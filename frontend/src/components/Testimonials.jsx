import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Container, Section } from './ui';
import { Star, Quote, Edit3, Trash2, Plus } from 'lucide-react';
import { loadPageContent } from '../data/storage';

const defaultTestimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    location: 'London, UK',
    rating: 5,
    text: 'Amazing experience in Djerba! The house was beautiful and the service was exceptional. Will definitely come back.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 2,
    name: 'Ahmed Ben Ali',
    location: 'Tunis, Tunisia',
    rating: 5,
    text: 'Perfect place for a family vacation. Clean, comfortable, and the staff was very helpful throughout our stay.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 3,
    name: 'Marie Dubois',
    location: 'Paris, France',
    rating: 5,
    text: 'The construction work was done professionally and on time. Highly recommend their services for any renovation needs.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  },
];

const defaultStats = {
  properties: '500+',
  guests: '10k+',
  rating: '4.9★',
  satisfaction: '98%',
};

export function Testimonials({ adminMode = false, onEditTestimonials, onDeleteTestimonials }) {
  const { t } = useTranslation();
  const [testimonials, setTestimonials] = useState(() => {
    const content = loadPageContent();
    return content?.testimonials?.items || defaultTestimonials;
  });
  const [stats] = useState(() => {
    const content = loadPageContent();
    return content?.testimonials?.stats || defaultStats;
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const handleUpdate = () => {
      const content = loadPageContent();
      setTestimonials(content?.testimonials?.items || defaultTestimonials);
    };
    window.addEventListener('content-updated', handleUpdate);
    return () => window.removeEventListener('content-updated', handleUpdate);
  }, []);

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditForm({ ...testimonials[index] });
  };

  const handleSave = (index) => {
    if (onEditTestimonials) {
      onEditTestimonials(index, editForm);
    }
    setEditingIndex(null);
    setEditForm({});
  };

  const handleDelete = (index) => {
    if (onDeleteTestimonials) {
      onDeleteTestimonials(index);
    }
    setEditingIndex(null);
    setEditForm({});
  };

  return (
    <Section className="bg-sand-50">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-navy-900 mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-xl text-navy-600 max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="relative"
            >
              <Card className="h-full">
                <CardContent className="p-6 space-y-4">
                  <Quote className="w-8 h-8 text-bordeaux-500 opacity-50" />

                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  <p className="text-navy-700 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>

                  <div className="flex items-center space-x-3 pt-4 border-t border-sand-200">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-navy-900">{testimonial.name}</div>
                      <div className="text-sm text-navy-600">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {adminMode && (
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => handleEdit(index)}
                    className="p-1 bg-white rounded-full shadow hover:bg-gray-100"
                    title="Edit testimonial"
                  >
                    <Edit3 className="w-4 h-4 text-primary-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-1 bg-white rounded-full shadow hover:bg-red-100"
                    title="Delete testimonial"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {adminMode && editingIndex !== null && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Modifier le Témoignage</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Nom"
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="text"
                  value={editForm.location || ''}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  placeholder="Localisation"
                  className="w-full px-3 py-2 border rounded"
                />
                <textarea
                  value={editForm.text || ''}
                  onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
                  placeholder="Témoignage"
                  rows={3}
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="url"
                  value={editForm.image || ''}
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                  placeholder="URL de l'image"
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={editForm.rating || 5}
                  onChange={(e) => setEditForm({ ...editForm, rating: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleSave(editingIndex)}
                  className="flex-1 bg-primary-600 text-white py-2 rounded hover:bg-primary-700"
                >
                  Enregistrer
                </button>
                <button
                  onClick={() => setEditingIndex(null)}
                  className="flex-1 bg-gray-200 py-2 rounded hover:bg-gray-300"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="text-2xl font-bold text-navy-900">{stats.properties}</div>
            <div className="text-2xl font-bold text-navy-900">{stats.guests}</div>
            <div className="text-2xl font-bold text-navy-900">{stats.rating}</div>
            <div className="text-2xl font-bold text-navy-900">{stats.satisfaction}</div>
            <div className="text-sm text-navy-600">{t('testimonials.stats.properties')}</div>
            <div className="text-sm text-navy-600">{t('testimonials.stats.guests')}</div>
            <div className="text-sm text-navy-600">{t('testimonials.stats.rating')}</div>
            <div className="text-sm text-navy-600">{t('testimonials.stats.satisfaction')}</div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}