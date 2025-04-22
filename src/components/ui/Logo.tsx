
import React from 'react';
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ 
  className, 
  size = 'md' 
}) => {
  const sizeClasses = {
    'sm': 'w-8 h-8',
    'md': 'w-10 h-10',
    'lg': 'w-12 h-12'
  };

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      className={cn(
        "text-primary", 
        sizeClasses[size], 
        className
      )}
      fill="none"
    >
      {/* Hexagonal base representing connection and community */}
      <polygon 
        points="50,10 90,35 90,65 50,90 10,65 10,35" 
        stroke="currentColor" 
        strokeWidth="8" 
        fill="currentColor"
        fillOpacity="0.1"
      />
      
      {/* Code brackets symbolizing development */}
      <path 
        d="M35,50 L25,50 Q20,50 20,45 L20,35 Q20,30 25,30" 
        stroke="currentColor" 
        strokeWidth="6" 
        fill="none"
      />
      <path 
        d="M65,50 L75,50 Q80,50 80,45 L80,35 Q80,30 75,30" 
        stroke="currentColor" 
        strokeWidth="6" 
        fill="none"
      />
      
      {/* Connecting lines representing network */}
      <line 
        x1="50" y1="50" 
        x2="30" y2="40" 
        stroke="currentColor" 
        strokeWidth="4" 
        strokeOpacity="0.5"
      />
      <line 
        x1="50" y1="50" 
        x2="70" y2="40" 
        stroke="currentColor" 
        strokeWidth="4" 
        strokeOpacity="0.5"
      />
    </svg>
  );
};
