
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWikiPages, createWikiPage, updateWikiPage, deleteWikiPage } from '../../../store/slices/wikiSlice';
import MDEditor from '@uiw/react-md-editor';
import 'react-markdown-editor-lite/lib/index.css';
import Debug from '../../commons/Debug';

const generateSlug = (title) => {
  return title.
  toLowerCase().
  normalize('NFD').
  replace(/[\u0300-\u036f]/g, '').
  replace(/[^\w\s-]/g, '').
  replace(/\s+/g, '-').
  replace(/-+/g, '-').
  trim();
};


const WIKI_CATEGORIES = [
{ value: 'getting-started', label: '🚀 Comenzando' },
{ value: 'client', label: '🔌 Cliente VPN' },
{ value: 'server', label: '🖥️ Servidor' },
{ value: 'routing', label: '🔄 Routing' },
{ value: 'firewall', label: '🔥 Firewall' },
{ value: 'troubleshooting', label: '🔧 Troubleshooting' },
{ value: 'advanced', label: '⚡ Avanzado' },
{ value: 'reference', label: '📚 Referencia' }];



const SOFTWARE_VERSIONS = ['1.0.0', '1.1.0', '2.0.0-beta'];

export default function AdminWikiPages() {
  const dispatch = useDispatch();
  const pages = useSelector((state) => state.wiki.items);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    markdown: '',
    category: 'getting-started',
    version: '1.0.0',
    order: 0,
    parentPage: '',
    status: 'draft',
    tags: '',
    metadata: {
      command: '',
      filePath: '',
      seeAlso: []
    }
  });

  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    dispatch(fetchWikiPages());
  }, [dispatch]);

  const handleTitleChange = (title) => {
    setForm({
      ...form,
      title,
      slug: form.slug || generateSlug(title)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const pageData = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter((t) => t),
      metadata: {
        ...form.metadata,
        seeAlso: form.metadata.seeAlso.split(',').map((s) => s.trim()).filter((s) => s)
      },
      publishedAt: form.status === 'published' ? new Date() : null,
      updatedAt: new Date()
    };

    if (editing) {
      dispatch(updateWikiPage({ id: editing, data: pageData }));
      setEditing(null);
    } else {
      dispatch(createWikiPage(pageData));
    }

    resetForm();
  };

  const handleEdit = (page) => {
    setForm({
      title: page.title,
      slug: page.slug,
      excerpt: page.excerpt || '',
      markdown: page.markdown || '',
      category: page.category || 'getting-started',
      version: page.version || '1.0.0',
      order: page.order || 0,
      parentPage: page.parentPage || '',
      status: page.status,
      tags: page.tags ? page.tags.join(', ') : '',
      metadata: {
        command: page.metadata?.command || '',
        filePath: page.metadata?.filePath || '',
        seeAlso: page.metadata?.seeAlso ? page.metadata.seeAlso.join(', ') : ''
      }
    });
    setEditing(page._id);
    setPreviewMode(false);
  };

  const resetForm = () => {
    setForm({
      title: '',
      slug: '',
      excerpt: '',
      markdown: '',
      category: 'getting-started',
      version: '1.0.0',
      order: 0,
      parentPage: '',
      status: 'draft',
      tags: '',
      metadata: {
        command: '',
        filePath: '',
        seeAlso: ''
      }
    });
    setEditing(null);
  };

  const filteredPages = pages.filter((page) => {
    if (filter !== 'all' && page.status !== filter) return false;
    if (categoryFilter !== 'all' && page.category !== categoryFilter) return false;
    return true;
  });


  const parentOptions = pages.
  filter((p) => p.status === 'published' && p._id !== editing).
  map((p) => ({ value: p._id, label: p.title }));

  return (
    <div className="page admin-wiki-page">
        <h1>📚 Gestión de Wiki</h1>

        <form onSubmit={handleSubmit} className="wiki-form">

        {}
        <div className="form-row-split">
        <div className="form-group">
        <label>Título de la página *</label>
        <input
            type="text"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            placeholder="Ej: Configuración del Servidor WireGuard" />

        </div>

        <div className="form-group">
        <label>URL (slug) *</label>
        <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
            placeholder="configuracion-servidor-wireguard" />

        </div>
        </div>

        {}
        <div className="form-row">
        <label>Descripción breve</label>
        <textarea
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          rows="2"
          placeholder="Resumen de lo que trata esta página..." />

        </div>

        {}
        <div className="form-row-split">
        <div className="form-group">
        <label>Categoría</label>
        <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}>

        {WIKI_CATEGORIES.map((cat) =>
              <option key={cat.value} value={cat.value}>{cat.label}</option>)}

        </select>
        </div>

        <div className="form-group">
        <label>Versión del software</label>
        <select
            value={form.version}
            onChange={(e) => setForm({ ...form, version: e.target.value })}>

        {SOFTWARE_VERSIONS.map((v) =>
              <option key={v} value={v}>{v}</option>)}

        </select>
        </div>
        </div>

        {}
        <div className="form-row-split">
        <div className="form-group">
        <label>Página padre (para jerarquía)</label>
        <select
            value={form.parentPage}
            onChange={(e) => setForm({ ...form, parentPage: e.target.value })}>

        <option value="">-- Página raíz --</option>
        {parentOptions.map((opt) =>
              <option key={opt.value} value={opt.value}>{opt.label}</option>)}

        </select>
        </div>

        <div className="form-group">
        <label>Orden (número)</label>
        <input
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
            min="0"
            step="1" />

        </div>
        </div>

        {}
        <div className="form-row">
        <label>Contenido (Markdown)</label>
        <div className="editor-toolbar">
        <button
            type="button"
            className={!previewMode ? 'active' : ''}
            onClick={() => setPreviewMode(false)}>

        ✏️ Editar
        </button>
        <button
            type="button"
            className={previewMode ? 'active' : ''}
            onClick={() => setPreviewMode(true)}>

        👁️ Vista previa
        </button>
        </div>

        <div className="markdown-editor-wrapper">
        {previewMode ?
            <div className="markdown-preview wiki-content">
            <MDEditor.Markdown source={form.markdown} />
            </div> :

            <MDEditor
            value={form.markdown}
            onChange={(val) => setForm({ ...form, markdown: val || '' })}
            preview="edit"
            height={500} />}


        </div>
        </div>

        {}
        <div className="form-section">
        <h3>⚙️ Metadatos del Software</h3>

        <div className="form-row">
        <label>Comando relacionado</label>
        <input
            type="text"
            value={form.metadata.command}
            onChange={(e) => setForm({
              ...form,
              metadata: { ...form.metadata, command: e.target.value }
            })}
            placeholder="Ej: wg-autoconf server create" />

        </div>

        <div className="form-row">
        <label>Ruta en documentación original</label>
        <input
            type="text"
            value={form.metadata.filePath}
            onChange={(e) => setForm({
              ...form,
              metadata: { ...form.metadata, filePath: e.target.value }
            })}
            placeholder="Ej: /docs/DOCS.md#server-management" />

        </div>

        <div className="form-row">
        <label>Ver también (IDs separados por comas)</label>
        <input
            type="text"
            value={form.metadata.seeAlso}
            onChange={(e) => setForm({
              ...form,
              metadata: { ...form.metadata, seeAlso: e.target.value }
            })}
            placeholder="page-id-1, page-id-2" />

        </div>
        </div>

        {}
        <div className="form-row-split">
        <div className="form-group">
        <label>Tags (separados por comas)</label>
        <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="wireguard, vpn, routing" />

        </div>

        <div className="form-group">
        <label>Estado</label>
        <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}>

        <option value="draft">📝 Borrador</option>
        <option value="published">✅ Publicado</option>
        <option value="archived">📦 Archivado</option>
        </select>
        </div>
        </div>

        {}
        <div className="form-actions">
        <button type="submit" className="btn-primary">
        {editing ? 'Actualizar Página' : 'Crear Página'}
        </button>

        {editing &&
          <button type="button" className="btn-secondary" onClick={() => {setEditing(null);resetForm();}}>
            Cancelar
            </button>}

        </div>
        </form>

        {}
        <div className="wiki-filters">
        <div className="filter-group">
        <label>Estado:</label>
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}>

        Todos ({pages.length})
        </button>
        <button
          className={filter === 'published' ? 'active' : ''}
          onClick={() => setFilter('published')}>

        Publicados ({pages.filter((p) => p.status === 'published').length})
        </button>
        <button
          className={filter === 'draft' ? 'active' : ''}
          onClick={() => setFilter('draft')}>

        Borradores ({pages.filter((p) => p.status === 'draft').length})
        </button>
        </div>

        <div className="filter-group">
        <label>Categoría:</label>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}>

        <option value="all">Todas las categorías</option>
        {WIKI_CATEGORIES.map((cat) =>
            <option key={cat.value} value={cat.value}>{cat.label}</option>)}

        </select>
        </div>
        </div>

        {}
        <div className="wiki-pages-list">
        {filteredPages.map((page) =>
        <div key={page._id} className="wiki-page-card">
            <div className="wiki-page-header">
            <div>
            <h3>
            {page.title}
            {page.metadata?.command &&
                <code className="page-command">{page.metadata.command}</code>}

            </h3>
            <div className="page-meta-badges">
            <span className={`status-badge status-${page.status}`}>
            {page.status === 'published' ? '✅ Publicado' :
                  page.status === 'draft' ? '📝 Borrador' : '📦 Archivado'}
                </span>
                <span className="category-badge">
                {WIKI_CATEGORIES.find((c) => c.value === page.category)?.label || page.category}
                </span>
                <span className="version-badge">v{page.version}</span>
                </div>
                </div>

                {page.excerpt &&
            <p className="page-excerpt">{page.excerpt}</p>}

                </div>

                <div className="page-metadata">
                <small>
                <strong>Slug:</strong> <code>{page.slug}</code>
                </small>
                <small>
                <strong>Actualizado:</strong> {new Date(page.updatedAt || page.createdAt).toLocaleDateString()}
                </small>
                {page.parentPage &&
            <small>
                    <strong>Padre:</strong> {pages.find((p) => p._id === page.parentPage)?.title}
                    </small>}

                </div>

                {page.tags && page.tags.length > 0 &&
          <div className="page-tags">
                    {page.tags.map((tag) =>
            <span key={tag} className="tag">{tag}</span>)}

                    </div>}


                <div className="page-actions">
                <button onClick={() => handleEdit(page)}>✏️ Editar</button>
                <button onClick={() => dispatch(deleteWikiPage(page._id))}>🗑️ Eliminar</button>
                <button onClick={() => window.open(`/wiki/${page.slug}`, '_blank')}>👁️ Ver</button>
                </div>
                </div>)}

        </div>
        </div>);

}