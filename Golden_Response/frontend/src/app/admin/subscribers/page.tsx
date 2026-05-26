'use client';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import useSWR from 'swr';
import api, { fetcher } from '@/lib/api';
import { Subscriber } from '@/types';
import { formatDate } from '@/lib/utils';

export default function AdminSubscribersPage() {
  const { data, mutate } = useSWR<{ success: boolean; data: { subscribers: Subscriber[]; pagination: any } }>('/admin/subscribers', fetcher);
  const subscribers = data?.data?.subscribers || [];

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Remove "${email}" from the list?`)) return;
    try {
      await api.delete(`/admin/subscribers/${id}`);
      toast.success('Subscriber removed');
      mutate();
    } catch {
      toast.error('Failed to remove subscriber');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)' }}>Subscribers</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
          <span className="badge badge-green" style={{ fontSize: 13 }}>{subscribers.length} total</span>
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Newsletter subscribers</span>
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['#', 'Name', 'Email', 'Subscribed', ''].map((h) => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subscribers.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '60px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <div>No subscribers yet</div>
              </td></tr>
            )}
            {subscribers.map((sub, i) => (
              <motion.tr key={sub._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: 13 }}>{i + 1}</td>
                <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #8B5CF6, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                      {sub.name.charAt(0).toUpperCase()}
                    </div>
                    {sub.name}
                  </div>
                </td>
                <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: 14 }}>{sub.email}</td>
                <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: 13 }}>{formatDate(sub.subscribedAt)}</td>
                <td style={{ padding: '14px 16px' }}>
                  <button onClick={() => handleDelete(sub._id, sub.email)} className="btn" style={{ padding: '6px 14px', fontSize: 12, borderRadius: 6, border: '1px solid rgba(244,63,94,0.3)', color: '#F43F5E', background: 'rgba(244,63,94,0.08)', cursor: 'pointer' }}>
                    Remove
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
