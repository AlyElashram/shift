import { Outlet, Navigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import styles from '../../styles/components/AdminLayout.module.css';

export function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className={styles.layout}>
      <AdminSidebar user={{ role: user.role }} />
      <div className={styles.main}>
        <AdminHeader user={user} />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
