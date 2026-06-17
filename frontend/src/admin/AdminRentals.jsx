import { useEffect, useState } from 'react';
import { loadListings, saveListings } from '../data/storage';
import DataTable from '../components/DataTable';
import { X, Plus, Edit2, Trash2 } from 'lucide-react';
import { createListing, fetchListings } from '../lib/listings';
import { listings as defaultListings } from '../data/mockData';

const months = [
  { key: 'jan', label: 'Janvier' },
  { key: 'feb', label: 'Février' },
  { key: 'mar', label: 'Mars' },
  { key: 'apr', label: 'Avril' },
  { key: 'may', label: 'Mai' },
  { key: 'jun', label: 'Juin' },
  { key: 'jul', label: 'Juillet' },
  { key: 'aug', label: 'Août' },
  { key: 'sep', label: 'Septembre' },
  { key: 'oct', label: 'Octobre' },
  { key: 'nov', label: 'Novembre' },
  { key: 'dec', label: 'Décembre' },
];

export default function AdminRentals() {
  const [allListings, setAllListings] = useState(() => {
    const stored = loadListings();
    return stored.length ? stored : defaultListings;
  });
  const [editing, setEditing] = useState(null);
  const [imagePreview, setImagePreview] = useState([]);
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    location: '',
    price: '',
    rating: '',
    images: [],
    amenities: '',
    description: '',
    host: '',
    priceByMonth: {},
    capacity: { adults: 6, children: 4 },
  });

  useEffect(() => {
    fetchListings()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAllListings(data);
          saveListings(data);
        }
      })
      .catch(() => {});
  }, []);

  const columns = [
    { label: 'Titre', key: 'title' },
    { label: 'Localisation', key: 'location' },
    { 
      label: 'Prix', 
      key: 'price', 
      render: (row) => (
        <div>
          <div className="font-medium">{row.price} DT</div>
          <div className="text-xs text-gray-500">par nuit (base)</div>
        </div>
      )
    },
    { label: 'Note', key: 'rating', render: (row) => `⭐ ${row.rating}` },
    {
      label: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="px-3 py-1 bg-primary-600 text-white rounded text-xs hover:bg-primary-700 flex items-center gap-1"
          >
            <Edit2 className="w-3 h-3" /> Modifier
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" /> Supprimer
          </button>
        </div>
      ),
    },
  ];

  const handleEdit = (listing) => {
    setEditing(listing.id);
    setImagePreview(listing.images || []);
    setForm({
      title: listing.title,
      location: listing.location,
      price: listing.price,
      rating: listing.rating,
      images: listing.images || [],
      amenities: (listing.amenities || []).join(', '),
      description: listing.description,
      host: `${listing.host?.name || listing.hostName || 'Host'} (${listing.host?.avatar || listing.hostAvatar || ''})`,
      priceByMonth: listing.priceByMonth || {},
      capacity: listing.capacity || { adults: 6, children: 4 },
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette location?')) {
      const updated = allListings.filter((l) => l.id !== id);
      setAllListings(updated);
      saveListings(updated);
      setSuccess('Location supprimée avec succès!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({ 
      title: '', location: '', price: '', rating: '', 
      images: [], amenities: '', description: '', host: '',
      priceByMonth: {}, capacity: { adults: 6, children: 4 },
    });
    setImagePreview([]);
  };

  const handlePriceChange = (month, value) => {
    setForm({
      ...form,
      priceByMonth: {
        ...form.priceByMonth,
        [month]: Number(value) || 0,
      },
    });
  };

  const handleSave = async () => {
    if (isUploading) {
      alert('Veuillez attendre la fin du téléchargement des images.');
      return;
    }

    if (!form.title || !form.location || !form.price) {
      alert('Veuillez remplir tous les champs obligatoires (Titre, Localisation, Prix)');
      return;
    }

    setIsSaving(true);
    try {
      const updatedListing = {
        title: form.title,
        location: form.location,
        price: parseFloat(form.price),
        rating: parseFloat(form.rating) || 0,
        images: form.images,
        amenities: form.amenities.split(',').map((s) => s.trim()).filter(Boolean),
        description: form.description,
        host: {
          name: form.host.split(' (')[0] || 'Host',
          avatar: form.host.split(' (')[1]?.replace(')', '') || '',
        },
        priceByMonth: form.priceByMonth,
        capacity: form.capacity,
      };

      let updated;
      if (editing && editing !== 'new') {
        updated = allListings.map((l) =>
          l.id === editing ? { ...l, ...updatedListing } : l
        );
        setSuccess('Location modifiée avec succès!');
      } else {
        let newListing;
        try {
          const result = await createListing({
            ...updatedListing,
            hostName: updatedListing.host.name,
            hostAvatar: updatedListing.host.avatar,
            coordinates: { lat: 33.876, lng: 10.858 },
          });
          newListing = result.listing;
        } catch {
          newListing = {
            id: Date.now().toString(),
            ...updatedListing,
            coordinates: { lat: 33.876, lng: 10.858 },
          };
        }
        updated = [...allListings, newListing];
        setSuccess('Location créée avec succès!');
      }

      setAllListings(updated);
      saveListings(updated);
      handleCancel();
      setTimeout(() => setSuccess(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setIsUploading(true);
    const promises = files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    );

    Promise.all(promises)
      .then((urls) => {
        const currentImages = form.images || [];
        const mergedImages = [...currentImages, ...urls];
        setImagePreview(mergedImages);
        setForm({ ...form, images: mergedImages });
      })
      .catch(() => {
        alert('Une ou plusieurs images n\'ont pas pu être téléchargées. Veuillez réessayer.');
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  const removeImage = (index) => {
    const newPreview = imagePreview.filter((_, i) => i !== index);
    setImagePreview(newPreview);
    setForm({ ...form, images: newPreview });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-navy">Gestion des Locations</h2>
        <button
          onClick={() => {
            setEditing('new');
            setForm({ 
              title: '', location: '', price: '', rating: '', 
              images: [], amenities: '', description: '', host: '',
              priceByMonth: {}, capacity: { adults: 6, children: 4 },
            });
            setImagePreview([]);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-5 h-5" /> Ajouter une Location
        </button>
      </div>

      {success && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          ✓ {success}
        </div>
      )}

      {editing && (
        <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">
              {editing === 'new' ? 'Ajouter une Location' : 'Modifier la Location'}
            </h3>
            <button
              onClick={handleCancel}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  Titre *
                </label>
                <input
                  type="text"
                  placeholder="Titre de la propriété"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  Localisation *
                </label>
                <input
                  type="text"
                  placeholder="Localisation"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  Prix de base (par nuit) *
                </label>
                <input
                  type="number"
                  placeholder="Prix"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  Note (0-5)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="Note"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  Nom de l'Hôte
                </label>
                <input
                  type="text"
                  placeholder="Nom de l'hôte"
                  value={form.host}
                  onChange={(e) => setForm({ ...form, host: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">Adultes max</label>
                  <input
                    type="number"
                    value={form.capacity.adults}
                    onChange={(e) => setForm({ ...form, capacity: { ...form.capacity, adults: Number(e.target.value) } })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">Enfants max</label>
                  <input
                    type="number"
                    value={form.capacity.children}
                    onChange={(e) => setForm({ ...form, capacity: { ...form.capacity, children: Number(e.target.value) } })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  Équipements (séparés par des virgules)
                </label>
                <textarea
                  placeholder="WiFi, Piscine, Cuisine..."
                  value={form.amenities}
                  onChange={(e) => setForm({ ...form, amenities: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Description de la propriété"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-1">
                  Télécharger des Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Monthly Pricing */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-navy mb-3">Prix par Mois (saisonnier)</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {months.map((month) => (
                <div key={month.key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{month.label}</label>
                  <input
                    type="number"
                    placeholder={form.price || '0'}
                    value={form.priceByMonth[month.key] || ''}
                    onChange={(e) => handlePriceChange(month.key, e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Image Preview */}
          {imagePreview.length > 0 && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-navy mb-3">
                Aperçu des Images ({imagePreview.length})
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreview.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img}
                      alt={`Aperçu ${idx}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 pt-6 border-t">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Enregistrement...' : 'Enregistrer la Location'}
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 font-medium"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <DataTable columns={columns} rows={allListings} />
      </div>
    </div>
  );
}