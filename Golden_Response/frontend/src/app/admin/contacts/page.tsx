'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import useSWR from 'swr';
import api, { fetcher } from '@/lib/api';
import { ContactSubmission } from '@/types';
import { formatDate } from '@/lib/utils';

export default function AdminContactsPage() {
  const { data, mutate } = useSWR<{ success: boolean; data: { submissions: ContactSubmission[]; pagination: any } }>('/admin/contacts', fetcher);
  const contacts = data?.data?.submissions || [];
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try {
      await api.delete(`/admin/contacts/${id}`);
      toast.success('Message deleted');
      mutate();
    } catch {
      toast.error('Failed to delete message');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)' }}>Contact Messages</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
          <span className="badge badge-amber" style={{ fontSize: 13 }}>{contacts.length} messages</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {contacts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <p>No contact messages yet</p>
          </div>
        )}
        {contacts.map((contact, i) => (
          <motion.div
            key={contact._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="card"
            style={{ overflow: 'visible' }}
          >
            {/* Header row — always visible */}
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '18px 20px', cursor: 'pointer' }}
              onClick={() => setExpanded(expanded === contact._id ? null : contact._id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #F59E0B, #FCD34D)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A0A14', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>{contact.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{contact.email} · {contact.phone}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: 13 }}>{contact.subject}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatDate(contact.createdAt)}</div>
                </div>
                <motion.svg
                  width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--text-muted)" strokeWidth="2"
                  animate={{ rotate: expanded === contact._id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </motion.svg>
              </div>
            </div>

            {/* Expanded message */}
            <AnimatePresence>
              {expanded === contact._id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ paddingTop: 16, marginBottom: 16 }}>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Message</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7 }}>
                        {contact.message || <em style={{ color: 'var(--text-muted)' }}>No message provided</em>}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <a href={`mailto:${contact.email}?subject=Re: ${contact.subject}`} className="btn btn-secondary" style={{ fontSize: 12 }}>
                        Reply via Email
                      </a>
                      <button onClick={() => handleDelete(contact._id)} className="btn" style={{ fontSize: 12, border: '1px solid rgba(244,63,94,0.3)', color: '#F43F5E', background: 'rgba(244,63,94,0.08)', cursor: 'pointer' }}>
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
