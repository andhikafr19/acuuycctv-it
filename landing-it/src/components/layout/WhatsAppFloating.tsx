'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { StoreSettings } from '@/lib/types';
import { getStoreSettings } from '@/lib/store';
import { formatWaPhone } from '@/lib/whatsapp';
import { BUSINESS } from '@/lib/business';

export default function WhatsAppFloating() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  useEffect(() => {
    getStoreSettings().then(setSettings);
    const timer = setTimeout(() => setTooltipOpen(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const waNumber = settings ? formatWaPhone(settings.whatsapp_number) : BUSINESS.phone;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 select-none">
      {tooltipOpen && (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-3 max-w-xs text-xs text-slate-700 animate-in fade-in slide-in-from-bottom-2 relative">
          <button
            onClick={() => setTooltipOpen(false)}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
            aria-label="Close message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5 text-teal-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            CS Acuuy CCTV Garut
          </div>
          <p className="text-slate-600">
            Halo! Butuh pemasangan CCTV, servis laptop express, atau tanya stok unit laptop? Chat kami
            sekarang!
          </p>
        </div>
      )}

      <a
        href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
          'Halo Admin Acuuy CCTV, saya ingin berkonsultasi seputar layanan di Garut'
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-full shadow-lg shadow-emerald-700/30 hover:shadow-xl hover:scale-105 active:scale-95 transition-all group"
      >
        <MessageCircle className="w-6 h-6 fill-white/20 group-hover:rotate-12 transition-transform" />
        <span className="text-sm font-semibold hidden sm:inline">Konsultasi WhatsApp</span>
      </a>
    </div>
  );
}
