'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/layout/Logo';
import { Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const redirectParam = searchParams.get('redirect');
        const target =
          redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//')
            ? redirectParam
            : '/';
        router.replace(target);
        router.refresh();
      } else {
        setError(data.error || 'Email atau kata sandi tidak sesuai.');
      }
    } catch {
      setError('Gagal menghubungi server autentikasi. Periksa koneksi Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden flex items-center justify-center p-4 sm:p-6">
      {/* Subtle decorative background accents */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2.5">
          <div className="flex justify-center">
            <Logo variant="dark" showTagline />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight pt-1">
            Login Dashboard Admin
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Masuk untuk mengelola operasional pesanan, paket CCTV, stok laptop, dan notifikasi WhatsApp di Garut.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4" autoComplete="on">
          <div>
            <label htmlFor="admin-email" className="block text-xs font-bold text-slate-700 mb-1.5">
              Email Administrator
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="username"
                required
                placeholder="admin@acuuycctv.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 pl-10 pr-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-xs font-bold text-slate-700 mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="admin-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="Masukkan kata sandi admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 pl-10 pr-10 py-2.5 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none transition"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-lg shadow-teal-700/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Memverifikasi Kredensial...' : 'Masuk ke Dashboard'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Dilindungi enkripsi sesi HttpOnly & proteksi brute-force</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
          Memuat halaman autentikasi...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
