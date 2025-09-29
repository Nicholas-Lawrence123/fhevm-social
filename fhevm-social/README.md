# FHEVM Social - 链上朋友圈 DApp

基于 FHEVM (Fully Homomorphic Encryption Virtual Machine) 构建的加密朋友圈应用。

## 功能特性

### 🔓 公开动态
- 所有人都能直接查看内容
- 明文存储在区块链上

### 🔒 私密动态
- 内容使用 FHEVM 加密存储
- 只有发布者本人能够解密查看
- 其他用户看到的是加密状态

### 🎨 美观界面
- 现代化的 UI 设计
- 响应式布局
- 深色模式支持
- 流畅的用户体验

## 技术架构

### 智能合约 (FHEVM)
- **FhevmSocial.sol**: 朋友圈核心合约
- 支持公开和私密动态发布
- 基于 FHEVM 的加密功能
- ACL 访问控制

### 前端应用 (Next.js + TypeScript)
- **React 19** + **Next.js 15**
- **Tailwind CSS** 样式
- **FHEVM SDK** 集成
- **ethers.js** 区块链交互

## 快速开始

### 环境要求
- Node.js 18+
- Hardhat 本地节点
- MetaMask 钱包

### 安装依赖
```bash
npm install --cache /tmp/npm-cache
```

### 启动本地 Hardhat 节点
```bash
cd ../fhevm-hardhat-template
npx hardhat node
```

### 部署合约
```bash
cd ../fhevm-hardhat-template
npx hardhat deploy --network localhost
```

### 启动前端应用
```bash
cd ../fhevm-social
npm run dev
```

### 一键启动脚本
```bash
cd fhevm-social
./scripts/start-dev.sh
```

### 使用 Mock 模式 (开发环境)
```bash
# 确保 Hardhat 节点运行
npm run dev:mock
```

Mock 模式会自动检测本地 Hardhat 节点并使用 FHEVM Mock Utils 进行模拟，适合快速开发和测试。

### 网络支持
- **本地开发**: Hardhat 网络 (chainId: 31337)
- **测试网**: Sepolia 网络 (chainId: 11155111)
- **Mock模式**: 本地Hardhat节点模拟FHEVM

### 开发模式说明
- `npm run dev` - 标准开发模式（支持Sepolia测试网）
- `npm run dev:mock` - Mock 模式（使用本地 Hardhat 节点模拟 FHEVM）

### Sepolia 测试网使用
1. 在 MetaMask 中添加 Sepolia 网络
2. 确保有 Sepolia ETH (从 [Sepolia Faucet](https://sepoliafaucet.com/) 获取)
3. 在应用中切换到 Sepolia 网络
4. 开始发布和查看动态！

## 静态部署

应用已配置为支持静态导出，可以部署到任何静态文件服务器：

### 构建静态文件
```bash
npm run build  # 生成 out/ 目录
```

### 本地预览
```bash
./preview-static.sh
```

### 部署平台
- **Vercel**: 直接拖拽 `out/` 文件夹
- **Netlify**: 拖拽 `out/` 文件夹或使用 CLI
- **GitHub Pages**: 使用 `gh-pages` 包
- **其他**: AWS S3, Firebase, Surge 等

### 部署注意事项
⚠️ **重要**: 区块链应用部署到静态主机有以下限制：
- 需要 HTTPS 连接 (MetaMask 要求)
- 可能遇到 CORS 限制
- 建议使用支持自定义域名的专业托管服务

## 项目结构

```
fhevm-social/
├── abi/                    # 合约 ABI 文件
├── app/                    # Next.js 应用页面
├── components/             # React 组件
│   ├── ui/                # 基础 UI 组件
│   ├── FhevmSocialApp.tsx # 主应用组件
│   ├── CreatePostForm.tsx # 发布动态表单
│   ├── PostCard.tsx       # 动态卡片组件
│   └── ConnectionStatus.tsx # 连接状态组件
├── fhevm/                 # FHEVM 相关工具
├── hooks/                 # React Hooks
│   └── useFhevmSocial.tsx # 朋友圈业务逻辑
└── lib/                   # 工具函数
```

## 核心功能实现

### 1. 动态发布流程

#### 公开动态
1. 用户输入内容
2. 调用 `createPublicPost(string content)`
3. 内容明文存储在区块链

#### 私密动态
1. 用户输入内容
2. 使用 `instance.createEncryptedInput()` 创建加密输入
3. 调用 `createPrivatePost(externalEuint256, bytes)`
4. 内容加密存储，只有作者有解密权限

### 2. 动态查看流程

#### 公开动态
- 直接显示明文内容

#### 私密动态
- 显示加密状态和解密按钮
- 点击解密后调用 `instance.userDecrypt()`
- 验证签名后显示解密内容

### 3. FHEVM 集成

```typescript
// 创建加密输入
const input = instance.createEncryptedInput(contractAddress, userAddress);
input.add256(contentLength);
const encrypted = await input.encrypt();

// 解密内容
const result = await instance.userDecrypt(
  [{ handle: encryptedHandle, contractAddress }],
  signatureData.privateKey,
  // ... 其他参数
);
```

## 安全特性

- **端到端加密**: 私密动态在客户端加密
- **访问控制**: 只有作者能解密自己的私密动态
- **签名验证**: 所有解密操作都需要有效的 FHEVM 签名
- **网络隔离**: 私密内容不会在网络中明文传输

## 开发指南

### 添加新功能
1. 在合约中实现新的功能函数
2. 更新 ABI 文件
3. 在 `useFhevmSocial` hook 中添加业务逻辑
4. 创建相应的 UI 组件
5. 集成到主应用中

### 测试流程
1. 启动本地 Hardhat 节点
2. 部署合约
3. 启动前端应用
4. 使用 MetaMask 连接
5. 测试发布和查看动态功能

## 部署说明

### 本地开发
使用 Mock 模式进行快速开发和测试。

### 测试网部署
1. 配置网络 (Sepolia)
2. 更新合约地址
3. 部署合约到测试网
4. 更新前端配置

### 主网部署
1. 审计合约代码
2. 部署到主网
3. 更新前端配置
4. 进行最终测试

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 发起 Pull Request

## 许可证

BSD-3-Clause-Clear License

## 致谢

- [Zama](https://www.zama.ai/) - FHEVM 技术提供者
- [fhEVM](https://docs.zama.ai/fhevm) - 全同态加密虚拟机
- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架