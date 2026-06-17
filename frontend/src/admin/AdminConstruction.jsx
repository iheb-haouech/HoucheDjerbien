import { useEffect, useState } from 'react';
import { loadConstructionRequests, saveConstructionRequests } from '../data/storage';
import DataTable from '../components/DataTable';
import { fetchAdminConstructionRequests } from '../lib/admin';
import { X, Plus } from 'lucide-react';

const normalizeConstruction = (request) => ({
  id: request.id,
  name: request.name || 'Client',
  type: request.requestType || request.type || 'Construction',
  date: request.date ? String(request.date).slice(0, 10) : '',
  phone: request.phone || '',
  email: request.email || '',
  status: String(request.status || 'pending').toLowerCase(),
  location: request.location || '',
  budget: request.budgetRange || '',
  description: request.description || '',
});

const defaultNewRequest = {
  name: '',
  phone: '',
  email: '',
  type: '',
  location: '',
  budget: '',
  description: '',
};

export default function AdminConstruction() {
  const [constructionData, setConstructionData] = useState(() => loadConstructionRequests().map(normalizeConstruction));
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRequest, setNewRequest] = useState(defaultNewRequest);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchAdminConstructionRequests()
      .then((data) => {
        const normalized = Array.isArray(data) ? data.map(normalizeConstruction) : [];
        setConstructionData(normalized);
        saveConstructionRequests(normalized);
      })
      .catch(() => {});
  }, []);

  const columns = [
    { label: 'Nom', key: 'name', editable: true },
    { label: 'Type', key: 'type', editable: true },
    { label: 'Date', key: 'date' },
    { label: 'Téléphone', key: 'phone', editable: true, type: 'tel' },
    { label: 'Email', key: 'email', editable: true, type: 'email' },
    { label: 'Statut', key: 'status' },
  ];

  const handleEdit = (updatedRequest) => {
    const updated = constructionData.map((request) =>
      request.id === updatedRequest.id ? updatedRequest : request
    );
    setConstructionData(updated);
    saveConstructionRequests(updated);
  };

  const handleDelete = (requestId) => {
    const updated = constructionData.filter((request) => request.id !== requestId);
    setConstructionData(updated);
    saveConstructionRequests(updated);
  };

  const handleStatusChange = (requestId, newStatus) => {
    const updated = constructionData.map((request) =>
      request.id === requestId ? { ...request, status: newStatus } : request
    );
    setConstructionData(updated);
    saveConstructionRequests(updated);
  };

  const handleAddNew = async () => {
    if (!newRequest.name || !newRequest.phone || !newRequest.email) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSaving(true);
    try {
      const requestToAdd = {
        ...newRequest,
        id: Date.now().toString(),
        date: new Date().toISOString(),
        status: 'pending',
      };
      const updated = [...constructionData, requestToAdd];
      setConstructionData(updated);
      saveConstructionRequests(updated);
      setNewRequest(defaultNewRequest);
      setShowAddForm(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-navy">Demandes de Construction</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-5 h-5" /> Ajouter une Demande
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-navy">Nouvelle Demande de Construction</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nom complet *"
                value={newRequest.name}
                onChange={(e) => setNewRequest({ ...newRequest, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="tel"
                placeholder="Téléphone *"
                value={newRequest.phone}
                onChange={(e) => setNewRequest({ ...newRequest, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="email"
                placeholder="Email *"
                value={newRequest.email}
                onChange={(e) => setNewRequest({ ...newRequest, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Type de projet"
                value={newRequest.type}
                onChange={(e) => setNewRequest({ ...newRequest, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Localisation du projet"
                value={newRequest.location}
                onChange={(e) => setNewRequest({ ...newRequest, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Budget estimé"
                value={newRequest.budget}
                onChange={(e) => setNewRequest({ ...newRequest, budget: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <textarea
                placeholder="Détails du projet"
                value={newRequest.description}
                onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddNew}
                disabled={isSaving}
                className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {isSaving ? 'Enregistrement...' : 'Ajouter la Demande'}
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <DataTable
          columns={columns}
          rows={constructionData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
}