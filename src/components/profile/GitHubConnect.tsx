
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function GitHubConnect() {
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const handleConnect = () => {
    // Mock GitHub connection for now
    setIsConnected(true);
    toast({
      title: "GitHub Connected!",
      description: "Your GitHub account has been successfully linked.",
    });
  };

  return (
    <Button 
      variant={isConnected ? "secondary" : "outline"} 
      className="w-full"
      onClick={handleConnect}
    >
      <Github className="mr-2 h-4 w-4" />
      {isConnected ? "GitHub Connected" : "Connect GitHub"}
    </Button>
  );
}
