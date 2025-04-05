import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Heart } from "lucide-react";

interface DonateButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  text?: string;
  showIcon?: boolean;
  fullWidth?: boolean;
}

const DonateButton: React.FC<DonateButtonProps> = ({
  variant = "default",
  size = "default",
  className = "",
  text = "Donate",
  showIcon = true,
  fullWidth = false,
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={`${fullWidth ? 'w-full' : ''} ${className}`}
      asChild
    >
      <Link href="/#support">
        {showIcon && <Heart className="mr-2 h-4 w-4" />}
        {text}
      </Link>
    </Button>
  );
};

export default DonateButton;