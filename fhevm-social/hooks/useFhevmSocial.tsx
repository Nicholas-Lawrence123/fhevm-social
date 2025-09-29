"use client";

import { ethers } from "ethers";
import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { FhevmInstance } from "@/fhevm/fhevmTypes";
import { FhevmDecryptionSignature } from "@/fhevm/FhevmDecryptionSignature";
import { GenericStringStorage } from "@/fhevm/GenericStringStorage";

import { FhevmSocialAddresses } from "@/abi/FhevmSocialAddresses";
import { FhevmSocialABI } from "@/abi/FhevmSocialABI";

export type PostType = {
  id: bigint;
  author: `0x${string}`;
  timestamp: bigint;
  isPrivate: boolean;
  publicContent: string;
  encryptedContent: string; // handle
};

type FhevmSocialInfoType = {
  abi: typeof FhevmSocialABI.abi;
  address?: `0x${string}`;
  chainId?: number;
  chainName?: string;
};

/**
 * Resolves FhevmSocial contract metadata for the given EVM `chainId`.
 */
function getFhevmSocialByChainId(
  chainId: number | undefined
): FhevmSocialInfoType {
  if (!chainId) {
    return { abi: FhevmSocialABI.abi };
  }

  const entry =
    FhevmSocialAddresses[chainId.toString() as keyof typeof FhevmSocialAddresses];

  if (!("address" in entry) || entry.address === ethers.ZeroAddress) {
    return { abi: FhevmSocialABI.abi, chainId };
  }

  return {
    address: entry?.address as `0x${string}` | undefined,
    chainId: entry?.chainId ?? chainId,
    chainName: entry?.chainName,
    abi: FhevmSocialABI.abi,
  };
}

/**
 * Main FhevmSocial React hook with post creation, listing, and decryption functionality
 */
export const useFhevmSocial = (parameters: {
  instance: FhevmInstance | undefined;
  fhevmDecryptionSignatureStorage: GenericStringStorage;
  eip1193Provider: ethers.Eip1193Provider | undefined;
  chainId: number | undefined;
  ethersSigner: ethers.JsonRpcSigner | undefined;
  ethersReadonlyProvider: ethers.ContractRunner | undefined;
  sameChain: RefObject<(chainId: number | undefined) => boolean>;
  sameSigner: RefObject<
    (ethersSigner: ethers.JsonRpcSigner | undefined) => boolean
  >;
}) => {
  const {
    instance,
    fhevmDecryptionSignatureStorage,
    chainId,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
  } = parameters;

  //////////////////////////////////////////////////////////////////////////////
  // States + Refs
  //////////////////////////////////////////////////////////////////////////////

  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>(false);
  const [isCreatingPost, setIsCreatingPost] = useState<boolean>(false);
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const fhevmSocialRef = useRef<FhevmSocialInfoType | undefined>(undefined);
  const isLoadingPostsRef = useRef<boolean>(isLoadingPosts);
  const isCreatingPostRef = useRef<boolean>(isCreatingPost);
  const isDecryptingRef = useRef<boolean>(isDecrypting);

  //////////////////////////////////////////////////////////////////////////////
  // FhevmSocial Contract
  //////////////////////////////////////////////////////////////////////////////

  const fhevmSocial = useMemo(() => {
    const c = getFhevmSocialByChainId(chainId);
    fhevmSocialRef.current = c;
    return c;
  }, [chainId]);

  const isDeployed = useMemo(() => {
    if (!fhevmSocial) {
      return undefined;
    }
    return Boolean(fhevmSocial.address) && fhevmSocial.address !== ethers.ZeroAddress;
  }, [fhevmSocial]);

  //////////////////////////////////////////////////////////////////////////////
  // Load Posts
  //////////////////////////////////////////////////////////////////////////////

  const canLoadPosts = useMemo(() => {
    return fhevmSocial.address && ethersReadonlyProvider && !isLoadingPosts;
  }, [fhevmSocial.address, ethersReadonlyProvider, isLoadingPosts]);

  const loadPosts = useCallback(async (offset: number = 0, limit: number = 10) => {
    console.log("[useFhevmSocial] call loadPosts()");
    if (isLoadingPostsRef.current) {
      return;
    }

    if (
      !fhevmSocialRef.current ||
      !fhevmSocialRef.current?.chainId ||
      !fhevmSocialRef.current?.address ||
      !ethersReadonlyProvider
    ) {
      setPosts([]);
      return;
    }

    isLoadingPostsRef.current = true;
    setIsLoadingPosts(true);

    const thisChainId = fhevmSocialRef.current.chainId;
    const thisFhevmSocialAddress = fhevmSocialRef.current.address;

    const thisFhevmSocialContract = new ethers.Contract(
      thisFhevmSocialAddress,
      fhevmSocialRef.current.abi,
      ethersReadonlyProvider
    );

    try {
      const [ids, authors, timestamps, isPrivates, publicContents, encryptedContents] =
        await thisFhevmSocialContract.getPosts(offset, limit);

      if (sameChain.current(thisChainId) && thisFhevmSocialAddress === fhevmSocialRef.current?.address) {
        const loadedPosts: PostType[] = [];
        for (let i = 0; i < ids.length; i++) {
          loadedPosts.push({
            id: ids[i],
            author: authors[i],
            timestamp: timestamps[i],
            isPrivate: isPrivates[i],
            publicContent: publicContents[i],
            encryptedContent: encryptedContents[i],
          });
        }
        setPosts(prevPosts => offset === 0 ? loadedPosts : [...prevPosts, ...loadedPosts]);
      }
    } catch (e) {
      setMessage("FhevmSocial.getPosts() call failed! error=" + e);
    } finally {
      isLoadingPostsRef.current = false;
      setIsLoadingPosts(false);
    }
  }, [ethersReadonlyProvider, sameChain]);

  // Auto load posts on mount
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  //////////////////////////////////////////////////////////////////////////////
  // Create Posts
  //////////////////////////////////////////////////////////////////////////////

  const canCreatePost = useMemo(() => {
    return fhevmSocial.address && ethersSigner && !isCreatingPost;
  }, [fhevmSocial.address, ethersSigner, isCreatingPost]);

  const createPublicPost = useCallback(
    async (content: string) => {
      if (isCreatingPostRef.current) {
        return;
      }

      if (!fhevmSocial.address || !ethersSigner || content.trim().length === 0) {
        return;
      }

      if (content.length > 280) {
        setMessage("Content too long (max 280 characters)");
        return;
      }

      const thisChainId = chainId;
      const thisFhevmSocialAddress = fhevmSocial.address;
      const thisEthersSigner = ethersSigner;

      const thisFhevmSocialContract = new ethers.Contract(
        thisFhevmSocialAddress,
        fhevmSocial.abi,
        thisEthersSigner
      );

      isCreatingPostRef.current = true;
      setIsCreatingPost(true);
      setMessage("Creating public post...");

      try {
        const tx = await thisFhevmSocialContract.createPublicPost(content);
        setMessage("Waiting for transaction...");

        const receipt = await tx.wait();

        if (sameChain.current(thisChainId) && thisFhevmSocialAddress === fhevmSocialRef.current?.address) {
          setMessage("Public post created successfully!");
          // Reload posts to show the new one
          loadPosts();
        }
      } catch (error) {
        setMessage("Failed to create public post: " + error);
      } finally {
        isCreatingPostRef.current = false;
        setIsCreatingPost(false);
      }
    },
    [ethersSigner, fhevmSocial.address, fhevmSocial.abi, chainId, sameChain, loadPosts]
  );

  const createPrivatePost = useCallback(
    async (content: string) => {
      if (isCreatingPostRef.current) {
        return;
      }

      if (!fhevmSocial.address || !instance || !ethersSigner) {
        return;
      }

      const thisChainId = chainId;
      const thisFhevmSocialAddress = fhevmSocial.address;
      const thisEthersSigner = ethersSigner;
      const thisInstance = instance;

      const thisFhevmSocialContract = new ethers.Contract(
        thisFhevmSocialAddress,
        fhevmSocial.abi,
        thisEthersSigner
      );

      isCreatingPostRef.current = true;
      setIsCreatingPost(true);
      setMessage("Encrypting content...");

      try {
        // Convert text content to a numerical representation
        // For simplicity, we'll use the first 32 characters converted to a number
        // In a production app, you'd want a more robust text-to-number conversion
        const textToEncrypt = content.length > 32 ? content.substring(0, 32) : content;
        let contentValue = BigInt(0);

        // Convert string to a large number using character codes
        for (let i = 0; i < textToEncrypt.length; i++) {
          contentValue = contentValue * BigInt(256) + BigInt(textToEncrypt.charCodeAt(i));
        }

        // Pad with content length info (last 8 bits)
        contentValue = (contentValue << BigInt(8)) | BigInt(content.length);

        const input = thisInstance.createEncryptedInput(
          thisFhevmSocialAddress,
          thisEthersSigner.address
        );
        input.add256(contentValue);

        const enc = await input.encrypt();

        if (!sameChain.current(thisChainId) || thisFhevmSocialAddress !== fhevmSocialRef.current?.address) {
          setMessage("Context changed during encryption");
          return;
        }

        setMessage("Creating private post...");

        const tx = await thisFhevmSocialContract.createPrivatePost(
          enc.handles[0],
          enc.inputProof
        );

        setMessage("Waiting for transaction...");
        const receipt = await tx.wait();

        if (sameChain.current(thisChainId) && thisFhevmSocialAddress === fhevmSocialRef.current?.address) {
          setMessage("Private post created successfully!");
          loadPosts();
        }
      } catch (error) {
        setMessage("Failed to create private post: " + error);
      } finally {
        isCreatingPostRef.current = false;
        setIsCreatingPost(false);
      }
    },
    [ethersSigner, fhevmSocial.address, fhevmSocial.abi, instance, chainId, sameChain, loadPosts]
  );

  //////////////////////////////////////////////////////////////////////////////
  // Decrypt Private Posts
  //////////////////////////////////////////////////////////////////////////////

  const canDecrypt = useMemo(() => {
    return instance && ethersSigner && !isDecrypting;
  }, [instance, ethersSigner, isDecrypting]);

  const decryptPost = useCallback(
    async (post: PostType) => {
      if (isDecryptingRef.current) {
        return;
      }

      if (!fhevmSocial.address || !instance || !ethersSigner) {
        return;
      }

      if (!post.isPrivate) {
        return; // Not a private post
      }

      const thisChainId = chainId;
      const thisFhevmSocialAddress = fhevmSocial.address;
      const thisEthersSigner = ethersSigner;

      isDecryptingRef.current = true;
      setIsDecrypting(true);
      setMessage("Preparing decryption...");

      try {
        const sig = await FhevmDecryptionSignature.loadOrSign(
          instance,
          [fhevmSocial.address as `0x${string}`],
          ethersSigner,
          fhevmDecryptionSignatureStorage
        );

        if (!sig) {
          setMessage("Unable to build FHEVM decryption signature");
          return;
        }

        if (!sameChain.current(thisChainId) || thisFhevmSocialAddress !== fhevmSocialRef.current?.address) {
          setMessage("Context changed during signature creation");
          return;
        }

        setMessage("Decrypting post content...");

        const res = await instance.userDecrypt(
          [{ handle: post.encryptedContent, contractAddress: thisFhevmSocialAddress }],
          sig.privateKey,
          sig.publicKey,
          sig.signature,
          sig.contractAddresses,
          sig.userAddress,
          sig.startTimestamp,
          sig.durationDays
        );

        if (!sameChain.current(thisChainId) || thisFhevmSocialAddress !== fhevmSocialRef.current?.address) {
          setMessage("Context changed during decryption");
          return;
        }

        const decryptedValue = BigInt(res[post.encryptedContent]);

        // Extract content length (last 8 bits)
        const contentLength = Number(decryptedValue & BigInt(0xFF));

        // Extract text content (remaining bits)
        let textValue = decryptedValue >> BigInt(8);
        let decryptedText = '';

        // Convert number back to string
        while (textValue > BigInt(0)) {
          const charCode = Number(textValue % BigInt(256));
          decryptedText = String.fromCharCode(charCode) + decryptedText;
          textValue = textValue / BigInt(256);
        }

        // If the decrypted text is shorter than the original length,
        // it means we truncated it during encryption
        const finalText = decryptedText.length >= contentLength
          ? decryptedText
          : decryptedText + `... (truncated, original length: ${contentLength})`;

        setMessage(`Post decrypted! Content: "${finalText}"`);

        // Update the post in state with decrypted info
        setPosts(prevPosts =>
          prevPosts.map(p =>
            p.id === post.id
              ? { ...p, publicContent: finalText }
              : p
          )
        );

      } catch (error) {
        setMessage("Failed to decrypt post: " + error);
      } finally {
        isDecryptingRef.current = false;
        setIsDecrypting(false);
      }
    },
    [
      fhevmDecryptionSignatureStorage,
      ethersSigner,
      fhevmSocial.address,
      instance,
      chainId,
      sameChain,
    ]
  );

  return {
    contractAddress: fhevmSocial.address,
    isDeployed,
    posts,
    isLoadingPosts,
    isCreatingPost,
    isDecrypting,
    message,
    canLoadPosts,
    canCreatePost,
    canDecrypt,
    loadPosts,
    createPublicPost,
    createPrivatePost,
    decryptPost,
  };
};
