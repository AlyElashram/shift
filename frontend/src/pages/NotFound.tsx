import { Link } from 'react-router';
import { Logo } from '../components/ui/Logo';
import styles from '../styles/pages/NotFound.module.css';

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Logo variant="full" color="yellow" className={styles.logo} />
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.message}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link to="/" className={styles.link}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
