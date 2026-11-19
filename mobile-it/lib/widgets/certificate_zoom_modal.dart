import 'package:flutter/material.dart';
import '../models/store_models.dart';
import '../theme/app_theme.dart';

class CertificateCardWidget extends StatelessWidget {
  final Certificate certificate;
  final VoidCallback onTap;

  const CertificateCardWidget({
    super.key,
    required this.certificate,
    required this.onTap,
  });

  Color _brandColor(String brand) {
    final b = brand.toUpperCase();
    if (b.contains('HIKVISION')) return const Color(0xFFD9232A);
    if (b.contains('DAHUA')) return const Color(0xFF005BAC);
    if (b.contains('HILOOK')) return const Color(0xFFE11D48);
    if (b.contains('EZVIZ')) return const Color(0xFF0D9488);
    if (b.contains('IMOU')) return const Color(0xFFF59E0B);
    return const Color(0xFF1E3A8A); // AVTECH
  }

  @override
  Widget build(BuildContext context) {
    final accent = _brandColor(certificate.brand);

    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 255,
        margin: const EdgeInsets.only(right: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AcuuyColors.slate200),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Visual Certificate Document Preview
            Expanded(
              child: Container(
                margin: const EdgeInsets.all(10),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFFDF7),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AcuuyColors.amber500.withValues(alpha: 0.5), width: 1.5),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: accent,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            certificate.brand.toUpperCase(),
                            style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.w900,
                              fontSize: 10,
                              letterSpacing: 0.8,
                            ),
                          ),
                        ),
                        const Icon(
                          Icons.verified_rounded,
                          color: AcuuyColors.amber600,
                          size: 18,
                        ),
                      ],
                    ),
                    Column(
                      children: [
                        const Text(
                          'CERTIFICATE OF AUTHORIZATION',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 8.5,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 1.1,
                            color: AcuuyColors.slate500,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          certificate.title,
                          textAlign: TextAlign.center,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w900,
                            color: AcuuyColors.navy900,
                          ),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'ACUUY CCTV & KOMPUTER GARUT',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 9.5,
                            fontWeight: FontWeight.w900,
                            color: AcuuyColors.teal700,
                          ),
                        ),
                      ],
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Valid: ${certificate.validPeriod}',
                          style: const TextStyle(
                            fontSize: 8.5,
                            fontWeight: FontWeight.w700,
                            color: AcuuyColors.slate500,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: AcuuyColors.teal50,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: const Row(
                            children: [
                              Icon(Icons.zoom_in_rounded, size: 11, color: AcuuyColors.teal700),
                              SizedBox(width: 2),
                              Text(
                                'Zoom',
                                style: TextStyle(
                                  fontSize: 8.5,
                                  fontWeight: FontWeight.w800,
                                  color: AcuuyColors.teal700,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            // Footer metadata
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 9),
              color: AcuuyColors.slate100,
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          certificate.tier,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                            color: AcuuyColors.navy900,
                          ),
                        ),
                        Text(
                          certificate.issuer,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 9.5,
                            color: AcuuyColors.slate500,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Icon(
                    Icons.open_in_full_rounded,
                    size: 15,
                    color: AcuuyColors.teal700,
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

/// Interactive Zoom In/Out Lightbox Modal (PRD Bagian 13.3 & FR-M07)
class CertificateZoomModal extends StatefulWidget {
  final List<Certificate> certificates;
  final int initialIndex;

  const CertificateZoomModal({
    super.key,
    required this.certificates,
    required this.initialIndex,
  });

  @override
  State<CertificateZoomModal> createState() => _CertificateZoomModalState();
}

class _CertificateZoomModalState extends State<CertificateZoomModal> {
  late int _currentIndex;
  final TransformationController _transformController = TransformationController();
  double _currentScale = 1.0;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
  }

  @override
  void dispose() {
    _transformController.dispose();
    super.dispose();
  }

  void _setZoom(double scale) {
    final clamped = scale.clamp(0.75, 3.25);
    setState(() {
      _currentScale = clamped;
      _transformController.value = Matrix4.diagonal3Values(clamped, clamped, 1.0);
    });
  }

  void _switchCert(int index) {
    setState(() {
      _currentIndex = index;
      _currentScale = 1.0;
      _transformController.value = Matrix4.identity();
    });
  }

  @override
  Widget build(BuildContext context) {
    final cert = widget.certificates[_currentIndex];

    return Dialog.fullscreen(
      backgroundColor: AcuuyColors.navy950.withValues(alpha: 0.96),
      child: SafeArea(
        child: Column(
          children: [
            // Top Toolbar: Title + Zoom Controls + Close
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${cert.brand} • ${cert.tier}',
                          style: const TextStyle(
                            color: AcuuyColors.teal300,
                            fontSize: 11.5,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        Text(
                          cert.title,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 14,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    onPressed: () => _setZoom(_currentScale - 0.25),
                    icon: const Icon(Icons.zoom_out_rounded, color: Colors.white),
                    tooltip: 'Zoom Out',
                  ),
                  Text(
                    '${(_currentScale * 100).round()}%',
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w800,
                      fontSize: 12,
                    ),
                  ),
                  IconButton(
                    onPressed: () => _setZoom(_currentScale + 0.25),
                    icon: const Icon(Icons.zoom_in_rounded, color: Colors.white),
                    tooltip: 'Zoom In',
                  ),
                  IconButton(
                    onPressed: () => _setZoom(_currentScale == 1.0 ? 2.0 : 1.0),
                    icon: const Icon(Icons.restart_alt_rounded, color: AcuuyColors.teal300),
                    tooltip: 'Reset / 200%',
                  ),
                  IconButton(
                    onPressed: () => Navigator.of(context).pop(),
                    icon: const Icon(Icons.close_rounded, color: Colors.white),
                  ),
                ],
              ),
            ),

            // Interactive Pinch-to-Zoom & Drag Canvas
            Expanded(
              child: GestureDetector(
                onDoubleTap: () => _setZoom(_currentScale > 1.2 ? 1.0 : 2.0),
                child: InteractiveViewer(
                  transformationController: _transformController,
                  minScale: 0.75,
                  maxScale: 3.25,
                  onInteractionUpdate: (details) {
                    setState(() {
                      _currentScale = _transformController.value.getMaxScaleOnAxis();
                    });
                  },
                  child: Center(
                    child: Container(
                      margin: const EdgeInsets.all(20),
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFFFDF9),
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(color: AcuuyColors.amber500, width: 4),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.5),
                            blurRadius: 25,
                          ),
                        ],
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(
                            Icons.workspace_premium_rounded,
                            size: 46,
                            color: AcuuyColors.amber600,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            cert.issuer.toUpperCase(),
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 1.2,
                              color: AcuuyColors.slate600,
                            ),
                          ),
                          const SizedBox(height: 12),
                          const Text(
                            'CERTIFICATE OF OFFICIAL PARTNERSHIP',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 1.5,
                              color: AcuuyColors.amber600,
                            ),
                          ),
                          const SizedBox(height: 10),
                          Text(
                            cert.title,
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.w900,
                              color: AcuuyColors.navy900,
                            ),
                          ),
                          const SizedBox(height: 16),
                          const Text(
                            'Dengan ini menyatakan bahwa:',
                            style: TextStyle(fontSize: 11, color: AcuuyColors.slate500),
                          ),
                          const SizedBox(height: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                            decoration: BoxDecoration(
                              color: AcuuyColors.teal50,
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: AcuuyColors.teal200),
                            ),
                            child: const Text(
                              'ACUUY CCTV & KOMPUTER GARUT',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w900,
                                color: AcuuyColors.teal800,
                              ),
                            ),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            'Telah diverifikasi sebagai ${cert.tier} resmi produk ${cert.brand} dengan jaminan keaslian unit dan dukungan garansi purna jual resmi di Indonesia.',
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                              fontSize: 12,
                              height: 1.45,
                              color: AcuuyColors.slate700,
                            ),
                          ),
                          const SizedBox(height: 20),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'MASA BERLAKU',
                                    style: TextStyle(
                                      fontSize: 9.5,
                                      fontWeight: FontWeight.w800,
                                      color: AcuuyColors.slate500,
                                    ),
                                  ),
                                  Text(
                                    cert.validPeriod,
                                    style: const TextStyle(
                                      fontSize: 12.5,
                                      fontWeight: FontWeight.w900,
                                      color: AcuuyColors.navy900,
                                    ),
                                  ),
                                ],
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 10,
                                  vertical: 5,
                                ),
                                decoration: BoxDecoration(
                                  color: AcuuyColors.amber400.withValues(alpha: 0.2),
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(color: AcuuyColors.amber600),
                                ),
                                child: const Row(
                                  children: [
                                    Icon(
                                      Icons.verified_user_rounded,
                                      size: 14,
                                      color: AcuuyColors.amber600,
                                    ),
                                    SizedBox(width: 4),
                                    Text(
                                      'VERIFIED PARTNER',
                                      style: TextStyle(
                                        fontSize: 10,
                                        fontWeight: FontWeight.w900,
                                        color: AcuuyColors.navy900,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),

            // Hint + Bottom Brand Switcher Strip (PRD 13.3)
            const Padding(
              padding: EdgeInsets.only(bottom: 6),
              child: Text(
                'Cubit layar (pinch) atau ketuk 2x untuk memperbesar & geser sertifikat',
                style: TextStyle(color: AcuuyColors.slate400, fontSize: 11),
              ),
            ),
            SizedBox(
              height: 46,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 14),
                itemCount: widget.certificates.length,
                itemBuilder: (context, idx) {
                  final item = widget.certificates[idx];
                  final selected = idx == _currentIndex;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8, bottom: 8),
                    child: ChoiceChip(
                      label: Text(item.brand),
                      selected: selected,
                      onSelected: (_) => _switchCert(idx),
                      selectedColor: AcuuyColors.teal500,
                      backgroundColor: AcuuyColors.navy800,
                      labelStyle: TextStyle(
                        color: selected ? AcuuyColors.navy950 : Colors.white,
                        fontWeight: FontWeight.w800,
                        fontSize: 11.5,
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
