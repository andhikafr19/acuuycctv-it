'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/layout/Logo';
import { Lock, Mail, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@acuuycctv.com');
  const [password, setPassword] = useState('admincctvgarut');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Demo admin check (matches .env.local.example)
    if (
      (email === 'admin@acuuycctv.com' && password === 'admincctvgarut') ||
      (email === 'admin' && password === 'admin')
    ) {
      localStorage.setItem('acuuy_admin_session', 'logged_in');
      router.push('/');
    } else {
      setError('Email atau kata sandi tidak sesuai. Gunakan akun demo di bawah.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo showTagline />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Login Dashboard Admin</h2>
          <p className="text-xs text-slate-500">
            Masuk untuk mengelola operasional pesanan, stok laptop, dan notifikasi WhatsApp di Garut.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold animate-in fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Administrator</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Kata Sandi</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2.5 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-lg shadow-teal-700/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/60 text-xs text-teal-900 space-y-1">
          <span className="font-bold flex items-center gap-1.5 text-teal-800">
            <Sparkles className="w-3.5 h-3.5" /> Akun Demo Siap Pakai:
          </span>
          <p className="text-[11px] text-teal-800">
            Email: <code className="font-mono font-bold">admin@acuuycctv.com</code>
            <br />
            Password: <code className="font-mono font-bold">admincctvgarut</code>
          </p>
        </div>
      </div>
    </div>
  );
}
