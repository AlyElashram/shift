import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { Logo } from '../../components/ui/Logo';
import styles from '../../styles/pages/Login.module.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Logo variant="full" color="yellow" className={styles.logo} />
          <h1 className={styles.title}>Admin Login</h1>
        </div>

        <form onSubmit={handleSubmit} className={`card ${styles.form}`}>
          {error && (
            <div className={styles.error}>{error}</div>
          )}

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="admin@shift.com"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" disabled={isLoading} className={styles.submitButton}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
