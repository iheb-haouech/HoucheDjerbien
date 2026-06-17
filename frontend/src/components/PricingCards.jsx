import { useSettings } from '../contexts/SettingsContext';

export default function PricingCards() {
  const { formatCurrency } = useSettings();

  const plans = [
    { title: 'Basic', price: 65, details: ['Standard cleaning', '1 bathroom', '1 bedroom'] },
    { title: 'Standard', price: 95, details: ['Deep clean', '2 bathrooms', 'Kitchen & living'] },
    { title: 'Premium', price: 130, details: ['Full service', 'Pool, garden, walls', 'Priority scheduling'] },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-4 mt-4">
      {plans.map((plan) => (
        <article key={plan.title} className="rounded-2xl border border-sand p-5 shadow-soft bg-white hover:-translate-y-1 transition-transform">
          <h4 className="text-xl font-semibold mb-2 text-navy">{plan.title}</h4>
          <p className="text-bordeaux text-2xl font-bold mb-3">{formatCurrency(plan.price)}</p>
          <ul className="space-y-1 mb-4 text-gray-600">
            {plan.details.map((item) => (<li key={item}>• {item}</li>))}
          </ul>
          <button className="bg-bordeaux text-white rounded-lg px-4 py-2 font-semibold hover:bg-bordeaux-600 transition-colors">Choose Plan</button>
        </article>
      ))}
    </div>
  );
}
