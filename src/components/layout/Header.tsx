
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Logo } from "@/components/ui/Logo";
import { 
  Bell, 
  LogIn, 
  Menu, 
  Search, 
  User,
  Moon,
  Sun,
  LogOut
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut, loading } = useAuth();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
    toast({
      title: `${newTheme === 'dark' ? 'Dark' : 'Light'} Mode Activated`,
      description: `Switched to ${newTheme} mode.`,
    });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
      navigate("/");
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNotificationClick = () => {
    setHasUnreadNotifications(false);
    toast({
      title: "Notifications",
      description: "You have no new notifications.",
    });
  };

  const getInitials = (email: string) => {
    if (!email) return "GU";
    const parts = email.split('@');
    if (parts.length > 0) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return "GU";
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <Logo size="md" />
            <span className="text-xl font-bold tracking-tight">DevHive Connect</span>
          </Link>
        </div>
        
        {user && (
          <div className="hidden md:flex md:flex-1 md:items-center md:justify-end md:gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search discussions..."
                className="w-full rounded-md border border-input bg-background py-2 pl-8 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {user && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleNotificationClick}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {hasUnreadNotifications && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          )}
          
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <div className="flex items-center gap-2">
            {loading ? (
              <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
            ) : user ? (
              <>
                <Button variant="outline" size="sm" className="gap-1 hidden md:flex" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/profile">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitials(user.email || "")}</AvatarFallback>
                    </Avatar>
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" className="gap-1" asChild>
                  <Link to="/login">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                </Button>
                <Button size="sm" className="gap-1" asChild>
                  <Link to="/signup">
                    <User className="h-4 w-4" />
                    Sign up
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
