
import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { CommentItem } from "./CommentItem";
import { Comment } from "./types";

interface CommentListProps {
  comments: Comment[];
  viewCount: number;
  onReply: (commentId: string) => void;
  onLike: (commentId: string) => void;
  onShare: (commentId: string) => void;
  onViewComment: (commentId: string) => void;
  viewedComments: Set<string>;
  replyTo: string | null;
}

export function CommentList({
  comments,
  viewCount,
  onReply,
  onLike,
  onShare,
  onViewComment,
  viewedComments,
  replyTo
}: CommentListProps) {
  const [viewComments, setViewComments] = React.useState(true);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-medium">
            Comments ({comments.length})
          </h3>
          <span className="flex items-center text-sm text-muted-foreground">
            <Eye className="h-4 w-4 mr-1" />
            {viewCount} views
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewComments(!viewComments)}
        >
          {viewComments ? 'Hide Comments' : 'Show Comments'}
        </Button>
      </div>
      
      {viewComments && (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={onReply}
              onLike={onLike}
              onShare={onShare}
              onView={onViewComment}
              isViewed={viewedComments.has(comment.id)}
              isReplyOpen={replyTo === comment.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
