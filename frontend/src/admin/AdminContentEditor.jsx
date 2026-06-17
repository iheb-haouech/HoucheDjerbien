import { useState, useEffect } from 'react';
import { Edit3, Save, X, Eye, EyeOff, Upload, RotateCcw, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { loadPageContent, savePageContent, defaultPageContent, updateSectionContent } from '../data/storage';

const pages = [
  { id: 'homepage', label: 'Page d\'Accueil' },
  { id: 'construction', label: 'Construction' },
  { id: 'cleaning', label: 'Nettoyage' },
  { id: 'rentals', label: 'Locations' },
];

export default function AdminContentEditor() {
  const [selectedPage, setSelectedPage] = useState('homepage');
  const [content, setContent] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [changes, setChanges] = useState({});
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState({});
  const [bgPreview, setBgPreview] = useState(null);

  useEffect(() => {
    const loadedContent = loadPageContent();
    setContent(loadedContent);
  }, []);

  const currentPageSections = content?.[selectedPage] || {};

  const handleSectionClick = (sectionId) => {
    setEditingSection(editingSection === sectionId ? null : sectionId);
    setChanges({});
    setImagePreview({});
  };

  const handleFieldChange = (sectionId, field, value) => {
    setChanges((prev) => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], [field]: value },
    }));
  };

  const handleToggleVisibility = (sectionId) => {
    handleFieldChange(sectionId, 'visible', !currentPageSections[sectionId]?.visible);
  };

  const handleImageUpload = (event, sectionId, imageField = 'image') => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setImagePreview((prev) => ({
        ...prev,
        [sectionId]: dataUrl,
      }));
      handleFieldChange(sectionId, imageField, dataUrl);
    };
    reader.readAsDataURL(files[0]);
  };

  const handleBgUpload = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setBgPreview(dataUrl);
      setChanges((prev) => ({
        ...prev,
        backgroundImage: dataUrl,
      }));
    };
    reader.readAsDataURL(files[0]);
  };

  const handleAddTestimonial = () => {
    const newTestimonial = {
      id: Date.now(),
      name: '',
      location: '',
      rating: 5,
      text: '',
      image: '',
    };
    const currentItems = content?.testimonials?.items || [];
    const updatedItems = [...currentItems, newTestimonial];
    setChanges((prev) => ({
      ...prev,
      testimonials: {
        ...(content?.testimonials || {}),
        items: updatedItems,
      },
    }));
    setEditingTestimonial(newTestimonial);
  };

  const handleDeleteTestimonial = (index) => {
    const currentItems = content?.testimonials?.items || [];
    const updatedItems = currentItems.filter((_, i) => i !== index);
    setChanges((prev) => ({
      ...prev,
      testimonials: {
        ...(content?.testimonials || {}),
        items: updatedItems,
      },
    }));
    setEditingTestimonial(null);
  };

  const handleTestimonialChange = (field, value) => {
    if (!editingTestimonial) return;
    const currentItems = content?.testimonials?.items || [];
    const updatedItems = currentItems.map((item) =>
      item.id === editingTestimonial.id ? { ...item, [field]: value } : item
    );
    setEditingTestimonial({ ...editingTestimonial, [field]: value });
    setChanges((prev) => ({
      ...prev,
      testimonials: {
        ...(content?.testimonials || {}),
        items: updatedItems,
      },
    }));
  };

  const handleSave = () => {
    if (!content) return;

    const updatedContent = { ...content };
    Object.keys(changes).forEach((sectionId) => {
      if (sectionId === 'backgroundImage') {
        updatedContent.backgroundImage = changes[sectionId];
      } else {
        updatedContent[selectedPage][sectionId] = {
          ...updatedContent[selectedPage]?.[sectionId],
          ...changes[sectionId],
        };
      }
    });

    savePageContent(updatedContent);
    setContent(updatedContent);
    setChanges({});
    setEditingSection(null);
    setEditingTestimonial(null);
    setImagePreview({});
    setSuccess('Modifications enregistrées avec succès!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleReset = () => {
    const defaultContent = defaultPageContent;
    savePageContent(defaultContent);
    setContent(defaultContent);
    setChanges({});
    setEditingSection(null);
    setEditingTestimonial(null);
    setImagePreview({});
    setBgPreview(null);
    setSuccess('Contenu réinitialisé aux valeurs par défaut!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const renderTestimonialsEditor = () => {
    const testimonials = changes.testimonials?.items || content?.testimonials?.items || [];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-navy">Gestion des Témoignages</h4>
          <button
            onClick={handleAddTestimonial}
            className="flex items-center gap-1 rounded-lg bg-primary-600 px-3 py-1 text-white text-sm hover:bg-primary-700"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>

        {editingTestimonial && (
          <div className="rounded-2xl border border-primary-200 bg-primary-50 p-4 space-y-3">
            <h5 className="font-medium">Modifier le Témoignage</h5>
            <input
              type="text"
              value={editingTestimonial.name || ''}
              onChange={(e) => handleTestimonialChange('name', e.target.value)}
              placeholder="Nom"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              value={editingTestimonial.location || ''}
              onChange={(e) => handleTestimonialChange('location', e.target.value)}
              placeholder="Localisation"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <textarea
              value={editingTestimonial.text || ''}
              onChange={(e) => handleTestimonialChange('text', e.target.value)}
              placeholder="Témoignage"
              rows={3}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              type="url"
              value={editingTestimonial.image || ''}
              onChange={(e) => handleTestimonialChange('image', e.target.value)}
              placeholder="URL de l'image"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              type="number"
              min={1}
              max={5}
              value={editingTestimonial.rating || 5}
              onChange={(e) => handleTestimonialChange('rating', Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setEditingTestimonial(null)}
                className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-3">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div>
                <div className="font-medium">{testimonial.name || 'Nouveau témoignage'}</div>
                <div className="text-sm text-gray-500">{testimonial.location}</div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditingTestimonial(testimonial)}
                  className="p-1 text-primary-600 hover:bg-primary-50 rounded"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTestimonial(index)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSectionEditor = (sectionId, sectionData) => {
    const editedData = changes[sectionId] || sectionData || {};

    return (
      <div key={sectionId} className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-navy capitalize">{sectionId}</h3>
            <button
              onClick={() => handleToggleVisibility(sectionId)}
              className={`p-2 rounded-lg transition ${
                (editedData.visible ?? sectionData?.visible) ? 'bg-green-100 text-green-700' : 'bg-primary-100 text-primary-700'
              }`}
              title={`Cliquez pour ${(editedData.visible ?? sectionData?.visible) ? 'cacher' : 'afficher'} la section`}
            >
              {(editedData.visible ?? sectionData?.visible) ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
          <button
            onClick={() => handleSectionClick(sectionId)}
            className="text-primary-600 hover:text-primary-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Text Fields */}
          {['title', 'subtitle', 'description', 'description1', 'description2', 'description3', 'buttonText', 'buttonLink'].map(
            (field) => {
              if (!(field in sectionData || field in editedData)) return null;
              const value = editedData[field] ?? sectionData?.[field] ?? '';

              return (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {field}
                  </label>
                  <textarea
                    value={value}
                    onChange={(e) => handleFieldChange(sectionId, field, e.target.value)}
                    rows={field === 'description' || field.includes('description') ? 3 : 1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              );
            }
          )}

          {/* Image Fields */}
          {['image'].map((field) => {
            if (!(field in sectionData || field in editedData)) return null;
            const imageUrl = imagePreview[sectionId] || editedData[field] || sectionData?.[field];
            
            return (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                  {field}
                </label>
                <div className="space-y-3">
                  {imageUrl && (
                    <div className="relative rounded-lg overflow-hidden h-48 bg-gray-100">
                      <img src={imageUrl} alt={field} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700">
                    <Upload className="w-4 h-4" />
                    Télécharger une Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, sectionId, field)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            );
          })}

          {/* Special handling for testimonials section */}
          {sectionId === 'testimonials' && (
            <div className="border-t pt-4 mt-4">
              {renderTestimonialsEditor()}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!content) return <div className="p-6 text-center">Chargement...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-navy">Gestionnaire de Contenu (CMS)</h2>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Modifiez tout le contenu du site sans toucher au code. Les changements s\'appliquent instantanément.
          </p>
        </div>
      </div>

      {success && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700 flex items-center gap-2">
          <span>✓ {success}</span>
        </div>
      )}

      {/* Background Image Upload */}
      {selectedPage === 'homepage' && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-navy mb-4">Image de Fond de la Page</h3>
          {bgPreview ? (
            <div className="mb-3">
              <img src={bgPreview} alt="Background preview" className="w-full h-48 object-cover rounded-lg" />
            </div>
          ) : content?.backgroundImage ? (
            <div className="mb-3">
              <img src={content.backgroundImage} alt="Current background" className="w-full h-48 object-cover rounded-lg" />
            </div>
          ) : null}
          <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700">
            <ImageIcon className="w-4 h-4" />
            Changer l'Image de Fond
            <input
              type="file"
              accept="image/*"
              onChange={handleBgUpload}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* Page Selector */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-navy mb-4">Sélectionner une Page</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => {
                setSelectedPage(page.id);
                setEditingSection(null);
                setEditingTestimonial(null);
                setChanges({});
              }}
              className={`rounded-lg px-4 py-3 font-medium transition ${
                selectedPage === page.id
                  ? 'bg-primary-600 text-white'
                  : 'border border-gray-200 bg-white text-navy hover:border-primary-400'
              }`}
            >
              {page.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sections Editor */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-navy">Sections de la Page</h3>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 rounded-lg bg-orange-100 px-4 py-2 text-orange-700 hover:bg-orange-200"
          >
            <RotateCcw className="w-4 h-4" />
            Réinitialiser
          </button>
        </div>

        {Object.keys(currentPageSections).length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
            Aucune section disponible pour cette page.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {Object.entries(currentPageSections).map(([sectionId, sectionData]) => (
              <div key={sectionId}>
                {editingSection === sectionId ? (
                  renderSectionEditor(sectionId, sectionData)
                ) : (
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 cursor-pointer hover:border-primary-400 transition"
                    onClick={() => handleSectionClick(sectionId)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-navy capitalize">{sectionId}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {sectionData?.title || sectionData?.description || 'Sans titre'}
                        </p>
                        <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                          sectionData?.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {sectionData?.visible ? 'Visible' : 'Caché'}
                        </span>
                      </div>
                      <Edit3 className="w-5 h-5 text-primary-600 mt-1" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save Button */}
      {Object.keys(changes).length > 0 && (
        <div className="fixed bottom-6 right-6 flex gap-3">
          <button
            onClick={() => {
              setChanges({});
              setEditingSection(null);
              setEditingTestimonial(null);
            }}
            className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-navy hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-medium text-white hover:bg-primary-700"
          >
            <Save className="w-5 h-5" />
            Enregistrer les Changements
          </button>
        </div>
      )}
    </div>
  );
}