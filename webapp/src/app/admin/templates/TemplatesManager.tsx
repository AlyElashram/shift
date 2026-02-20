"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal, ConfirmModal, Input, Textarea, Select } from "@/components/admin";
import { createTemplate, updateTemplate, deleteTemplate, previewTemplate } from "@/actions/templates";
import type { Template, TemplateType } from "@prisma/client";

interface TemplatesManagerProps {
  templates: Template[];
}

const templateTypeLabels: Record<TemplateType, string> = {
  CONTRACT: "Contract",
  BILL: "Bill of Lading",
  EMAIL: "Email",
};

const templateTypeColors: Record<TemplateType, string> = {
  CONTRACT: "bg-blue-500/20 text-blue-400",
  BILL: "bg-purple-500/20 text-purple-400",
  EMAIL: "bg-green-500/20 text-green-400",
};

const placeholders = [
  { key: "{{ownerName}}", description: "Car owner's full name" },
  { key: "{{ownerEmail}}", description: "Car owner's email" },
  { key: "{{ownerPhone}}", description: "Car owner's phone" },
  { key: "{{manufacturer}}", description: "Car manufacturer" },
  { key: "{{model}}", description: "Car model" },
  { key: "{{year}}", description: "Car year" },
  { key: "{{vin}}", description: "Vehicle Identification Number" },
  { key: "{{color}}", description: "Car color" },
  { key: "{{trackingId}}", description: "Shipment tracking ID" },
  { key: "{{trackingUrl}}", description: "Full tracking page URL" },
  { key: "{{date}}", description: "Current date" },
];

export function TemplatesManager({ templates: initialTemplates }: TemplatesManagerProps) {
  const router = useRouter();
  const [templates, setTemplates] = useState(initialTemplates);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  // Form state
  const [name, setName] = useState("");
  const [type, setType] = useState<TemplateType>("EMAIL");
  const [content, setContent] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const resetForm = () => {
    setName("");
    setType("EMAIL");
    setContent("");
    setIsDefault(false);
    setError("");
    setActiveTab("edit");
    setPreviewContent("");
  };

  const openCreateModal = () => {
    resetForm();
    setEditingTemplate(null);
    setShowModal(true);
  };

  const openEditModal = (template: Template) => {
    setEditingTemplate(template);
    setName(template.name);
    setType(template.type);
    setContent(template.content);
    setIsDefault(template.isDefault);
    setError("");
    setActiveTab("edit");
    setShowModal(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const data = {
      name,
      type,
      content,
      isDefault,
    };

    try {
      const result = editingTemplate
        ? await updateTemplate(editingTemplate.id, data)
        : await createTemplate(data);

      if (result.success) {
        setShowModal(false);
        resetForm();
        router.refresh();
      } else {
        setError(result.error);
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
      const result = await deleteTemplate(deleteId);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error);
      }
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  const handlePreview = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const result = await previewTemplate(content);
      if (result.success) {
        setPreviewContent(result.data);
        setActiveTab("preview");
      } else {
        setError(result.error);
      }
    } catch {
      setError("Failed to generate preview");
    } finally {
      setLoading(false);
    }
  };

  const insertPlaceholder = (placeholder: string) => {
    setContent((prev) => prev + placeholder);
  };

  // Group templates by type
  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.type]) {
      acc[template.type] = [];
    }
    acc[template.type].push(template);
    return acc;
  }, {} as Record<TemplateType, Template[]>);

  return (
    <>
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[var(--shift-gray-light)]">
            Create templates for contracts, bills, and emails with dynamic placeholders.
          </p>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--shift-yellow)] text-[var(--shift-black)] font-semibold hover:bg-[var(--shift-yellow-dark)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Template
          </button>
        </div>

        {templates.length > 0 ? (
          <div className="space-y-8">
            {(["CONTRACT", "BILL", "EMAIL"] as TemplateType[]).map((templateType) => {
              const typeTemplates = groupedTemplates[templateType];
              if (!typeTemplates?.length) return null;

              return (
                <div key={templateType}>
                  <h3 className="text-sm font-semibold text-[var(--shift-gray)] uppercase tracking-wider mb-3">
                    {templateTypeLabels[templateType]} Templates
                  </h3>
                  <div className="space-y-2">
                    {typeTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="flex items-center gap-4 p-4 rounded-lg bg-[var(--shift-black)] border border-[var(--shift-gray)]/20 hover:border-[var(--shift-gray)]/40 transition-colors"
                      >
                        {/* Template Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[var(--shift-cream)]">{template.name}</span>
                            <span className={`px-2 py-0.5 text-xs rounded ${templateTypeColors[template.type]}`}>
                              {templateTypeLabels[template.type]}
                            </span>
                            {template.isDefault && (
                              <span className="px-2 py-0.5 text-xs rounded bg-[var(--shift-yellow)]/20 text-[var(--shift-yellow)]">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[var(--shift-gray)] mt-0.5 truncate max-w-md">
                            {template.content.substring(0, 100)}...
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(template)}
                            className="p-2 rounded-lg text-[var(--shift-gray-light)] hover:text-[var(--shift-cream)] hover:bg-[var(--shift-black-muted)] transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleteId(template.id)}
                            className="p-2 rounded-lg text-[var(--shift-gray-light)] hover:text-red-400 hover:bg-[var(--shift-black-muted)] transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="text-center py-12 text-[var(--shift-gray)]">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No templates created yet</p>
            <button
              onClick={openCreateModal}
              className="mt-4 text-[var(--shift-yellow)] hover:underline"
            >
              Create your first template
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
        title={editingTemplate ? "Edit Template" : "Create Template"}
        size="xl"
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
              disabled={loading || !name || !content}
              className="px-4 py-2 rounded-lg bg-[var(--shift-yellow)] text-[var(--shift-black)] font-semibold hover:bg-[var(--shift-yellow-dark)] transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : editingTemplate ? "Update" : "Create"}
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

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Template Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Standard Contract"
              required
            />

            <Select
              label="Type"
              value={type}
              onChange={(e) => setType(e.target.value as TemplateType)}
              options={[
                { value: "CONTRACT", label: "Contract" },
                { value: "BILL", label: "Bill of Lading" },
                { value: "EMAIL", label: "Email" },
              ]}
            />
          </div>

          <label className="flex items-center gap-3 p-3 rounded-lg bg-[var(--shift-black)] border border-[var(--shift-gray)]/30 cursor-pointer hover:border-[var(--shift-gray)] transition-colors">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--shift-gray)] text-[var(--shift-yellow)] focus:ring-[var(--shift-yellow)]"
            />
            <div>
              <p className="text-[var(--shift-cream)] text-sm font-medium">Set as Default</p>
              <p className="text-[var(--shift-gray)] text-xs">Use this template by default for its type</p>
            </div>
          </label>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-[var(--shift-gray)]/20">
            <button
              onClick={() => setActiveTab("edit")}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === "edit"
                  ? "border-[var(--shift-yellow)] text-[var(--shift-yellow)]"
                  : "border-transparent text-[var(--shift-gray)] hover:text-[var(--shift-cream)]"
              }`}
            >
              Edit
            </button>
            <button
              onClick={handlePreview}
              disabled={!content.trim() || loading}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === "preview"
                  ? "border-[var(--shift-yellow)] text-[var(--shift-yellow)]"
                  : "border-transparent text-[var(--shift-gray)] hover:text-[var(--shift-cream)] disabled:opacity-50"
              }`}
            >
              Preview
            </button>
          </div>

          {activeTab === "edit" ? (
            <>
              <Textarea
                label="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter template content with placeholders..."
                rows={10}
                required
              />

              {/* Placeholders Reference */}
              <div className="p-4 rounded-lg bg-[var(--shift-black)] border border-[var(--shift-gray)]/20">
                <p className="text-sm font-medium text-[var(--shift-cream)] mb-3">Available Placeholders</p>
                <div className="flex flex-wrap gap-2">
                  {placeholders.map((p) => (
                    <button
                      key={p.key}
                      onClick={() => insertPlaceholder(p.key)}
                      title={p.description}
                      className="px-2 py-1 text-xs rounded bg-[var(--shift-black-muted)] text-[var(--shift-gray-light)] hover:text-[var(--shift-yellow)] border border-[var(--shift-gray)]/30 hover:border-[var(--shift-yellow)]/50 transition-colors font-mono"
                    >
                      {p.key}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 rounded-lg bg-[var(--shift-black)] border border-[var(--shift-gray)]/20 min-h-[200px]">
              <p className="text-sm font-medium text-[var(--shift-cream)] mb-3">Preview with Sample Data</p>
              <div className="text-[var(--shift-gray-light)] whitespace-pre-wrap">
                {previewContent || "Click Preview to see the template with sample data."}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Template"
        message="Are you sure you want to delete this template? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
        loading={loading}
      />
    </>
  );
}
