import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Container } from './ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LOCAL_ASSETS from '../assets/images';

export function Hero({ config = null, images = [], layout = 'slider' }) {
  const { t } = useTranslation();
  const cfgImages = images.length > 0 ? images : LOCAL_ASSETS.gallery;

  const heroItems = cfgImages;

  const [active, setActive] = useState(0);
  const autoplay = useRef(null);

  useEffect(() => {
    if (layout !== 'slider' || heroItems.length <= 1) return;
    autoplay.current = setInterval(() => setActive((p) => (p + 1) % heroItems.length), 6000);
    return () => clearInterval(autoplay.current);
  }, [heroItems.length, layout]);

  const goPrev = () => {
    clearInterval(autoplay.current);
    setActive((p) => (p - 1 + heroItems.length) % heroItems.length);
  };

  const goNext = () => {
    clearInterval(autoplay.current);
    setActive((p) => (p + 1) % heroItems.length);
  };

  const bg = heroItems[active];

  return (
    <section className="relative w-full min-h-screen flex items-center">
      {/* Background media */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div
          className="w-full h-full bg-cover bg-center transition-opacity duration-1000"
          style={{ backgroundImage: `url(${bg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/70 via-navy-900/32 to-black/18" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/54 via-transparent to-white/5" />
      </div>

      <Container className="z-10">
        <div className="mx-auto max-w-4xl py-28">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white backdrop-blur-md">
              <img src={LOCAL_ASSETS.logo} alt="Houches Djerbien" className="h-12 w-auto rounded bg-white/90 object-contain" loading="lazy" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/90">Houches Djerbien</p>
                <p className="text-sm text-white/80">L'ame de Djerba, l'exclusivite en plus</p>
              </div>
            </div>

            <h1 className="mt-8 font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-7xl">Houches Djerbien</h1>
            <p className="mt-3 text-2xl font-semibold text-gold-300">Authentic spaces. Refined comfort.</p>
            <p className="mt-4 text-white/85 max-w-2xl text-lg leading-8">{t('hero.description')}</p>

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
              <a href="/rentals" className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-primary-700 shadow-xl transition hover:bg-sand-50">
                Explore Rentals
              </a>
              <a href="/contact" className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/20">
                Contact Us
              </a>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-3xl border border-white/20 bg-white/10 p-5 text-white shadow-lg backdrop-blur-md">
                <div className="text-2xl font-semibold">Authentic</div>
                <div className="text-sm text-white/70">Restored houches</div>
              </div>
              <div className="rounded-3xl border border-white/20 bg-white/10 p-5 text-white shadow-lg backdrop-blur-md">
                <div className="text-2xl font-semibold">Serene</div>
                <div className="text-sm text-white/70">Courtyard stays</div>
              </div>
              <div className="rounded-3xl border border-white/20 bg-white/10 p-5 text-white shadow-lg backdrop-blur-md">
                <div className="text-2xl font-semibold">Premium</div>
                <div className="text-sm text-white/70">Local services</div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>

      {heroItems.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3" role="navigation" aria-label="Hero pagination">
          {heroItems.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-3 h-3 rounded-full transition ${i === active ? 'bg-white' : 'bg-white/40 hover:bg-white/70'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
