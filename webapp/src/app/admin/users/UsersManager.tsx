"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, ConfirmModal, Input, Select } from "@/components/admin";
import { createUser, updateUser, deleteUser } from "@/actions/users";
import type { UserRole } from "@prisma/client";

type UserWithCount = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  _count: {
    shipmentsCreated: number;
    statusChanges: number;
  };
};

interface UsersManagerProps {
  users: UserWithCount[];
  currentUserId: string;
}

const roleLabels: Record<UserRole, { label: string; color: string }> = {
  ADMIN: { label: "Admin", color: "bg-blue-500/20 text-blue-400" },
  SUPER_ADMIN: { label: "Super Admin", color: "bg-purple-500/20 text-purple-400" },
};

export function UsersManager({ users: initialUsers, currentUserId }: UsersManagerProps) {
  const router = useRouter();
  const [users] = useState(initialUsers);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithCount | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("ADMIN");

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("ADMIN");
    setError("");
  };

  const openCreateModal = () => {
    resetForm();
    setEditingUser(null);
    setShowModal(true);
  };

  const openEditModal = (user: UserWithCount) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setPassword("");
    setRole(user.role);
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      if (editingUser) {
        const data: { name?: string; email?: string; password?: string; role?: UserRole } = {
          name,
          email,
          role,
        };
        if (password) {
          data.password = password;
        }
        const result = await updateUser(editingUser.id, data);
        if (result.success) {
          setShowModal(false);
          resetForm();
          router.refresh();
        } else {
          setError(result.error);
        }
      } else {
        if (!password) {
          setError("Password is required for new users");
          setLoading(false);
          return;
        }
        const result = await createUser({ name, email, password, role });
        if (result.success) {
          setShowModal(false);
          resetForm();
          router.refresh();
        } else {
          setError(result.error);
        }
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      const result = await deleteUser(deleteId);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error);
        // Show error in a more visible way
        alert(result.error);
      }
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[var(--shift-gray-light)]">
            {users.length} user{users.length !== 1 ? "s" : ""} in the system
          </p>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--shift-yellow)] text-[var(--shift-black)] font-semibold hover:bg-[var(--shift-yellow-dark)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add User
          </button>
        </div>

        {users.length > 0 ? (
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-[var(--shift-black)] border border-[var(--shift-gray)]/20 hover:border-[var(--shift-gray)]/40 transition-colors"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-[var(--shift-yellow)]/20 text-[var(--shift-yellow)] flex items-center justify-center font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[var(--shift-cream)]">{user.name}</span>
                    <span className={`px-2 py-0.5 text-xs rounded ${roleLabels[user.role].color}`}>
                      {roleLabels[user.role].label}
                    </span>
                    {user.id === currentUserId && (
                      <span className="px-2 py-0.5 text-xs rounded bg-green-500/20 text-green-400">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--shift-gray)]">{user.email}</p>
                </div>

                {/* Stats */}
                <div className="text-right text-sm text-[var(--shift-gray)]">
                  <p>{user._count.shipmentsCreated} shipments created</p>
                  <p>{user._count.statusChanges} status updates</p>
                </div>

                {/* Created Date */}
                <div className="text-sm text-[var(--shift-gray)]">
                  {formatDate(user.createdAt)}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(user)}
                    className="p-2 rounded-lg text-[var(--shift-gray-light)] hover:text-[var(--shift-cream)] hover:bg-[var(--shift-black-muted)] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteId(user.id)}
                    disabled={user.id === currentUserId}
                    className="p-2 rounded-lg text-[var(--shift-gray-light)] hover:text-red-400 hover:bg-[var(--shift-black-muted)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title={user.id === currentUserId ? "Cannot delete your own account" : "Delete user"}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-[var(--shift-gray)]">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p>No users found</p>
            <button
              onClick={openCreateModal}
              className="mt-4 text-[var(--shift-yellow)] hover:underline"
            >
              Add your first user
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingUser ? "Edit User" : "Add User"}
        size="md"
        footer={
          <>
            <button
              onClick={() => setShowModal(false)}
              disabled={loading}
              className="px-4 py-2 rounded-lg text-[var(--shift-gray-light)] hover:text-[var(--shift-cream)] hover:bg-[var(--shift-black)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !name || !email || (!editingUser && !password)}
              className="px-4 py-2 rounded-lg bg-[var(--shift-yellow)] text-[var(--shift-black)] font-semibold hover:bg-[var(--shift-yellow-dark)] transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : editingUser ? "Update" : "Create"}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., John Doe"
            required
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g., john@example.com"
            required
          />

          <Input
            label={editingUser ? "Password (leave blank to keep current)" : "Password"}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={editingUser ? "Enter new password..." : "Minimum 8 characters"}
            required={!editingUser}
            helperText="Password must be at least 8 characters"
          />

          <Select
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            options={[
              { value: "ADMIN", label: "Admin - Can manage shipments and leads" },
              { value: "SUPER_ADMIN", label: "Super Admin - Full access to all features" },
            ]}
            disabled={editingUser?.id === currentUserId}
            helperText={editingUser?.id === currentUserId ? "You cannot change your own role" : undefined}
          />
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone. Users with associated shipments or status changes cannot be deleted."
        confirmText="Delete"
        variant="danger"
        loading={loading}
      />
    </>
  );
}
