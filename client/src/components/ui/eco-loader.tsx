import { Leaf, Wind, Sprout, TreeDeciduous, Coffee } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface EcoLoaderProps {
  /** Variant of the loader. Default is "leaf" */
  variant?: "leaf" | "wind" | "sprout" | "tree" | "seedling";
  /** Size of the loader in pixels. Default is 24 */
  size?: number;
  /** Text to display below the loader. If not provided, no text is shown */
  text?: string;
  /** Additional CSS classes for the loader container */
  className?: string;
  /** Duration of the animation in seconds. Default is 2 */
  duration?: number;
}

export function EcoLoader({
  variant = "leaf",
  size = 24,
  text,
  className,
  duration = 2,
}: EcoLoaderProps) {
  // Choose the icon based on the variant
  const Icon = (() => {
    switch (variant) {
      case "wind":
        return Wind;
      case "sprout":
        return Sprout;
      case "tree":
        return TreeDeciduous;
      case "seedling":
        return Coffee;
      case "leaf":
      default:
        return Leaf;
    }
  })();

  // Different animation variants for each loader type
  const getAnimationVariants = () => {
    switch (variant) {
      case "wind":
        return {
          animate: {
            x: [0, 10, -5, 10, 0],
            opacity: [0.5, 1, 0.8, 1, 0.5],
            transition: {
              duration,
              repeat: Infinity,
              ease: "easeInOut",
            },
          },
        };
      case "sprout":
        return {
          animate: {
            y: [0, -5, 0],
            scale: [1, 1.1, 1],
            transition: {
              duration: duration * 0.8,
              repeat: Infinity,
              ease: "easeInOut",
            },
          },
        };
      case "tree":
        return {
          animate: {
            rotate: [-5, 0, 5, 0, -5],
            transition: {
              duration: duration * 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            },
          },
        };
      case "seedling":
        return {
          animate: {
            scale: [1, 1.15, 1],
            transition: {
              duration: duration * 0.6,
              repeat: Infinity,
              ease: "easeInOut",
            },
          },
        };
      case "leaf":
      default:
        return {
          animate: {
            rotate: [0, 10, -10, 10, 0],
            transition: {
              duration,
              repeat: Infinity,
              ease: "easeInOut",
            },
          },
        };
    }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <motion.div
        initial={{ opacity: 0.8 }}
        {...getAnimationVariants()}
        className="text-primary"
      >
        <Icon size={size} />
      </motion.div>
      {text && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {text}
        </p>
      )}
    </div>
  );
}

export function LeafSpinner({
  className,
  size = 24,
  text,
}: {
  className?: string;
  size?: number;
  text?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
        className="text-primary"
      >
        <Leaf size={size} />
      </motion.div>
      {text && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {text}
        </p>
      )}
    </div>
  );
}

export function GrowingSprout({
  className,
  size = 24,
  text,
}: {
  className?: string;
  size?: number;
  text?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeOut",
        }}
        className="text-primary"
      >
        <Sprout size={size} />
      </motion.div>
      {text && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {text}
        </p>
      )}
    </div>
  );
}

export function SwayingTree({
  className,
  size = 24,
  text,
}: {
  className?: string;
  size?: number;
  text?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <motion.div
        animate={{
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="text-primary"
      >
        <TreeDeciduous size={size} />
      </motion.div>
      {text && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {text}
        </p>
      )}
    </div>
  );
}

export function MultiLeafLoader({
  className,
  size = 24,
  text,
}: {
  className?: string;
  size?: number;
  text?: string;
}) {
  const leafCount = 3;
  const baseDelay = 0.15;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="flex items-center justify-center gap-2">
        {Array(leafCount)
          .fill(null)
          .map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.2, y: 0 }}
              animate={{ opacity: 1, y: [-2, 2, -2] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * baseDelay,
                ease: "easeInOut",
              }}
              className="text-primary"
            >
              <Leaf size={size} />
            </motion.div>
          ))}
      </div>
      {text && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {text}
        </p>
      )}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex h-40 w-full items-center justify-center">
      <MultiLeafLoader size={32} text="Loading..." />
    </div>
  );
}

export function FullPageLoader() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
      <MultiLeafLoader 
        size={48} 
        text="Loading ECODATA CIC..." 
        className="animate-pulse" 
      />
    </div>
  );
}