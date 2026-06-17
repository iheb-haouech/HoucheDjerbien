import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { loadServices, saveServices } from '../data/storage';
import { UploadCloud, X, Check } from 'lucide-react';

export default function AdminServices() {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const loaded = loadServices();
    setServices(loaded);
    if (loaded.length > 0) {
      setSelectedServiceId(loaded[0].id);
    }
  }, []);

  const selectedService = services.find((service) => service.id === selectedServiceId);

  const updateService = (updatedService) => {
    const updated = services.map((service) =>
      service.id === updatedService.id ? updatedService : service
    );
    setServices(updated);
  };

  const handleUploadImages = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length || !selectedService) return;

    setIsUploading(true);
    const promises = files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    );

    Promise.all(promises)
      .then((urls) => {
        const nextService = {
          ...selectedService,
          images: [...(selectedService.images || []), ...urls],
        };
        updateService(nextService);
      })
      .catch(() => {
        alert('Unable to upload one or more images. Please try again.');
      })
      .finally(() => setIsUploading(false));
  };

  const removeImage = (index) => {
    if (!selectedService) return;
    const nextService = {
      ...selectedService,
      images: selectedService.images.filter((_, idx) => idx !== index),
    };
    updateService(nextService);
  };

  const handleSave = () => {
    if (!selectedService) return;
    saveServices(services);
    setSuccess('Service images saved successfully');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-navy">Manage Service Images</h2>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Edit the visuals used on construction and cleaning pages, then save them so they persist across reloads.
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          <Check className="inline w-4 h-4 mr-2" /> {success}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-3">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setSelectedServiceId(service.id)}
              className={`w-full text-left rounded-2xl border p-4 transition-colors ${
                service.id === selectedServiceId ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white hover:border-primary-300'
              }`}
            >
              <h3 className="text-lg font-semibold text-navy">{t(`services.${service.id}.title`)}</h3>
              <p className="mt-2 text-sm text-gray-600">{t(`services.${service.id}.description`)}</p>
            </button>
          ))}
        </aside>

        <section className="bg-white rounded-3xl shadow-soft p-6">
          {selectedService ? (
            <>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-navy">{t(`services.${selectedService.id}.title`)}</h3>
                  <p className="text-sm text-gray-600 mt-1">{t(`services.${selectedService.id}.description`)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl cursor-pointer hover:bg-primary-700">
                    <UploadCloud className="w-4 h-4" /> Upload Images
                    <input type="file" multiple accept="image/*" onChange={handleUploadImages} className="hidden" />
                  </label>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600"
                  >
                    Save Changes
                  </button>
                </div>
              </div>

              {isUploading && (
                <div className="text-sm text-gray-500 mb-4">Uploading images, please wait...</div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(selectedService.images || []).map((src, index) => (
                  <div key={index} className="relative overflow-hidden rounded-2xl border border-gray-200">
                    <img src={src} alt={`${selectedService.id} service ${index + 1}`} className="w-full h-40 object-cover" />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-primary-600 shadow-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-gray-600">Select a service to manage its images.</div>
          )}
        </section>
      </div>
    </div>
  );
}
