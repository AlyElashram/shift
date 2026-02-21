import { useState, useEffect } from 'react';
import { getLeads, markLeadContacted, markLeadUncontacted, deleteLead, bulkDeleteLeads as deleteMultipleLeads } from '../../api/leads';
import { ConfirmModal } from '../../components/admin';
import styles from '../../styles/pages/Leads.module.css';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  document_status: string;
  contacted: boolean;
  created_at: string;
}

const documentStatusLabels: Record<string, { label: string; className: string }> = {
  'non-egyptian-passport': { label: 'Non-Egyptian Passport', className: 'docBlue' },
  'uae-eqama': { label: 'UAE Eqama', className: 'docGreen' },
  'none': { label: 'None', className: 'docGray' },
};

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showBulkDelete, setShowBulkDelete] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'contacted'>('all');

  useEffect(() => {
    getLeads().then(setLeads).finally(() => setLoading(false));
  }, []);

  const filteredLeads = leads.filter((lead) => {
    if (filter === 'pending') return !lead.contacted;
    if (filter === 'contacted') return lead.contacted;
    return true;
  });

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredLeads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredLeads.map((l) => l.id)));
    }
  };

  const handleToggleContacted = async (lead: Lead) => {
    setActionLoading(true);
    try {
      if (lead.contacted) {
        await markLeadUncontacted(lead.id);
      } else {
        await markLeadContacted(lead.id);
      }
      setLeads((prev) =>
        prev.map((l) => l.id === lead.id ? { ...l, contacted: !l.contacted } : l)
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setActionLoading(true);
    try {
      await deleteLead(deleteId);
      setLeads((prev) => prev.filter((l) => l.id !== deleteId));
    } finally {
      setActionLoading(false);
      setDeleteId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setActionLoading(true);
    try {
      await deleteMultipleLeads(Array.from(selectedIds));
      setLeads((prev) => prev.filter((l) => !selectedIds.has(l.id)));
      setSelectedIds(new Set());
    } finally {
      setActionLoading(false);
      setShowBulkDelete(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className={styles.loading}>Loading leads...</div>;
  }

  return (
    <>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Leads</h1>
            <p className={styles.subtitle}>Manage contact form submissions</p>
          </div>
        </div>

        <div className="card">
          <div className={styles.toolbar}>
            <div className={styles.filterTabs}>
              {(['all', 'pending', 'contacted'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`${styles.filterTab} ${filter === f ? styles.filterTabActive : ''}`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {selectedIds.size > 0 && (
              <button onClick={() => setShowBulkDelete(true)} className={styles.bulkDeleteButton}>
                <svg className={styles.smallIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete {selectedIds.size} Selected
              </button>
            )}
          </div>

          {filteredLeads.length > 0 ? (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.headerRow}>
                    <th className={styles.headerCell}>
                      <input
                        type="checkbox"
                        checked={selectedIds.size === filteredLeads.length && filteredLeads.length > 0}
                        onChange={toggleSelectAll}
                        className={styles.checkbox}
                      />
                    </th>
                    <th className={styles.headerCell}>Contact</th>
                    <th className={styles.headerCell}>Document Status</th>
                    <th className={styles.headerCell}>Date</th>
                    <th className={styles.headerCell}>Status</th>
                    <th className={styles.headerCell}>Actions</th>
                  </tr>
                </thead>
                <tbody className={styles.tableBody}>
                  {filteredLeads.map((lead) => {
                    const docInfo = documentStatusLabels[lead.document_status];
                    return (
                      <tr key={lead.id} className={styles.bodyRow}>
                        <td className={styles.bodyCell}>
                          <input
                            type="checkbox"
                            checked={selectedIds.has(lead.id)}
                            onChange={() => toggleSelect(lead.id)}
                            className={styles.checkbox}
                          />
                        </td>
                        <td className={styles.bodyCell}>
                          <div>
                            <p className={styles.contactName}>{lead.name}</p>
                            <p className={styles.contactDetail}>{lead.email}</p>
                            <p className={styles.contactDetail}>{lead.phone}</p>
                          </div>
                        </td>
                        <td className={styles.bodyCell}>
                          <span className={`${styles.docBadge} ${styles[docInfo?.className || 'docGray']}`}>
                            {docInfo?.label || lead.document_status}
                          </span>
                        </td>
                        <td className={styles.bodyCell}>
                          <span className={styles.dateText}>{formatDate(lead.created_at)}</span>
                        </td>
                        <td className={styles.bodyCell}>
                          <button
                            onClick={() => handleToggleContacted(lead)}
                            disabled={actionLoading}
                            className={`${styles.contactedButton} ${
                              lead.contacted ? styles.contactedButtonDone : styles.contactedButtonPending
                            }`}
                          >
                            {lead.contacted ? 'Contacted' : 'Mark Contacted'}
                          </button>
                        </td>
                        <td className={styles.bodyCell}>
                          <div className={styles.actions}>
                            <a href={`mailto:${lead.email}`} className={styles.actionButton} title="Send Email">
                              <svg className={styles.smallIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </a>
                            <a href={`tel:${lead.phone}`} className={styles.actionButton} title="Call">
                              <svg className={styles.smallIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </a>
                            <button onClick={() => setDeleteId(lead.id)} className={`${styles.actionButton} ${styles.actionButtonDanger}`} title="Delete">
                              <svg className={styles.smallIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <svg className={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p>No leads found</p>
              <p className={styles.emptySubtext}>Leads will appear here when users submit the contact form</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Lead"
        message="Are you sure you want to delete this lead? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        loading={actionLoading}
      />

      <ConfirmModal
        isOpen={showBulkDelete}
        onClose={() => setShowBulkDelete(false)}
        onConfirm={handleBulkDelete}
        title="Delete Selected Leads"
        message={`Are you sure you want to delete ${selectedIds.size} selected leads? This action cannot be undone.`}
        confirmText="Delete All"
        variant="danger"
        loading={actionLoading}
      />
    </>
  );
}
