
import { Link } from "react-router-dom";
import { Logo } from "@/components/ui/Logo";
import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Logo size="md" />
              <span className="text-lg font-bold">DevHive Connect</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Where developers collaborate, share knowledge, and grow together.
            </p>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold">Community</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/trending" className="text-muted-foreground hover:text-foreground">
                  Trending
                </Link>
              </li>
              <li>
                <Link to="/tags" className="text-muted-foreground hover:text-foreground">
                  Tags
                </Link>
              </li>
              <li>
                <Link to="/interview-questions" className="text-muted-foreground hover:text-foreground">
                  Interview Questions
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-semibold">Admin</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  to="/admin-login" 
                  className="text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <Shield className="h-3 w-3" />
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          © 2024 DevHive Connect. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
