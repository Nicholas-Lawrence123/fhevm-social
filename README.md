# FHEVM Social - Encrypted Social Platform

[![GitHub](https://img.shields.io/badge/GitHub-Nicholas--Lawrence123/fhevm--social-blue)](https://github.com/Nicholas-Lawrence123/fhevm-social)
[![License](https://img.shields.io/badge/License-BSD--3--Clause--Clear-green)](LICENSE)

FHEVM Social is an innovative blockchain-based social platform powered by Fully Homomorphic Encryption (FHEVM). Users can post public updates visible to all, or create private posts encrypted with FHE technology—only the author can decrypt and view their own private content.

## 🚀 Features

### 🔓 Public Posts
- Visible to all users on the platform
- Traditional social media experience
- No encryption overhead

### 🔒 Private Posts
- Encrypted using FHEVM technology
- Only the author can decrypt and view content
- Privacy-preserving social networking

### 🎨 Modern UI
- Built with React/Next.js and Tailwind CSS
- Responsive design for all devices
- Dark mode support
- Intuitive user interface

### 🔗 Blockchain Integration
- MetaMask wallet integration
- Support for Sepolia testnet and local Hardhat
- Smart contracts deployed on Ethereum-compatible networks

## 🏗️ Architecture

```
fhevm-social-complete/
├── fhevm-hardhat-template/     # Smart contracts (Solidity)
│   ├── contracts/
│   │   └── FhevmSocial.sol     # Main social contract
│   └── test/                   # Contract tests
└── fhevm-social/              # Frontend application (Next.js)
    ├── app/                   # Next.js app router
    ├── components/            # React components
    ├── fhevm/                 # FHEVM integration
    └── hooks/                 # Custom React hooks
```

## 📋 Prerequisites

- Node.js 18+
- MetaMask browser extension
- Hardhat (for local development)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Nicholas-Lawrence123/fhevm-social.git
cd fhevm-social
```

### 2. Install Dependencies
```bash
# Install smart contract dependencies
cd fhevm-hardhat-template
npm install

# Install frontend dependencies
cd ../fhevm-social
npm install
```

### 3. Start Local Hardhat Node
```bash
cd ../fhevm-hardhat-template
npx hardhat node
```

### 4. Deploy Contracts
```bash
npx hardhat deploy --network localhost
```

### 5. Start Frontend Application
```bash
cd ../fhevm-social
npm run dev
```

### 6. Open Browser
Navigate to `http://localhost:3000` and connect your MetaMask wallet!

## 🧪 Development Modes

### Standard Development
```bash
npm run dev
```
- Full development server with hot reloading
- Supports Sepolia testnet integration

### Mock Development
```bash
npm run dev:mock
```
- Uses local Hardhat node for FHE simulation
- Faster development without real network costs
- Perfect for UI/UX development

## 🏗️ Smart Contracts

### FhevmSocial.sol
- **Public Posts**: Standard Ethereum storage
- **Private Posts**: FHE-encrypted content storage
- **Access Control**: Author-only decryption permissions
- **Pagination**: Efficient post retrieval

### Deployment Addresses

#### Sepolia Testnet
- **FhevmSocial**: `0x7bF54480eA0c1EF7e74afeDbD9C19e510C062D69`
- **FHECounter**: `0x832465072732e48be2aFF9c8FFca6BE1b397FA24`

#### Local Hardhat
- **FhevmSocial**: `0x23a750d7c6757e861F35Debc9208f4bEFa4B2764`
- **FHECounter**: `0x5c653ca4AeA7F2Da07f0AABf75F85766EAFDA615`

## 🎨 Frontend Features

### Components
- **ConnectionStatus**: Wallet connection and network display
- **CreatePostForm**: Post creation with public/private options
- **PostCard**: Individual post display with decryption
- **FhevmSocialApp**: Main application container

### Hooks
- **useFhevmSocial**: Social platform business logic
- **useFhevm**: FHEVM integration
- **useMetaMask**: Wallet connectivity

## 📦 Static Export

The application can be exported as static files for deployment:

```bash
cd fhevm-social
npm run build
```

Generated files are in the `out/` directory and can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static file server

## 🔐 Security & Privacy

- **End-to-End Encryption**: Private posts are encrypted client-side
- **Zero-Knowledge**: Content encryption uses FHEVM technology
- **Access Control**: Only post authors can decrypt their private content
- **Blockchain Transparency**: Public posts are fully transparent on-chain

## 🧪 Testing

### Contract Tests
```bash
cd fhevm-hardhat-template
npx hardhat test
```

### Frontend Tests
```bash
cd fhevm-social
npm run test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the BSD-3-Clause-Clear License.

## 🙏 Acknowledgments

- [Zama](https://www.zama.ai/) - FHEVM technology
- [fhEVM](https://docs.zama.ai/fhevm) - Fully Homomorphic Encryption Virtual Machine
- [Hardhat](https://hardhat.org/) - Ethereum development environment
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## 📞 Contact

- **GitHub**: [Nicholas-Lawrence123](https://github.com/Nicholas-Lawrence123)
- **Email**: racmiroux05@gmail.com

---

⭐ **Star this repository** if you find it interesting or useful for your FHEVM projects!
