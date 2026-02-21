import { useState, useEffect } from 'react';
import { getTemplates, createTemplate, updateTemplate, deleteTemplate, previewTemplate } from '../../api/templates';
import { getErrorMessage } from '../../api/client';
import { Modal, ConfirmModal } from '../../components/admin';
import { Input, Textarea, Select } from '../../components/admin/forms';
import styles from '../../styles/pages/Templates.module.css';

type TemplateType = 'contract' | 'bill' | 'email';

interface Template {
  id: string;
  name: string;
  template_type: TemplateType;
  content: string;
  is_default: boolean;
}

const templateTypeLabels: Record<TemplateType, string> = {
  contract: 'Contract',
  bill: 'Bill of Lading',
  email: 'Email',
};

const templateTypeStyles: Record<TemplateType, string> = {
  contract: 'typeBadgeBlue',
  bill: 'typeBadgePurple',
  email: 'typeBadgeGreen',
};

const placeholders = [
  { key: '{{ownerName}}', description: "Car owner's full name" },
  { key: '{{ownerEmail}}', description: "Car owner's email" },
  { key: '{{ownerPhone}}', description: "Car owner's phone" },
  { key: '{{manufacturer}}', description: 'Car manufacturer' },
  { key: '{{model}}', description: 'Car model' },
  { key: '{{year}}', description: 'Car year' },
  { key: '{{vin}}', description: 'Vehicle Identification Number' },
  { key: '{{color}}', description: 'Car color' },
  { key: '{{trackingId}}', description: 'Shipment tracking ID' },
  { key: '{{trackingUrl}}', description: 'Full tracking page URL' },
  { key: '{{date}}', description: 'Current date' },
];

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewContent, setPreviewContent] = useState('');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const [name, setName] = useState('');
  const [type, setType] = useState<TemplateType>('email');
  const [content, setContent] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    getTemplates().then(setTemplates).finally(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setName('');
    setType('email');
    setContent('');
    setIsDefault(false);
    setError('');
    setActiveTab('edit');
    setPreviewContent('');
  };

  const openCreateModal = () => {
    resetForm();
    setEditingTemplate(null);
    setShowModal(true);
  };

  const openEditModal = (template: Template) => {
    setEditingTemplate(template);
    setName(template.name);
    setType(template.template_type);
    setContent(template.content);
    setIsDefault(template.is_default);
    setError('');
    setActiveTab('edit');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    setActionLoading(true);
    setError('');

    const data = { name, template_type: type, content, is_default: isDefault };

    try {
      if (editingTemplate) {
        await updateTemplate(editingTemplate.id, data);
      } else {
        await createTemplate(data);
      }
      setShowModal(false);
      resetForm();
      const updated = await getTemplates();
      setTemplates(updated);
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
      await deleteTemplate(deleteId);
      setTemplates((prev) => prev.filter((t) => t.id !== deleteId));
    } finally {
      setActionLoading(false);
      setDeleteId(null);
    }
  };

  const handlePreview = async () => {
    if (!content.trim()) return;
    setActionLoading(true);
    try {
      const result = await previewTemplate(content);
      setPreviewContent(result.preview);
      setActiveTab('preview');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to generate preview'));
    } finally {
      setActionLoading(false);
    }
  };

  const insertPlaceholder = (placeholder: string) => {
    setContent((prev) => prev + placeholder);
  };

  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.template_type]) acc[template.template_type] = [];
    acc[template.template_type].push(template);
    return acc;
  }, {} as Record<TemplateType, Template[]>);

  if (loading) {
    return <div className={styles.loading}>Loading templates...</div>;
  }

  return (
    <>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Templates</h1>
            <p className={styles.subtitle}>Manage document and email templates</p>
          </div>
        </div>

        <div className="card">
          <div className={styles.toolbar}>
            <p className={styles.toolbarHint}>
              Create templates for contracts, bills, and emails with dynamic placeholders.
            </p>
            <button onClick={openCreateModal} className={styles.addButton}>
              <svg className={styles.addIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Template
            </button>
          </div>

          {templates.length > 0 ? (
            <div className={styles.groupList}>
              {(['contract', 'bill', 'email'] as TemplateType[]).map((templateType) => {
                const typeTemplates = groupedTemplates[templateType];
                if (!typeTemplates?.length) return null;

                return (
                  <div key={templateType}>
                    <h3 className={styles.groupTitle}>
                      {templateTypeLabels[templateType]} Templates
                    </h3>
                    <div className={styles.templateList}>
                      {typeTemplates.map((template) => (
                        <div key={template.id} className={styles.templateItem}>
                          <div className={styles.templateInfo}>
                            <div className={styles.templateNameRow}>
                              <span className={styles.templateName}>{template.name}</span>
                              <span className={`${styles.typeBadge} ${styles[templateTypeStyles[template.template_type]]}`}>
                                {templateTypeLabels[template.template_type]}
                              </span>
                              {template.is_default && (
                                <span className={styles.defaultBadge}>Default</span>
                              )}
                            </div>
                            <p className={styles.templatePreview}>
                              {template.content.substring(0, 100)}...
                            </p>
                          </div>
                          <div className={styles.actions}>
                            <button onClick={() => openEditModal(template)} className={styles.actionButton}>
                              <svg className={styles.smallIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button onClick={() => setDeleteId(template.id)} className={`${styles.actionButton} ${styles.actionButtonDanger}`}>
                              <svg className={styles.smallIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No templates created yet</p>
              <button onClick={openCreateModal} className={styles.emptyAction}>
                Create your first template
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); resetForm(); }}
        title={editingTemplate ? 'Edit Template' : 'Create Template'}
        size="xl"
        footer={
          <>
            <button onClick={() => setShowModal(false)} disabled={actionLoading} className={styles.modalCancel}>Cancel</button>
            <button onClick={handleSubmit} disabled={actionLoading || !name || !content} className={styles.modalConfirm}>
              {actionLoading ? 'Saving...' : editingTemplate ? 'Update' : 'Create'}
            </button>
          </>
        }
      >
        <div className={styles.modalBody}>
          {error && <div className={styles.errorBanner}>{error}</div>}

          <div className={styles.formRow}>
            <Input label="Template Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Standard Contract" required />
            <Select
              label="Type"
              value={type}
              onChange={(e) => setType(e.target.value as TemplateType)}
              options={[
                { value: 'contract', label: 'Contract' },
                { value: 'bill', label: 'Bill of Lading' },
                { value: 'email', label: 'Email' },
              ]}
            />
          </div>

          <label className={styles.checkboxLabel}>
            <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className={styles.checkbox} />
            <div>
              <p className={styles.checkboxTitle}>Set as Default</p>
              <p className={styles.checkboxHint}>Use this template by default for its type</p>
            </div>
          </label>

          <div className={styles.tabRow}>
            <button
              onClick={() => setActiveTab('edit')}
              className={`${styles.tab} ${activeTab === 'edit' ? styles.tabActive : ''}`}
            >
              Edit
            </button>
            <button
              onClick={handlePreview}
              disabled={!content.trim() || actionLoading}
              className={`${styles.tab} ${activeTab === 'preview' ? styles.tabActive : ''}`}
            >
              Preview
            </button>
          </div>

          {activeTab === 'edit' ? (
            <>
              <Textarea label="Content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Enter template content with placeholders..." rows={10} required />
              <div className={styles.placeholdersBox}>
                <p className={styles.placeholdersTitle}>Available Placeholders</p>
                <div className={styles.placeholdersList}>
                  {placeholders.map((p) => (
                    <button key={p.key} onClick={() => insertPlaceholder(p.key)} title={p.description} className={styles.placeholderButton}>
                      {p.key}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className={styles.previewBox}>
              <p className={styles.previewTitle}>Preview with Sample Data</p>
              <div className={styles.previewContent}>
                {previewContent || 'Click Preview to see the template with sample data.'}
              </div>
            </div>
          )}
        </div>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Template"
        message="Are you sure you want to delete this template? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        loading={actionLoading}
      />
    </>
  );
}
