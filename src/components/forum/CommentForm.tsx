
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ThumbsUp } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
}

interface CommentFormProps {
  onSubmit: (content: string) => void;
  existingComments?: Comment[];
}

export function CommentForm({ onSubmit, existingComments = [] }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [viewComments, setViewComments] = useState(true);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty",
        variant: "destructive",
      });
      return;
    }
    onSubmit(content);
    setContent('');
    toast({
      title: "Success",
      description: "Comment posted successfully",
    });
  };

  return (
    <div className="space-y-6" id="comments">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Write your comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px]"
        />
        <Button type="submit">Post Comment</Button>
      </form>
      
      {existingComments.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Comments ({existingComments.length})</h3>
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
              {existingComments.map((comment) => (
                <div key={comment.id} className="border rounded-md p-4 bg-card">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{comment.author}</span>
                    <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                  </div>
                  <p className="mb-2">{comment.content}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                      <ThumbsUp className="h-3 w-3 mr-1" /> {comment.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                      Reply
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
