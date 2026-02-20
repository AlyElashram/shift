"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: string[];
  actions?: (item: T) => React.ReactNode;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  rowHref?: (item: T) => string;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = "Search...",
  searchKeys = [],
  actions,
  emptyMessage = "No data found",
  onRowClick,
  rowHref,
}: DataTableProps<T>) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filteredData = data.filter((item) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return searchKeys.some((key) => {
      const value = getNestedValue(item, key);
      return String(value || "").toLowerCase().includes(searchLower);
    });
  });

  const sortedData = sortKey
    ? [...filteredData].sort((a, b) => {
        const aVal = getNestedValue(a, sortKey);
        const bVal = getNestedValue(b, sortKey);
        const comparison = String(aVal || "").localeCompare(String(bVal || ""));
        return sortDir === "asc" ? comparison : -comparison;
      })
    : filteredData;

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const handleRowClick = (item: T) => {
    if (rowHref) {
      router.push(rowHref(item));
    } else if (onRowClick) {
      onRowClick(item);
    }
  };

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--shift-gray)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--shift-black)] border border-[var(--shift-gray)]/50 text-[var(--shift-cream)] placeholder:text-[var(--shift-gray)] focus:outline-none focus:border-[var(--shift-yellow)] transition-colors"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-[var(--shift-gray)]/20">
        <table className="w-full">
          <thead>
            <tr className="bg-[var(--shift-black-muted)]">
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => column.sortable && handleSort(column.key)}
                  className={`px-4 py-3 text-left text-sm font-semibold text-[var(--shift-gray-light)] uppercase tracking-wider ${
                    column.sortable ? "cursor-pointer hover:text-[var(--shift-cream)]" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && sortKey === column.key && (
                      <svg
                        className={`w-4 h-4 transition-transform ${sortDir === "desc" ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="px-4 py-3 text-right text-sm font-semibold text-[var(--shift-gray-light)] uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-4 py-12 text-center text-[var(--shift-gray)]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => handleRowClick(item)}
                  className={`border-b border-[var(--shift-gray)]/20 hover:bg-[var(--shift-black)] transition-colors ${
                    onRowClick || rowHref ? "cursor-pointer" : ""
                  }`}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 text-[var(--shift-cream)]">
                      {column.render
                        ? column.render(item)
                        : String(getNestedValue(item, column.key) ?? "")}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3 text-right">
                      <div onClick={(e) => e.stopPropagation()}>{actions(item)}</div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-[var(--shift-gray)]">
        Showing {sortedData.length} of {data.length} results
      </div>
    </div>
  );
}

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce((acc: unknown, part) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
}
