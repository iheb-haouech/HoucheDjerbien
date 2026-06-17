import { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export default function AdminSettings() {
  const { settings, updateSettings } = useSettings();
  const [savedMessage, setSavedMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateSettings({
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  setSavedMessage('Settings saved successfully.');
  setTimeout(() => setSavedMessage(''), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-navy mb-6">System Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Settings */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h3 className="text-lg font-semibold text-navy mb-4">General Settings</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-bordeaux focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-bordeaux focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-bordeaux focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-bordeaux focus:border-transparent"
              >
                <option value="TND">Tunisian Dinar (TND)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="USD">US Dollar (USD)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Business Settings */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h3 className="text-lg font-semibold text-navy mb-4">Business Settings</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate (%)</label>
              <input
                type="number"
                name="commissionRate"
                value={settings.commissionRate}
                onChange={handleChange}
                min="0"
                max="50"
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-bordeaux focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests per Property</label>
              <input
                type="number"
                name="maxGuests"
                value={settings.maxGuests}
                onChange={handleChange}
                min="1"
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-bordeaux focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cleaning Fee (TND)</label>
              <input
                type="number"
                name="cleaningFee"
                value={settings.cleaningFee}
                onChange={handleChange}
                min="0"
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-bordeaux focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Construction Markup (%)</label>
              <input
                type="number"
                name="constructionMarkup"
                value={settings.constructionMarkup}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-bordeaux focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h3 className="text-lg font-semibold text-navy mb-4">Notification Settings</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleChange}
                className="rounded border-gray-300 text-bordeaux focus:ring-bordeaux"
              />
              <span className="ml-2 text-sm text-gray-700">Email Notifications</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="smsNotifications"
                checked={settings.smsNotifications}
                onChange={handleChange}
                className="rounded border-gray-300 text-bordeaux focus:ring-bordeaux"
              />
              <span className="ml-2 text-sm text-gray-700">SMS Notifications</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="bookingConfirmation"
                checked={settings.bookingConfirmation}
                onChange={handleChange}
                className="rounded border-gray-300 text-bordeaux focus:ring-bordeaux"
              />
              <span className="ml-2 text-sm text-gray-700">Automatic Booking Confirmation</span>
            </label>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h3 className="text-lg font-semibold text-navy mb-4">Payment Settings</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Gateway</label>
              <select
                name="paymentGateway"
                value={settings.paymentGateway}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-bordeaux focus:border-transparent"
              >
                <option value="stripe">Stripe</option>
                <option value="paypal">PayPal</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                name="language"
                value={settings.language}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-bordeaux focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="ar">العربية</option>
              </select>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h3 className="text-lg font-semibold text-navy mb-4">System Settings</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleChange}
                className="rounded border-gray-300 text-bordeaux focus:ring-bordeaux"
              />
              <span className="ml-2 text-sm text-gray-700">Maintenance Mode</span>
            </label>
          </div>
        </div>
        {savedMessage && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {savedMessage}
          </div>
        )}
        <div className="sticky bottom-0 mt-8 border-t border-slate-200 bg-white/95 px-1 py-4 backdrop-blur">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}