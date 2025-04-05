interface BlogContentProps {
  content: string;
}

const BlogContent = ({ content }: BlogContentProps) => {
  return (
    <div className="prose prose-lg max-w-none dark:prose-invert 
      prose-headings:font-heading prose-headings:font-bold 
      prose-h2:border-b prose-h2:border-[#E0F3F0] prose-h2:dark:border-[#1A4D5C] prose-h2:pb-2
      prose-a:text-[#2A9D8F] prose-a:no-underline prose-a:border-b prose-a:border-[#2A9D8F] prose-a:border-opacity-30 hover:prose-a:border-opacity-100
      dark:prose-a:text-[#38B593] dark:prose-a:border-[#38B593]
      prose-img:rounded-lg prose-img:shadow-md
      prose-blockquote:border-l-[#2A9D8F] prose-blockquote:bg-[#F0FAF8] dark:prose-blockquote:bg-[#1A3C46] prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-md
      prose-code:text-[#2A9D8F] dark:prose-code:text-[#38B593] prose-code:bg-[#F0FAF8] dark:prose-code:bg-[#1A3C46] prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md
      prose-strong:text-[#1A323C] dark:prose-strong:text-[#A8D0D4]
      prose-ul:list-disc prose-ol:list-decimal
      prose-li:marker:text-[#2A9D8F] dark:prose-li:marker:text-[#38B593]
      transition-colors">
      {/* Renders the HTML content */}
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
    </div>
  );
};

export default BlogContent;