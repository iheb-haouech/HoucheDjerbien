import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { loadServices } from '../data/storage';
import { createCleaningRequest } from '../lib/services';

export default function Cleaning() {
  const [service, setService] = useState(null);
  const [form, setForm] = useState({
    clientName: '',
    email: '',
    phone: '',
    frequency: 'Ponctuel',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setService(loadServices().find((item) => item.id === 'cleaning'));
  }, []);

  const cleaningImages = (service?.images || []).map((src, index) => ({
    src,
    alt: `Cleaning service image ${index + 1}`,
    title:
      [
        'Nettoyage en profondeur',
        'Entretien cour',
        'Nettoyage cuisine',
        'Nettoyage salle de bain',
        'Nettoyage extérieur',
        'Après construction',
      ][index] || 'Services de nettoyage',
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await createCleaningRequest({
        clientName: form.clientName,
        phone: form.phone,
        requestType: 'Deep Cleaning',
        frequency: form.frequency,
        date: new Date().toISOString(),
        notes: `Email: ${form.email}\nDétails: ${form.notes}`,
      });

      setSuccessMessage('Demande de nettoyage envoyée avec succès! Nous vous contacterons bientôt.');
      setForm({
        clientName: '',
        email: '',
        phone: '',
        frequency: 'Ponctuel',
        notes: '',
      });
    } catch (err) {
      setErrorMessage(err.message || 'Échec de l\'envoi de la demande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto px-4 py-12 bg-sand-50"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.section
        className="bg-white rounded-[32px] shadow-xl border border-sand-200 p-10 mb-10"
        variants={itemVariants}
      >
        <motion.h1
          className="text-4xl font-bold text-navy-900"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Service de Nettoyage Professionnel
        </motion.h1>

        <motion.p
          className="mt-4 text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Nettoyage complet pour maisons et locations touristiques à Djerba.
        </motion.p>

        <motion.ul
          className="mt-4 list-disc list-inside text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <li>Nettoyage en profondeur et désinfection</li>
          <li>Produits écologiques et respectueux de l\'environnement</li>
          <li>Expertise locale et connaissance des houchs djerbiens</li>
          <li>Service ponctuel ou régulier selon vos besoins</li>
        </motion.ul>
      </motion.section>

      <motion.section className="mb-8" variants={itemVariants}>
        <motion.h2
          className="text-3xl font-semibold text-navy-900 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Nos Services de Nettoyage
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {cleaningImages.map((image, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-soft hover:shadow-glow transition-shadow duration-300"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <h3 className="text-white font-semibold p-4">{image.title}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        className="bg-white rounded-2xl shadow-soft p-8"
        variants={itemVariants}
      >
        <motion.h2
          className="text-2xl font-semibold text-gray-900 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Demander un Service de Nettoyage
        </motion.h2>

        <motion.form
          className="grid gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
        >
          {successMessage && (
            <p className="text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              {successMessage}
            </p>
          )}

          {errorMessage && (
            <p className="text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {errorMessage}
            </p>
          )}

          <input
            name="clientName"
            type="text"
            placeholder="Nom complet"
            value={form.clientName}
            onChange={handleChange}
            className="rounded-2xl border border-sand-300 bg-sand-50 px-4 py-3 text-navy-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="rounded-2xl border border-sand-300 bg-sand-50 px-4 py-3 text-navy-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
            required
          />

          <input
            name="phone"
            type="tel"
            placeholder="Téléphone"
            value={form.phone}
            onChange={handleChange}
            className="rounded-2xl border border-sand-300 bg-sand-50 px-4 py-3 text-navy-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
            required
          />

          <select
            name="frequency"
            value={form.frequency}
            onChange={handleChange}
            className="rounded-2xl border border-sand-300 bg-sand-50 px-4 py-3 text-navy-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
          >
            <option value="Ponctuel">Ponctuel</option>
            <option value="Hebdomadaire">Hebdomadaire</option>
            <option value="Bi-hebdomadaire">Bi-hebdomadaire</option>
            <option value="Mensuel">Mensuel</option>
          </select>

          <textarea
            name="notes"
            placeholder="Détails du nettoyage requis"
            rows="3"
            value={form.notes}
            onChange={handleChange}
            className="rounded-2xl border border-sand-300 bg-sand-50 px-4 py-3 text-navy-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
            required
          />

          <motion.button
            type="submit"
            disabled={loading}
            className="bg-primary-600 text-white rounded-lg px-6 py-3 font-semibold hover:bg-primary-700 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? 'Envoi en cours...' : 'Envoyer la Demande'}
          </motion.button>
        </motion.form>
      </motion.section>
    </motion.div>
  );
}