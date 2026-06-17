import { useEffect, useState } from 'react';
import { loadCleaningRequests, saveCleaningRequests } from '../data/storage';
import DataTable from '../components/DataTable';
import { fetchAdminCleaningRequests } from '../lib/admin';
import { Plus } from 'lucide-react';

const normalizeCleaning = (request) => ({
  id: request.id,
  client: request.clientName || request.client || request.user?.name || 'Client',
  type: request.requestType || request.type || 'Cleaning',
  frequency: request.frequency || 'one-time',
  status: String(request.status || 'pending').toLowerCase(),
  team: request.team || 'unassigned',
});

export default function AdminCleaning() {
  const [cleaningData, setCleaningData] = useState(() => loadCleaningRequests().map(normalizeCleaning));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    client: '',
    type: 'Deep Cleaning',
    frequency: 'One-time',
    date: '',
    team: 'Team A',
  });

  useEffect(() => {
    fetchAdminCleaningRequests()
      .then((data) => {
        const normalized = Array.isArray(data) ? data.map(normalizeCleaning) : [];
        setCleaningData(normalized);
        saveCleaningRequests(normalized);
      })
      .catch(() => {});
  }, []);

  const columns = [
    { label: 'ID', key: 'id' },
    { label: 'Client', key: 'client', editable: true },
    { label: 'Type', key: 'type', editable: true },
    { label: 'Frequency', key: 'frequency', editable: true },
    { label: 'Status', key: 'status' },
    { label: 'Team', key: 'team', editable: true },
  ];

  const handleEdit = (updatedRequest) => {
    const updated = cleaningData.map((request) =>
      request.id === updatedRequest.id ? updatedRequest : request
    );
    setCleaningData(updated);
    saveCleaningRequests(updated);
  };

  const handleDelete = (requestId) => {
    const updated = cleaningData.filter((request) => request.id !== requestId);
    setCleaningData(updated);
    saveCleaningRequests(updated);
  };

  const handleStatusChange = (requestId, newStatus) => {
    const updated = cleaningData.map((request) =>
      request.id === requestId ? { ...request, status: newStatus } : request
    );
    setCleaningData(updated);
    saveCleaningRequests(updated);
  };

  const handleAddRequest = (event) => {
    event.preventDefault();
    const newRequest = {
      id: Date.now().toString(),
      ...form,
      status: 'pending',
    };
    const updated = [newRequest, ...cleaningData];
    setCleaningData(updated);
    saveCleaningRequests(updated);
    setForm({ client: '', type: 'Deep Cleaning', frequency: 'One-time', date: '', team: 'Team A' });
    setShowForm(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold text-navy-900">Manage Cleaning Requests</h2>
          <p className="text-sm text-navy-500">Confirm cleaning requests so they appear in the admin agenda.</p>
        </div>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary-500/20 hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Add New Request for Cleaning
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddRequest} className="grid gap-4 rounded-[24px] border border-sand-200 bg-white p-5 shadow-xl shadow-navy-900/5 md:grid-cols-5">
          <input className="admin-input" placeholder="Client name" value={form.client} onChange={(e) => setForm((prev) => ({ ...prev, client: e.target.value }))} required />
          <input className="admin-input" placeholder="Type" value={form.type} onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))} required />
          <input className="admin-input" placeholder="Frequency" value={form.frequency} onChange={(e) => setForm((prev) => ({ ...prev, frequency: e.target.value }))} />
          <input className="admin-input" type="date" value={form.date} onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))} required />
          <button className="rounded-2xl bg-navy-900 px-4 py-3 text-sm font-bold text-white hover:bg-primary-700">Save Request</button>
        </form>
      )}

      <DataTable
        columns={columns}
        rows={cleaningData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
