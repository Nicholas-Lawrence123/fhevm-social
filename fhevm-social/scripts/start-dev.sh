#!/bin/bash

echo "🚀 Starting FHEVM Social Development Environment"
echo "================================================"

# Check if hardhat node is running
echo "📋 Checking Hardhat node status..."
if ! curl -s http://localhost:8545 > /dev/null; then
    echo "❌ Hardhat node is not running!"
    echo "   Please start it with:"
    echo "   cd ../fhevm-hardhat-template && npx hardhat node"
    exit 1
fi

echo "✅ Hardhat node is running"

# Check if contracts are deployed
echo "📋 Checking contract deployment..."
if [ ! -f "../fhevm-hardhat-template/deployments/localhost/FhevmSocial.json" ]; then
    echo "❌ FhevmSocial contract not deployed!"
    echo "   Please deploy it with:"
    echo "   cd ../fhevm-hardhat-template && npx hardhat deploy --network localhost"
    exit 1
fi

echo "✅ Contracts are deployed"

# Start the frontend
echo "🎨 Starting frontend application..."
npm run dev
