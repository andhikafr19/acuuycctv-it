import 'package:flutter/material.dart';
import '../models/store_models.dart';
import '../services/supabase_store_service.dart';
import '../theme/app_theme.dart';
import '../utils/whatsapp_helper.dart';
import '../widgets/booking_form_sheet.dart';
import 'laptop_catalog_screen.dart';

class ServicesToolsScreen extends StatefulWidget {
  final SupabaseStoreService storeService;

  const ServicesToolsScreen({
    super.key,
    required this.storeService,
  });

  @override
  State<ServicesToolsScreen> createState() => _ServicesToolsScreenState();
}

class _ServicesToolsScreenState extends State<ServicesToolsScreen> {
  // Kalkulator Kebutuhan CCTV State (FR-M09)
  String _buildingType = 'Rumah Tinggal';
  int _indoorRooms = 2;
  int _outdoorPoints = 2;
  String _featurePreference = 'ColorVu Audio'; // 'Standard' | 'Audio' | 'ColorVu Audio' | 'IP Camera 4MP'

  CctvPackage _calculateRecommendedPackage(List<CctvPackage> all) {
    final totalNeeded = _indoorRooms + _outdoorPoints;
    final targetChannel = totalNeeded <= 2
        ? 2
        : totalNeeded <= 4
            ? 4
            : totalNeeded <= 6
                ? 6
                : totalNeeded <= 8
                    ? 8
                    : 16;

    final wantIp = _featurePreference == 'IP Camera 4MP' ||
        _buildingType == 'Gudang / Pabrik' ||
        targetChannel == 16;

    final candidates = all.where((p) {
      if (p.cameraCount != targetChannel) return false;
      if (wantIp && !p.isIpCamera) return false;
      if (!wantIp && p.isIpCamera) return false;
      return true;
    }).toList();

    if (candidates.isNotEmpty) {
      final exactSeries = candidates.where((p) {
        if (_featurePreference == 'IP Camera 4MP') return true;
        return p.series.toLowerCase() == _featurePreference.toLowerCase();
      }).toList();
      if (exactSeries.isNotEmpty) return exactSeries.first;
      return candidates.first;
    }

    // Fallback closest camera count
    final sorted = [...all]
      ..sort(
        (a, b) => (a.cameraCount - totalNeeded)
            .abs()
            .compareTo((b.cameraCount - totalNeeded).abs()),
      );
    return sorted.first;
  }

  @override
  Widget build(BuildContext context) {
    final store = widget.storeService;
    final recommendedPkg = _calculateRecommendedPackage(store.cctvPackages);
    final favPackages = store.favoritePackages;
    final favLaptops = store.favoriteLaptops;
    final history = store.localHistory;

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 92),
      children: [
        // 1. KALKULATOR & SIMULASI KEBUTUHAN PAKET CCTV (FR-M09)
        Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: AcuuyColors.teal300, width: 1.5),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AcuuyColors.teal50,
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: const Icon(
                      Icons.calculate_rounded,
                      color: AcuuyColors.teal700,
                    ),
                  ),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Kalkulator Simulasi Paket CCTV',
                          style: TextStyle(
                            fontSize: 16.5,
                            fontWeight: FontWeight.w900,
                            color: AcuuyColors.navy900,
                          ),
                        ),
                        Text(
                          'Pilih jumlah ruangan & fitur untuk rekomendasi paket otomatis',
                          style: TextStyle(
                            fontSize: 11.5,
                            color: AcuuyColors.slate500,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),

              DropdownButtonFormField<String>(
                initialValue: _buildingType,
                decoration: const InputDecoration(
                  labelText: 'Jenis Bangunan Anda',
                  prefixIcon: Icon(Icons.home_work_outlined),
                ),
                items: const [
                  DropdownMenuItem(
                    value: 'Rumah Tinggal',
                    child: Text('Rumah Tinggal / Kost'),
                  ),
                  DropdownMenuItem(
                    value: 'Toko / Ruko',
                    child: Text('Toko / Ruko / Kafe'),
                  ),
                  DropdownMenuItem(
                    value: 'Kantor / Klinik',
                    child: Text('Kantor / Klinik / Sekolah'),
                  ),
                  DropdownMenuItem(
                    value: 'Gudang / Pabrik',
                    child: Text('Gudang / Area Luas (Disarankan IP Cam)'),
                  ),
                ],
                onChanged: (v) {
                  if (v != null) setState(() => _buildingType = v);
                },
              ),
              const SizedBox(height: 12),

              // Indoor & Outdoor Sliders
              Row(
                children: [
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: AcuuyColors.slate100,
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Column(
                        children: [
                          Text(
                            'Titik Indoor: $_indoorRooms',
                            style: const TextStyle(
                              fontWeight: FontWeight.w900,
                              fontSize: 12.5,
                              color: AcuuyColors.navy900,
                            ),
                          ),
                          Slider(
                            value: _indoorRooms.toDouble(),
                            min: 0,
                            max: 8,
                            divisions: 8,
                            activeColor: AcuuyColors.teal600,
                            onChanged: (v) {
                              setState(() {
                                _indoorRooms = v.round();
                                if (_indoorRooms + _outdoorPoints == 0) {
                                  _indoorRooms = 1;
                                }
                              });
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: AcuuyColors.slate100,
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Column(
                        children: [
                          Text(
                            'Titik Outdoor: $_outdoorPoints',
                            style: const TextStyle(
                              fontWeight: FontWeight.w900,
                              fontSize: 12.5,
                              color: AcuuyColors.navy900,
                            ),
                          ),
                          Slider(
                            value: _outdoorPoints.toDouble(),
                            min: 0,
                            max: 8,
                            divisions: 8,
                            activeColor: AcuuyColors.teal600,
                            onChanged: (v) {
                              setState(() {
                                _outdoorPoints = v.round();
                                if (_indoorRooms + _outdoorPoints == 0) {
                                  _outdoorPoints = 1;
                                }
                              });
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              const Text(
                'PRIORITAS FITUR REKAMAN:',
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w900,
                  color: AcuuyColors.slate500,
                ),
              ),
              const SizedBox(height: 6),
              Wrap(
                spacing: 6,
                runSpacing: 6,
                children: [
                  for (final pref in [
                    {'id': 'Standard', 'label': 'Hemat (Infrared)'},
                    {'id': 'Audio', 'label': 'Rekam Suara (Mic)'},
                    {'id': 'ColorVu Audio', 'label': 'Malam Berwarna 24 Jam + Suara'},
                    {'id': 'IP Camera 4MP', 'label': 'IP Camera 4MP Super Tajam'},
                  ])
                    ChoiceChip(
                      label: Text(pref['label']!),
                      selected: _featurePreference == pref['id'],
                      onSelected: (_) =>
                          setState(() => _featurePreference = pref['id']!),
                      selectedColor: AcuuyColors.teal600,
                      labelStyle: TextStyle(
                        fontSize: 11.2,
                        fontWeight: FontWeight.w800,
                        color: _featurePreference == pref['id']
                            ? Colors.white
                            : AcuuyColors.navy900,
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 14),

              // Recommendation Output Box
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AcuuyColors.navy900,
                  borderRadius: BorderRadius.circular(18),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(
                          Icons.auto_awesome_rounded,
                          color: AcuuyColors.amber400,
                          size: 16,
                        ),
                        const SizedBox(width: 6),
                        Text(
                          'REKOMENDASI UNTUK ${_indoorRooms + _outdoorPoints} TITIK ($_buildingType):',
                          style: const TextStyle(
                            color: AcuuyColors.teal300,
                            fontSize: 10,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      recommendedPkg.name,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 15.5,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const SizedBox(height: 3),
                    Text(
                      '${recommendedPkg.price} • ${recommendedPkg.recorderSpec} + HDD ${recommendedPkg.hddSize}',
                      style: const TextStyle(
                        color: AcuuyColors.amber400,
                        fontSize: 13.5,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () => WhatsAppHelper.openCctvPackageInquiry(
                              pkg: recommendedPkg,
                              settings: store.settings,
                            ),
                            icon: const Icon(Icons.chat_rounded, size: 15),
                            label: const Text('Tanya via WA'),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: AcuuyColors.teal300,
                              side: const BorderSide(color: AcuuyColors.teal400),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: () => BookingFormSheet.show(
                              context,
                              storeService: store,
                              initialServiceType: 'cctv',
                              presetPackage: recommendedPkg,
                            ),
                            icon: const Icon(Icons.check_circle_outline_rounded, size: 15),
                            label: const Text('Booking Paket'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AcuuyColors.teal500,
                              foregroundColor: AcuuyColors.navy950,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),

        // 2. LAYANAN SERVIS KOMPUTER & KONSULTASI IT
        Row(
          children: [
            Expanded(
              child: _ServiceActionCard(
                icon: Icons.build_circle_rounded,
                title: 'Servis Komputer & Laptop',
                description:
                    'Upgrade SSD/RAM, ganti LCD/baterai, instal ulang Windows, servis mati total & overheat.',
                priceNote: 'Cek Kerusakan Gratis',
                onBook: () => BookingFormSheet.show(
                  context,
                  storeService: store,
                  initialServiceType: 'servis_komputer',
                ),
                onWhatsApp: () => WhatsAppHelper.openDirectConsultation(
                  settings: store.settings,
                  topic: 'Servis & Upgrade Laptop / Komputer',
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _ServiceActionCard(
                icon: Icons.hub_rounded,
                title: 'Konsultasi IT & Jaringan',
                description:
                    'Instalasi LAN kantor/klinik, setting Mikrotik Wi-Fi, server lokal & maintenance IT rutin.',
                priceNote: 'Survei Area Garut',
                onBook: () => BookingFormSheet.show(
                  context,
                  storeService: store,
                  initialServiceType: 'konsultasi_it',
                ),
                onWhatsApp: () => WhatsAppHelper.openDirectConsultation(
                  settings: store.settings,
                  topic: 'Konsultasi Jaringan LAN / Wi-Fi / IT Kantor',
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),

        // 3. DAFTAR FAVORIT / BOOKMARK SAYA (FR-M09)
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
                  const Icon(Icons.favorite_rounded, color: AcuuyColors.rose500, size: 20),
                  const SizedBox(width: 8),
                  Text(
                    'Simpanan Favorit Saya (${favPackages.length + favLaptops.length})',
                    style: const TextStyle(
                      fontSize: 15.5,
                      fontWeight: FontWeight.w900,
                      color: AcuuyColors.navy900,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              const Text(
                'Ketuk ikon hati pada kartu paket CCTV atau laptop untuk membandingkan harga di sini.',
                style: TextStyle(fontSize: 11.5, color: AcuuyColors.slate500),
              ),
              const SizedBox(height: 10),
              if (favPackages.isEmpty && favLaptops.isEmpty)
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 8),
                  child: Text(
                    'Belum ada paket CCTV atau laptop yang ditandai favorit.',
                    style: TextStyle(fontSize: 12, color: AcuuyColors.slate400),
                  ),
                )
              else ...[
                ...favPackages.map(
                  (pkg) => ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: const CircleAvatar(
                      backgroundColor: AcuuyColors.teal50,
                      child: Icon(Icons.videocam_rounded, color: AcuuyColors.teal700, size: 18),
                    ),
                    title: Text(
                      pkg.name,
                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800),
                    ),
                    subtitle: Text(
                      '${pkg.price} • ${pkg.cameraCount} Kamera',
                      style: const TextStyle(
                        fontSize: 11.5,
                        fontWeight: FontWeight.w700,
                        color: AcuuyColors.teal700,
                      ),
                    ),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          icon: const Icon(
                            Icons.chat_rounded,
                            color: AcuuyColors.whatsappDark,
                            size: 20,
                          ),
                          onPressed: () => WhatsAppHelper.openCctvPackageInquiry(
                            pkg: pkg,
                            settings: store.settings,
                          ),
                        ),
                        IconButton(
                          icon: const Icon(
                            Icons.delete_outline_rounded,
                            color: AcuuyColors.rose500,
                            size: 20,
                          ),
                          onPressed: () => store.toggleFavoritePackage(pkg.id),
                        ),
                      ],
                    ),
                  ),
                ),
                ...favLaptops.map(
                  (lap) => ListTile(
                    contentPadding: EdgeInsets.zero,
                    onTap: () => LaptopCatalogScreen.showLaptopDetailModal(
                      context,
                      laptop: lap,
                      storeService: store,
                    ),
                    leading: const CircleAvatar(
                      backgroundColor: Color(0xFFE0F2FE),
                      child: Icon(Icons.laptop_mac_rounded, color: Color(0xFF0369A1), size: 18),
                    ),
                    title: Text(
                      lap.title,
                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800),
                    ),
                    subtitle: Text(
                      FormatHelper.rupiah(lap.effectivePrice),
                      style: const TextStyle(
                        fontSize: 11.5,
                        fontWeight: FontWeight.w700,
                        color: AcuuyColors.teal700,
                      ),
                    ),
                    trailing: IconButton(
                      icon: const Icon(
                        Icons.delete_outline_rounded,
                        color: AcuuyColors.rose500,
                        size: 20,
                      ),
                      onPressed: () => store.toggleFavoriteLaptop(lap.id),
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
        const SizedBox(height: 18),

        // 4. RIWAYAT PENGAJUAN LOKAL (FR-M10)
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
                  const Icon(Icons.history_rounded, color: AcuuyColors.teal700, size: 20),
                  const SizedBox(width: 8),
                  Text(
                    'Riwayat Nomor Order & Pengajuan Saya (${history.length})',
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w900,
                      color: AcuuyColors.navy900,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              const Text(
                'Daftar nomor order/pengajuan yang pernah Anda buat dari perangkat ini.',
                style: TextStyle(fontSize: 11.5, color: AcuuyColors.slate500),
              ),
              const SizedBox(height: 10),
              if (history.isEmpty)
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 8),
                  child: Text(
                    'Belum ada riwayat pengajuan form dari HP ini.',
                    style: TextStyle(fontSize: 12, color: AcuuyColors.slate400),
                  ),
                )
              else
                ...history.map(
                  (rec) => Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AcuuyColors.slate100,
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                rec.referenceNumber,
                                style: const TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w900,
                                  color: AcuuyColors.teal700,
                                ),
                              ),
                              Text(
                                rec.title,
                                style: const TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w800,
                                  color: AcuuyColors.navy900,
                                ),
                              ),
                              Text(
                                '${rec.subtitle} • ${rec.priceOrEstimate}',
                                style: const TextStyle(
                                  fontSize: 11,
                                  color: AcuuyColors.slate600,
                                ),
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          icon: const Icon(
                            Icons.chat_rounded,
                            color: AcuuyColors.whatsappDark,
                          ),
                          tooltip: 'Tanyakan Status ke WhatsApp Admin',
                          onPressed: () => WhatsAppHelper.openDirectConsultation(
                            settings: store.settings,
                            topic: 'Konfirmasi Nomor Order/Pengajuan ${rec.referenceNumber}',
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }
}

class _ServiceActionCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String description;
  final String priceNote;
  final VoidCallback onBook;
  final VoidCallback onWhatsApp;

  const _ServiceActionCard({
    required this.icon,
    required this.title,
    required this.description,
    required this.priceNote,
    required this.onBook,
    required this.onWhatsApp,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AcuuyColors.slate200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: AcuuyColors.teal600, size: 28),
          const SizedBox(height: 8),
          Text(
            title,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w900,
              color: AcuuyColors.navy900,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            description,
            style: const TextStyle(
              fontSize: 11.2,
              color: AcuuyColors.slate600,
              height: 1.35,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            priceNote,
            style: const TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w800,
              color: AcuuyColors.teal700,
            ),
          ),
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: onBook,
              style: ElevatedButton.styleFrom(
                backgroundColor: AcuuyColors.navy900,
                padding: const EdgeInsets.symmetric(vertical: 10),
              ),
              child: const Text('Form Booking', style: TextStyle(fontSize: 11.5)),
            ),
          ),
          const SizedBox(height: 6),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              onPressed: onWhatsApp,
              style: OutlinedButton.styleFrom(
                foregroundColor: AcuuyColors.whatsappDark,
                side: const BorderSide(color: AcuuyColors.whatsappGreen),
                padding: const EdgeInsets.symmetric(vertical: 10),
              ),
              child: const Text('Tanya via WA', style: TextStyle(fontSize: 11.5)),
            ),
          ),
        ],
      ),
    );
  }
}
