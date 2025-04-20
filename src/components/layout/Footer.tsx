
import { Link } from "react-router-dom";
import { Code, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-primary" />
          <span className="font-medium">DevHive Connect</span>
        </div>
        <nav className="flex gap-4 text-sm text-muted-foreground">
          <Link to="/about" className="hover:underline">
            About
          </Link>
          <Link to="/privacy" className="hover:underline">
            Privacy
          </Link>
          <Link to="/terms" className="hover:underline">
            Terms
          </Link>
          <a href="https://github.com/devhive-community" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </nav>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} DevHive Connect. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
