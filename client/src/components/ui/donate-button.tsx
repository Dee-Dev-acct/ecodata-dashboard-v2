import { Button, ButtonProps } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

type CustomVariant = "filled" | "outline" | "ghost" | "subtle";

interface DonateButtonProps extends Omit<ButtonProps, 'variant'> {
  goalId?: string;
  amount?: number;
  variant?: CustomVariant;
  icon?: boolean;
}

export function DonateButton({
  goalId,
  amount,
  variant = "filled",
  icon = true,
  className,
  children,
  ...props
}: DonateButtonProps) {
  const [, navigate] = useLocation();

  const handleClick = () => {
    // Navigate to the checkout page with the goal ID if available
    navigate(goalId ? `/checkout/${goalId}` : '/checkout');
  };

  // Map our custom variants to shadcn variants
  const buttonVariant = (() => {
    switch (variant) {
      case "filled": return "default";
      case "outline": return "outline";
      case "ghost": return "ghost";
      case "subtle": return "secondary";
      default: return "default";
    }
  })();

  return (
    <Button
      className={cn(
        "font-medium",
        icon && "flex items-center gap-2",
        className
      )}
      variant={buttonVariant as any}
      onClick={handleClick}
      {...props}
    >
      {icon && <Heart className="h-4 w-4" />}
      {children || (amount ? `Donate £${amount}` : "Donate Now")}
    </Button>
  );
}

interface DonateAmountButtonsProps {
  goalId?: string;
  amounts?: number[];
  className?: string;
}

export function DonateAmountButtons({
  goalId,
  amounts = [10, 25, 50, 100],
  className,
}: DonateAmountButtonsProps) {
  const [, navigate] = useLocation();

  const handleCustomAmount = () => {
    navigate(goalId ? `/checkout/${goalId}` : '/checkout');
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {amounts.map((amount) => (
        <DonateButton 
          key={amount} 
          goalId={goalId} 
          amount={amount} 
          size="sm"
          icon={false}
        />
      ))}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleCustomAmount}
        className="font-medium"
      >
        Custom Amount
      </Button>
    </div>
  );
}

export function SubscribeButton({
  className,
  children,
  ...props
}: ButtonProps) {
  const [, navigate] = useLocation();

  const handleClick = () => {
    // We'll open a separate subscription page
    navigate('/subscribe');
  };

  return (
    <Button
      className={cn("font-medium", className)}
      variant="outline"
      onClick={handleClick}
      {...props}
    >
      {children || "Subscribe Monthly"}
    </Button>
  );
}