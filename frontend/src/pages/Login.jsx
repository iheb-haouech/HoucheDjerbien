import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';
import PasswordInput from '../components/PasswordInput';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await login(form.email, form.password);
      const role = data?.user?.role;

      if (role === 'ADMIN' || role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err?.message || 'Invalid email or password.');
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-sand-50 px-4 py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div className="hidden lg:block">
          <span className="inline-flex rounded-full border border-primary-200 bg-white px-4 py-2 text-sm font-semibold text-primary-700 shadow-sm">
            Welcome back
          </span>
          <h1 className="mt-6 max-w-xl text-5xl font-semibold tracking-tight text-navy-950">
            Sign in to access your heritage stays and services.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-navy-600">
            Manage bookings, explore services, and enjoy a refined, premium experience.
          </p>
        </div>

        <div className="mx-auto w-full max-w-md rounded-[32px] border border-sand-200 bg-white p-8 shadow-xl">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold tracking-tight text-navy-900">
              Login to Djerba Houches
            </h2>
            <p className="mt-2 text-sm text-navy-600">
              Use your email and password to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-navy-400">
              <span className="h-px flex-1 bg-sand-200" />
              Sign in
              <span className="h-px flex-1 bg-sand-200" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-navy-700">Email</label>
              <div className="flex items-center gap-3 rounded-2xl border border-sand-300 bg-sand-50 px-4 py-3 focus-within:border-primary-500 focus-within:bg-white">
                <Mail className="h-4 w-4 text-navy-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-navy-900 outline-none placeholder:text-navy-400"
                  required
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-navy-700">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary-700 transition hover:text-primary-800"
                >
                  Forgot password?
                </Link>
              </div>

              <PasswordInput
                name="password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="rounded-2xl border-sand-300 bg-sand-50"
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-300/20 transition hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100"
            >
              Login
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-navy-600">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-semibold text-primary-700 hover:text-primary-800">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
