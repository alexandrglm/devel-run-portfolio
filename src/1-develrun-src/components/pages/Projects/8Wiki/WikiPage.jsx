
import { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWikiPages } from '../../../../store/slices/wikiSlice';
import MDEditor from '@uiw/react-md-editor';

export default function WikiPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { items: pages, loading } = useSelector((state) => state.wiki);
  const [tableOfContents, setTableOfContents] = useState([]);

  useEffect(() => {
    if (pages.length === 0) {
      dispatch(fetchWikiPages());
    }
  }, [dispatch, pages.length]);


  useEffect(() => {
    if (currentPage?.markdown) {
      const headings = currentPage.markdown.match(/^#{2,3} .+$/gm) || [];
      const toc = headings.map((h) => {
        const level = h.match(/^#+/)[0].length;
        const text = h.replace(/^#+\s/, '');
        const id = text.toLowerCase().replace(/[^\w]+/g, '-');
        return { level, text, id };
      });
      setTableOfContents(toc);
    }
  }, [currentPage]);

  if (loading) {
    return (
      <div className="page wiki-page">
            <div className="wiki-loading">Loading knowledge base...</div>
            </div>);

  }

  const currentPage = pages.find((p) => p.slug === slug && p.status === 'published');

  if (!currentPage) {
    return <Navigate to="/wiki" replace />;
  }


  const relatedPages = currentPage.metadata?.seeAlso ?
  pages.filter((p) => currentPage.metadata.seeAlso.includes(p._id) && p.status === 'published') :
  [];


  const childPages = pages.filter((p) => p.parentPage === currentPage._id && p.status === 'published');

  return (
    <div className="page wiki-page">
        <div className="wiki-layout">
        {tableOfContents.length > 0 &&
        <aside className="wiki-toc">
            <h4>📋 TOC</h4>
            <ul>
            {tableOfContents.map((heading, idx) =>
            <li key={idx} className={`toc-level-${heading.level}`}>
                <a href={`#${heading.id}`}>{heading.text}</a>
                </li>)}

            </ul>
            </aside>}


        {}
        <article className="wiki-content">
        {}
        <header className="wiki-page-header">
        <h1>{currentPage.title}</h1>

        <div className="wiki-meta">
        <span className="wiki-category">
        {WIKI_CATEGORIES.find((c) => c.value === currentPage.category)?.label}
        </span>
        <span className="wiki-version">v{currentPage.version}</span>
        {currentPage.metadata?.command &&
              <code className="wiki-command">{currentPage.metadata.command}</code>}

        </div>

        {currentPage.excerpt &&
            <p className="wiki-excerpt">{currentPage.excerpt}</p>}

        </header>

        {}
        <div className="markdown-body" data-color-mode="auto">
        <MDEditor.Markdown
            source={currentPage.markdown}
            transformLinkUri={(uri) => {
              if (uri.startsWith('wiki:')) {
                return `/wiki/${uri.replace('wiki:', '')}`;
              }
              return uri;
            }} />

        </div>

        {}
        {childPages.length > 0 &&
          <section className="wiki-child-pages">
            <h3>📖 On this page</h3>
            <div className="child-pages-grid">
            {childPages.map((child) =>
              <Link key={child._id} to={`/wiki/${child.slug}`} className="child-page-card">
                <h4>{child.title}</h4>
                {child.excerpt && <p>{child.excerpt}</p>}
                </Link>)}

            </div>
            </section>}


        {}
        {relatedPages.length > 0 &&
          <section className="wiki-related-pages">
            <h3>🔗 See Also</h3>
            <ul>
            {relatedPages.map((related) =>
              <li key={related._id}>
                <Link to={`/wiki/${related.slug}`}>{related.title}</Link>
                </li>)}

            </ul>
            </section>}


        {}
        <footer className="wiki-page-footer">
        <hr />
        <p className="wiki-last-updated">
        Última actualización: {new Date(currentPage.updatedAt || currentPage.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
        </p>
        {currentPage.metadata?.filePath &&
            <p className="wiki-source">
            <a
              href={`https://github.com/alexandrglm/wg-autoconf/blob/main/${currentPage.metadata.filePath}`}
              target="_blank"
              rel="noopener noreferrer">

            📝 Check source code on GitHub
            </a>
            </p>}

        </footer>
        </article>
        </div>
        </div>);

}