import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

export default function PasswordInput({
  label,
  name,
  value,
  onChange,
  placeholder = '••••••••',
  required = false,
  autoComplete = 'current-password',
}) {
  const [show, setShow] = useState(false);

  return (
    <div>
      {label ? (
        <label className="mb-2 block text-sm font-medium text-slate-700">
          {label}
        </label>
      ) : null}

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-blue-400 focus-within:bg-white">
        <Lock className="h-4 w-4 text-slate-400" />
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
          required={required}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="text-slate-500 transition hover:text-slate-700"
          aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}