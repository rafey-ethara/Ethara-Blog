'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import useSWR from 'swr';
import api, { fetcher } from '@/lib/api';
import { Category } from '@/types';

export default function AdminCategoriesPage() {
  const { data, mutate } = useSWR<{ success: boolean; data: Category[] }>('/categories', fetcher);
  const categories = data?.data || [];

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#8B5CF6');
  const [saving, setSaving] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      await api.post('/categories', { name: name.trim(), description: description.trim(), color });
      toast.success('Category created!');
      setName(''); setDescription(''); setColor('#8B5CF6');
      mutate();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Delete "${catName}"? Posts in this category may be affected.`)) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      mutate();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete category');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)' }}>Categories</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{categories.length} categories</p>
      </div>

      {/* Create form */}
      <div className="card" style={{ padding: 24, marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>Add New Category</h2>
        <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: 12, alignItems: 'end' }}>
          <div className="form-group">
            <label htmlFor="cat-name" className="form-label">Name *</label>
            <input id="cat-name" type="text" placeholder="Technology" value={name} onChange={(e) => setName(e.target.value)} className="form-input" />
          </div>
          <div className="form-group">
            <label htmlFor="cat-desc" className="form-label">Description</label>
            <input id="cat-desc" type="text" placeholder="Articles about tech..." value={description} onChange={(e) => setDescription(e.target.value)} className="form-input" />
          </div>
          <div className="form-group">
            <label htmlFor="cat-color" className="form-label">Color</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input id="cat-color" type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: 44, height: 42, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', cursor: 'pointer', padding: 2 }} />
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{color}</span>
            </div>
          </div>
          <button type="submit" disabled={saving} className="btn btn-primary" style={{ fontSize: 13, alignSelf: 'flex-end', padding: '12px 20px' }}>
            + Add
          </button>
        </form>
      </div>

      {/* Categories table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Name', 'Slug', 'Description', 'Color', ''].map((h) => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>No categories yet</td></tr>
            )}
            {categories.map((cat, i) => (
              <motion.tr key={cat._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>{cat.name}</td>
                <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: 13, fontFamily: 'monospace' }}>{cat.slug}</td>
                <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: 13, maxWidth: 200 }}>
                  <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{cat.description || '—'}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 4, background: cat.color, boxShadow: `0 0 6px ${cat.color}60` }} />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{cat.color}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <button onClick={() => handleDelete(cat._id, cat.name)} className="btn" style={{ padding: '6px 14px', fontSize: 12, borderRadius: 6, border: '1px solid rgba(244,63,94,0.3)', color: '#F43F5E', background: 'rgba(244,63,94,0.08)', cursor: 'pointer' }}>
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
