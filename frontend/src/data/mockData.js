import LOCAL_ASSETS from '../assets/images';

export const listings = [
  {
    id: '1',
    title: 'Houch Jerbi Bleu',
    location: 'Houmt Souk, Djerba',
    price: 120,
    priceByMonth: {
      'jan': 100, 'feb': 100, 'mar': 110, 'apr': 120,
      'may': 140, 'jun': 180, 'jul': 200, 'aug': 200,
      'sep': 150, 'oct': 130, 'nov': 120, 'dec': 110,
    },
    rating: 4.8,
    images: [
      LOCAL_ASSETS.hero1,
      LOCAL_ASSETS.hero2,
      LOCAL_ASSETS.hero3
    ],
    amenities: ['WiFi', 'Air Conditioning', 'Pool', 'Kitchen', 'Sea View'],
    description: 'Authentic Djerbian stone house with vaulted ceilings and courtyard.',
    host: { name: 'Amina', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
    coordinates: { lat: 33.876, lng: 10.858 },
    capacity: { adults: 6, children: 4 },
  },
  {
    id: '2',
    title: 'Maison Blanc Houch',
    location: 'Midoun, Djerba',
    price: 95,
    priceByMonth: {
      'jan': 80, 'feb': 80, 'mar': 85, 'apr': 95,
      'may': 110, 'jun': 130, 'jul': 150, 'aug': 150,
      'sep': 120, 'oct': 100, 'nov': 95, 'dec': 85,
    },
    rating: 4.6,
    images: [
      LOCAL_ASSETS.hero2,
      LOCAL_ASSETS.hero4,
      LOCAL_ASSETS.hero1
    ],
    amenities: ['Breakfast', 'Parking', 'Garden', 'Pet friendly'],
    description: 'Cozy traditional structure close to beaches and craft markets.',
    host: { name: 'Fathi', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
    coordinates: { lat: 33.835, lng: 10.902 },
    capacity: { adults: 4, children: 2 },
  },
  {
    id: '3',
    title: 'Villa Sidi Beshr',
    location: 'Menzel Temime, Djerba',
    price: 170,
    priceByMonth: {
      'jan': 150, 'feb': 150, 'mar': 160, 'apr': 170,
      'may': 190, 'jun': 250, 'jul': 300, 'aug': 300,
      'sep': 220, 'oct': 190, 'nov': 170, 'dec': 160,
    },
    rating: 4.9,
    images: [
      LOCAL_ASSETS.hero4,
      LOCAL_ASSETS.hero3,
      LOCAL_ASSETS.hero1
    ],
    amenities: ['Private Pool', 'Cleaner', 'Garden', 'Barbecue'],
    description: 'Luxury traditional villa with private pool and rooftop terrace.',
    host: { name: 'Youssef', avatar: 'https://randomuser.me/api/portraits/men/12.jpg' },
    coordinates: { lat: 33.821, lng: 10.939 },
    capacity: { adults: 8, children: 6 },
  },
];

export const services = [
  {
    id: 'rentals',
    title: 'Location Houches Djerbiens',
    description: 'Houches traditionnels authentiques pour votre séjour à Djerba',
    features: ['Architecture traditionnelle', 'Hôtel de charme', 'Expérience culturelle'],
    images: [
      LOCAL_ASSETS.hero1,
      LOCAL_ASSETS.hero2,
      LOCAL_ASSETS.hero4
    ],
  },
  {
    id: 'construction',
    title: 'Construction Houche Djerbiénne',
    description: 'Construction et rénovation de maisons traditionnelles à Djerba',
    features: ['Techniques traditionnelles', 'Matériaux locaux', 'Artisans experts'],
    images: [
      LOCAL_ASSETS.hero3,
      LOCAL_ASSETS.hero4,
      LOCAL_ASSETS.hero2,
      LOCAL_ASSETS.hero1,
    ],
  },
  {
    id: 'events',
    title: 'Organisation d\'Événements Personnalisée',
    description: 'Organisation d\'événements privés et spéciaux en Tunisie',
    features: ['Mariages traditionnels', 'Événements culturels', 'Décoration personnalisée'],
    images: [
      LOCAL_ASSETS.hero2,
      LOCAL_ASSETS.hero3,
      LOCAL_ASSETS.hero1,
    ],
  },
  {
    id: 'cleaning',
    title: 'Service de Nettoyage Professionnel',
    description: 'Nettoyage complet pour maisons et locations touristiques',
    features: ['Nettoyage en profondeur', 'Produits écologiques', 'Expertise locale'],
    images: [
      LOCAL_ASSETS.hero4,
      LOCAL_ASSETS.hero3,
      LOCAL_ASSETS.hero2,
      LOCAL_ASSETS.hero1,
    ],
  },
];

export const bookings = [
  { id: 'b1', listingId: '1', guest: 'Meryem', nights: 4, status: 'confirmed', total: 480 },
  { id: 'b2', listingId: '2', guest: 'Omar', nights: 3, status: 'pending', total: 285 },
  { id: 'b3', listingId: '3', guest: 'Sara', nights: 6, status: 'cancelled', total: 1020 },
];

export const constructionRequests = [
  { id: 'c1', name: 'Hassen', phone: '+216 98 765 432', email: 'hassen@mail.com', type: 'renovation', date: '2026-04-10', description: 'Restore ancient houch roof and tile.' },
  { id: 'c2', name: 'Leila', phone: '+216 95 123 456', email: 'leila@mail.com', type: 'construction', date: '2026-05-04', description: 'New courtyard design for family stays.' },
];

export const cleaningRequests = [
  { id: 'cl1', client: 'Tunisian Rental Co.', type: 'B2B', frequency: 'weekly', status: 'assigned', team: 'North Djerba' },
  { id: 'cl2', client: 'Walid', type: 'B2C', frequency: 'one-time', status: 'pending', team: 'unassigned' },
];

export const users = [
  { id: 'u1', name: 'Mayssa', email: 'mayssa@mail.com', password: 'pass123', role: 'host' },
  { id: 'u2', name: 'Ahmed', email: 'ahmed@mail.com', password: 'pass123', role: 'guest' },
  { id: 'admin', name: 'Admin', email: 'admin@djerba.com', password: 'admin123', role: 'admin' },
];
