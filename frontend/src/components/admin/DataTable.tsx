import { useState } from 'react';
import { useNavigate } from 'react-router';
import styles from '../../styles/components/DataTable.module.css';

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
  searchPlaceholder = 'Search...',
  searchKeys = [],
  actions,
  emptyMessage = 'No data found',
  onRowClick,
  rowHref,
}: DataTableProps<T>) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filteredData = data.filter((item) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return searchKeys.some((key) => {
      const value = getNestedValue(item, key);
      return String(value || '').toLowerCase().includes(searchLower);
    });
  });

  const sortedData = sortKey
    ? [...filteredData].sort((a, b) => {
        const aVal = getNestedValue(a, sortKey);
        const bVal = getNestedValue(b, sortKey);
        const comparison = String(aVal || '').localeCompare(String(bVal || ''));
        return sortDir === 'asc' ? comparison : -comparison;
      })
    : filteredData;

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const handleRowClick = (item: T) => {
    if (rowHref) {
      navigate(rowHref(item));
    } else if (onRowClick) {
      onRowClick(item);
    }
  };

  return (
    <div className={styles.wrapper}>
      {searchable && (
        <div className={styles.searchRow}>
          <div className={styles.searchContainer}>
            <svg
              className={styles.searchIcon}
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
              className={styles.searchInput}
            />
          </div>
        </div>
      )}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => column.sortable && handleSort(column.key)}
                  className={`${styles.headerCell} ${column.sortable ? styles.headerCellSortable : ''}`}
                >
                  <div className={styles.headerContent}>
                    {column.header}
                    {column.sortable && sortKey === column.key && (
                      <svg
                        className={`${styles.sortIcon} ${sortDir === 'desc' ? styles.sortIconDesc : ''}`}
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
                <th className={`${styles.headerCell} ${styles.headerCellActions}`}>
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
                  className={styles.emptyCell}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => handleRowClick(item)}
                  className={`${styles.bodyRow} ${onRowClick || rowHref ? styles.bodyRowClickable : ''}`}
                >
                  {columns.map((column) => (
                    <td key={column.key} className={styles.bodyCell}>
                      {column.render
                        ? column.render(item)
                        : String(getNestedValue(item, column.key) ?? '')}
                    </td>
                  ))}
                  {actions && (
                    <td className={styles.actionsCell}>
                      <div onClick={(e) => e.stopPropagation()}>{actions(item)}</div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.resultCount}>
        Showing {sortedData.length} of {data.length} results
      </div>
    </div>
  );
}

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((acc: unknown, part) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
}
