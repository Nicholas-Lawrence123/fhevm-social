// 简单的合约测试脚本
import { ethers } from "ethers";

// 合约地址和ABI
const CONTRACT_ADDRESS = "0x5f923FB956d0E7550D3fE836988edC9d32D07e67";
const CONTRACT_ABI = [
  {
    "inputs": [
      {"internalType": "uint256", "name": "offset", "type": "uint256"},
      {"internalType": "uint256", "name": "limit", "type": "uint256"}
    ],
    "name": "getPosts",
    "outputs": [
      {"internalType": "uint256[]", "name": "ids", "type": "uint256[]"},
      {"internalType": "address[]", "name": "authors", "type": "address[]"},
      {"internalType": "uint256[]", "name": "timestamps", "type": "uint256[]"},
      {"internalType": "bool[]", "name": "isPrivates", "type": "bool[]"},
      {"internalType": "string[]", "name": "publicContents", "type": "string[]"},
      {"internalType": "euint256[]", "name": "encryptedContents", "type": "bytes32[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPostCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

async function testContract() {
  try {
    // 连接到本地Hardhat节点
    const provider = new ethers.JsonRpcProvider("http://localhost:8545");

    // 创建合约实例
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

    console.log("Testing contract connection...");
    console.log("Contract address:", CONTRACT_ADDRESS);

    // 测试getPostCount方法
    console.log("Calling getPostCount...");
    const postCount = await contract.getPostCount();
    console.log("Post count:", postCount.toString());

    // 测试getPosts方法
    console.log("Calling getPosts...");
    const result = await contract.getPosts(0, 10);
    console.log("getPosts result:", result);

    console.log("✅ Contract test successful!");

  } catch (error) {
    console.error("❌ Contract test failed:", error);
    console.error("Error details:", error.message);
  }
}

testContract();
