import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    siteName: 'Djerba.Houches',
    contactEmail: 'admin@djerba-houches.com',
    phone: '+216 XX XXX XXX',
    currency: 'TND',
    language: 'en',
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: false,
    bookingConfirmation: true,
    paymentGateway: 'stripe',
    commissionRate: 10,
    maxGuests: 20,
    cleaningFee: 50,
    constructionMarkup: 15,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('djerba-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('djerba-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const formatCurrency = (amount) => {
    const currencySymbols = {
      TND: 'DT',
      EUR: '€',
      USD: '$'
    };

    return `${amount} ${currencySymbols[settings.currency] || settings.currency}`;
  };

  const value = {
    settings,
    updateSettings,
    formatCurrency,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}