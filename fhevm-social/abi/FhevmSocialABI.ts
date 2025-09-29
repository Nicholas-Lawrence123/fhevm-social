/*
  This file is auto-generated from FhevmSocial contract artifacts.
*/
export const FhevmSocialABI = {
  "abi": [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "postId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "author",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isPrivate",
          "type": "bool"
        }
      ],
      "name": "PostCreated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "postId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "allowedAddress",
          "type": "address"
        }
      ],
      "name": "allowPostAccess",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "offset",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "limit",
          "type": "uint256"
        }
      ],
      "name": "getPosts",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        },
        {
          "internalType": "address[]",
          "name": "authors",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "timestamps",
          "type": "uint256[]"
        },
        {
          "internalType": "bool[]",
          "name": "isPrivates",
          "type": "bool[]"
        },
        {
          "internalType": "string[]",
          "name": "publicContents",
          "type": "string[]"
        },
        {
          "internalType": "euint256[]",
          "name": "encryptedContents",
          "type": "bytes32[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "postId",
          "type": "uint256"
        }
      ],
      "name": "getPost",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "author",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isPrivate",
          "type": "bool"
        },
        {
          "internalType": "string",
          "name": "publicContent",
          "type": "string"
        },
        {
          "internalType": "euint256",
          "name": "encryptedContent",
          "type": "euint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getPostCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "postId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "revokePostAccess",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "externalEuint256",
          "name": "encryptedContent",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "inputProof",
          "type": "bytes"
        }
      ],
      "name": "createPrivatePost",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "content",
          "type": "string"
        }
      ],
      "name": "createPublicPost",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
} as const;
