'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Award,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  X,
  ShieldCheck,
  CheckCircle2,
  Move,
} from 'lucide-react';
import { Certificate } from '@/lib/types';
import { getCertificates } from '@/lib/store';

export default function CertificateSection() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Lightbox & Zoom states
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const MIN_ZOOM = 0.75;
  const MAX_ZOOM = 3.25;
  const ZOOM_STEP = 0.25;

  useEffect(() => {
    let active = true;
    getCertificates()
      .then((data) => {
        if (active) {
          setCertificates(data || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setCertificates([]);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const updateScrollState = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);

    if (certificates.length > 0) {
      const maxScroll = Math.max(1, scrollWidth - clientWidth);
      const progress = Math.min(1, Math.max(0, scrollLeft / maxScroll));
      const idx = Math.round(progress * Math.max(0, certificates.length - 1));
      setActiveSlideIndex(idx);
    }
  }, [certificates.length]);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState, certificates.length]);

  const scrollSlider = (direction: 'left' | 'right') => {
    const el = sliderRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('[data-cert-card]')?.clientWidth || 260;
    const gap = 20;
    const scrollAmount = (cardWidth + gap) * (window.innerWidth >= 1024 ? 2 : 1);

    if (direction === 'right' && !canScrollRight) {
      el.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }

    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Gentle auto-slide when not hovering or viewing modal
  useEffect(() => {
    if (isPaused || selectedIndex !== null || certificates.length <= 1) return;
    const timer = setInterval(() => {
      const el = sliderRef.current;
      if (!el) return;
      const { scrollLeft, scrollWidth, clientWidth } = el;
      if (scrollLeft + clientWidth >= scrollWidth - 12) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const cardWidth = el.querySelector('[data-cert-card]')?.clientWidth || 240;
        el.scrollBy({ left: cardWidth + 20, behavior: 'smooth' });
      }
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, selectedIndex, certificates.length]);

  // Reset zoom & pan when switching certificates or opening modal
  const resetTransform = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
  }, []);

  const openModal = (index: number) => {
    setSelectedIndex(index);
    resetTransform();
  };

  const closeModal = useCallback(() => {
    setSelectedIndex(null);
    resetTransform();
  }, [resetTransform]);

  const navigateModal = useCallback(
    (dir: 'prev' | 'next') => {
      if (certificates.length === 0) return;
      setSelectedIndex((prev) => {
        if (prev === null) return null;
        const total = certificates.length;
        return dir === 'prev' ? (prev - 1 + total) % total : (prev + 1) % total;
      });
      resetTransform();
    },
    [resetTransform, certificates.length]
  );

  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(MAX_ZOOM, Number((z + ZOOM_STEP).toFixed(2))));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => {
      const next = Math.max(MIN_ZOOM, Number((z - ZOOM_STEP).toFixed(2)));
      if (next <= 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handleDoubleClick = () => {
    if (zoom > 1) {
      resetTransform();
    } else {
      setZoom(2);
    }
  };

  // Keyboard navigation & shortcuts in Lightbox
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') navigateModal('prev');
      if (e.key === 'ArrowRight') navigateModal('next');
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        handleZoomIn();
      }
      if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        handleZoomOut();
      }
      if (e.key === '0') {
        e.preventDefault();
        resetTransform();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedIndex, closeModal, navigateModal, handleZoomIn, handleZoomOut, resetTransform]);

  // Mouse / Touch Dragging when zoomed in
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (zoom <= 1) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || zoom <= 1) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
  };

  const handleWheelZoom = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const currentCertificate = selectedIndex !== null ? certificates[selectedIndex] : null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      {/* Decorative Soft Glow */}
      <div className="
        bg-gradient-to-b from-white via-slate-50/70 to-white
        rounded-3xl border border-slate-200/80 shadow-sm
        p-6 sm:p-10 relative overflow-hidden
      ">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-200">
            <Award className="w-3.5 h-3.5" /> Lisensi &amp; Kemitraan Resmi
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-wider uppercase mt-3">
            Certificate
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Bukti otorisasi distributor dan dealer resmi produk keamanan CCTV original bergaransi
            pabrikan. Klik pada sertifikat untuk memperbesar (<strong>Zoom In / Out</strong>).
          </p>
        </div>

        {loading ? (
          <div className="flex gap-5 overflow-hidden pb-4 pt-1 px-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="shrink-0 w-[210px] sm:w-[220px] lg:w-[205px] xl:w-[210px] animate-pulse space-y-3"
              >
                <div className="w-full aspect-[5/7] rounded-2xl bg-slate-200/70" />
                <div className="h-4 bg-slate-200/70 rounded w-1/2 mx-auto" />
                <div className="h-3 bg-slate-200/60 rounded w-2/3 mx-auto" />
              </div>
            ))}
          </div>
        ) : certificates.length === 0 ? (
          <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-slate-200 bg-white/70">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">
              Belum ada sertifikat lisensi yang ditampilkan
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Sertifikat kemitraan resmi akan muncul di sini setelah diunggah melalui dashboard admin.
            </p>
          </div>
        ) : (
          <>
            {/* Top Controls Bar (Navigation Arrows + Interactive Hint) */}
            <div className="flex items-center justify-between mb-5 px-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollSlider('left')}
                  aria-label="Geser ke kiri"
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                    canScrollLeft
                      ? 'bg-white border-slate-300 text-slate-700 hover:bg-teal-600 hover:text-white hover:border-teal-600 shadow-sm'
                      : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollSlider('right')}
                  aria-label="Geser ke kanan"
                  className="w-9 h-9 rounded-full border bg-white border-slate-300 text-slate-700 hover:bg-teal-600 hover:text-white hover:border-teal-600 shadow-sm flex items-center justify-center transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 ml-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  {certificates.length} Brand Ternama Terverifikasi
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50/80 px-3 py-1.5 rounded-full border border-teal-200/70">
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Klik gambar untuk Zoom</span>
              </div>
            </div>

            {/* Horizontal Sliding Track */}
            <div
              ref={sliderRef}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
              className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 pt-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {certificates.map((cert, index) => (
                <div
                  key={cert.id}
                  data-cert-card
                  onClick={() => openModal(index)}
                  className="group snap-start shrink-0 w-[210px] sm:w-[220px] lg:w-[205px] xl:w-[210px] cursor-pointer select-none flex flex-col items-center"
                >
                  {/* Certificate Frame */}
                  <div className="relative w-full aspect-[5/7] rounded-2xl bg-white p-2.5 border border-slate-200/90 shadow-sm group-hover:shadow-xl group-hover:border-teal-500/60 group-hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
                    {/* Certificate Image */}
                    <div className="w-full h-full rounded-xl overflow-hidden border border-slate-100 relative bg-slate-50">
                      <img
                        src={cert.image_url}
                        alt={`${cert.brand} - ${cert.title}`}
                        loading="lazy"
                        className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    </div>

                    {/* Hover Glass Overlay with Zoom Icon */}
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/35 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md text-slate-900 font-bold text-xs shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <ZoomIn className="w-4 h-4 text-teal-600" />
                        <span>Perbesar</span>
                      </div>
                    </div>

                    {/* Subtle Verified Corner Ribbon */}
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white/90 backdrop-blur shadow-sm border border-slate-200 flex items-center justify-center text-teal-600 opacity-90 group-hover:scale-110 transition-transform">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Brand Label Below */}
                  <div className="mt-3.5 text-center">
                    <h3 className="text-sm sm:text-base font-extrabold tracking-wider text-slate-800 group-hover:text-teal-700 transition-colors uppercase">
                      {cert.brand}
                    </h3>
                    {cert.tier && (
                      <p className="text-[11px] font-medium text-slate-500 mt-0.5">{cert.tier}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            {certificates.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                {certificates.map((cert, idx) => (
                  <button
                    key={cert.id}
                    type="button"
                    aria-label={`Lihat sertifikat ${cert.brand}`}
                    onClick={() => {
                      const el = sliderRef.current;
                      if (!el) return;
                      const cards = el.querySelectorAll('[data-cert-card]');
                      const target = cards[idx] as HTMLElement | undefined;
                      if (target) {
                        el.scrollTo({ left: target.offsetLeft - 8, behavior: 'smooth' });
                      }
                    }}
                    className={`h-2 rounded-full transition-all ${
                      activeSlideIndex === idx
                        ? 'w-7 bg-teal-600'
                        : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* =====================================================================
          INTERACTIVE ZOOM & SLIDE LIGHTBOX MODAL
         ===================================================================== */}
      {currentCertificate && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col justify-between animate-fadeIn"
          onClick={closeModal}
        >
          {/* Top Toolbar */}
          <div
            className="w-full px-4 sm:px-8 py-4 bg-slate-900/80 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Info */}
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-black tracking-wider uppercase">
                {currentCertificate.brand}
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-white leading-tight">
                  {currentCertificate.title}
                </h3>
                {(currentCertificate.issuer || currentCertificate.valid_period) && (
                  <p className="text-xs text-slate-400">
                    {[
                      currentCertificate.issuer,
                      currentCertificate.valid_period
                        ? `Berlaku ${currentCertificate.valid_period}`
                        : '',
                    ]
                      .filter(Boolean)
                      .join(' • ')}
                  </p>
                )}
              </div>
            </div>

            {/* Right Zoom Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-800/90 border border-slate-700 rounded-2xl p-1.5">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoom <= MIN_ZOOM}
                title="Perkecil (Zoom Out)"
                className="p-2 rounded-xl text-slate-200 hover:bg-slate-700 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              {/* Zoom Slider + Percentage */}
              <div className="flex items-center gap-2 px-2">
                <input
                  type="range"
                  min={MIN_ZOOM}
                  max={MAX_ZOOM}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => {
                    const next = parseFloat(e.target.value);
                    setZoom(next);
                    if (next <= 1) setPan({ x: 0, y: 0 });
                  }}
                  aria-label="Pengaturan tingkat zoom"
                  className="hidden sm:block w-24 accent-teal-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                />
                <span className="text-xs font-extrabold text-teal-300 min-w-[44px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
              </div>

              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoom >= MAX_ZOOM}
                title="Perbesar (Zoom In)"
                className="p-2 rounded-xl text-slate-200 hover:bg-slate-700 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-slate-700 mx-0.5" />

              <button
                type="button"
                onClick={() => setZoom((z) => (z < 2 ? 2 : 1))}
                title="Perbesar 200%"
                className="p-2 rounded-xl text-slate-200 hover:bg-slate-700 hover:text-white transition-colors hidden sm:flex"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={resetTransform}
                title="Reset Ukuran (100%)"
                className="p-2 rounded-xl text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-slate-700 mx-0.5" />

              <button
                type="button"
                onClick={closeModal}
                title="Tutup (Esc)"
                className="p-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center Interactive Viewport */}
          <div
            className="relative flex-1 w-full overflow-hidden flex items-center justify-center select-none"
            onWheel={handleWheelZoom}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Previous Certificate Button */}
            {certificates.length > 1 && (
              <button
                type="button"
                onClick={() => navigateModal('prev')}
                aria-label="Sertifikat sebelumnya"
                className="absolute left-3 sm:left-6 z-20 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-teal-500 text-white hover:text-slate-950 border border-white/15 shadow-xl flex items-center justify-center transition-all hover:scale-105"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Draggable & Zoomable Certificate Sheet */}
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onDoubleClick={handleDoubleClick}
              style={{
                transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                transition: isDragging ? 'none' : 'transform 200ms cubic-bezier(0.2, 0, 0, 1)',
                cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
              }}
              className="w-[82vw] max-w-[440px] sm:max-w-[480px] aspect-[5/7] rounded-2xl bg-white p-2 sm:p-3 shadow-2xl border border-white/20"
            >
              <div className="w-full h-full rounded-xl overflow-hidden bg-slate-50">
                <img
                  src={currentCertificate.image_url}
                  alt={`${currentCertificate.brand} - ${currentCertificate.title}`}
                  draggable={false}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Next Certificate Button */}
            {certificates.length > 1 && (
              <button
                type="button"
                onClick={() => navigateModal('next')}
                aria-label="Sertifikat berikutnya"
                className="absolute right-3 sm:right-6 z-20 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-teal-500 text-white hover:text-slate-950 border border-white/15 shadow-xl flex items-center justify-center transition-all hover:scale-105"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Floating Helper Pill */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-white/10 text-[11px] text-slate-300 flex items-center gap-2 pointer-events-none shadow-lg">
              <Move className="w-3.5 h-3.5 text-teal-400" />
              <span>
                {zoom > 1
                  ? 'Geser (drag) gambar untuk melihat bagian detail'
                  : 'Scroll mouse atau klik ganda (double-click) untuk Zoom'}
              </span>
            </div>
          </div>

          {/* Bottom Thumbnail Strip */}
          {certificates.length > 1 && (
            <div
              className="w-full px-4 py-3 bg-slate-900/85 border-t border-white/10 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-w-3xl mx-auto flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto py-1">
                {certificates.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSelectedIndex(idx);
                        resetTransform();
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all shrink-0 flex items-center gap-1.5 border ${
                        isSelected
                          ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md shadow-teal-500/20 scale-105'
                          : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <span>{item.brand}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
