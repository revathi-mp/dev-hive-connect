
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfilePictureUploadProps {
  currentAvatar: string;
  onUpdate: (newAvatarUrl: string) => void;
}

export function ProfilePictureUpload({ currentAvatar, onUpdate }: ProfilePictureUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please choose an image under 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onUpdate(reader.result);
          toast({
            title: "Profile picture updated",
            description: "Your profile picture has been successfully updated.",
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative group">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-0 right-0 rounded-full bg-background shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => fileInputRef.current?.click()}
      >
        <Camera className="h-4 w-4" />
      </Button>
    </div>
  );
}
