import { useEffect, useState } from 'react';
import { ImagePlus, ArrowUp, ArrowDown, LayoutGrid, Play, Image, CheckCircle } from 'lucide-react';
import { loadHomepageConfig, saveHomepageConfig } from '../data/storage';

const layoutOptions = [
  { value: 'hero', label: 'Hero Banner', icon: Image },
  { value: 'slider', label: 'Image Slider', icon: Play },
  { value: 'grid', label: 'Image Grid', icon: LayoutGrid },
];

export default function AdminHomepage() {
  const [config, setConfig] = useState({ layout: 'hero', images: [] });
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setConfig(loadHomepageConfig());
  }, []);

  const handleUploadImages = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setIsUploading(true);
    const readers = files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers)
      .then((urls) => {
        setConfig((prev) => ({
          ...prev,
          images: [...prev.images, ...urls],
        }));
      })
      .catch(() => {
        alert('Unable to upload one or more images.');
      })
      .finally(() => setIsUploading(false));
  };

  const handleVideoChange = (e) => {
    const val = e.target.value;
    setConfig((prev) => ({ ...prev, heroVideo: val }));
  };

  const toggleUseVideo = () => {
    setConfig((prev) => ({ ...prev, useHeroVideo: !prev.useHeroVideo }));
  };

  const handleReorder = (index, direction) => {
    const nextImages = [...config.images];
    const target = index + direction;
    if (target < 0 || target >= nextImages.length) return;
    [nextImages[index], nextImages[target]] = [nextImages[target], nextImages[index]];
    setConfig((prev) => ({ ...prev, images: nextImages }));
  };

  const handleRemoveImage = (index) => {
    setConfig((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index),
    }));
  };

  const handleSave = () => {
    saveHomepageConfig(config);
    setSuccess('Homepage configuration saved successfully.');
    window.dispatchEvent(new Event('homepage-config-updated'));
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-navy">Homepage Management</h2>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Control the homepage hero visuals, image ordering and layout type for the landing page.
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-soft">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-navy">Layout</h3>
            <div className="space-y-3">
              {layoutOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setConfig((prev) => ({ ...prev, layout: option.value }))}
                    className={`w-full flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                      config.layout === option.value
                        ? 'border-primary-500 bg-primary-50 text-primary-800'
                        : 'border-gray-200 bg-white text-navy hover:border-primary-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-navy">Upload Images</h3>
            <label className="cursor-pointer inline-flex items-center gap-2 rounded-2xl bg-primary-600 px-4 py-3 text-white hover:bg-primary-700">
              <ImagePlus className="w-5 h-5" />
              Add images
              <input type="file" accept="image/*" multiple onChange={handleUploadImages} className="hidden" />
            </label>
            {isUploading && <p className="text-sm text-gray-500">Uploading images…</p>}
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-navy">Hero Video (optional)</h3>
            <input type="url" placeholder="https://example.com/video.mp4" value={config.heroVideo || ''} onChange={handleVideoChange} className="w-full rounded-lg border px-3 py-2" />
            <label className="inline-flex items-center gap-2 mt-2">
              <input type="checkbox" checked={!!config.useHeroVideo} onChange={toggleUseVideo} />
              Use video as hero background
            </label>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-navy">Image Count</h3>
            <p className="text-gray-600">{config.images.length} image(s) stored.</p>
          </div>
        </aside>

        <section className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-soft">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-navy">Homepage Preview</h3>
                <p className="text-gray-500">Reorder images, remove them, and choose how the page should display.</p>
              </div>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-2xl bg-primary-600 px-5 py-3 text-white hover:bg-primary-700"
              >
                <CheckCircle className="w-5 h-5" /> Save Changes
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {config.images.length === 0 && (
                <div className="col-span-full rounded-2xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
                  Add homepage images to preview them here.
                </div>
              )}

              {config.images.map((src, index) => (
                <div key={src + index} className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-sand-50">
                  <img src={src} alt={`Homepage image ${index + 1}`} className="h-48 w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-black/50 p-3 text-white transition-opacity opacity-0 group-hover:opacity-100">
                    <div className="text-sm">#{index + 1}</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReorder(index, -1)}
                        disabled={index === 0}
                        className="rounded-full bg-white/10 p-2 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReorder(index, 1)}
                        disabled={index === config.images.length - 1}
                        className="rounded-full bg-white/10 p-2 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="rounded-full bg-primary-500 p-2 hover:bg-primary-600"
                      >
                        <span className="sr-only">Remove image</span>
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-soft">
            <h4 className="text-xl font-semibold text-navy mb-4">Current Layout</h4>
            <div className="rounded-3xl border border-gray-200 bg-sand-50 p-4">
              <p className="text-sm text-gray-700 mb-4">Selected layout: <span className="font-semibold text-navy">{config.layout}</span></p>
              {config.layout === 'grid' ? (
                <div className="grid grid-cols-2 gap-3">
                  {config.images.slice(0, 4).map((src, index) => (
                    <div key={src + index} className="h-32 overflow-hidden rounded-2xl bg-gray-100">
                      <img src={src} alt={`Grid preview ${index + 1}`} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              ) : config.layout === 'slider' ? (
                <div className="h-64 overflow-hidden rounded-3xl bg-gray-100">
                  {config.useHeroVideo && config.heroVideo ? (
                    <video src={config.heroVideo} className="h-full w-full object-cover" muted loop playsInline />
                  ) : (
                    <img src={config.images[0] || ''} alt="Slider preview" className="h-full w-full object-cover" />
                  )}
                </div>
              ) : (
                <div className="h-64 overflow-hidden rounded-3xl bg-gray-100">
                  {config.useHeroVideo && config.heroVideo ? (
                    <video src={config.heroVideo} className="h-full w-full object-cover" muted loop playsInline />
                  ) : (
                    <img src={config.images[0] || ''} alt="Hero preview" className="h-full w-full object-cover" />
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
