
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Share, Heart, MessageSquareReply, Eye, MousePointerClick } from "lucide-react";
import { Comment } from "./types";
import { CodePlayground } from './CodePlayground';
import { toast } from "@/hooks/use-toast";

interface CommentItemProps {
  comment: Comment;
  onReply: (commentId: string) => void;
  onLike: (commentId: string) => void;
  onShare: (commentId: string) => void;
  onView: (commentId: string) => void;
  isViewed: boolean;
  isReplyOpen: boolean;
}

export function CommentItem({
  comment,
  onReply,
  onLike,
  onShare,
  onView,
  isViewed,
  isReplyOpen
}: CommentItemProps) {
  const [commentContent, setCommentContent] = useState(comment.content);
  
  // Function to parse comment content and extract code blocks
  const renderContent = (content: string) => {
    const codeBlockRegex = /```(\w+)\n([\s\S]*?)\n```/g;
    let lastIndex = 0;
    const fragments = [];
    let match;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        fragments.push(
          <p key={`text-${lastIndex}`} className="mb-2">
            {content.substring(lastIndex, match.index)}
          </p>
        );
      }
      
      fragments.push(
        <CodePlayground 
          key={`code-${match.index}`} 
          code={match[2]}
          language={match[1]}
          isEditable={true}
          onCodeChange={(newCode) => {
            // Store the match information to fix the "null" error
            const matchIndex = match.index;
            const matchLength = match[0].length;
            const matchLang = match[1];
            
            // Create updated content with new code
            const beforeCode = content.substring(0, matchIndex);
            const afterCode = content.substring(matchIndex + matchLength);
            const updatedContent = `${beforeCode}\`\`\`${matchLang}\n${newCode}\n\`\`\`${afterCode}`;
            
            setCommentContent(updatedContent);
            toast({
              description: "Code updated successfully",
            });
          }}
        />
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < content.length) {
      fragments.push(
        <p key={`text-${lastIndex}`} className="mb-2">
          {content.substring(lastIndex)}
        </p>
      );
    }
    
    return fragments.length > 0 ? fragments : <p className="mb-2">{content}</p>;
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: `Comment by ${comment.author}`,
        text: comment.content,
        url: `${window.location.origin}${window.location.pathname}#comment-${comment.id}`
      };

      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast({
          description: "Comment shared successfully",
        });
      } else {
        throw new Error('Web Share API not supported');
      }
    } catch (error) {
      const shareUrl = `${window.location.origin}${window.location.pathname}#comment-${comment.id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast({
        description: "Link copied to clipboard",
      });
    }
  };

  return (
    <div 
      className={`border rounded-md p-4 bg-card ${isReplyOpen ? 'ring-2 ring-primary' : ''}`}
      id={`comment-${comment.id}`}
    >
      <div className="flex justify-between mb-2">
        <span className="font-medium">{comment.author}</span>
        <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
      </div>
      
      <div className="mb-2" onClick={() => onView(comment.id)}>
        {renderContent(commentContent)}
      </div>
      
      <div className="flex items-center gap-2 text-sm">
        <Button 
          variant="ghost" 
          size="sm" 
          className={`h-7 px-2 text-xs ${comment.isLiked ? 'text-red-500' : ''}`}
          onClick={() => onLike(comment.id)}
        >
          <Heart className={`h-3 w-3 mr-1 ${comment.isLiked ? 'fill-current' : ''}`} />
          {comment.likes}
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`h-7 px-2 text-xs ${isReplyOpen ? 'bg-muted' : ''}`}
          onClick={() => onReply(comment.id)}
        >
          <MessageSquareReply className="h-3 w-3 mr-1" />
          Reply
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 px-2 text-xs"
          onClick={handleShare}
        >
          <Share className="h-3 w-3 mr-1" />
          Share
        </Button>
        <div className="ml-auto flex items-center text-xs text-muted-foreground">
          <Eye className="h-3 w-3 mr-1" />
          <span>{isViewed ? '1' : '0'} views</span>
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-6 mt-2 space-y-2">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="border-l-2 pl-4 py-2">
              <div className="flex justify-between mb-1">
                <span className="font-medium text-sm">{reply.author}</span>
                <span className="text-xs text-muted-foreground">{reply.createdAt}</span>
              </div>
              <div className="text-sm">{renderContent(reply.content)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
