'use client';

import React from 'react';
import { Laptop, StoreSettings } from '@/lib/types';
import { createLaptopInquiryWaLink } from '@/lib/whatsapp';
import {
  X,
  Cpu,
  HardDrive,
  Monitor,
  Battery,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface LaptopDetailModalProps {
  laptop: Laptop | null;
  settings: StoreSettings;
  onClose: () => void;
}

export default function LaptopDetailModal({
  laptop,
  settings,
  onClose,
}: LaptopDetailModalProps) {
  if (!laptop) return null;

  const priceFormatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(laptop.discount_price || laptop.price);

  const normalPriceFormatted = laptop.discount_price
    ? new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(laptop.price)
    : null;

  const waLink = createLaptopInquiryWaLink(laptop, settings);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image */}
          <div className="relative bg-slate-100 aspect-square md:aspect-auto">
            <img
              src={
                laptop.images?.[0] ||
                'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80'
              }
              alt={laptop.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white backdrop-blur-sm">
                {laptop.condition_grade}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                {laptop.brand} • {laptop.model}
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">{laptop.title}</h2>

              <div className="mt-2.5">
                {normalPriceFormatted && (
                  <span className="text-xs text-slate-400 line-through mr-2">
                    {normalPriceFormatted}
                  </span>
                )}
                <span className="text-2xl font-black text-teal-700">{priceFormatted}</span>
              </div>

              <div className="mt-4 space-y-2 border-t border-b border-slate-100 py-3 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="font-medium text-slate-500 w-20">Prosesor:</span>
                  <span className="font-bold text-slate-900">{laptop.processor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="font-medium text-slate-500 w-20">RAM & SSD:</span>
                  <span className="font-bold text-slate-900">
                    {laptop.ram} / {laptop.storage}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="font-medium text-slate-500 w-20">Layar / GPU:</span>
                  <span className="font-bold text-slate-900">
                    {laptop.display} ({laptop.graphics})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Battery className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="font-medium text-slate-500 w-20">Baterai:</span>
                  <span className="font-bold text-slate-900">{laptop.battery_health}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">{laptop.description}</p>

              {/* Highlight Features */}
              {laptop.features && laptop.features.length > 0 && (
                <div className="mt-3">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Keunggulan Unit Ini:
                  </span>
                  <div className="space-y-1">
                    {laptop.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warranty */}
              <div className="mt-4 p-2.5 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center gap-2 text-xs text-teal-900 font-semibold">
                <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
                <span>{laptop.warranty_info}</span>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-5 mt-5">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 active:scale-95 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Beli / Booking Unit Ini via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
