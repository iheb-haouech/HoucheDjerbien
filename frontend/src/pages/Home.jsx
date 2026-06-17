import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import SearchBar from '../components/SearchBar';
import { Testimonials } from '../components/Testimonials';
import Footer from '../components/Footer';
import { Container, Section } from '../components/ui';
import {
  loadHomepageConfig,
  loadListings,
  loadServices,
  loadPageContent,
} from '../data/storage';
import LOCAL_ASSETS from '../assets/images';

const excursions = [
  { title: 'Djerba Island Heritage Tour', price: 75, image: LOCAL_ASSETS.hero2, description: 'Marchés, villages, ateliers de poterie et routes de l\'île.' },
  { title: 'Sunset Lagoon Escape', price: 95, image: LOCAL_ASSETS.hero1, description: 'Une promenade au golden hour avec des plats locaux et des arrêts au bord de mer.' },
  { title: 'Traditional Houch Cooking Class', price: 60, image: LOCAL_ASSETS.hero3, description: 'Cuisinez les classiques djerbien dans une cour chaleureuse.' },
];

export default function Home() {
  const { t } = useTranslation();
  const [homepageConfig] = useState(() => loadHomepageConfig());
  const [listings] = useState(() => loadListings());
  const [services] = useState(() => loadServices());
  const [pageContent, setPageContent] = useState(() => {
    const content = loadPageContent();
    return content?.homepage || {};
  });

  useEffect(() => {
    const handleUpdate = () => {
      const content = loadPageContent();
      setPageContent(content?.homepage || {});
    };

    window.addEventListener('content-updated', handleUpdate);
    return () => window.removeEventListener('content-updated', handleUpdate);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {pageContent.hero?.visible !== false && (
        <Hero config={homepageConfig} images={LOCAL_ASSETS.gallery} />
      )}

      <Section className="-mt-24 bg-transparent pb-10 pt-0" spacing="sm">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-20 rounded-[28px] border border-white/80 bg-white/95 p-5 shadow-[0_28px_80px_-28px_rgba(10,32,56,0.65)]"
          >
            <div className="mb-5 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-display text-3xl font-semibold text-navy-900">Trouvez votre séjour</h2>
                <p className="text-sm font-medium text-navy-500">Choisissez les dates, adultes et enfants pour votre escapade djerbienne.</p>
              </div>
            </div>
            <SearchBar />
          </motion.div>
        </Container>
      </Section>

      {/* Featured Rentals Section */}
      {pageContent.rentals?.visible !== false && (
        <Section className="bg-sand-50 py-20">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
                Nos meilleures locations
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4">
                {pageContent.rentals?.title || t('featuredRentals')}
              </h2>
              <p className="text-xl text-navy-600 max-w-3xl mx-auto">
                {pageContent.rentals?.subtitle || t('featuredRentalsDesc')}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {listings.slice(0, 8).map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Link to={`/rentals/${listing.id}`} className="group block">
                    <div className="relative overflow-hidden rounded-3xl border border-sand-200 bg-white shadow-xl hover:shadow-2xl transition-all duration-500">
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={listing.images?.[0] || LOCAL_ASSETS.hero1}
                            alt={listing.title}
                            className="w-full h-full object-cover transition-transform duration-700"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute top-4 right-4 bg-white/90 rounded-full px-3 py-1.5 flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            <span className="font-semibold text-navy-900">{listing.rating}</span>
                          </div>
                        </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-navy-900 mb-2 group-hover:text-primary-600 transition-colors">
                          {listing.title}
                        </h3>
                        <p className="text-navy-600 mb-4">{listing.location}</p>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-2xl font-bold text-primary-600">{listing.price} DT</span>
                            <span className="text-navy-500 text-sm">/nuit</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {listing.amenities?.slice(0, 3).map((amenity) => (
                            <span key={amenity} className="text-xs px-3 py-1.5 bg-sand-100 text-navy-700 rounded-full">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Services Section */}
      {pageContent.services?.visible !== false && (
        <Section className="py-20">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center px-4 py-2 bg-gold-100 text-gold-700 rounded-full text-sm font-medium mb-4">
                Nos services
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4">
                {pageContent.services?.title || t('services.title')}
              </h2>
              <p className="text-xl text-navy-600 max-w-3xl mx-auto">
                {pageContent.services?.subtitle || t('services.subtitle')}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -8 }}
                >
<div className="relative overflow-hidden rounded-3xl border border-sand-200 bg-white shadow-xl hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={service.images?.[0] || LOCAL_ASSETS.hero1}
                            alt={service.title}
                            className="w-full h-full object-cover transition-transform duration-700"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                          <h3 className="text-xl font-bold text-navy-900 mb-3">{service.title}</h3>
                          <p className="text-navy-600 flex-1 mb-4">{service.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {service.features?.slice(0, 2).map((feature) => (
                              <span key={feature} className="text-xs px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                </motion.div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section className="bg-white/90">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-10 text-center"
          >
            <h2 className="text-4xl font-bold text-navy-900">Excursions</h2>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-navy-600">
              Découvrez des moments uniques sur l'île pour compléter votre séjour.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {excursions.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-xl shadow-navy-900/5"
              >
                <img src={item.image} alt={item.title} className="h-52 w-full object-cover" />
                <div className="p-5">
                  <div className="mb-3 inline-flex rounded-full bg-gold-50 px-3 py-1 text-sm font-bold text-gold-700">
                    From {item.price} DT
                  </div>
                  <h3 className="text-2xl font-semibold text-navy-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-navy-600">{item.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </Container>
      </Section>

      {/* About/Architecture Section */}
      {pageContent.architecture?.visible !== false && (
        <Section className="bg-sand-50">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <h2 className="text-4xl font-bold text-navy-900">
                  {pageContent.architecture?.title || t('aboutHouch')}
                </h2>
                <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                  <p className="text-navy-700">{pageContent.architecture?.description1 || t('aboutDesc')}</p>
                  <p className="text-navy-700">{pageContent.architecture?.description2 || t('aboutDesc2')}</p>
                  <p className="text-navy-700">{pageContent.architecture?.description3 || t('aboutDesc3')}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <img
                  src={pageContent.architecture?.image || LOCAL_ASSETS.hero4}
                  alt="Traditional Djerba house interior with courtyard"
                  className="h-80 w-full rounded-2xl border border-white/70 object-cover shadow-xl shadow-navy-900/10"
                />
              </motion.div>
            </div>
          </Container>
        </Section>
      )}

      {/* Testimonials Section */}
      {pageContent.testimonials?.visible !== false && (
        <Testimonials />
      )}

      {/* CTA Section */}
      {pageContent.cta?.visible !== false && (
        <Section className="bg-gradient-to-r from-primary-700 via-primary-600 to-gold-500 text-white">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-4xl font-bold">
                  {pageContent.cta?.title || t('experienceAuthentic')}
                </h2>
                <p className="text-xl text-white/90 max-w-2xl mx-auto">
                  {pageContent.cta?.description || t('bookTraditional')}
                </p>
              </div>

              <motion.a
                href={pageContent.cta?.buttonLink || '/rentals'}
                className="inline-block bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {pageContent.cta?.buttonText || t('startBooking')}
              </motion.a>
            </motion.div>
          </Container>
        </Section>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}