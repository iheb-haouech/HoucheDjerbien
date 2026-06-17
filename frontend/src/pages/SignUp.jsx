import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import PasswordInput from '../components/PasswordInput';

export default function SignUp() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      setLoading(true);

      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        address: form.address,
        email: form.email,
        password: form.password,
      });

      navigate('/');
    } catch (err) {
      setError(err?.message || 'Impossible de créer le compte.');
    } finally {
      setLoading(false);
    }
  };

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const handleSocialRegister = (provider) => {
    window.location.href = `${API_BASE}/api/auth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-sand-50 px-4 py-16">
      <div className="mx-auto max-w-3xl rounded-[36px] border border-sand-200 bg-white p-10 shadow-xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-navy-900">
            Create your account
          </h1>
          <p className="mt-3 text-base text-navy-600">
            Join Djerba Houches to book rentals, request services, and manage your stay.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-3 md:grid-cols-2">
            <button type="button" onClick={() => handleSocialRegister('google')} className="rounded-2xl border border-sand-300 bg-white px-4 py-3 text-sm font-bold text-navy-800 shadow-sm hover:border-primary-300">
              Register with Google
            </button>
            <button type="button" onClick={() => handleSocialRegister('facebook')} className="rounded-2xl border border-sand-300 bg-white px-4 py-3 text-sm font-bold text-navy-800 shadow-sm hover:border-primary-300">
              Register with Facebook
            </button>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-navy-400">
            <span className="h-px flex-1 bg-sand-200" />
            or
            <span className="h-px flex-1 bg-sand-200" />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-navy-700">Nom</label>
              <div className="flex items-center gap-3 rounded-2xl border border-sand-300 bg-sand-50 px-4 py-3">
                <User className="h-4 w-4 text-navy-400" />
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Votre nom"
                  className="w-full bg-transparent text-navy-900 outline-none placeholder:text-navy-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-navy-700">Prénom</label>
              <div className="flex items-center gap-3 rounded-2xl border border-sand-300 bg-sand-50 px-4 py-3">
                <User className="h-4 w-4 text-navy-400" />
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Votre prénom"
                  className="w-full bg-transparent text-navy-900 outline-none placeholder:text-navy-400"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-navy-700">Numéro de téléphone</label>
            <div className="flex items-center gap-3 rounded-2xl border border-sand-300 bg-sand-50 px-4 py-3">
              <Phone className="h-4 w-4 text-navy-400" />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+216 XX XXX XXX"
                className="w-full bg-transparent text-navy-900 outline-none placeholder:text-navy-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-navy-700">Adresse</label>
            <div className="flex items-center gap-3 rounded-2xl border border-sand-300 bg-sand-50 px-4 py-3">
              <MapPin className="h-4 w-4 text-navy-400" />
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Votre adresse"
                className="w-full bg-transparent text-navy-900 outline-none placeholder:text-navy-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-navy-700">Email</label>
            <div className="flex items-center gap-3 rounded-2xl border border-sand-300 bg-sand-50 px-4 py-3">
              <Mail className="h-4 w-4 text-navy-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-transparent text-navy-900 outline-none placeholder:text-navy-400"
                required
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-navy-700">Mot de passe</label>
              <PasswordInput
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                autoComplete="new-password"
                className="rounded-2xl border border-sand-300 bg-sand-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-navy-700">Confirmer le mot de passe</label>
              <div className="flex items-center gap-3 rounded-2xl border border-sand-300 bg-sand-50 px-4 py-3">
                <Lock className="h-4 w-4 text-navy-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-navy-900 outline-none placeholder:text-navy-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="text-navy-500 hover:text-navy-700"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
