
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EditProfileDialogProps {
  user: {
    name: string;
    username: string;
    bio: string;
    skills: string[];
  };
  onUpdate: (data: any) => void;
}

export function EditProfileDialog({ user, onUpdate }: EditProfileDialogProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    bio: user.bio,
    skills: user.skills.join(", ")
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...formData,
      skills: formData.skills.split(",").map(skill => skill.trim())
    });
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">Username</label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-medium">Bio</label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="skills" className="text-sm font-medium">Skills (comma-separated)</label>
            <Input
              id="skills"
              value={formData.skills}
              onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
            />
          </div>
          <Button type="submit" className="w-full">Save Changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
