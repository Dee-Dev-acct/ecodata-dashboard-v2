import { motion } from "framer-motion";
import { MessageSquare, User } from "lucide-react";
import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

type MessageType = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
};

type ChatMessageProps = {
  message: MessageType;
};

// Helper function to convert URLs and mentions to clickable links
const linkifyText = (text: string): string => {
  // URL regex
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // Page path regex with word boundaries to avoid matching in the middle of words
  // This matches /path or /path/subpath patterns
  const pathRegex = /(\s|\(|^)(\/([\w-]+)(\/[\w-]+)*)\b/g;
  
  // Convert URLs to links
  let processed = text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>');
  
  // Convert paths to links with data attributes that we'll use for navigation
  processed = processed.replace(pathRegex, '$1<a href="javascript:void(0)" data-internal-link="$2" class="text-primary hover:underline">$2</a>');
  
  return processed;
};

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isBot = message.sender === "bot";
  const [, setLocation] = useLocation();
  
  // Use DOMPurify to sanitize the HTML after linkification
  const sanitizedContent = DOMPurify.sanitize(linkifyText(message.content));
  
  // Handle clicking on internal links
  const handleMessageClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    
    if (target.tagName === 'A' && target.hasAttribute('data-internal-link')) {
      e.preventDefault();
      const path = target.getAttribute('data-internal-link');
      if (path) {
        setLocation(path);
      }
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex gap-3 max-w-[85%]",
        isBot ? "self-start" : "self-end ml-auto"
      )}
    >
      {isBot && (
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <MessageSquare className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
      
      <div
        className={cn(
          "rounded-2xl px-4 py-2",
          isBot
            ? "bg-muted text-foreground"
            : "bg-primary text-primary-foreground"
        )}
      >
        {/* We use dangerouslySetInnerHTML here, but only after sanitizing with DOMPurify */}
        <div
          className="text-sm"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          onClick={handleMessageClick}
        />
        <div
          className={cn(
            "text-[10px] mt-1 text-right",
            isBot ? "text-muted-foreground" : "text-primary-foreground/70"
          )}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
      
      {!isBot && (
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessage;