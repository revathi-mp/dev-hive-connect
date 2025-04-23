
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReplyFormProps {
  content: string;
  onChange: (content: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function ReplyForm({
  content,
  onChange,
  onSubmit,
  onCancel
}: ReplyFormProps) {
  return (
    <div className="mt-2 ml-6">
      <Textarea
        placeholder="Write your reply..."
        value={content}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[80px] text-sm"
      />
      <div className="mt-2">
        <Button size="sm" onClick={onSubmit}>Post Reply</Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCancel}
          className="ml-2"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
