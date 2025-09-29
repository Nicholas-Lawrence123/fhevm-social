"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Lock, Unlock } from "lucide-react";

interface CreatePostFormProps {
  onCreatePublicPost: (content: string) => Promise<void>;
  onCreatePrivatePost: (content: string) => Promise<void>;
  canCreatePost: boolean;
  isCreatingPost: boolean;
}

export const CreatePostForm = ({
  onCreatePublicPost,
  onCreatePrivatePost,
  canCreatePost,
  isCreatingPost,
}: CreatePostFormProps) => {
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState<"public" | "private">("public");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      if (postType === "public") {
        await onCreatePublicPost(content.trim());
      } else {
        await onCreatePrivatePost(content.trim());
      }

      if (!isCreatingPost) { // Only clear if not still creating (success case)
        setContent("");
      }
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isCreatingPost || isSubmitting;
  const characterCount = content.length;
  const maxLength = 280;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>发布新动态</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Post Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">动态类型</Label>
            <RadioGroup
              value={postType}
              onValueChange={(value) => setPostType(value as "public" | "private")}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public" className="flex items-center gap-2 cursor-pointer">
                  <Unlock className="w-4 h-4 text-green-600" />
                  公开动态
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private" className="flex items-center gap-2 cursor-pointer">
                  <Lock className="w-4 h-4 text-blue-600" />
                  私密动态
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Content Input */}
          <div className="space-y-2">
            <Label htmlFor="content">动态内容</Label>
            <Textarea
              id="content"
              placeholder={
                postType === "public"
                  ? "分享你的想法..."
                  : "输入要加密的内容..."
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={maxLength}
              rows={4}
              className="resize-none"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span className={characterCount > maxLength * 0.8 ? "text-orange-500" : ""}>
                {characterCount}/{maxLength}
              </span>
              {postType === "private" && (
                <span className="text-blue-600 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  将被加密
                </span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!canCreatePost || !content.trim() || isLoading || characterCount > maxLength}
            className="w-full"
          >
            {isLoading ? (
              <>
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {postType === "public" ? "发布中..." : "加密发布中..."}
              </>
            ) : (
              <>
                {postType === "public" ? (
                  <>
                    <Unlock className="w-4 h-4 mr-2" />
                    发布公开动态
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    发布私密动态
                  </>
                )}
              </>
            )}
          </Button>

          {/* Helper Text */}
          <div className="text-sm text-gray-500 space-y-1">
            <p>
              <strong>公开动态：</strong>所有人都能看到内容
            </p>
            <p>
              <strong>私密动态：</strong>内容将被加密，只有你自己能解密查看
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
