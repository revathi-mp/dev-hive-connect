
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// A simple post modal creation form (stub, demo only)
interface NewPostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (post: { title: string; content: string }) => void;
}

// Only minimal fields for demo—expand as needed
export function NewPostModal({ open, onOpenChange, onSubmit }: NewPostModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onSubmit({ title, content });
      setTitle("");
      setContent("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Post</DialogTitle>
          <DialogDescription>Share a new discussion topic with the community.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            placeholder="Post title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <Textarea
            placeholder="Write your post..."
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={5}
            required
          />
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || !content.trim()}>
              Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
