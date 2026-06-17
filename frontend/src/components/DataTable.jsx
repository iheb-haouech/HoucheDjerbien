import { useState } from 'react';
import { motion } from 'framer-motion';

export default function DataTable({ columns, rows, onEdit, onDelete, onStatusChange }) {
  const [editingRow, setEditingRow] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEdit = (row) => {
    setEditingRow(row.id);
    setEditData({ ...row });
  };

  const handleSave = () => {
    if (onEdit) {
      onEdit(editData);
    }
    setEditingRow(null);
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditData({});
  };

  const handleDelete = (row) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      if (onDelete) {
        onDelete(row.id);
      }
    }
  };

  const handleStatusChange = (rowId, newStatus) => {
    if (onStatusChange) {
      onStatusChange(rowId, newStatus);
    }
  };

  return (
    <div className="overflow-x-auto bg-white shadow-soft rounded-2xl">
      <table className="min-w-full text-left">
        <thead className="bg-sand text-gray-700">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-xs uppercase tracking-wide">
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3 text-xs uppercase tracking-wide">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <motion.tr
              key={row.id}
              className="border-t border-sand hover:bg-sand/40"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {columns.map((col) => (
                <td key={`${row.id}-${col.key}`} className="px-4 py-3 text-sm">
                  {editingRow === row.id && col.editable ? (
                    <input
                      type={col.type || 'text'}
                      value={editData[col.key] || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, [col.key]: e.target.value }))}
                      className="w-full rounded border px-2 py-1 text-sm"
                    />
                  ) : col.render ? (
                    col.render(row)
                  ) : (
                    row[col.key]
                  )}
                </td>
              ))}
              <td className="px-4 py-3 text-sm">
                {editingRow === row.id ? (
                  <div className="flex gap-2">
                    <motion.button
                      onClick={handleSave}
                      className="text-green-600 hover:text-green-800 font-medium"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      Save
                    </motion.button>
                    <motion.button
                      onClick={handleCancel}
                      className="text-gray-600 hover:text-gray-800"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => handleEdit(row)}
                      className="text-blue-600 hover:text-blue-800"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      Edit
                    </motion.button>
                    {onStatusChange && row.status && (
                      <select
                        value={row.status}
                        onChange={(e) => handleStatusChange(row.id, e.target.value)}
                        className="text-xs rounded border px-1 py-0.5"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="assigned">Assigned</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    )}
                    <motion.button
                      onClick={() => handleDelete(row)}
                      className="text-primary-600 hover:text-primary-800"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      Delete
                    </motion.button>
                  </div>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
