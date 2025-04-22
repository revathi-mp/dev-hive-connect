
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function GitHubConnect() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConnect = () => {
    // Simulate GitHub connection with loading state
    setIsLoading(true);
    
    setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
      toast({
        title: "GitHub Connected!",
        description: "Your GitHub account has been successfully linked.",
      });
    }, 1500);
  };

  const handleDisconnect = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsConnected(false);
      setIsLoading(false);
      toast({
        title: "GitHub Disconnected",
        description: "Your GitHub account has been unlinked.",
      });
    }, 1000);
  };

  return (
    <Button 
      variant={isConnected ? "secondary" : "outline"} 
      className="w-full"
      onClick={isConnected ? handleDisconnect : handleConnect}
      disabled={isLoading}
    >
      <Github className="mr-2 h-4 w-4" />
      {isLoading ? "Processing..." : isConnected ? "Disconnect GitHub" : "Connect GitHub"}
    </Button>
  );
}
