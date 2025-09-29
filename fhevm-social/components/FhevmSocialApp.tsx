"use client";

import { useFhevm } from "@/fhevm/useFhevm";
import { useInMemoryStorage } from "@/hooks/useInMemoryStorage";
import { useMetaMaskEthersSigner } from "@/hooks/metamask/useMetaMaskEthersSigner";
import { useFhevmSocial } from "@/hooks/useFhevmSocial";
import { PostCard } from "./PostCard";
import { CreatePostForm } from "./CreatePostForm";
import { ConnectionStatus } from "./ConnectionStatus";

/*
 * Main FHEVM Social App component
 */
export const FhevmSocialApp = () => {
  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();
  const {
    provider,
    chainId,
    accounts,
    isConnected,
    connect,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
    initialMockChains,
  } = useMetaMaskEthersSigner();

  //////////////////////////////////////////////////////////////////////////////
  // FHEVM instance
  //////////////////////////////////////////////////////////////////////////////

  const {
    instance: fhevmInstance,
    status: fhevmStatus,
    error: fhevmError,
  } = useFhevm({
    provider,
    chainId,
    initialMockChains: {
      ...initialMockChains,
      31337: "http://localhost:8545", // Hardhat node
    },
    enabled: true,
  });

  //////////////////////////////////////////////////////////////////////////////
  // FhevmSocial hook
  //////////////////////////////////////////////////////////////////////////////

  const fhevmSocial = useFhevmSocial({
    instance: fhevmInstance,
    fhevmDecryptionSignatureStorage,
    eip1193Provider: provider,
    chainId,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
  });

  //////////////////////////////////////////////////////////////////////////////
  // UI
  //////////////////////////////////////////////////////////////////////////////

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🔒 FHEVM Social
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            基于全同态加密的朋友圈应用
          </p>
        </div>

        {/* Connection Status */}
        <ConnectionStatus
          isConnected={isConnected}
          chainId={chainId}
          accounts={accounts}
          fhevmStatus={fhevmStatus}
          fhevmError={fhevmError}
          onConnect={connect}
        />

        {/* Contract Status */}
        {!isConnected && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 dark:text-yellow-200 text-center">
              请先连接钱包以使用朋友圈功能
            </p>
          </div>
        )}

        {isConnected && !fhevmSocial.isDeployed && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-200 text-center">
              合约未部署或不可用，请检查网络配置
            </p>
          </div>
        )}

        {/* Create Post Form */}
        {isConnected && fhevmSocial.isDeployed && (
          <CreatePostForm
            onCreatePublicPost={fhevmSocial.createPublicPost}
            onCreatePrivatePost={fhevmSocial.createPrivatePost}
            canCreatePost={fhevmSocial.canCreatePost || false}
            isCreatingPost={fhevmSocial.isCreatingPost}
          />
        )}

        {/* Posts List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            最新动态
          </h2>

          {fhevmSocial.posts.length === 0 && !fhevmSocial.isLoadingPosts && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                还没有动态，快来发布第一条吧！
              </p>
            </div>
          )}

          {fhevmSocial.posts.map((post) => (
            <PostCard
              key={post.id.toString()}
              post={post}
              onDecrypt={fhevmSocial.decryptPost}
              canDecrypt={fhevmSocial.canDecrypt || false}
              isDecrypting={fhevmSocial.isDecrypting}
            />
          ))}

          {fhevmSocial.isLoadingPosts && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-500 dark:text-gray-400 mt-2">加载中...</p>
            </div>
          )}
        </div>

        {/* Message */}
        {fhevmSocial.message && (
          <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg max-w-sm">
            {fhevmSocial.message}
          </div>
        )}
      </div>
    </div>
  );
};
