'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import api, { fetcher } from '@/lib/api';
import { Category, Tag } from '@/types';
import Spinner from '@/components/ui/Spinner';

// Dynamic import to avoid SSR issues with ProseMirror
const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), {
  ssr: false,
  loading: () => <div style={{ height: 400, background: 'var(--bg-elevated)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner /></div>,
});

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [coverImageAlt, setCoverImageAlt] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  const { data: catData } = useSWR<{ success: boolean; data: Category[] }>('/categories', fetcher);
  const { data: tagData } = useSWR<{ success: boolean; data: Tag[] }>('/tags', fetcher);
  const categories = catData?.data || [];
  const tags = tagData?.data || [];

  const toggleTag = (id: string) => {
    setSelectedTags((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]);
  };

  const handleSave = async (saveStatus: 'draft' | 'published') => {
    if (!title.trim()) { toast.error('Title is required'); return; }
    if (!content || content === '<p></p>') { toast.error('Content is required'); return; }
    if (!excerpt.trim()) { toast.error('Excerpt is required'); return; }
    if (!categoryId) { toast.error('Please select a category'); return; }

    setSaving(true);
    try {
      await api.post('/posts', {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content,
        coverImage: coverImage.trim() || undefined,
        coverImageAlt: coverImageAlt.trim() || undefined,
        category: categoryId,
        tags: selectedTags,
        status: saveStatus,
      });
      toast.success(saveStatus === 'published' ? 'Post published! 🎉' : 'Draft saved');
      router.push('/admin/posts');
    } catch (err: any) {
      const details = err.response?.data?.details;
      if (details) Object.values(details).forEach((m) => toast.error(m as string));
      else toast.error(err.response?.data?.error || 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)' }}>New Post</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Draft an article and publish when ready</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setPreview((v) => !v)} className="btn btn-secondary" style={{ fontSize: 13 }}>
            {preview ? '← Editor' : 'Preview →'}
          </button>
          <button onClick={() => handleSave('draft')} disabled={saving} className="btn btn-secondary" style={{ fontSize: 13 }}>
            {saving ? <Spinner size={14} /> : null} Save Draft
          </button>
          <button onClick={() => handleSave('published')} disabled={saving} className="btn btn-primary" style={{ fontSize: 13 }}>
            {saving ? <Spinner size={14} color="white" /> : null} Publish
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24 }}>
        {/* Left: editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="form-group">
            <label htmlFor="post-title" className="form-label">Title *</label>
            <input id="post-title" type="text" placeholder="Write a compelling title..." value={title} onChange={(e) => setTitle(e.target.value)} className="form-input" style={{ fontSize: 18, fontWeight: 600 }} />
          </div>

          <div className="form-group">
            <label htmlFor="post-excerpt" className="form-label">Excerpt *</label>
            <textarea id="post-excerpt" placeholder="A short summary shown in post cards..." value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="form-input" rows={3} />
          </div>

          {/* Editor / Preview toggle */}
          <div className="form-group">
            <label className="form-label">Content *</label>
            {preview ? (
              <div className="prose-ethara card" style={{ padding: 32, minHeight: 400 }} dangerouslySetInnerHTML={{ __html: content || '<p style="color:var(--text-muted)">Nothing to preview yet…</p>' }} />
            ) : (
              <RichTextEditor content={content} onChange={setContent} placeholder="Start writing your article..." />
            )}
          </div>
        </div>

        {/* Right: settings panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Status */}
          <div className="card" style={{ padding: 20 }}>
            <p className="form-label" style={{ marginBottom: 10 }}>Status</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['draft', 'published'] as const).map((s) => (
                <button key={s} type="button" onClick={() => setStatus(s)} className="btn" style={{ flex: 1, justifyContent: 'center', padding: '8px', fontSize: 12, borderRadius: 6, border: '1px solid', background: status === s ? 'linear-gradient(135deg, #8B5CF6, #6366F1)' : 'transparent', borderColor: status === s ? 'transparent' : 'var(--border)', color: status === s ? 'white' : 'var(--text-secondary)' }}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="card" style={{ padding: 20 }}>
            <label htmlFor="post-category" className="form-label" style={{ marginBottom: 10, display: 'block' }}>Category *</label>
            <select id="post-category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="form-input" style={{ fontSize: 14 }}>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>

          {/* Tags */}
          <div className="card" style={{ padding: 20 }}>
            <p className="form-label" style={{ marginBottom: 10 }}>Tags</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {tags.map((tag) => (
                <button
                  key={tag._id}
                  type="button"
                  onClick={() => toggleTag(tag._id)}
                  className="badge"
                  style={{ cursor: 'pointer', border: '1px solid', background: selectedTags.includes(tag._id) ? 'rgba(139,92,246,0.2)' : 'transparent', borderColor: selectedTags.includes(tag._id) ? 'rgba(139,92,246,0.5)' : 'var(--border)', color: selectedTags.includes(tag._id) ? 'var(--accent-light)' : 'var(--text-muted)', transition: 'all 0.15s' }}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Cover Image */}
          <div className="card" style={{ padding: 20 }}>
            <label htmlFor="post-cover" className="form-label" style={{ marginBottom: 10, display: 'block' }}>Cover Image URL</label>
            <input id="post-cover" type="url" placeholder="https://..." value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className="form-input" style={{ fontSize: 13, marginBottom: 10 }} />
            {coverImage && (
              <img src={coverImage} alt="Cover preview" style={{ width: '100%', borderRadius: 8, objectFit: 'cover', maxHeight: 140 }} />
            )}
            <label htmlFor="post-cover-alt" className="form-label" style={{ marginBottom: 6, display: 'block', marginTop: 10 }}>Alt Text</label>
            <input id="post-cover-alt" type="text" placeholder="Describe the image..." value={coverImageAlt} onChange={(e) => setCoverImageAlt(e.target.value)} className="form-input" style={{ fontSize: 13 }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
