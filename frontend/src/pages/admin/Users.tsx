import { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../../api/users';
import { getErrorMessage } from '../../api/client';
import { useAuth } from '../../hooks/useAuth';
import { Modal, ConfirmModal } from '../../components/admin';
import { Input, Select } from '../../components/admin/forms';
import styles from '../../styles/pages/Users.module.css';

type UserRole = 'admin' | 'super_admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  _count?: {
    shipments_created: number;
    status_changes: number;
  };
}

const roleLabels: Record<UserRole, { label: string; className: string }> = {
  admin: { label: 'Admin', className: 'roleAdmin' },
  super_admin: { label: 'Super Admin', className: 'roleSuperAdmin' },
};

export default function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('admin');

  useEffect(() => {
    getUsers().then(setUsers).finally(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole('admin');
    setError('');
  };

  const openCreateModal = () => {
    resetForm();
    setEditingUser(null);
    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setPassword('');
    setRole(user.role);
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    setActionLoading(true);
    setError('');

    try {
      if (editingUser) {
        const data: Record<string, string> = { name, email, role };
        if (password) data.password = password;
        await updateUser(editingUser.id, data);
      } else {
        if (!password) {
          setError('Password is required for new users');
          setActionLoading(false);
          return;
        }
        await createUser({ name, email, password, role });
      }
      setShowModal(false);
      resetForm();
      const updated = await getUsers();
      setUsers(updated);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setActionLoading(true);
    try {
      await deleteUser(deleteId);
      setUsers((prev) => prev.filter((u) => u.id !== deleteId));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
      setDeleteId(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className={styles.loading}>Loading users...</div>;
  }

  return (
    <>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Users</h1>
            <p className={styles.subtitle}>Manage admin users</p>
          </div>
        </div>

        <div className="card">
          <div className={styles.toolbar}>
            <p className={styles.toolbarHint}>
              {users.length} user{users.length !== 1 ? 's' : ''} in the system
            </p>
            <button onClick={openCreateModal} className={styles.addButton}>
              <svg className={styles.addIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add User
            </button>
          </div>

          {users.length > 0 ? (
            <div className={styles.userList}>
              {users.map((user) => {
                const roleInfo = roleLabels[user.role];
                return (
                  <div key={user.id} className={styles.userItem}>
                    <div className={styles.avatar}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    <div className={styles.userInfo}>
                      <div className={styles.userNameRow}>
                        <span className={styles.userName}>{user.name}</span>
                        <span className={`${styles.roleBadge} ${styles[roleInfo.className]}`}>
                          {roleInfo.label}
                        </span>
                        {user.id === currentUser?.id && (
                          <span className={styles.youBadge}>You</span>
                        )}
                      </div>
                      <p className={styles.userEmail}>{user.email}</p>
                    </div>

                    <div className={styles.userStats}>
                      <p>{user._count?.shipments_created ?? 0} shipments created</p>
                      <p>{user._count?.status_changes ?? 0} status updates</p>
                    </div>

                    <div className={styles.userDate}>
                      {formatDate(user.created_at)}
                    </div>

                    <div className={styles.actions}>
                      <button onClick={() => openEditModal(user)} className={styles.actionButton}>
                        <svg className={styles.smallIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeleteId(user.id)}
                        disabled={user.id === currentUser?.id}
                        className={`${styles.actionButton} ${styles.actionButtonDanger}`}
                        title={user.id === currentUser?.id ? 'Cannot delete your own account' : 'Delete user'}
                      >
                        <svg className={styles.smallIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No users found</p>
              <button onClick={openCreateModal} className={styles.emptyAction}>
                Add your first user
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); resetForm(); }}
        title={editingUser ? 'Edit User' : 'Add User'}
        size="md"
        footer={
          <>
            <button onClick={() => setShowModal(false)} disabled={actionLoading} className={styles.modalCancel}>Cancel</button>
            <button
              onClick={handleSubmit}
              disabled={actionLoading || !name || !email || (!editingUser && !password)}
              className={styles.modalConfirm}
            >
              {actionLoading ? 'Saving...' : editingUser ? 'Update' : 'Create'}
            </button>
          </>
        }
      >
        <div className={styles.modalBody}>
          {error && <div className={styles.errorBanner}>{error}</div>}

          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., John Doe" required />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g., john@example.com" required />
          <Input
            label={editingUser ? 'Password (leave blank to keep current)' : 'Password'}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={editingUser ? 'Enter new password...' : 'Minimum 8 characters'}
            required={!editingUser}
            helperText="Password must be at least 8 characters"
          />
          <Select
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            options={[
              { value: 'admin', label: 'Admin - Can manage shipments and leads' },
              { value: 'super_admin', label: 'Super Admin - Full access to all features' },
            ]}
            disabled={editingUser?.id === currentUser?.id}
            helperText={editingUser?.id === currentUser?.id ? 'You cannot change your own role' : undefined}
          />
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone. Users with associated shipments or status changes cannot be deleted."
        confirmText="Delete"
        variant="danger"
        loading={actionLoading}
      />
    </>
  );
}
