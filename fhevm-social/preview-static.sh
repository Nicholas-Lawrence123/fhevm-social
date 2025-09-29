# 本地预览脚本
#!/bin/bash

echo '🚀 启动 FHEVM Social 静态文件预览...'
echo '====================================='

# 检查是否安装了serve
if ! command -v serve &> /dev/null; then
    echo '📦 安装 serve...'
    npm install -g serve
fi

echo '🌐 启动本地服务器...'
echo '📱 访问: http://localhost:3000'
echo '🛑 按 Ctrl+C 停止服务器'
echo ''

serve out -p 3000 -s
