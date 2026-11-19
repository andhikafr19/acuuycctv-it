import 'package:flutter/material.dart';
import '../models/store_models.dart';
import '../services/supabase_store_service.dart';
import '../theme/app_theme.dart';
import '../utils/whatsapp_helper.dart';

class LaptopCatalogScreen extends StatefulWidget {
  final SupabaseStoreService storeService;

  const LaptopCatalogScreen({
    super.key,
    required this.storeService,
  });

  static void showLaptopDetailModal(
    BuildContext context, {
    required Laptop laptop,
    required SupabaseStoreService storeService,
  }) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _LaptopDetailSheet(
        laptop: laptop,
        storeService: storeService,
      ),
    );
  }

  @override
  State<LaptopCatalogScreen> createState() => _LaptopCatalogScreenState();
}

class _LaptopCatalogScreenState extends State<LaptopCatalogScreen> {
  String _selectedBrand = 'Semua';
  String _searchQuery = '';
  bool _onlyReadyStock = false;

  @override
  Widget build(BuildContext context) {
    final store = widget.storeService;
    final filtered = store.laptops.where((l) {
      if (_selectedBrand != 'Semua' &&
          l.brand.toLowerCase() != _selectedBrand.toLowerCase()) {
        return false;
      }
      if (_onlyReadyStock && !l.isAvailable) return false;
      if (_searchQuery.trim().isNotEmpty) {
        final q = _searchQuery.toLowerCase();
        final match = l.title.toLowerCase().contains(q) ||
            l.processor.toLowerCase().contains(q) ||
            l.ram.toLowerCase().contains(q) ||
            l.storage.toLowerCase().contains(q);
        if (!match) return false;
      }
      return true;
    }).toList();

    return RefreshIndicator(
      onRefresh: store.refreshFromSupabase,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 14, 16, 92),
        children: [
          // Banner Jual / Tukar Tambah Laptop (FR-M05)
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [AcuuyColors.navy900, AcuuyColors.teal800],
              ),
              borderRadius: BorderRadius.circular(22),
            ),
            child: Row(
              children: [
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Punya Laptop Bekas Ingin Dijual?',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 15.5,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        'Kami terima jual-beli & tukar tambah laptop bekas kondisi normal dengan harga pantas di Garut.',
                        style: TextStyle(color: AcuuyColors.slate200, fontSize: 11.5),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                ElevatedButton.icon(
                  onPressed: () => _SellLaptopSheet.show(context, store),
                  icon: const Icon(Icons.sell_rounded, size: 15),
                  label: const Text('Jual Laptop'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AcuuyColors.amber400,
                    foregroundColor: AcuuyColors.navy950,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // Filter Panel
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AcuuyColors.slate200),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                TextField(
                  onChanged: (v) => setState(() => _searchQuery = v),
                  decoration: const InputDecoration(
                    hintText: 'Cari ThinkPad, Gaming, Core i5, RAM 16GB...',
                    hintStyle: TextStyle(fontSize: 12.5),
                    prefixIcon: Icon(Icons.search_rounded, size: 20),
                  ),
                ),
                const SizedBox(height: 10),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      FilterChip(
                        label: const Text('Hanya Ready Stock'),
                        selected: _onlyReadyStock,
                        onSelected: (v) => setState(() => _onlyReadyStock = v),
                        selectedColor: AcuuyColors.teal100,
                        labelStyle: const TextStyle(
                          fontSize: 11.5,
                          fontWeight: FontWeight.w800,
                          color: AcuuyColors.teal900,
                        ),
                      ),
                      const SizedBox(width: 8),
                      for (final brand in ['Semua', 'Lenovo', 'Asus', 'Dell', 'HP'])
                        Padding(
                          padding: const EdgeInsets.only(right: 6),
                          child: ChoiceChip(
                            label: Text(brand),
                            selected: _selectedBrand == brand,
                            onSelected: (_) => setState(() => _selectedBrand = brand),
                            selectedColor: AcuuyColors.navy900,
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
              ],
            ),
          ),
          const SizedBox(height: 14),

          // Laptop List
          ...filtered.map(
            (laptop) => _LaptopCardItem(
              laptop: laptop,
              isFavorite: store.isLaptopFavorite(laptop.id),
              onToggleFavorite: () => store.toggleFavoriteLaptop(laptop.id),
              onTapDetail: () => LaptopCatalogScreen.showLaptopDetailModal(
                context,
                laptop: laptop,
                storeService: store,
              ),
              onAskWhatsApp: () => WhatsAppHelper.openLaptopInquiry(
                laptop: laptop,
                settings: store.settings,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _LaptopCardItem extends StatelessWidget {
  final Laptop laptop;
  final bool isFavorite;
  final VoidCallback onToggleFavorite;
  final VoidCallback onTapDetail;
  final VoidCallback onAskWhatsApp;

  const _LaptopCardItem({
    required this.laptop,
    required this.isFavorite,
    required this.onToggleFavorite,
    required this.onTapDetail,
    required this.onAskWhatsApp,
  });

  @override
  Widget build(BuildContext context) {
    final statusColor = laptop.status == 'tersedia'
        ? AcuuyColors.emerald500
        : laptop.status == 'booking'
            ? AcuuyColors.amber500
            : AcuuyColors.rose500;

    return GestureDetector(
      onTap: onTapDetail,
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: AcuuyColors.slate200),
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image + Status & Grade badges
            Stack(
              children: [
                SizedBox(
                  height: 175,
                  width: double.infinity,
                  child: laptop.images.isNotEmpty
                      ? Image.network(
                          laptop.images.first,
                          fit: BoxFit.cover,
                          errorBuilder: (_, _, _) => Container(
                            color: AcuuyColors.navy800,
                            child: const Icon(
                              Icons.laptop_mac_rounded,
                              size: 48,
                              color: AcuuyColors.teal300,
                            ),
                          ),
                        )
                      : Container(
                          color: AcuuyColors.navy800,
                          child: const Icon(
                            Icons.laptop_mac_rounded,
                            size: 48,
                            color: AcuuyColors.teal300,
                          ),
                        ),
                ),
                Positioned(
                  top: 10,
                  left: 10,
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: statusColor,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          laptop.status.toUpperCase(),
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                      ),
                      const SizedBox(width: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: AcuuyColors.navy900.withValues(alpha: 0.85),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          laptop.conditionGrade,
                          style: const TextStyle(
                            color: AcuuyColors.teal300,
                            fontSize: 10,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                Positioned(
                  top: 10,
                  right: 10,
                  child: InkWell(
                    onTap: onToggleFavorite,
                    child: Container(
                      padding: const EdgeInsets.all(7),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.4),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        isFavorite
                            ? Icons.favorite_rounded
                            : Icons.favorite_border_rounded,
                        size: 18,
                        color: isFavorite ? AcuuyColors.rose500 : Colors.white,
                      ),
                    ),
                  ),
                ),
              ],
            ),

            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${laptop.brand.toUpperCase()} • ${laptop.model}',
                    style: const TextStyle(
                      fontSize: 10.5,
                      fontWeight: FontWeight.w800,
                      color: AcuuyColors.teal700,
                    ),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    laptop.title,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w900,
                      color: AcuuyColors.navy900,
                    ),
                  ),
                  const SizedBox(height: 10),

                  // Key Spec Grid
                  Wrap(
                    spacing: 6,
                    runSpacing: 6,
                    children: [
                      _SpecChip(icon: Icons.memory_rounded, text: laptop.processor),
                      _SpecChip(icon: Icons.sd_storage_rounded, text: 'RAM ${laptop.ram}'),
                      _SpecChip(icon: Icons.storage_rounded, text: laptop.storage),
                      _SpecChip(icon: Icons.monitor_rounded, text: laptop.display),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Price & Warranty Row
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            if (laptop.hasDiscount)
                              Text(
                                FormatHelper.rupiah(laptop.price),
                                style: const TextStyle(
                                  fontSize: 11.5,
                                  decoration: TextDecoration.lineThrough,
                                  color: AcuuyColors.slate400,
                                ),
                              ),
                            Text(
                              FormatHelper.rupiah(laptop.effectivePrice),
                              style: const TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.w900,
                                color: AcuuyColors.teal700,
                              ),
                            ),
                            Text(
                              laptop.warrantyInfo,
                              style: const TextStyle(
                                fontSize: 10.5,
                                color: AcuuyColors.slate500,
                              ),
                            ),
                          ],
                        ),
                      ),
                      OutlinedButton(
                        onPressed: onTapDetail,
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 11,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text(
                          'Detail',
                          style: TextStyle(fontWeight: FontWeight.w800, fontSize: 12),
                        ),
                      ),
                      const SizedBox(width: 8),
                      ElevatedButton.icon(
                        onPressed: onAskWhatsApp,
                        icon: const Icon(Icons.chat_rounded, size: 15),
                        label: const Text('Tanya WA'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AcuuyColors.whatsappDark,
                          padding: const EdgeInsets.symmetric(
                            horizontal: 14,
                            vertical: 11,
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
    );
  }
}

class _SpecChip extends StatelessWidget {
  final IconData icon;
  final String text;

  const _SpecChip({required this.icon, required this.text});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: AcuuyColors.slate100,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: AcuuyColors.teal700),
          const SizedBox(width: 4),
          Flexible(
            child: Text(
              text,
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: AcuuyColors.navy900,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _LaptopDetailSheet extends StatelessWidget {
  final Laptop laptop;
  final SupabaseStoreService storeService;

  const _LaptopDetailSheet({
    required this.laptop,
    required this.storeService,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(top: 50),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      clipBehavior: Clip.antiAlias,
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Stack(
              children: [
                SizedBox(
                  height: 220,
                  width: double.infinity,
                  child: InteractiveViewer(
                    child: laptop.images.isNotEmpty
                        ? Image.network(laptop.images.first, fit: BoxFit.cover)
                        : Container(color: AcuuyColors.navy900),
                  ),
                ),
                Positioned(
                  top: 12,
                  right: 12,
                  child: CircleAvatar(
                    backgroundColor: Colors.black54,
                    child: IconButton(
                      onPressed: () => Navigator.of(context).pop(),
                      icon: const Icon(Icons.close_rounded, color: Colors.white),
                    ),
                  ),
                ),
              ],
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${laptop.brand} • ${laptop.conditionGrade}',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w800,
                      color: AcuuyColors.teal700,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    laptop.title,
                    style: const TextStyle(
                      fontSize: 19,
                      fontWeight: FontWeight.w900,
                      color: AcuuyColors.navy900,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    FormatHelper.rupiah(laptop.effectivePrice),
                    style: const TextStyle(
                      fontSize: 23,
                      fontWeight: FontWeight.w900,
                      color: AcuuyColors.teal700,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    laptop.description,
                    style: const TextStyle(
                      fontSize: 12.8,
                      color: AcuuyColors.slate600,
                      height: 1.45,
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'SPESIFIKASI LENGKAP UNIT:',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w900,
                      color: AcuuyColors.navy900,
                    ),
                  ),
                  const SizedBox(height: 8),
                  _specRow('Processor', laptop.processor),
                  _specRow('Memory (RAM)', laptop.ram),
                  _specRow('Storage', laptop.storage),
                  _specRow('Kartu Grafis', laptop.graphics),
                  _specRow('Layar', laptop.display),
                  _specRow('Baterai', laptop.batteryHealth),
                  _specRow('Garansi', laptop.warrantyInfo),
                  const SizedBox(height: 18),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: () {
                        Navigator.of(context).pop();
                        WhatsAppHelper.openLaptopInquiry(
                          laptop: laptop,
                          settings: storeService.settings,
                        );
                      },
                      icon: const Icon(Icons.chat_rounded),
                      label: const Text('Tanya / Booking Unit Ini via WhatsApp'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AcuuyColors.whatsappDark,
                        padding: const EdgeInsets.symmetric(vertical: 15),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _specRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 110,
            child: Text(
              label,
              style: const TextStyle(
                fontSize: 12,
                color: AcuuyColors.slate500,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                fontSize: 12,
                color: AcuuyColors.navy900,
                fontWeight: FontWeight.w800,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _SellLaptopSheet extends StatefulWidget {
  final SupabaseStoreService storeService;

  const _SellLaptopSheet({required this.storeService});

  static Future<void> show(BuildContext context, SupabaseStoreService storeService) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _SellLaptopSheet(storeService: storeService),
    );
  }

  @override
  State<_SellLaptopSheet> createState() => _SellLaptopSheetState();
}

class _SellLaptopSheetState extends State<_SellLaptopSheet> {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _brandCtrl = TextEditingController();
  final _modelCtrl = TextEditingController();
  final _specsCtrl = TextEditingController();
  final _condCtrl = TextEditingController();
  final _priceCtrl = TextEditingController();
  bool _isSubmitting = false;

  @override
  void dispose() {
    _nameCtrl.dispose();
    _phoneCtrl.dispose();
    _brandCtrl.dispose();
    _modelCtrl.dispose();
    _specsCtrl.dispose();
    _condCtrl.dispose();
    _priceCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isSubmitting = true);

    final submissionNumber = FormatHelper.generateSellNumber();
    final expectedPrice =
        int.tryParse(_priceCtrl.text.replaceAll(RegExp(r'\D'), '')) ?? 0;

    await widget.storeService.submitSellLaptop(
      submissionNumber: submissionNumber,
      customerName: _nameCtrl.text.trim(),
      customerPhone: _phoneCtrl.text.trim(),
      brand: _brandCtrl.text.trim(),
      model: _modelCtrl.text.trim(),
      specifications: _specsCtrl.text.trim(),
      conditionDescription: _condCtrl.text.trim(),
      expectedPrice: expectedPrice,
    );

    if (!mounted) return;
    Navigator.of(context).pop();
    WhatsAppHelper.openSellLaptopConfirmation(
      submissionNumber: submissionNumber,
      customerName: _nameCtrl.text.trim(),
      customerPhone: _phoneCtrl.text.trim(),
      brandModel: '${_brandCtrl.text.trim()} ${_modelCtrl.text.trim()}',
      specifications: _specsCtrl.text.trim(),
      condition: _condCtrl.text.trim(),
      expectedPrice: expectedPrice,
      settings: widget.storeService.settings,
    );
  }

  @override
  Widget build(BuildContext context) {
    final bottomInset = MediaQuery.of(context).viewInsets.bottom;
    return Container(
      margin: const EdgeInsets.only(top: 50),
      padding: EdgeInsets.only(bottom: bottomInset),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                children: [
                  const Expanded(
                    child: Text(
                      'Form Jual / Tukar Tambah Laptop',
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w900,
                        color: AcuuyColors.navy900,
                      ),
                    ),
                  ),
                  IconButton(
                    onPressed: () => Navigator.of(context).pop(),
                    icon: const Icon(Icons.close_rounded),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _nameCtrl,
                decoration: const InputDecoration(labelText: 'Nama Anda'),
                validator: (v) =>
                    (v == null || v.isEmpty) ? 'Wajib diisi' : null,
              ),
              const SizedBox(height: 10),
              TextFormField(
                controller: _phoneCtrl,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(labelText: 'Nomor WhatsApp'),
                validator: (v) =>
                    (v == null || v.length < 9) ? 'Nomor WA tidak valid' : null,
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _brandCtrl,
                      decoration: const InputDecoration(
                        labelText: 'Merek (Asus/Lenovo/dll)',
                      ),
                      validator: (v) =>
                          (v == null || v.isEmpty) ? 'Wajib diisi' : null,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: TextFormField(
                      controller: _modelCtrl,
                      decoration: const InputDecoration(
                        labelText: 'Tipe / Seri Laptop',
                      ),
                      validator: (v) =>
                          (v == null || v.isEmpty) ? 'Wajib diisi' : null,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              TextFormField(
                controller: _specsCtrl,
                decoration: const InputDecoration(
                  labelText: 'Spesifikasi (Processor, RAM, SSD/HDD)',
                ),
                validator: (v) =>
                    (v == null || v.isEmpty) ? 'Wajib diisi' : null,
              ),
              const SizedBox(height: 10),
              TextFormField(
                controller: _condCtrl,
                maxLines: 2,
                decoration: const InputDecoration(
                  labelText: 'Kondisi Fisik, Baterai & Kelengkapan',
                ),
                validator: (v) =>
                    (v == null || v.isEmpty) ? 'Wajib diisi' : null,
              ),
              const SizedBox(height: 10),
              TextFormField(
                controller: _priceCtrl,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: 'Ekspektasi Harga Jual (Rp)',
                  hintText: 'Contoh: 2500000',
                ),
                validator: (v) =>
                    (v == null || v.isEmpty) ? 'Wajib diisi' : null,
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: _isSubmitting ? null : _submit,
                icon: const Icon(Icons.send_rounded),
                label: Text(
                  _isSubmitting
                      ? 'Mengirim...'
                      : 'Kirim Pengajuan & Kirim Foto via WhatsApp',
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
