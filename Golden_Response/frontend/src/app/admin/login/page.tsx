'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import Spinner from '@/components/ui/Spinner';

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type FormData = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post('/auth/login', data);
      const { token, user } = res.data.data;
      localStorage.setItem('ethara_token', token);
      localStorage.setItem('ethara_user', JSON.stringify(user));
      toast.success(`Welcome back, ${user.name}!`);
      router.push('/admin');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Invalid email or password');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: 20,
    }}>
      {/* Background glow */}
      <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent)', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: 420 }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div
            className="gradient-text"
            style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 6 }}
          >
            Ethara
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Admin Panel</p>
          <div style={{ width: 40, height: 2, background: 'linear-gradient(90deg, #8B5CF6, #6366F1)', borderRadius: 1, margin: '12px auto 0' }} />
        </div>

        {/* Card */}
        <div className="card" style={{ padding: 36 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Sign in</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>
            Enter your admin credentials to continue.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">Email</label>
              <input
                id="login-email"
                type="email"
                placeholder="admin@ethara.blog"
                className={`form-input ${errors.email ? 'error' : ''}`}
                {...register('email')}
                autoComplete="email"
              />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="login-password" className="form-label">Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                className={`form-input ${errors.password ? 'error' : ''}`}
                {...register('password')}
                autoComplete="current-password"
              />
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ width: '100%', justifyContent: 'center', padding: 14, marginTop: 8 }}
            >
              {isSubmitting && <Spinner size={16} color="white" />}
              {isSubmitting ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-muted)', fontSize: 13 }}>
          ← <a href="/" style={{ color: 'var(--accent-light)', textDecoration: 'none' }}>Back to blog</a>
        </p>
      </motion.div>
    </div>
  );
}
