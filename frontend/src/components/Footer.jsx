import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Container } from './ui';
import { MessageCircle, Camera, Bird, Mail, Phone, MapPin } from 'lucide-react';
import LOCAL_ASSETS from '../assets/images';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: t('footer.services.rentals'), href: '/rentals' },
      { name: t('footer.services.construction'), href: '/construction' },
      { name: t('footer.services.cleaning'), href: '/cleaning' },
    ],
    company: [
      { name: t('footer.company.about'), href: '/about' },
      { name: t('footer.company.contact'), href: '/contact' },
      { name: t('footer.company.careers'), href: '/careers' },
    ],
    support: [
      { name: t('footer.support.help'), href: '/help' },
      { name: t('footer.support.privacy'), href: '/privacy' },
      { name: t('footer.support.terms'), href: '/terms' },
    ],
  };

  return (
    <footer className="site-footer text-white">
      <Container className="relative z-10 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={LOCAL_ASSETS.logo}
                alt="Houches Djerbien"
                className="h-14 w-auto rounded-md bg-white object-contain p-1 shadow-xl shadow-black/20"
              />
              <div>
                <p className="font-display text-2xl font-bold text-white">Houches Djerbien</p>
                <p className="text-sm font-medium text-gold-300">L'ame de Djerba, l'exclusivite en plus</p>
              </div>
            </div>

            <p className="max-w-sm text-sm leading-relaxed text-white/80">
              {t('footer.description')}
            </p>

            <div className="space-y-3 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold-300" />
                Djerba, Tunisia
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold-300" />
                +216 XX XXX XXX
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold-300" />
                contact@djerba-houches.com
              </div>
            </div>
          </div>

          {[
            [t('footer.sections.services'), footerLinks.services],
            [t('footer.sections.company'), footerLinks.company],
            [t('footer.sections.support'), footerLinks.support],
          ].map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-4 text-lg font-semibold text-white">{title}</h3>
              <ul className="space-y-2 text-white/75">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="transition-colors duration-200 hover:text-gold-300">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-white/15 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-sm text-white/70">
              © {currentYear} Houches Djerbien. {t('footer.copyright')}
            </div>

            <div className="flex items-center gap-3">
              <a href="#" className="footer-social" aria-label="Facebook">
                <MessageCircle className="h-4 w-4" />
              </a>
              <a href="#" className="footer-social" aria-label="Instagram">
                <Camera className="h-4 w-4" />
              </a>
              <a href="#" className="footer-social" aria-label="Twitter">
                <Bird className="h-4 w-4" />
              </a>
              <a
                href={`https://wa.me/216XXXXXXXX?text=${encodeURIComponent('Hello, I want to contact you about a rental')}`}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 transition-colors duration-200 hover:bg-green-700"
                aria-label="WhatsApp"
              >
                <Phone className="h-4 w-4 text-white" />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
