# FHEVM Social - 部署状态

## 合约地址

### Sepolia 测试网 (Chain ID: 11155111)
- **FhevmSocial**: 0x7bF54480eA0c1EF7e74afeDbD9C19e510C062D69
- **FHECounter**: 0x832465072732e48be2aFF9c8FFca6BE1b397FA24

### 本地 Hardhat (Chain ID: 31337)  
- **FhevmSocial**: 0x23a750d7c6757e861F35Debc9208f4bEFa4B2764
- **FHECounter**: 0x5c653ca4AeA7F2Da07f0AABf75F85766EAFDA615

## 验证合约
```bash
# Sepolia验证
npx hardhat verify --network sepolia 0x7bF54480eA0c1EF7e74afeDbD9C19e510C062D69

# 本地验证
npx hardhat verify --network localhost 0x23a750d7c6757e861F35Debc9208f4bEFa4B2764
```

