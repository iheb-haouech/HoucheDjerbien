import { useState, useEffect } from 'react';
import { loadUsers, saveUsers } from '../data/storage';
import DataTable from '../components/DataTable';
import { X, Plus } from 'lucide-react';

const defaultNewUser = {
  name: '',
  email: '',
  password: '',
  role: 'guest',
  phone: '',
};

export default function AdminUsers() {
  const [usersData, setUsersData] = useState(() => loadUsers());
  const [showAddForm, setShowAddForm] = useState(false);
  const [ newUser, setNewUser] = useState(defaultNewUser);
  const [isSaving, setIsSaving] = useState(false);

  const columns = [
    { label: 'Nom', key: 'name', editable: true },
    { label: 'Email', key: 'email', editable: true, type: 'email' },
    { label: 'Rôle', key: 'role', editable: true },
    { label: 'Téléphone', key: 'phone' },
  ];

  const handleEdit = (updatedUser) => {
    const updated = usersData.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );
    setUsersData(updated);
    saveUsers(updated);
  };

  const handleDelete = (userId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
      const updated = usersData.filter((user) => user.id !== userId);
      setUsersData(updated);
      saveUsers(updated);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSaving(true);
    try {
      const userToAdd = {
        ...newUser,
        id: `u${Date.now()}`,
      };
      const updated = [...usersData, userToAdd];
      setUsersData(updated);
      saveUsers(updated);
      setNewUser(defaultNewUser);
      setShowAddForm(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-navy">Gestion des Utilisateurs</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-5 h-5" /> Ajouter un Utilisateur
        </button>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-navy">Nouvel Utilisateur</h3>
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
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="email"
                placeholder="Email *"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="tel"
                placeholder="Téléphone"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="guest">Client</option>
                <option value="host">Hôte</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddUser}
                disabled={isSaving}
                className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {isSaving ? 'Enregistrement...' : 'Ajouter l\'Utilisateur'}
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
          rows={usersData}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}