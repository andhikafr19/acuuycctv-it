import 'package:flutter/material.dart';
import '../models/store_models.dart';
import '../services/supabase_store_service.dart';
import '../theme/app_theme.dart';
import '../utils/whatsapp_helper.dart';

class BookingFormSheet extends StatefulWidget {
  final SupabaseStoreService storeService;
  final String initialServiceType; // 'cctv' | 'servis_komputer' | 'konsultasi_it'
  final CctvPackage? presetPackage;

  const BookingFormSheet({
    super.key,
    required this.storeService,
    this.initialServiceType = 'cctv',
    this.presetPackage,
  });

  static Future<void> show(
    BuildContext context, {
    required SupabaseStoreService storeService,
    String initialServiceType = 'cctv',
    CctvPackage? presetPackage,
  }) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => BookingFormSheet(
        storeService: storeService,
        initialServiceType: initialServiceType,
        presetPackage: presetPackage,
      ),
    );
  }

  @override
  State<BookingFormSheet> createState() => _BookingFormSheetState();
}

class _BookingFormSheetState extends State<BookingFormSheet> {
  final _formKey = GlobalKey<FormState>();
  late String _serviceType;
  CctvPackage? _selectedPackage;
  String _propertyType = 'Rumah Tinggal';

  final TextEditingController _nameCtrl = TextEditingController();
  final TextEditingController _phoneCtrl = TextEditingController();
  final TextEditingController _addressCtrl = TextEditingController();
  final TextEditingController _descCtrl = TextEditingController();
  final TextEditingController _deviceModelCtrl = TextEditingController();

  bool _isSubmitting = false;
  String? _createdOrderNumber;

  @override
  void initState() {
    super.initState();
    _serviceType = widget.initialServiceType;
    _selectedPackage = widget.presetPackage;
    if (_selectedPackage != null) {
      _descCtrl.text =
          'Pemesanan ${_selectedPackage!.name} (${_selectedPackage!.price})';
    }
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _phoneCtrl.dispose();
    _addressCtrl.dispose();
    _descCtrl.dispose();
    _deviceModelCtrl.dispose();
    super.dispose();
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isSubmitting = true);

    final orderNumber = FormatHelper.generateOrderNumber(_serviceType);
    final int estimatedCost =
        _serviceType == 'cctv' && _selectedPackage != null
            ? _selectedPackage!.estimatedCost
            : 0;

    final Map<String, dynamic> specificDetails = {};
    if (_serviceType == 'cctv') {
      specificDetails['property_type'] = _propertyType;
      if (_selectedPackage != null) {
        specificDetails['selected_package'] = _selectedPackage!.name;
        specificDetails['package_price'] = _selectedPackage!.price;
        specificDetails['camera_count'] = _selectedPackage!.cameraCount;
      } else {
        specificDetails['selected_package'] = 'Custom / Survei Lokasi';
      }
    } else if (_serviceType == 'servis_komputer') {
      specificDetails['laptop_model'] = _deviceModelCtrl.text.trim();
      specificDetails['complaint'] = _descCtrl.text.trim();
    } else {
      specificDetails['institution_type'] = _propertyType;
      specificDetails['topic'] = _descCtrl.text.trim();
    }

    await widget.storeService.submitBookingOrder(
      orderNumber: orderNumber,
      serviceType: _serviceType,
      customerName: _nameCtrl.text.trim(),
      customerPhone: _phoneCtrl.text.trim(),
      address: _addressCtrl.text.trim(),
      description: _descCtrl.text.trim().isEmpty
          ? 'Pengajuan jadwal survei / layanan via aplikasi mobile'
          : _descCtrl.text.trim(),
      estimatedCost: estimatedCost,
      specificDetails: specificDetails,
    );

    if (!mounted) return;
    setState(() {
      _isSubmitting = false;
      _createdOrderNumber = orderNumber;
    });
  }

  @override
  Widget build(BuildContext context) {
    final bottomInset = MediaQuery.of(context).viewInsets.bottom;
    final packages = widget.storeService.cctvPackages;

    return Container(
      margin: const EdgeInsets.only(top: 48),
      padding: EdgeInsets.only(bottom: bottomInset),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: _createdOrderNumber != null
            ? _buildSuccessView()
            : Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Header
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: AcuuyColors.teal50,
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: const Icon(
                            Icons.assignment_turned_in_rounded,
                            color: AcuuyColors.teal600,
                          ),
                        ),
                        const SizedBox(width: 12),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Form Pemesanan & Survei',
                                style: TextStyle(
                                  fontSize: 17,
                                  fontWeight: FontWeight.w900,
                                  color: AcuuyColors.navy900,
                                ),
                              ),
                              Text(
                                'Dapatkan Nomor Order & lanjut konfirmasi via WhatsApp',
                                style: TextStyle(
                                  fontSize: 11.5,
                                  color: AcuuyColors.slate500,
                                ),
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          onPressed: () => Navigator.of(context).pop(),
                          icon: const Icon(Icons.close_rounded),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Service Type Selector
                    SegmentedButton<String>(
                      segments: const [
                        ButtonSegment(
                          value: 'cctv',
                          label: Text('Pasang CCTV', style: TextStyle(fontSize: 11.5)),
                          icon: Icon(Icons.videocam_rounded, size: 16),
                        ),
                        ButtonSegment(
                          value: 'servis_komputer',
                          label: Text('Servis PC/Laptop', style: TextStyle(fontSize: 11.5)),
                          icon: Icon(Icons.build_circle_outlined, size: 16),
                        ),
                        ButtonSegment(
                          value: 'konsultasi_it',
                          label: Text('Konsultasi IT', style: TextStyle(fontSize: 11.5)),
                          icon: Icon(Icons.hub_outlined, size: 16),
                        ),
                      ],
                      selected: {_serviceType},
                      onSelectionChanged: (s) {
                        setState(() => _serviceType = s.first);
                      },
                    ),
                    const SizedBox(height: 16),

                    // Pre-selected Package Summary Card (PRD 14.3.2)
                    if (_serviceType == 'cctv') ...[
                      if (_selectedPackage != null)
                        Container(
                          margin: const EdgeInsets.only(bottom: 12),
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: AcuuyColors.teal50,
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(color: AcuuyColors.teal300),
                          ),
                          child: Row(
                            children: [
                              const Icon(
                                Icons.verified_rounded,
                                color: AcuuyColors.teal700,
                                size: 22,
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text(
                                      'PAKET CCTV TERPILIH & ESTIMASI BIAYA',
                                      style: TextStyle(
                                        fontSize: 9.5,
                                        fontWeight: FontWeight.w900,
                                        color: AcuuyColors.teal800,
                                      ),
                                    ),
                                    Text(
                                      _selectedPackage!.name,
                                      style: const TextStyle(
                                        fontSize: 13,
                                        fontWeight: FontWeight.w900,
                                        color: AcuuyColors.navy900,
                                      ),
                                    ),
                                    Text(
                                      '${_selectedPackage!.price} (Terima Beres + Garansi 1 Tahun)',
                                      style: const TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w800,
                                        color: AcuuyColors.teal700,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      DropdownButtonFormField<String>(
                        key: ValueKey(_selectedPackage?.id ?? 'custom'),
                        initialValue: _selectedPackage?.id ?? 'custom',
                        isExpanded: true,
                        decoration: const InputDecoration(
                          labelText: 'Pilihan Paket CCTV',
                          prefixIcon: Icon(Icons.inventory_2_outlined),
                        ),
                        items: [
                          const DropdownMenuItem(
                            value: 'custom',
                            child: Text(
                              'Konsultasi / Survei Lokasi Dulu (Custom)',
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          ...packages.map(
                            (p) => DropdownMenuItem(
                              value: p.id,
                              child: Text(
                                '${p.name} — ${p.price}',
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(fontSize: 12.5),
                              ),
                            ),
                          ),
                        ],
                        onChanged: (val) {
                          setState(() {
                            if (val == 'custom' || val == null) {
                              _selectedPackage = null;
                            } else {
                              _selectedPackage =
                                  packages.firstWhere((p) => p.id == val);
                              _descCtrl.text =
                                  'Pemesanan ${_selectedPackage!.name} (${_selectedPackage!.price})';
                            }
                          });
                        },
                      ),
                      const SizedBox(height: 12),
                      DropdownButtonFormField<String>(
                        initialValue: _propertyType,
                        decoration: const InputDecoration(
                          labelText: 'Jenis Bangunan / Lokasi',
                          prefixIcon: Icon(Icons.domain_rounded),
                        ),
                        items: const [
                          DropdownMenuItem(
                            value: 'Rumah Tinggal',
                            child: Text('Rumah Tinggal'),
                          ),
                          DropdownMenuItem(
                            value: 'Toko / Ruko / Kafe',
                            child: Text('Toko / Ruko / Kafe'),
                          ),
                          DropdownMenuItem(
                            value: 'Kantor / Klinik / Sekolah',
                            child: Text('Kantor / Klinik / Sekolah'),
                          ),
                          DropdownMenuItem(
                            value: 'Gudang / Pabrik',
                            child: Text('Gudang / Pabrik'),
                          ),
                        ],
                        onChanged: (v) {
                          if (v != null) setState(() => _propertyType = v);
                        },
                      ),
                      const SizedBox(height: 12),
                    ],

                    if (_serviceType == 'servis_komputer') ...[
                      TextFormField(
                        controller: _deviceModelCtrl,
                        decoration: const InputDecoration(
                          labelText: 'Merek / Tipe Laptop atau PC',
                          hintText: 'Contoh: Lenovo ThinkPad / PC Rakitan Kasir',
                          prefixIcon: Icon(Icons.laptop_mac_rounded),
                        ),
                        validator: (v) => (v == null || v.trim().isEmpty)
                            ? 'Mohon isi merek/tipe perangkat'
                            : null,
                      ),
                      const SizedBox(height: 12),
                    ],

                    TextFormField(
                      controller: _nameCtrl,
                      decoration: const InputDecoration(
                        labelText: 'Nama Lengkap Anda',
                        hintText: 'Contoh: Bpk. Rahmat Kurnia',
                        prefixIcon: Icon(Icons.person_outline_rounded),
                      ),
                      validator: (v) =>
                          (v == null || v.trim().isEmpty) ? 'Mohon isi nama Anda' : null,
                    ),
                    const SizedBox(height: 12),

                    TextFormField(
                      controller: _phoneCtrl,
                      keyboardType: TextInputType.phone,
                      decoration: const InputDecoration(
                        labelText: 'Nomor WhatsApp Aktif',
                        hintText: 'Contoh: 081223344556',
                        prefixIcon: Icon(Icons.phone_android_rounded),
                      ),
                      validator: (v) => (v == null || v.trim().length < 9)
                          ? 'Mohon isi nomor WhatsApp yang valid'
                          : null,
                    ),
                    const SizedBox(height: 12),

                    TextFormField(
                      controller: _addressCtrl,
                      decoration: const InputDecoration(
                        labelText: 'Alamat Lengkap di Garut',
                        hintText: 'Contoh: Jl. Cimanuk No. 45, Tarogong Kidul, Garut',
                        prefixIcon: Icon(Icons.location_on_outlined),
                      ),
                      validator: (v) =>
                          (v == null || v.trim().isEmpty) ? 'Mohon isi alamat lokasi' : null,
                    ),
                    const SizedBox(height: 12),

                    TextFormField(
                      controller: _descCtrl,
                      maxLines: 3,
                      decoration: InputDecoration(
                        labelText: _serviceType == 'servis_komputer'
                            ? 'Keluhan / Kerusakan Perangkat'
                            : 'Catatan Kebutuhan / Jadwal Survei',
                        hintText: _serviceType == 'servis_komputer'
                            ? 'Contoh: Laptop lambat, ingin upgrade SSD 256GB & bersihkan kipas'
                            : 'Contoh: Mohon dijadwalkan survei hari Sabtu pagi',
                      ),
                    ),
                    const SizedBox(height: 18),

                    ElevatedButton.icon(
                      onPressed: _isSubmitting ? null : _submitForm,
                      icon: _isSubmitting
                          ? const SizedBox(
                              width: 16,
                              height: 16,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            )
                          : const Icon(Icons.send_rounded),
                      label: Text(
                        _isSubmitting
                            ? 'Menyimpan Pengajuan...'
                            : 'Buat Nomor Order & Lanjut ke WhatsApp',
                      ),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AcuuyColors.teal600,
                        padding: const EdgeInsets.symmetric(vertical: 15),
                      ),
                    ),
                  ],
                ),
              ),
      ),
    );
  }

  Widget _buildSuccessView() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          decoration: const BoxDecoration(
            color: AcuuyColors.teal50,
            shape: BoxShape.circle,
          ),
          child: const Icon(
            Icons.check_circle_rounded,
            size: 54,
            color: AcuuyColors.teal600,
          ),
        ),
        const SizedBox(height: 12),
        const Text(
          'Pengajuan Berhasil Dicatat!',
          style: TextStyle(
            fontSize: 19,
            fontWeight: FontWeight.w900,
            color: AcuuyColors.navy900,
          ),
        ),
        const SizedBox(height: 6),
        const Text(
          'Simpan nomor order Anda dan kirim konfirmasi ke WhatsApp Admin Acuuy CCTV agar segera diproses:',
          textAlign: TextAlign.center,
          style: TextStyle(fontSize: 12.5, color: AcuuyColors.slate600),
        ),
        const SizedBox(height: 14),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          decoration: BoxDecoration(
            color: AcuuyColors.navy900,
            borderRadius: BorderRadius.circular(14),
          ),
          child: Column(
            children: [
              const Text(
                'NOMOR ORDER ANDA',
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w800,
                  color: AcuuyColors.teal300,
                  letterSpacing: 1.1,
                ),
              ),
              const SizedBox(height: 4),
              SelectableText(
                _createdOrderNumber!,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w900,
                  color: Colors.white,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton.icon(
            onPressed: () {
              WhatsAppHelper.openBookingConfirmation(
                orderNumber: _createdOrderNumber!,
                serviceType: _serviceType,
                customerName: _nameCtrl.text.trim(),
                customerPhone: _phoneCtrl.text.trim(),
                address: _addressCtrl.text.trim(),
                description: _descCtrl.text.trim(),
                selectedPackage: _selectedPackage?.name,
                packagePrice: _selectedPackage?.price,
                settings: widget.storeService.settings,
              );
              Navigator.of(context).pop();
            },
            icon: const Icon(Icons.chat_rounded),
            label: const Text('Konfirmasi Sekarang via WhatsApp'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AcuuyColors.whatsappDark,
              padding: const EdgeInsets.symmetric(vertical: 15),
            ),
          ),
        ),
        const SizedBox(height: 8),
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Tutup'),
        ),
      ],
    );
  }
}
