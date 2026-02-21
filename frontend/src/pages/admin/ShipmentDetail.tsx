import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { getShipment, updateShipmentStatus } from '../../api/shipments';
import { getStatuses } from '../../api/statuses';
import { getTemplates } from '../../api/templates';
import { generateDocument, sendTemplateEmail, downloadBlob } from '../../api/documents';
import { getErrorMessage } from '../../api/client';
import { Modal } from '../../components/admin';
import { Select } from '../../components/admin/forms';
import styles from '../../styles/pages/ShipmentDetail.module.css';

interface ShipmentStatus {
  id: string;
  name: string;
  is_transit: boolean;
}

interface StatusHistory {
  id: string;
  changed_at: string;
  notes?: string;
  status: ShipmentStatus;
  changed_by?: { name: string } | null;
}

interface Template {
  id: string;
  name: string;
  template_type: 'contract' | 'bill' | 'email';
  is_default: boolean;
}

interface Shipment {
  id: string;
  tracking_id: string;
  manufacturer: string;
  model: string;
  vin: string;
  year: number | null;
  color: string | null;
  owner_name: string;
  owner_email: string | null;
  owner_phone: string | null;
  notes: string | null;
  pictures: string[];
  current_status: ShipmentStatus | null;
  status_histories: StatusHistory[];
  created_at: string;
  created_by?: { name: string } | null;
}

export default function ShipmentDetail() {
  const { id } = useParams<{ id: string }>();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [statuses, setStatuses] = useState<ShipmentStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [copied, setCopied] = useState(false);

  const [templates, setTemplates] = useState<Template[]>([]);
  const [showDocModal, setShowDocModal] = useState(false);
  const [docTemplateId, setDocTemplateId] = useState('');
  const [docLoading, setDocLoading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailTemplateId, setEmailTemplateId] = useState('');
  const [emailAttachIds, setEmailAttachIds] = useState<string[]>([]);
  const [emailLoading, setEmailLoading] = useState(false);
  const [docError, setDocError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');

  const trackingUrl = shipment
    ? `${window.location.origin}/track/${shipment.tracking_id}`
    : '';

  useEffect(() => {
    if (!id) return;
    Promise.all([getShipment(id), getStatuses(), getTemplates()])
      .then(([s, st, tpls]) => {
        setShipment(s);
        setStatuses(st);
        const parsed = typeof tpls === 'string' ? JSON.parse(tpls) : tpls;
        setTemplates(Array.isArray(parsed) ? parsed : []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!selectedStatus || !id) return;
    setUpdating(true);
    try {
      await updateShipmentStatus(id, selectedStatus, statusNotes || undefined);
      setShowStatusModal(false);
      setSelectedStatus('');
      setStatusNotes('');
      const updated = await getShipment(id);
      setShipment(updated);
    } finally {
      setUpdating(false);
    }
  };

  const copyTrackingLink = async () => {
    await navigator.clipboard.writeText(trackingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const contractTemplates = templates.filter(t => t.template_type === 'contract');
  const billTemplates = templates.filter(t => t.template_type === 'bill');
  const emailTemplates = templates.filter(t => t.template_type === 'email');
  const pdfTemplates = templates.filter(t => t.template_type === 'contract' || t.template_type === 'bill');

  const handleGenerateDoc = async () => {
    if (!docTemplateId || !shipment) return;
    setDocLoading(true);
    setDocError('');
    try {
      const response = await generateDocument(shipment.id, docTemplateId);
      const tpl = templates.find(t => t.id === docTemplateId);
      const typeLabel = tpl?.template_type === 'contract' ? 'Contract' : tpl?.template_type === 'bill' ? 'Bill' : 'Document';
      downloadBlob(response.data, `${typeLabel} - ${shipment.owner_name}.pdf`);
      setShowDocModal(false);
      setDocTemplateId('');
    } catch (err) {
      setDocError(getErrorMessage(err, 'Failed to generate document'));
    } finally {
      setDocLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!emailTemplateId || !shipment) return;
    setEmailLoading(true);
    setDocError('');
    try {
      await sendTemplateEmail(shipment.id, emailTemplateId, emailAttachIds.length > 0 ? emailAttachIds : undefined);
      setShowEmailModal(false);
      setEmailTemplateId('');
      setEmailAttachIds([]);
      setEmailSuccess('Email sent successfully');
      setTimeout(() => setEmailSuccess(''), 3000);
    } catch (err) {
      setDocError(getErrorMessage(err, 'Failed to send email'));
    } finally {
      setEmailLoading(false);
    }
  };

  const toggleAttachment = (templateId: string) => {
    setEmailAttachIds(prev =>
      prev.includes(templateId) ? prev.filter(id => id !== templateId) : [...prev, templateId]
    );
  };

  if (loading) {
    return <div className={styles.loading}>Loading shipment...</div>;
  }

  if (!shipment) {
    return <div className={styles.loading}>Shipment not found</div>;
  }

  return (
    <>
      <div className={styles.topBar}>
        <Link to="/admin/shipments" className={styles.backLink}>
          <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Shipments
        </Link>
        <Link to={`/admin/shipments/${id}/edit`} className={styles.editLink}>
          Edit Shipment
        </Link>
      </div>

      <div className={styles.grid}>
        <div className={styles.mainCol}>
          {/* Vehicle Card */}
          <div className="card">
            <h3 className={styles.cardTitle}>Vehicle Information</h3>
            <dl className={styles.detailGrid}>
              <div>
                <dt className={styles.detailLabel}>Manufacturer</dt>
                <dd className={styles.detailValue}>{shipment.manufacturer}</dd>
              </div>
              <div>
                <dt className={styles.detailLabel}>Model</dt>
                <dd className={styles.detailValue}>{shipment.model}</dd>
              </div>
              <div>
                <dt className={styles.detailLabel}>VIN</dt>
                <dd className={styles.detailValueMono}>{shipment.vin}</dd>
              </div>
              <div>
                <dt className={styles.detailLabel}>Year</dt>
                <dd className={styles.detailValue}>{shipment.year || '—'}</dd>
              </div>
              <div>
                <dt className={styles.detailLabel}>Color</dt>
                <dd className={styles.detailValue}>{shipment.color || '—'}</dd>
              </div>
            </dl>
          </div>

          {/* Owner Card */}
          <div className="card">
            <h3 className={styles.cardTitle}>Owner Information</h3>
            <dl className={styles.detailGrid}>
              <div>
                <dt className={styles.detailLabel}>Name</dt>
                <dd className={styles.detailValue}>{shipment.owner_name}</dd>
              </div>
              <div>
                <dt className={styles.detailLabel}>Email</dt>
                <dd className={styles.detailValue}>
                  {shipment.owner_email ? (
                    <a href={`mailto:${shipment.owner_email}`} className={styles.detailLink}>
                      {shipment.owner_email}
                    </a>
                  ) : '—'}
                </dd>
              </div>
              <div>
                <dt className={styles.detailLabel}>Phone</dt>
                <dd className={styles.detailValue}>
                  {shipment.owner_phone ? (
                    <a href={`tel:${shipment.owner_phone}`} className={styles.detailLink}>
                      {shipment.owner_phone}
                    </a>
                  ) : '—'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Notes Card */}
          {shipment.notes && (
            <div className="card">
              <h3 className={styles.cardTitle}>Notes</h3>
              <p className={styles.notesText}>{shipment.notes}</p>
            </div>
          )}

          {/* Status History */}
          <div className="card">
            <h3 className={styles.cardTitle}>Status History</h3>
            {shipment.status_histories.length > 0 ? (
              <div className={styles.historyList}>
                {shipment.status_histories.map((history, index) => (
                  <div
                    key={history.id}
                    className={`${styles.historyItem} ${
                      index !== shipment.status_histories.length - 1 ? styles.historyItemBorder : ''
                    }`}
                  >
                    <div
                      className={`${styles.historyDot} ${
                        index === 0 ? styles.historyDotActive : styles.historyDotInactive
                      }`}
                    />
                    <div>
                      <p className={styles.historyStatus}>{history.status.name}</p>
                      <p className={styles.historyMeta}>
                        {new Date(history.changed_at).toLocaleString()}
                        {history.changed_by && ` by ${history.changed_by.name}`}
                      </p>
                      {history.notes && (
                        <p className={styles.historyNotes}>{history.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyText}>No status history</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sideCol}>
          {/* Current Status */}
          <div className="card">
            <h3 className={styles.cardTitle}>Current Status</h3>
            <div className={styles.statusSection}>
              <span className={`${styles.statusBadge} ${
                shipment.current_status?.is_transit
                  ? styles.statusTransit
                  : shipment.current_status
                  ? styles.statusDefault
                  : styles.statusNone
              }`}>
                {shipment.current_status?.name || 'No Status'}
              </span>
              <button
                onClick={() => setShowStatusModal(true)}
                className={styles.updateStatusButton}
              >
                Update Status
              </button>
            </div>
          </div>

          {/* Tracking Link */}
          <div className="card">
            <h3 className={styles.cardTitle}>Tracking Link</h3>
            <div className={styles.trackingSection}>
              <p className={styles.trackingHint}>
                Share this link with the owner to track their shipment:
              </p>
              <div className={styles.trackingInputRow}>
                <input
                  type="text"
                  readOnly
                  value={trackingUrl}
                  className={styles.trackingInput}
                />
                <button onClick={copyTrackingLink} className={styles.copyButton}>
                  {copied ? (
                    <svg className={styles.copyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'rgb(74, 222, 128)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className={styles.copyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
              <a
                href={trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.viewTrackingLink}
              >
                View tracking page
                <svg className={styles.externalIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          {/* Metadata */}
          <div className="card">
            <h3 className={styles.cardTitle}>Details</h3>
            <dl className={styles.metaList}>
              <div className={styles.metaRow}>
                <dt className={styles.metaLabel}>Created</dt>
                <dd className={styles.metaValue}>
                  {new Date(shipment.created_at).toLocaleDateString()}
                </dd>
              </div>
              {shipment.created_by && (
                <div className={styles.metaRow}>
                  <dt className={styles.metaLabel}>Created By</dt>
                  <dd className={styles.metaValue}>{shipment.created_by.name}</dd>
                </div>
              )}
              <div className={styles.metaRow}>
                <dt className={styles.metaLabel}>Tracking ID</dt>
                <dd className={styles.metaValueMono}>{shipment.tracking_id}</dd>
              </div>
            </dl>
          </div>
          {/* Documents & Emails */}
          <div className="card">
            <h3 className={styles.cardTitle}>Documents & Emails</h3>
            {emailSuccess && (
              <div className={styles.successBanner}>{emailSuccess}</div>
            )}
            <div className={styles.docActions}>
              {contractTemplates.length > 0 && (
                <button
                  onClick={() => {
                    const def = contractTemplates.find(t => t.is_default) || contractTemplates[0];
                    setDocTemplateId(def.id);
                    setShowDocModal(true);
                  }}
                  className={styles.docButton}
                >
                  <svg className={styles.docIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generate Contract
                </button>
              )}
              {billTemplates.length > 0 && (
                <button
                  onClick={() => {
                    const def = billTemplates.find(t => t.is_default) || billTemplates[0];
                    setDocTemplateId(def.id);
                    setShowDocModal(true);
                  }}
                  className={styles.docButton}
                >
                  <svg className={styles.docIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Generate Bill
                </button>
              )}
              {emailTemplates.length > 0 && shipment.owner_email && (
                <button
                  onClick={() => {
                    const def = emailTemplates.find(t => t.is_default) || emailTemplates[0];
                    setEmailTemplateId(def.id);
                    setEmailAttachIds([]);
                    setShowEmailModal(true);
                  }}
                  className={styles.docButtonEmail}
                >
                  <svg className={styles.docIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Email
                </button>
              )}
              {templates.length === 0 && (
                <p className={styles.emptyText}>No templates created yet. Create templates in the Templates section to generate documents and send emails.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedStatus('');
          setStatusNotes('');
        }}
        title="Update Status"
        size="md"
        footer={
          <>
            <button
              onClick={() => setShowStatusModal(false)}
              disabled={updating}
              className={styles.modalCancel}
            >
              Cancel
            </button>
            <button
              onClick={handleStatusUpdate}
              disabled={updating || !selectedStatus}
              className={styles.modalConfirm}
            >
              {updating ? 'Updating...' : 'Update'}
            </button>
          </>
        }
      >
        <div className={styles.modalBody}>
          <Select
            label="New Status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            placeholder="Select a status"
            options={statuses.map((s) => ({ value: s.id, label: s.name }))}
            required
          />
          <div className={styles.modalField}>
            <label className={styles.modalLabel}>Notes (optional)</label>
            <textarea
              value={statusNotes}
              onChange={(e) => setStatusNotes(e.target.value)}
              placeholder="Add any notes about this status change..."
              rows={3}
              className={styles.modalTextarea}
            />
          </div>
        </div>
      </Modal>

      {/* Generate Document Modal */}
      <Modal
        isOpen={showDocModal}
        onClose={() => { setShowDocModal(false); setDocTemplateId(''); setDocError(''); }}
        title="Generate Document"
        size="md"
        footer={
          <>
            <button onClick={() => setShowDocModal(false)} disabled={docLoading} className={styles.modalCancel}>Cancel</button>
            <button onClick={handleGenerateDoc} disabled={docLoading || !docTemplateId} className={styles.modalConfirm}>
              {docLoading ? 'Generating...' : 'Download PDF'}
            </button>
          </>
        }
      >
        <div className={styles.modalBody}>
          {docError && <div className={styles.errorBanner}>{docError}</div>}
          <Select
            label="Template"
            value={docTemplateId}
            onChange={(e) => setDocTemplateId(e.target.value)}
            placeholder="Select a template"
            options={pdfTemplates.map(t => ({
              value: t.id,
              label: `${t.name} (${t.template_type === 'contract' ? 'Contract' : 'Bill'})`
            }))}
            required
          />
          <p className={styles.docHint}>
            The document will be generated as a PDF with all placeholders filled using this shipment's data.
          </p>
        </div>
      </Modal>

      {/* Send Email Modal */}
      <Modal
        isOpen={showEmailModal}
        onClose={() => { setShowEmailModal(false); setEmailTemplateId(''); setEmailAttachIds([]); setDocError(''); }}
        title="Send Email"
        size="md"
        footer={
          <>
            <button onClick={() => setShowEmailModal(false)} disabled={emailLoading} className={styles.modalCancel}>Cancel</button>
            <button onClick={handleSendEmail} disabled={emailLoading || !emailTemplateId} className={styles.modalConfirm}>
              {emailLoading ? 'Sending...' : 'Send Email'}
            </button>
          </>
        }
      >
        <div className={styles.modalBody}>
          {docError && <div className={styles.errorBanner}>{docError}</div>}
          <Select
            label="Email Template"
            value={emailTemplateId}
            onChange={(e) => setEmailTemplateId(e.target.value)}
            placeholder="Select an email template"
            options={emailTemplates.map(t => ({ value: t.id, label: t.name }))}
            required
          />
          {pdfTemplates.length > 0 && (
            <div className={styles.modalField}>
              <label className={styles.modalLabel}>Attach PDFs (optional)</label>
              <div className={styles.attachList}>
                {pdfTemplates.map(t => (
                  <label key={t.id} className={styles.attachItem}>
                    <input
                      type="checkbox"
                      checked={emailAttachIds.includes(t.id)}
                      onChange={() => toggleAttachment(t.id)}
                      className={styles.attachCheckbox}
                    />
                    <span>{t.name} ({t.template_type === 'contract' ? 'Contract' : 'Bill'})</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          <p className={styles.docHint}>
            Email will be sent to {shipment.owner_email} with placeholders filled using this shipment's data.
          </p>
        </div>
      </Modal>
    </>
  );
}
