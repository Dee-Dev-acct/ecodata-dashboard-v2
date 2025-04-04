interface BlogContentProps {
  content: string;
}

const BlogContent = ({ content }: BlogContentProps) => {
  return (
    <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-heading prose-headings:font-bold prose-a:text-[#2A9D8F] dark:prose-a:text-[#38B593] prose-img:rounded-lg">
      {/* Renders the HTML content */}
      <div dangerouslySetInnerHTML={{ __html: content }}></div>
    </div>
  );
};

export default BlogContent;