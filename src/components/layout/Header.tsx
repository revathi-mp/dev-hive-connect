
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Bell, 
  Code, 
  LogIn, 
  Menu, 
  Search, 
  User,
  Moon,
  Sun
} from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">DevHive Connect</span>
          </Link>
        </div>
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
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Moon className="h-5 w-5" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <div className="hidden md:block">
            <div className="flex items-center gap-2">
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
              <Button variant="ghost" size="icon" asChild>
                <Link to="/profile">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
