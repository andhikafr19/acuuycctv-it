'use client';

import React from 'react';
import { Laptop, StoreSettings } from '@/lib/types';
import { createLaptopInquiryWaLink } from '@/lib/whatsapp';
import {
  Cpu,
  HardDrive,
  CheckCircle2,
  ShieldCheck,
  MessageSquare,
  Eye,
  Tag,
  Monitor,
  Battery,
} from 'lucide-react';

interface LaptopCardProps {
  laptop: Laptop;
  settings: StoreSettings;
  onOpenDetail: (laptop: Laptop) => void;
}

export default function LaptopCard({ laptop, settings, onOpenDetail }: LaptopCardProps) {
  const isAvailable = laptop.status === 'tersedia';
  const isBooked = laptop.status === 'booking';
  const isSold = laptop.status === 'terjual';

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
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Image & Badges */}
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
        <img
          src={
            laptop.images?.[0] ||
            'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80'
          }
          alt={laptop.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isAvailable && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide bg-emerald-500/90 text-white shadow-md backdrop-blur-sm">
              ✓ Ready Garut
            </span>
          )}
          {isBooked && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide bg-amber-500/90 text-white shadow-md backdrop-blur-sm">
              Sudah Dibooking
            </span>
          )}
          {isSold && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide bg-slate-800/90 text-white shadow-md backdrop-blur-sm">
              Unit Terjual
            </span>
          )}
        </div>

        {/* Condition Grade */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide bg-white/90 text-slate-800 border border-slate-200/80 shadow-sm backdrop-blur-sm">
            {laptop.condition_grade}
          </span>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-teal-700 font-bold uppercase tracking-wider mb-1">
            <Tag className="w-3 h-3" />
            <span>{laptop.brand}</span>
          </div>

          <h3 className="font-extrabold text-base text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">
            {laptop.title}
          </h3>

          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {laptop.description}
          </p>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 gap-2 mt-4 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-[11px] text-slate-700">
            <div className="flex items-center gap-1.5 truncate">
              <Cpu className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="truncate">{laptop.processor}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <HardDrive className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="truncate">
                {laptop.ram} / {laptop.storage}
              </span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Monitor className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="truncate">{laptop.display}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Battery className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="truncate">{laptop.battery_health}</span>
            </div>
          </div>

          {/* Warranty Badge */}
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{laptop.warranty_info}</span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            {normalPriceFormatted && (
              <span className="text-[11px] text-slate-400 line-through block">
                {normalPriceFormatted}
              </span>
            )}
            <span className="text-lg font-black text-teal-700">{priceFormatted}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onOpenDetail(laptop)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Lihat Spesifikasi Lengkap"
            >
              <Eye className="w-4 h-4" />
            </button>

            {isAvailable ? (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Tanya WA</span>
              </a>
            ) : (
              <span className="text-xs text-slate-400 font-semibold px-2">Tidak Tersedia</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
