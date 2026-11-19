import 'package:flutter/material.dart';
import '../models/store_models.dart';
import '../services/supabase_store_service.dart';
import '../theme/app_theme.dart';
import '../utils/whatsapp_helper.dart';
import '../widgets/booking_form_sheet.dart';
import '../widgets/cctv_poster_card.dart';

class CctvCatalogScreen extends StatefulWidget {
  final SupabaseStoreService storeService;

  const CctvCatalogScreen({
    super.key,
    required this.storeService,
  });

  @override
  State<CctvCatalogScreen> createState() => _CctvCatalogScreenState();
}

class _CctvCatalogScreenState extends State<CctvCatalogScreen> {
  // Multi-Filter State (PRD Bagian 14.3 & FR-M03)
  String _selectedBrand = 'Semua';
  String _selectedType = 'Semua'; // 'Semua' | 'CCTV Analog' | 'CCTV IP Camera'
  String _selectedSeries = 'Semua'; // 'Semua' | 'Standard' | 'Audio' | 'ColorVu Audio'
  int _selectedCameras = 0; // 0 = Semua, 2, 4, 6, 8, 16
  String _searchQuery = '';
  int _visibleCount = 8; // Pagination bertahap 8 paket (PRD 14.3)

  void _resetPagination() {
    _visibleCount = 8;
  }

  void _resetAllFilters() {
    setState(() {
      _selectedBrand = 'Semua';
      _selectedType = 'Semua';
      _selectedSeries = 'Semua';
      _selectedCameras = 0;
      _searchQuery = '';
      _visibleCount = 8;
    });
  }

  List<CctvPackage> _filterPackages(List<CctvPackage> all) {
    return all.where((p) {
      if (_selectedBrand != 'Semua') {
        if (!p.brand.toLowerCase().contains(_selectedBrand.toLowerCase())) {
          return false;
        }
      }
      if (_selectedType != 'Semua') {
        if (_selectedType == 'CCTV IP Camera' && !p.isIpCamera) return false;
        if (_selectedType == 'CCTV Analog' && p.isIpCamera) return false;
      }
      if (_selectedSeries != 'Semua') {
        if (p.series.toLowerCase() != _selectedSeries.toLowerCase()) {
          return false;
        }
      }
      if (_selectedCameras != 0 && p.cameraCount != _selectedCameras) {
        return false;
      }
      if (_searchQuery.trim().isNotEmpty) {
        final q = _searchQuery.toLowerCase();
        final match = p.name.toLowerCase().contains(q) ||
            p.brand.toLowerCase().contains(q) ||
            p.description.toLowerCase().contains(q) ||
            p.bestFor.toLowerCase().contains(q);
        if (!match) return false;
      }
      return true;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final store = widget.storeService;
    final filtered = _filterPackages(store.cctvPackages);
    final displayed = filtered.take(_visibleCount).toList();
    final hasActiveFilter = _selectedBrand != 'Semua' ||
        _selectedType != 'Semua' ||
        _selectedSeries != 'Semua' ||
        _selectedCameras != 0 ||
        _searchQuery.isNotEmpty;

    return RefreshIndicator(
      onRefresh: store.refreshFromSupabase,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 14, 16, 92),
        children: [
          // Header Card & Multi-Filter Panel
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(22),
              border: Border.all(color: AcuuyColors.slate200),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Katalog & Harga Paket CCTV',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w900,
                              color: AcuuyColors.navy900,
                            ),
                          ),
                          SizedBox(height: 2),
                          Text(
                            'Multi-Filter cepat sesuai Brand, Jenis, Seri & Jumlah Kamera',
                            style: TextStyle(fontSize: 11.5, color: AcuuyColors.slate500),
                          ),
                        ],
                      ),
                    ),
                    if (hasActiveFilter)
                      TextButton.icon(
                        onPressed: _resetAllFilters,
                        icon: const Icon(Icons.refresh_rounded, size: 15),
                        label: const Text('Reset'),
                        style: TextButton.styleFrom(
                          foregroundColor: AcuuyColors.rose500,
                          textStyle: const TextStyle(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 12),

                // Search Bar
                TextField(
                  onChanged: (v) {
                    setState(() {
                      _searchQuery = v;
                      _resetPagination();
                    });
                  },
                  decoration: const InputDecoration(
                    hintText: 'Cari paket (misal: ColorVu, 4 kamera, gudang, ruko)...',
                    hintStyle: TextStyle(fontSize: 12.5),
                    prefixIcon: Icon(Icons.search_rounded, size: 20),
                  ),
                ),
                const SizedBox(height: 12),

                // 1. Filter Brand
                const Text(
                  '1. PILIH BRAND RESMI:',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w900,
                    color: AcuuyColors.slate500,
                    letterSpacing: 0.6,
                  ),
                ),
                const SizedBox(height: 6),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      for (final brand in [
                        'Semua',
                        'Hikvision',
                        'HiLook',
                        'Dahua',
                        'EZVIZ / IMOU',
                      ])
                        Padding(
                          padding: const EdgeInsets.only(right: 6),
                          child: ChoiceChip(
                            label: Text(brand),
                            selected: _selectedBrand == brand,
                            onSelected: (_) {
                              setState(() {
                                _selectedBrand = brand;
                                _resetPagination();
                              });
                            },
                            selectedColor: AcuuyColors.teal600,
                            labelStyle: TextStyle(
                              fontSize: 11.5,
                              fontWeight: FontWeight.w800,
                              color: _selectedBrand == brand
                                  ? Colors.white
                                  : AcuuyColors.navy900,
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
                const SizedBox(height: 10),

                // 2. Filter Jenis Kamera (Analog vs IP Camera)
                const Text(
                  '2. JENIS KAMERA:',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w900,
                    color: AcuuyColors.slate500,
                    letterSpacing: 0.6,
                  ),
                ),
                const SizedBox(height: 6),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      for (final type in ['Semua', 'CCTV Analog', 'CCTV IP Camera'])
                        Padding(
                          padding: const EdgeInsets.only(right: 6),
                          child: ChoiceChip(
                            label: Text(type == 'Semua' ? 'Semua Jenis' : type),
                            selected: _selectedType == type,
                            onSelected: (_) {
                              setState(() {
                                _selectedType = type;
                                _resetPagination();
                              });
                            },
                            selectedColor: AcuuyColors.navy900,
                            labelStyle: TextStyle(
                              fontSize: 11.5,
                              fontWeight: FontWeight.w800,
                              color: _selectedType == type
                                  ? Colors.white
                                  : AcuuyColors.navy900,
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
                const SizedBox(height: 10),

                // 3. Filter Seri / Fitur
                const Text(
                  '3. SERI & FITUR KAMERA:',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w900,
                    color: AcuuyColors.slate500,
                    letterSpacing: 0.6,
                  ),
                ),
                const SizedBox(height: 6),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      for (final series in [
                        {'id': 'Semua', 'label': 'Semua Seri'},
                        {'id': 'Standard', 'label': 'Standard (Infrared)'},
                        {'id': 'Audio', 'label': 'Audio (Built-in Mic)'},
                        {'id': 'ColorVu Audio', 'label': 'ColorVu Audio (Warna 24 Jam)'},
                      ])
                        Padding(
                          padding: const EdgeInsets.only(right: 6),
                          child: ChoiceChip(
                            label: Text(series['label']!),
                            selected: _selectedSeries == series['id'],
                            onSelected: (_) {
                              setState(() {
                                _selectedSeries = series['id']!;
                                _resetPagination();
                              });
                            },
                            selectedColor: AcuuyColors.teal700,
                            labelStyle: TextStyle(
                              fontSize: 11.5,
                              fontWeight: FontWeight.w800,
                              color: _selectedSeries == series['id']
                                  ? Colors.white
                                  : AcuuyColors.navy900,
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
                const SizedBox(height: 10),

                // 4. Filter Jumlah Titik Kamera (2, 4, 6, 8, 16)
                const Text(
                  '4. JUMLAH TITIK KAMERA:',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w900,
                    color: AcuuyColors.slate500,
                    letterSpacing: 0.6,
                  ),
                ),
                const SizedBox(height: 6),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      for (final count in [0, 2, 4, 6, 8, 16])
                        Padding(
                          padding: const EdgeInsets.only(right: 6),
                          child: ChoiceChip(
                            label: Text(count == 0 ? 'Semua Titik' : '$count Kamera'),
                            selected: _selectedCameras == count,
                            onSelected: (_) {
                              setState(() {
                                _selectedCameras = count;
                                _resetPagination();
                              });
                            },
                            selectedColor: AcuuyColors.amber500,
                            labelStyle: TextStyle(
                              fontSize: 11.5,
                              fontWeight: FontWeight.w900,
                              color: _selectedCameras == count
                                  ? AcuuyColors.navy950
                                  : AcuuyColors.navy900,
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // Result Count Banner
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Menampilkan ${displayed.length} dari ${filtered.length} paket CCTV',
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w800,
                    color: AcuuyColors.slate600,
                  ),
                ),
                const Text(
                  'Terima Beres + Garansi',
                  style: TextStyle(
                    fontSize: 11.5,
                    fontWeight: FontWeight.w800,
                    color: AcuuyColors.teal700,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),

          if (displayed.isEmpty)
            Container(
              padding: const EdgeInsets.all(28),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AcuuyColors.slate200),
              ),
              child: Column(
                children: [
                  const Icon(
                    Icons.filter_alt_off_rounded,
                    size: 44,
                    color: AcuuyColors.slate400,
                  ),
                  const SizedBox(height: 10),
                  const Text(
                    'Tidak ada paket dengan kombinasi filter ini',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w900,
                      color: AcuuyColors.navy900,
                    ),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'Silakan reset filter atau konsultasikan paket custom sesuai titik lokasi Anda via WhatsApp.',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 12, color: AcuuyColors.slate500),
                  ),
                  const SizedBox(height: 14),
                  ElevatedButton.icon(
                    onPressed: _resetAllFilters,
                    icon: const Icon(Icons.refresh_rounded),
                    label: const Text('Tampilkan Semua Paket'),
                  ),
                ],
              ),
            )
          else ...[
            ...displayed.map(
              (pkg) => CctvPosterCard(
                pkg: pkg,
                isHighlighted: pkg.popular,
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
              ),
            ),

            // Step-by-step Pagination Controls (PRD Bagian 14.3: +8 Paket / Lipat Kembali)
            if (filtered.length > 8)
              Padding(
                padding: const EdgeInsets.only(top: 6),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (_visibleCount < filtered.length)
                      ElevatedButton.icon(
                        onPressed: () {
                          setState(() => _visibleCount += 8);
                        },
                        icon: const Icon(Icons.expand_more_rounded),
                        label: const Text('Lihat Lainnya (+8 Paket)'),
                      ),
                    if (_visibleCount > 8) ...[
                      const SizedBox(width: 10),
                      OutlinedButton.icon(
                        onPressed: () {
                          setState(() => _visibleCount = 8);
                        },
                        icon: const Icon(Icons.expand_less_rounded),
                        label: const Text('Tampilkan Lebih Sedikit'),
                      ),
                    ],
                  ],
                ),
              ),
          ],
        ],
      ),
    );
  }
}
