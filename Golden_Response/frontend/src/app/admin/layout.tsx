'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Spinner from '@/components/ui/Spinner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // Skip auth check entirely on the login page
    if (isLoginPage) {
      setChecked(true);
      return;
    }

    const token = localStorage.getItem('ethara_token');
    if (!token) {
      router.replace('/admin/login');
    } else {
      setChecked(true);
    }
  }, [router, isLoginPage]);

  if (!checked) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <Spinner size={36} />
      </div>
    );
  }

  // Render login page without the sidebar shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <AdminSidebar />
      <main className="admin-content">{children}</main>
    </div>
  );
}
