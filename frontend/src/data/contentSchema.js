// Default content schema for all pages
export const defaultPageContent = {
  homepage: {
    hero: {
      visible: true,
      title: 'Découvrez la Djerba Authentique',
      subtitle: 'Houches Traditionnels',
      description: 'Vivez l\'expérience unique de l\'architecture et hospitalité djerbiennes traditionnelles',
      images: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=900&fit=crop',
        'https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=1200&h=900&fit=crop',
      ],
      layout: 'hero',
    },
    services: {
      visible: true,
      title: 'Nos Services',
      subtitle: 'Découvrez ce que nous offrons',
    },
    architecture: {
      visible: true,
      title: 'Architecture des Houches Djerbiennes',
      description1: 'L\'architecture traditionnelle de Djerba représente des siècles de patrimoine culturel.',
      description2: 'Chaque houch présente des éléments de design authentiques transmis de génération en génération.',
      description3: 'Le design distinctif de la cour intérieure fournit un refroidissement naturel et une intimité.',
      image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=600&h=400&fit=crop',
    },
    rentals: {
      visible: true,
      title: 'Houces Djerbiens à Louer',
      subtitle: 'Découvrez notre collection',
    },
    testimonials: {
      visible: true,
      title: 'Avis des Clients',
      items: [
        {
          id: 1,
          name: 'Sarah Johnson',
          location: 'Londres, Royaume-Uni',
          rating: 5,
          text: 'Expérience incroyable à Djerba! La maison était magnifique et le service exceptionnel.',
          image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        },
        {
          id: 2,
          name: 'Ahmed Ben Ali',
          location: 'Tunis, Tunisie',
          rating: 5,
          text: 'Lieu parfait pour des vacances en famille. Propre, confortable et le personnel très helpful.',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        },
        {
          id: 3,
          name: 'Marie Dubois',
          location: 'Paris, France',
          rating: 5,
          text: 'Les travaux de construction ont été réalisés professionnellement et à temps. Hautement recommandé!',
          image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        },
      ],
      stats: {
        properties: '500+',
        guests: '10k+',
        rating: '4.9★',
        satisfaction: '98%',
      },
    },
    cta: {
      visible: true,
      title: 'Expérimentez la Vraie Djerba',
      description: 'Réservez votre houch djerbien traditionnel aujourd\'hui',
      buttonText: 'Commencer la Réservation',
      buttonLink: '/rentals',
    },
  },
  construction: {
    hero: {
      visible: true,
      title: 'Services de Construction',
      description: 'Services de construction et rénovation professionnels',
    },
  },
  cleaning: {
    hero: {
      visible: true,
      title: 'Services de Nettoyage',
      description: 'Gardez votre propriété impeccable',
    },
  },
  rentals: {
    hero: {
      visible: true,
      title: 'Houches Disponibles',
      description: 'Parcourez notre collection de maisons traditionnelles',
    },
  },
};
