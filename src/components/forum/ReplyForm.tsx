
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Code, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  
  const insertCodeBlock = (language: string) => {
    const codeTemplate = `\`\`\`${language}\n// Your ${language} code here\n\`\`\``;
    
    // Insert at cursor position or append to the end
    onChange(content + (content.length > 0 ? '\n\n' : '') + codeTemplate);
    
    toast({
      description: `${language.toUpperCase()} code block added. Replace the placeholder with your code.`,
    });
  };
  
  return (
    <div className="mt-2 ml-6">
      <div className="relative">
        <Textarea
          placeholder="Write your reply..."
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[80px] text-sm"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute bottom-2 right-2 h-6 w-6"
            >
              <Code className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Add Code Block</h4>
              <div className="grid gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="justify-start text-xs"
                  onClick={() => insertCodeBlock('javascript')}
                >
                  JavaScript
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="justify-start text-xs"
                  onClick={() => insertCodeBlock('html')}
                >
                  HTML
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="justify-start text-xs"
                  onClick={() => insertCodeBlock('css')}
                >
                  CSS
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="justify-start text-xs"
                  onClick={() => insertCodeBlock('python')}
                >
                  Python
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="mt-2">
        <Button size="sm" onClick={onSubmit} className="flex items-center">
          <Send className="h-3 w-3 mr-1" />
          Post Reply
        </Button>
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
