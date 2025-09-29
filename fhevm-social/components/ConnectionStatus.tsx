import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ConnectionStatusProps {
  isConnected: boolean;
  chainId: number | undefined;
  accounts: string[] | undefined;
  fhevmStatus: string;
  fhevmError: Error | undefined;
  onConnect: () => void;
}

export const ConnectionStatus = ({
  isConnected,
  chainId,
  accounts,
  fhevmStatus,
  fhevmError,
  onConnect,
}: ConnectionStatusProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`} />
          连接状态
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <div className="text-center">
            <Button onClick={onConnect} size="lg">
              连接 MetaMask
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600 dark:text-gray-400">网络:</span>
              <span className="ml-2">{chainId || '未知'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600 dark:text-gray-400">地址:</span>
              <span className="ml-2 font-mono text-xs">
                {accounts?.[0] ? `${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}` : '未知'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600 dark:text-gray-400">FHEVM:</span>
              <span className={`ml-2 ${
                fhevmStatus === 'ready' ? 'text-green-600' :
                fhevmStatus === 'error' ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {fhevmStatus}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600 dark:text-gray-400">状态:</span>
              <span className="ml-2 text-green-600">已连接</span>
            </div>
          </div>
        )}

        {fhevmError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-red-800 dark:text-red-200 text-sm">
              FHEVM错误: {fhevmError.message}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
