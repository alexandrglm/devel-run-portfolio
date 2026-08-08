
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Icons, faBook, faCode } from './FontAwesome';


const MarkdownRenderer = ({
  content,
  title = 'Documentation',
  defaultOpen = false,
  className = '',
  icon = faBook,
  basePath = '',
  assetPrefix = '/src'
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const resolveImagePath = (src) => {
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
      return src;
    }

    if (src.startsWith('/')) {
      return src;
    }

    if (basePath) {
      const cleanBase = basePath.replace(/\/+$/, '');
      const cleanSrc = src.replace(/^\/+/, '');
      return `${cleanBase}/${cleanSrc}`;
    }

    if (assetPrefix) {
      const cleanPrefix = assetPrefix.replace(/\/+$/, '');
      const cleanSrc = src.replace(/^\/+/, '');
      return `${cleanPrefix}/${cleanSrc}`;
    }

    return src;
  };

  return (
    <div className={`markdown-renderer ${className}`}>
      <button
      className="markdown-renderer__toggle"
      onClick={() => setIsOpen(!isOpen)}
      aria-expanded={isOpen}
      aria-controls="markdown-content">

        <Icons icon={icon} className="markdown-renderer__toggle-icon" />
        <span className="markdown-renderer__toggle-label">
          {isOpen ? `Hide ${title}` : `View ${title}`}
        </span>
        <span className={`markdown-renderer__toggle-arrow ${isOpen ? 'open' : ''}`}>
          ▾
        </span>
      </button>

      {isOpen &&
      <div
      id="markdown-content"
      className="markdown-renderer__content"
      role="region"
      aria-label={title}>

          <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="markdown-h1">{children}</h1>,
          h2: ({ children }) => <h2 className="markdown-h2">{children}</h2>,
          h3: ({ children }) => <h3 className="markdown-h3">{children}</h3>,
          h4: ({ children }) => <h4 className="markdown-h4">{children}</h4>,
          p: ({ children }) => <p className="markdown-p">{children}</p>,
          img: ({ src, alt, title }) => {
            const resolvedSrc = resolveImagePath(src);
            return (
              <img
              src={resolvedSrc}
              alt={alt || ''}
              title={title}
              className="markdown-img"
              loading="lazy" />);


          },
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ?
            <code className="markdown-inline-code">{children}</code> :

            <div className="markdown-code-block">
                    <div className="markdown-code-block__header">
                      <span className="markdown-code-block__dot markdown-code-block__dot--red" />
                      <span className="markdown-code-block__dot markdown-code-block__dot--yellow" />
                      <span className="markdown-code-block__dot markdown-code-block__dot--green" />
                      <span className="markdown-code-block__lang">
                        {className?.replace('language-', '') || 'code'}
                      </span>
                      <button
                className="markdown-code-block__copy"
                onClick={() => {
                  navigator.clipboard?.writeText(String(children));
                }}
                aria-label="Copy code to clipboard">

                        <Icons icon={faCode} />
                        Copy
                      </button>
                    </div>
                    <pre className="markdown-code-block__pre">
                      <code className="markdown-code-block__code">{children}</code>
                    </pre>
                  </div>;

          },
          a: ({ href, children }) =>
          <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="markdown-link">

                  {children}
                </a>,

          ul: ({ children }) => <ul className="markdown-ul">{children}</ul>,
          ol: ({ children }) => <ol className="markdown-ol">{children}</ol>,
          li: ({ children }) => <li className="markdown-li">{children}</li>,
          blockquote: ({ children }) => <blockquote className="markdown-blockquote">{children}</blockquote>,
          table: ({ children }) => <table className="markdown-table">{children}</table>,
          thead: ({ children }) => <thead className="markdown-thead">{children}</thead>,
          tbody: ({ children }) => <tbody className="markdown-tbody">{children}</tbody>,
          tr: ({ children }) => <tr className="markdown-tr">{children}</tr>,
          th: ({ children }) => <th className="markdown-th">{children}</th>,
          td: ({ children }) => <td className="markdown-td">{children}</td>,
          hr: () => <hr className="markdown-hr" />,
          strong: ({ children }) => <strong className="markdown-strong">{children}</strong>,
          em: ({ children }) => <em className="markdown-em">{children}</em>
        }}>

            {content}
          </ReactMarkdown>
        </div>}

    </div>);

};

export default MarkdownRenderer;