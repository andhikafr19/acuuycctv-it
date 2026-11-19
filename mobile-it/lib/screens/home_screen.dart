import 'dart:async';
import 'package:flutter/material.dart';
import '../data/default_data.dart';
import '../models/store_models.dart';
import '../services/supabase_store_service.dart';
import '../theme/app_theme.dart';
import '../utils/whatsapp_helper.dart';
import '../widgets/booking_form_sheet.dart';
import '../widgets/cctv_poster_card.dart';
import '../widgets/certificate_zoom_modal.dart';

class HomeScreen extends StatefulWidget {
  final SupabaseStoreService storeService;
  final void Function(int tabIndex) onNavigateToTab;

  const HomeScreen({
    super.key,
    required this.storeService,
    required this.onNavigateToTab,
  });

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final ScrollController _certScrollController = ScrollController();
  Timer? _certAutoSlideTimer;
  String _portfolioCategory = 'semua';

  @override
  void initState() {
    super.initState();
    // Auto-slide Certificate Carousel every 4.5s (PRD Bagian 13.3)
    _certAutoSlideTimer = Timer.periodic(const Duration(milliseconds: 4500), (_) {
      if (!_certScrollController.hasClients) return;
      final maxScroll = _certScrollController.position.maxScrollExtent;
      final current = _certScrollController.offset;
      final next = (current + 269) >= maxScroll ? 0.0 : current + 269;
      _certScrollController.animateTo(
        next,
        duration: const Duration(milliseconds: 600),
        curve: Curves.easeOutCubic,
      );
    });
  }

  @override
  void dispose() {
    _certAutoSlideTimer?.cancel();
    _certScrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final store = widget.storeService;
    final popularPackages = store.popularThreePackages;
    final certificates = store.certificates;
    final portfolios = _portfolioCategory == 'semua'
        ? store.portfolios
        : store.portfolios.where((p) => p.category == _portfolioCategory).toList();

    return RefreshIndicator(
      onRefresh: store.refreshFromSupabase,
      color: AcuuyColors.teal600,
      child: ListView(
        padding: const EdgeInsets.only(bottom: 92),
        children: [
          // 1. HERO BANNER SECTION
          _buildHeroBanner(context, store),

          // 2. QUICK PILL SHORTCUTS
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Row(
              children: [
                _QuickNavCard(
                  icon: Icons.videocam_rounded,
                  title: 'Paket CCTV',
                  subtitle: '${store.cctvPackages.length} Paket',
                  color: AcuuyColors.teal600,
                  onTap: () => widget.onNavigateToTab(1),
                ),
                const SizedBox(width: 10),
                _QuickNavCard(
                  icon: Icons.laptop_chromebook_rounded,
                  title: 'Laptop Bekas',
                  subtitle: 'Grade A Garansi',
                  color: const Color(0xFF0284C7),
                  onTap: () => widget.onNavigateToTab(2),
                ),
                const SizedBox(width: 10),
                _QuickNavCard(
                  icon: Icons.calculate_rounded,
                  title: 'Simulasi CCTV',
                  subtitle: ' & Servis IT',
                  color: AcuuyColors.amber600,
                  onTap: () => widget.onNavigateToTab(3),
                ),
              ],
            ),
          ),

          // 3. SECTION PAKET POPULER CCTV (PRD Bagian 14 — 3 Kartu Simetris & Rekomendasi Teknisi di Tengah)
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 22, 16, 8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AcuuyColors.teal50,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AcuuyColors.teal200),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        Icons.local_fire_department_rounded,
                        size: 14,
                        color: AcuuyColors.teal700,
                      ),
                      SizedBox(width: 4),
                      Text(
                        'PAKET POPULER CCTV GARUT',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w900,
                          color: AcuuyColors.teal800,
                          letterSpacing: 0.6,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Paket CCTV Terlaris Pilihan Pelanggan',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    color: AcuuyColors.navy900,
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Harga transparan sudah termasuk kamera resmi, DVR/NVR, harddisk, kabel, jasa pasang rapi & setting ke HP.',
                  style: TextStyle(fontSize: 12.5, color: AcuuyColors.slate600),
                ),
                const SizedBox(height: 14),
                ...List.generate(popularPackages.length, (idx) {
                  final pkg = popularPackages[idx];
                  // Posisi tengah (indeks 1) otomatis mendapat sorotan Rekomendasi Teknisi (PRD 14.3)
                  final isMiddleHighlight =
                      popularPackages.length >= 3 ? idx == 1 : pkg.popular;
                  return CctvPosterCard(
                    pkg: pkg,
                    isHighlighted: isMiddleHighlight,
                    isFavorite: store.isPackageFavorite(pkg.id),
                    onToggleFavorite: () => store.toggleFavoritePackage(pkg.id),
                    onAskWhatsApp: () => WhatsAppHelper.openCctvPackageInquiry(
                      pkg: pkg,
                      settings: store.settings,
                    ),
                    onBookPackage: () => BookingFormSheet.show(
                      context,
                      storeService: store,
                      initialServiceType: 'cctv',
                      presetPackage: pkg,
                    ),
                  );
                }),
                Center(
                  child: OutlinedButton.icon(
                    onPressed: () => widget.onNavigateToTab(1),
                    icon: const Icon(Icons.grid_view_rounded, size: 17),
                    label: Text(
                      'Pilih Paket Lainnya (${store.cctvPackages.length} Paket Lengkap)',
                    ),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AcuuyColors.teal700,
                      side: const BorderSide(color: AcuuyColors.teal600, width: 1.6),
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 13),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                      textStyle: const TextStyle(
                        fontWeight: FontWeight.w900,
                        fontSize: 13,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          // 4. SECTION EDUKASI: PERBEDAAN CCTV ANALOG VS IP CAMERA (PRD Bagian 12)
          _buildAnalogVsIpSection(context, store),

          // 5. SECTION CERTIFICATE SHOWCASE (PRD Bagian 13 — 6 Brand Resmi + Pinch to Zoom)
          _buildCertificateSection(context, certificates),

          // 6. SECTION PORTOFOLIO PEMASANGAN DI GARUT (FR-M07)
          _buildPortfolioSection(context, portfolios),
        ],
      ),
    );
  }

  Widget _buildHeroBanner(BuildContext context, SupabaseStoreService store) {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 12, 16, 0),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [AcuuyColors.navy950, AcuuyColors.navy800, AcuuyColors.teal900],
        ),
        borderRadius: BorderRadius.circular(26),
        boxShadow: [
          BoxShadow(
            color: AcuuyColors.navy900.withValues(alpha: 0.25),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AcuuyColors.teal500.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AcuuyColors.teal400.withValues(alpha: 0.5)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 7,
                      height: 7,
                      decoration: BoxDecoration(
                        color: store.isOnlineSync
                            ? AcuuyColors.emerald500
                            : AcuuyColors.amber400,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      store.isOnlineSync
                          ? 'Katalog Sinkron Live • Garut'
                          : 'Katalog Tersimpan • Siap Offline',
                      style: const TextStyle(
                        color: AcuuyColors.teal200,
                        fontSize: 10.5,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ],
                ),
              ),
              const Spacer(),
              const Icon(Icons.verified_user_rounded, color: AcuuyColors.amber400, size: 18),
              const SizedBox(width: 4),
              const Text(
                'Bergaransi Resmi',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          const Text(
            'Solusi Pasang CCTV, Servis Komputer & Laptop Bekas Mulus di Garut',
            style: TextStyle(
              color: Colors.white,
              fontSize: 21,
              fontWeight: FontWeight.w900,
              height: 1.22,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            store.settings.tagline,
            style: const TextStyle(
              color: AcuuyColors.slate200,
              fontSize: 12.5,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => WhatsAppHelper.openDirectConsultation(
                    settings: store.settings,
                    topic: 'Survei & Pemasangan CCTV Gratis di Garut',
                  ),
                  icon: const Icon(Icons.chat_rounded, size: 17),
                  label: const Text('Tanya / Survei Gratis WA'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AcuuyColors.teal500,
                    foregroundColor: AcuuyColors.navy950,
                    padding: const EdgeInsets.symmetric(vertical: 13),
                    textStyle: const TextStyle(
                      fontWeight: FontWeight.w900,
                      fontSize: 12.5,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              OutlinedButton.icon(
                onPressed: () => BookingFormSheet.show(
                  context,
                  storeService: store,
                  initialServiceType: 'cctv',
                ),
                icon: const Icon(Icons.edit_calendar_rounded, size: 16),
                label: const Text('Form Booking'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.white,
                  side: const BorderSide(color: Colors.white38),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 13),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                  textStyle: const TextStyle(
                    fontWeight: FontWeight.w800,
                    fontSize: 12.5,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildAnalogVsIpSection(BuildContext context, SupabaseStoreService store) {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 22, 16, 8),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AcuuyColors.slate200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: AcuuyColors.teal50,
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Text(
              'PANDUAN MEMILIH CCTV',
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w900,
                color: AcuuyColors.teal800,
                letterSpacing: 0.6,
              ),
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'CCTV Analog vs IP Camera: Mana yang Cocok untuk Anda?',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w900,
              color: AcuuyColors.navy900,
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            'Kenali perbedaan utama kedua teknologi kamera ini agar sesuai dengan kebutuhan lokasi dan anggaran Anda:',
            style: TextStyle(fontSize: 12.5, color: AcuuyColors.slate600),
          ),
          const SizedBox(height: 14),

          // 2 Intro Cards with bundled images (assets/images/cctv-analog.jpg & ip-camera.jpg)
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: _CameraTypeIntroCard(
                  title: 'CCTV Analog',
                  badge: 'Hemat & Praktis',
                  badgeColor: AcuuyColors.amber500,
                  assetPath: 'assets/images/cctv-analog.jpg',
                  description:
                      'Sinyal video dikirim lewat kabel koaksial ke perekam DVR. Ekonomis & cocok untuk rumah atau warung.',
                  bestFor: 'Rumah, Toko Kecil, Kos-kosan',
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _CameraTypeIntroCard(
                  title: 'IP Camera',
                  badge: 'Digital & Cerdas',
                  badgeColor: const Color(0xFF0284C7),
                  assetPath: 'assets/images/ip-camera.jpg',
                  description:
                      'Kamera mengolah video digital via kabel LAN (PoE) / Wi-Fi ke NVR. Gambar super tajam hingga 4K & AI.',
                  bestFor: 'Ruko, Kantor, Gudang, Sekolah',
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Comparison Table (PRD Bagian 12.3)
          Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AcuuyColors.slate200),
            ),
            clipBehavior: Clip.antiAlias,
            child: Column(
              children: [
                Container(
                  color: AcuuyColors.navy900,
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  child: const Row(
                    children: [
                      Expanded(
                        flex: 2,
                        child: Text(
                          'Aspek',
                          style: TextStyle(
                            color: AcuuyColors.teal300,
                            fontWeight: FontWeight.w900,
                            fontSize: 11,
                          ),
                        ),
                      ),
                      Expanded(
                        flex: 3,
                        child: Text(
                          'CCTV Analog',
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w800,
                            fontSize: 11,
                          ),
                        ),
                      ),
                      Expanded(
                        flex: 3,
                        child: Text(
                          'IP Camera',
                          style: TextStyle(
                            color: AcuuyColors.teal200,
                            fontWeight: FontWeight.w800,
                            fontSize: 11,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                ...List.generate(
                  DefaultStoreData.analogVsIpComparison.length,
                  (idx) {
                    final row = DefaultStoreData.analogVsIpComparison[idx];
                    return Container(
                      color: idx.isEven ? Colors.white : AcuuyColors.slate100,
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 9),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            flex: 2,
                            child: Text(
                              row['aspect']!,
                              style: const TextStyle(
                                fontWeight: FontWeight.w800,
                                fontSize: 11,
                                color: AcuuyColors.navy900,
                              ),
                            ),
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            flex: 3,
                            child: Text(
                              row['analog']!,
                              style: const TextStyle(
                                fontSize: 11,
                                color: AcuuyColors.slate700,
                              ),
                            ),
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            flex: 3,
                            child: Text(
                              row['ip']!,
                              style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: AcuuyColors.teal900,
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () => WhatsAppHelper.openDirectConsultation(
                settings: store.settings,
                topic: 'Memilih CCTV Analog vs IP Camera yang Cocok untuk Lokasi Saya',
              ),
              icon: const Icon(Icons.support_agent_rounded, size: 18),
              label: const Text('Masih Bingung? Konsultasi & Survei Gratis via WA'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCertificateSection(
    BuildContext context,
    List<Certificate> certificates,
  ) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 18, 16, 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF3C7),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.workspace_premium_rounded, size: 14, color: AcuuyColors.amber600),
                    SizedBox(width: 4),
                    Text(
                      'OFFICIAL AUTHORIZED PARTNER',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w900,
                        color: AcuuyColors.amber600,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          const Text(
            'Lisensi & Sertifikat Kemitraan Resmi CCTV',
            style: TextStyle(
              fontSize: 19,
              fontWeight: FontWeight.w900,
              color: AcuuyColors.navy900,
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            'Jaminan produk 100% original & garansi resmi. Ketuk sertifikat untuk Zoom In / Zoom Out detail lisensi:',
            style: TextStyle(fontSize: 12, color: AcuuyColors.slate600),
          ),
          const SizedBox(height: 14),
          SizedBox(
            height: 235,
            child: ListView.builder(
              controller: _certScrollController,
              scrollDirection: Axis.horizontal,
              itemCount: certificates.length,
              itemBuilder: (context, index) {
                final cert = certificates[index];
                return CertificateCardWidget(
                  certificate: cert,
                  onTap: () {
                    showDialog(
                      context: context,
                      builder: (_) => CertificateZoomModal(
                        certificates: certificates,
                        initialIndex: index,
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPortfolioSection(BuildContext context, List<Portfolio> portfolios) {
    final categories = [
      {'id': 'semua', 'label': 'Semua Lokasi'},
      {'id': 'rumah', 'label': 'Rumah'},
      {'id': 'toko', 'label': 'Toko & Kafe'},
      {'id': 'kantor', 'label': 'Kantor & Klinik'},
      {'id': 'gudang', 'label': 'Gudang'},
    ];

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Portofolio Pemasangan CCTV di Garut',
            style: TextStyle(
              fontSize: 19,
              fontWeight: FontWeight.w900,
              color: AcuuyColors.navy900,
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            'Dokumentasi instalasi rapi oleh teknisi Acuuy CCTV di berbagai wilayah Kabupaten Garut.',
            style: TextStyle(fontSize: 12, color: AcuuyColors.slate600),
          ),
          const SizedBox(height: 10),
          SizedBox(
            height: 38,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: categories.length,
              separatorBuilder: (_, _) => const SizedBox(width: 8),
              itemBuilder: (context, idx) {
                final cat = categories[idx];
                final isSelected = _portfolioCategory == cat['id'];
                return ChoiceChip(
                  label: Text(cat['label']!),
                  selected: isSelected,
                  onSelected: (_) => setState(() => _portfolioCategory = cat['id']!),
                  selectedColor: AcuuyColors.teal600,
                  backgroundColor: Colors.white,
                  labelStyle: TextStyle(
                    fontSize: 11.5,
                    fontWeight: FontWeight.w800,
                    color: isSelected ? Colors.white : AcuuyColors.slate700,
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 12),
          ...portfolios.map(
            (item) => Container(
              margin: const EdgeInsets.only(bottom: 14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AcuuyColors.slate200),
              ),
              clipBehavior: Clip.antiAlias,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (item.images.isNotEmpty)
                    GestureDetector(
                      onTap: () => _showImageZoomDialog(context, item.title, item.images.first),
                      child: Stack(
                        children: [
                          Image.network(
                            item.images.first,
                            height: 165,
                            width: double.infinity,
                            fit: BoxFit.cover,
                            errorBuilder: (_, _, _) => Container(
                              height: 150,
                              color: AcuuyColors.navy800,
                              child: const Center(
                                child: Icon(
                                  Icons.videocam_rounded,
                                  color: AcuuyColors.teal300,
                                  size: 42,
                                ),
                              ),
                            ),
                          ),
                          Positioned(
                            top: 10,
                            left: 10,
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: AcuuyColors.navy900.withValues(alpha: 0.85),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(
                                '${item.cameraCount} Titik • ${item.location}',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 10.5,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  Padding(
                    padding: const EdgeInsets.all(14),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          item.title,
                          style: const TextStyle(
                            fontSize: 14.5,
                            fontWeight: FontWeight.w900,
                            color: AcuuyColors.navy900,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          item.cameraType,
                          style: const TextStyle(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w700,
                            color: AcuuyColors.teal700,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          item.description,
                          style: const TextStyle(
                            fontSize: 12,
                            color: AcuuyColors.slate600,
                            height: 1.35,
                          ),
                        ),
                        if (item.review != null && item.review!.isNotEmpty) ...[
                          const SizedBox(height: 10),
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: AcuuyColors.teal50,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Icon(
                                  Icons.format_quote_rounded,
                                  color: AcuuyColors.teal600,
                                  size: 18,
                                ),
                                const SizedBox(width: 6),
                                Expanded(
                                  child: Text(
                                    '"${item.review}" — ${item.clientName ?? "Pelanggan"}',
                                    style: const TextStyle(
                                      fontSize: 11.2,
                                      fontStyle: FontStyle.italic,
                                      color: AcuuyColors.navy900,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showImageZoomDialog(BuildContext context, String title, String imageUrl) {
    showDialog(
      context: context,
      builder: (_) => Dialog.fullscreen(
        backgroundColor: Colors.black,
        child: SafeArea(
          child: Column(
            children: [
              Row(
                children: [
                  const SizedBox(width: 16),
                  Expanded(
                    child: Text(
                      title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ),
                  IconButton(
                    onPressed: () => Navigator.of(context).pop(),
                    icon: const Icon(Icons.close_rounded, color: Colors.white),
                  ),
                ],
              ),
              Expanded(
                child: InteractiveViewer(
                  minScale: 0.8,
                  maxScale: 4.0,
                  child: Center(
                    child: Image.network(imageUrl, fit: BoxFit.contain),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _QuickNavCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;

  const _QuickNavCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(18),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: AcuuyColors.slate200),
          ),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(9),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.12),
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: color, size: 20),
              ),
              const SizedBox(height: 6),
              Text(
                title,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 11.5,
                  fontWeight: FontWeight.w900,
                  color: AcuuyColors.navy900,
                ),
              ),
              Text(
                subtitle,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 10,
                  color: AcuuyColors.slate500,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _CameraTypeIntroCard extends StatelessWidget {
  final String title;
  final String badge;
  final Color badgeColor;
  final String assetPath;
  final String description;
  final String bestFor;

  const _CameraTypeIntroCard({
    required this.title,
    required this.badge,
    required this.badgeColor,
    required this.assetPath,
    required this.description,
    required this.bestFor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AcuuyColors.backgroundOffWhite,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AcuuyColors.slate200),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            height: 95,
            width: double.infinity,
            child: Image.asset(
              assetPath,
              fit: BoxFit.cover,
              errorBuilder: (_, _, _) => Container(
                color: AcuuyColors.navy800,
                child: const Icon(Icons.videocam_rounded, color: Colors.white, size: 32),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(10),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                  decoration: BoxDecoration(
                    color: badgeColor.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    badge,
                    style: TextStyle(
                      fontSize: 9.5,
                      fontWeight: FontWeight.w900,
                      color: badgeColor,
                    ),
                  ),
                ),
                const SizedBox(height: 5),
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 13.5,
                    fontWeight: FontWeight.w900,
                    color: AcuuyColors.navy900,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  description,
                  style: const TextStyle(
                    fontSize: 11,
                    color: AcuuyColors.slate600,
                    height: 1.35,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  'Cocok: $bestFor',
                  style: const TextStyle(
                    fontSize: 10.5,
                    fontWeight: FontWeight.w800,
                    color: AcuuyColors.teal700,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
