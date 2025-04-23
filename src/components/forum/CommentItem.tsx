
import React from 'react';
import { Button } from "@/components/ui/button";
import { Share, Heart, MessageSquareReply, Eye } from "lucide-react";
import { Comment } from "./types";

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
  return (
    <div 
      className="border rounded-md p-4 bg-card"
      id={`comment-${comment.id}`}
      onClick={() => onView(comment.id)}
    >
      <div className="flex justify-between mb-2">
        <span className="font-medium">{comment.author}</span>
        <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
      </div>
      <p className="mb-2">{comment.content}</p>
      <div className="flex items-center gap-2 text-sm">
        <Button 
          variant="ghost" 
          size="sm" 
          className={`h-7 px-2 text-xs ${comment.isLiked ? 'text-red-500' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onLike(comment.id);
          }}
        >
          <Heart className={`h-3 w-3 mr-1 ${comment.isLiked ? 'fill-current' : ''}`} />
          {comment.likes}
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 px-2 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onReply(comment.id);
          }}
        >
          <MessageSquareReply className="h-3 w-3 mr-1" />
          Reply
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 px-2 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onShare(comment.id);
          }}
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
              <p className="text-sm">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
