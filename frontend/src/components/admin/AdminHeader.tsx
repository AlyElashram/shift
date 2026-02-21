import { useAuth } from '../../hooks/useAuth';
import styles from '../../styles/components/AdminHeader.module.css';

type UserRole = 'admin' | 'super_admin';

interface AdminHeaderProps {
  user: {
    name: string;
    email: string;
    role: UserRole;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const { logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    window.location.href = '/admin/login';
  };

  return (
    <header className={styles.header}>
      <p className={styles.welcomeText}>
        Welcome back, <span className={styles.welcomeName}>{user.name}</span>
      </p>

      <div className={styles.userSection}>
        <div className={styles.userInfo}>
          <p className={styles.userName}>{user.name}</p>
          <p className={styles.userRole}>
            {user.role === 'super_admin' ? 'Super Admin' : 'Admin'}
          </p>
        </div>

        <div className={styles.avatar}>
          <span className={styles.avatarInitial}>
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>

        <button
          onClick={handleSignOut}
          className={styles.signOutButton}
          title="Sign out"
        >
          <svg className={styles.signOutIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>
  );
}
