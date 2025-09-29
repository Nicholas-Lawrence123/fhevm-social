import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Lock, Unlock, Eye } from "lucide-react";
import type { PostType } from "@/hooks/useFhevmSocial";

interface PostCardProps {
  post: PostType;
  onDecrypt: (post: PostType) => Promise<void>;
  canDecrypt: boolean;
  isDecrypting: boolean;
}

export const PostCard = ({
  post,
  onDecrypt,
  canDecrypt,
  isDecrypting,
}: PostCardProps) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDecrypt = () => {
    onDecrypt(post);
  };

  const isEncrypted = post.isPrivate && post.publicContent === "";
  const showDecryptButton = post.isPrivate && isEncrypted;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {formatAddress(post.author).slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {formatAddress(post.author)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatTimestamp(post.timestamp)}
              </p>
            </div>
          </div>

          <Badge
            variant={post.isPrivate ? "secondary" : "default"}
            className={post.isPrivate ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" : ""}
          >
            {post.isPrivate ? (
              <>
                <Lock className="w-3 h-3 mr-1" />
                私密
              </>
            ) : (
              <>
                <Unlock className="w-3 h-3 mr-1" />
                公开
              </>
            )}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Post Content */}
          <div className="min-h-[60px]">
            {post.isPrivate && isEncrypted ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Lock className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  这是一条私密动态，内容已被加密
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  只有发布者才能解密查看
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {post.publicContent || "暂无内容"}
                </p>
              </div>
            )}
          </div>

          {/* Decrypt Button */}
          {showDecryptButton && (
            <div className="flex justify-center">
              <Button
                onClick={handleDecrypt}
                disabled={!canDecrypt || isDecrypting}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {isDecrypting ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    解密中...
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    解密查看
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Post Info */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
            <span>动态 #{post.id.toString()}</span>
            {post.isPrivate && (
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                加密保护
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
