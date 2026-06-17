import { useState } from 'react';
import { loadConsultationRequests, saveConsultationRequests } from '../data/storage';

const initialFormState = {
  name: '',
  phone: '',
  email: '',
  type: 'Construction',
  date: '',
  description: '',
};

export default function AppointmentForm() {
  const [form, setForm] = useState(initialFormState);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!form.name || !form.phone || !form.email || !form.date || !form.description) {
      setErrorMessage('Please fill out all fields to submit your consultation request.');
      return;
    }

    const existingRequests = loadConsultationRequests();
    const newRequest = {
      id: `request-${Date.now()}`,
      ...form,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    saveConsultationRequests([...existingRequests, newRequest]);
    setSuccessMessage('Consultation request submitted successfully! We will contact you soon.');
    setForm(initialFormState);
    window.dispatchEvent(new Event('consultation-request-submitted'));
  };

  return (
    <form className="bg-white p-6 rounded-2xl shadow-soft space-y-4 max-w-xl" onSubmit={handleSubmit}>
      <h3 className="text-xl font-semibold text-navy">Request Consultation</h3>

      {errorMessage && (
        <div className="rounded-2xl border border-primary-200 bg-primary-50 p-4 text-sm text-primary-700">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <input
          name="name"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="rounded-lg border px-3 py-2"
        />
        <input
          name="phone"
          type="tel"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="rounded-lg border px-3 py-2"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="rounded-lg border px-3 py-2"
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="rounded-lg border px-3 py-2"
        >
          <option>Construction</option>
          <option>Renovation</option>
        </select>
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="rounded-lg border px-3 py-2"
        />
      </div>

      <textarea
        name="description"
        placeholder="Project description"
        rows="4"
        value={form.description}
        onChange={handleChange}
        className="w-full rounded-lg border px-3 py-2"
      />

      <button
        type="submit"
        className="bg-bordeaux text-white rounded-lg px-4 py-2 font-semibold hover:bg-bordeaux-600 transition"
      >
        Submit Request
      </button>
    </form>
  );
}
