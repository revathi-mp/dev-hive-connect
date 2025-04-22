import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/ui/Logo";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block bg-sidebar relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <div className="max-w-lg">
            <div className="mb-4 flex items-center gap-2 text-white">
              <Logo size="lg" className="text-white" />
              <span className="text-2xl font-bold">DevHive Connect</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Join the developer community where collaboration meets innovation
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Connect with fellow developers, share knowledge, ask questions, and grow your
              skills with a supportive community built for developers by developers.
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-8">
        <div className="mx-auto w-full max-w-md">
          <div className="flex flex-col items-center space-y-2 text-center">
            <Link to="/" className="mb-4 flex items-center gap-2 lg:hidden">
              <Logo size="md" />
              <span className="text-xl font-bold">DevHive Connect</span>
            </Link>
            <h2 className="text-3xl font-bold">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
