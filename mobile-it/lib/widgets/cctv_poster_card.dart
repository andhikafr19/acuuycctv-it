import 'package:flutter/material.dart';
import '../models/store_models.dart';
import '../theme/app_theme.dart';

class CctvPosterCard extends StatelessWidget {
  final CctvPackage pkg;
  final bool isHighlighted;
  final bool isFavorite;
  final VoidCallback onToggleFavorite;
  final VoidCallback onAskWhatsApp;
  final VoidCallback onBookPackage;

  const CctvPosterCard({
    super.key,
    required this.pkg,
    this.isHighlighted = false,
    required this.isFavorite,
    required this.onToggleFavorite,
    required this.onAskWhatsApp,
    required this.onBookPackage,
  });

  List<Color> _brandGradient(String brand) {
    final lower = brand.toLowerCase();
    if (lower.contains('hilook')) {
      return [const Color(0xFFE11D48), const Color(0xFF9F1239)];
    }
    if (lower.contains('dahua')) {
      return [const Color(0xFF0284C7), const Color(0xFF1E3A8A)];
    }
    if (lower.contains('ezviz') || lower.contains('imou')) {
      return [const Color(0xFF059669), const Color(0xFF065F46)];
    }
    // Default Hikvision Teal/Navy
    return [AcuuyColors.teal600, AcuuyColors.navy900];
  }

  Color _seriesBadgeColor(String series) {
    if (series.toLowerCase().contains('colorvu')) {
      return AcuuyColors.amber500;
    }
    if (series.toLowerCase().contains('audio')) {
      return const Color(0xFF38BDF8);
    }
    return AcuuyColors.teal400;
  }

  @override
  Widget build(BuildContext context) {
    final gradientColors = _brandGradient(pkg.brand);

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: isHighlighted ? AcuuyColors.navy900 : Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: isHighlighted ? AcuuyColors.teal400 : AcuuyColors.slate200,
          width: isHighlighted ? 2.2 : 1.0,
        ),
        boxShadow: [
          BoxShadow(
            color: isHighlighted
                ? AcuuyColors.teal600.withValues(alpha: 0.22)
                : Colors.black.withValues(alpha: 0.04),
            blurRadius: isHighlighted ? 18 : 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (isHighlighted)
            Container(
              padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 12),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [AcuuyColors.teal400, AcuuyColors.emerald500],
                ),
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.star_rounded, size: 15, color: AcuuyColors.navy950),
                  SizedBox(width: 4),
                  Text(
                    'REKOMENDASI TEKNISI • PALING LARIS DI GARUT',
                    style: TextStyle(
                      fontSize: 10.5,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 0.7,
                      color: AcuuyColors.navy950,
                    ),
                  ),
                ],
              ),
            ),

          // Hybrid Modern Visual Poster Banner
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: gradientColors,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top Row: Brand + Tag + Bookmark
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.16),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.white24),
                      ),
                      child: Text(
                        pkg.brand.toUpperCase(),
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w900,
                          fontSize: 11,
                          letterSpacing: 0.6,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    if (pkg.tag != null && pkg.tag!.isNotEmpty)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                        decoration: BoxDecoration(
                          color: AcuuyColors.amber400,
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          pkg.tag!.toUpperCase(),
                          style: const TextStyle(
                            color: AcuuyColors.navy950,
                            fontWeight: FontWeight.w900,
                            fontSize: 9.5,
                          ),
                        ),
                      ),
                    const Spacer(),
                    InkWell(
                      onTap: onToggleFavorite,
                      borderRadius: BorderRadius.circular(20),
                      child: Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                          color: Colors.black.withValues(alpha: 0.25),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          isFavorite ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                          size: 18,
                          color: isFavorite ? AcuuyColors.rose500 : Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // Poster Headline & Series Badge
                Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'PAKET ${pkg.cameraCount} KAMERA',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 20,
                              fontWeight: FontWeight.w900,
                              height: 1.1,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Wrap(
                            spacing: 6,
                            runSpacing: 4,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 8,
                                  vertical: 2.5,
                                ),
                                decoration: BoxDecoration(
                                  color: Colors.black.withValues(alpha: 0.3),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  pkg.isIpCamera ? 'IP CAMERA DIGITAL' : 'CCTV ANALOG HD',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 10,
                                    fontWeight: FontWeight.w800,
                                  ),
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 8,
                                  vertical: 2.5,
                                ),
                                decoration: BoxDecoration(
                                  color: _seriesBadgeColor(pkg.series),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  '${pkg.series.toUpperCase()} • ${pkg.resolution}',
                                  style: const TextStyle(
                                    color: AcuuyColors.navy950,
                                    fontSize: 10,
                                    fontWeight: FontWeight.w900,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    // Visual Camera Kit Illustration Box
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.14),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: Colors.white24),
                      ),
                      child: Column(
                        children: [
                          const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.videocam_rounded, color: Colors.white, size: 18),
                              SizedBox(width: 4),
                              Icon(Icons.dns_rounded, color: AcuuyColors.teal200, size: 16),
                            ],
                          ),
                          const SizedBox(height: 3),
                          Text(
                            '${pkg.indoorCount} In + ${pkg.outdoorCount} Out',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // Quick Hardware Pills (Indoor/Outdoor, HDD, Cable/Recorder)
                Row(
                  children: [
                    _HardwarePill(
                      icon: Icons.home_work_outlined,
                      label: '${pkg.indoorCount} Indoor + ${pkg.outdoorCount} Outdoor',
                    ),
                    const SizedBox(width: 6),
                    _HardwarePill(
                      icon: Icons.storage_rounded,
                      label: 'HDD ${pkg.hddSize}',
                    ),
                    const SizedBox(width: 6),
                    Expanded(
                      child: _HardwarePill(
                        icon: Icons.dvr_rounded,
                        label: pkg.recorderSpec,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Card Body: Name, Description, Transparent Price, Features, CTAs
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  pkg.name,
                  style: TextStyle(
                    fontSize: 15.5,
                    fontWeight: FontWeight.w900,
                    color: isHighlighted ? Colors.white : AcuuyColors.navy900,
                  ),
                ),
                if (pkg.bestFor.isNotEmpty) ...[
                  const SizedBox(height: 3),
                  Text(
                    'Cocok untuk: ${pkg.bestFor}',
                    style: TextStyle(
                      fontSize: 11.5,
                      fontWeight: FontWeight.w700,
                      color: isHighlighted ? AcuuyColors.teal300 : AcuuyColors.teal700,
                    ),
                  ),
                ],
                const SizedBox(height: 6),
                Text(
                  pkg.description,
                  style: TextStyle(
                    fontSize: 12,
                    height: 1.4,
                    color: isHighlighted ? AcuuyColors.slate400 : AcuuyColors.slate600,
                  ),
                ),
                const SizedBox(height: 12),

                // Price Box
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  decoration: BoxDecoration(
                    color: isHighlighted
                        ? Colors.white.withValues(alpha: 0.06)
                        : AcuuyColors.teal50,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(
                      color: isHighlighted
                          ? Colors.white12
                          : AcuuyColors.teal200,
                    ),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text(
                                  'Harga Terima Beres',
                                  style: TextStyle(
                                    fontSize: 10.5,
                                    fontWeight: FontWeight.w700,
                                    color: isHighlighted
                                        ? AcuuyColors.slate400
                                        : AcuuyColors.slate600,
                                  ),
                                ),
                                if (pkg.originalPrice != null &&
                                    pkg.originalPrice!.isNotEmpty) ...[
                                  const SizedBox(width: 8),
                                  Text(
                                    pkg.originalPrice!,
                                    style: TextStyle(
                                      fontSize: 11,
                                      decoration: TextDecoration.lineThrough,
                                      color: isHighlighted
                                          ? AcuuyColors.slate400
                                          : AcuuyColors.slate500,
                                    ),
                                  ),
                                ],
                              ],
                            ),
                            const SizedBox(height: 2),
                            Text(
                              pkg.price,
                              style: TextStyle(
                                fontSize: 21,
                                fontWeight: FontWeight.w900,
                                color: isHighlighted
                                    ? AcuuyColors.teal300
                                    : AcuuyColors.teal700,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: isHighlighted
                              ? AcuuyColors.teal500.withValues(alpha: 0.2)
                              : Colors.white,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          'Gratis Pasang\n& Setting HP',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 9.5,
                            fontWeight: FontWeight.w800,
                            color: isHighlighted
                                ? AcuuyColors.teal200
                                : AcuuyColors.teal800,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),

                // Features list
                ...pkg.features.take(5).map(
                      (feat) => Padding(
                        padding: const EdgeInsets.only(bottom: 5),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Icon(
                              Icons.check_circle_rounded,
                              size: 15,
                              color: isHighlighted
                                  ? AcuuyColors.teal400
                                  : AcuuyColors.teal600,
                            ),
                            const SizedBox(width: 7),
                            Expanded(
                              child: Text(
                                feat,
                                style: TextStyle(
                                  fontSize: 11.8,
                                  color: isHighlighted
                                      ? AcuuyColors.slate200
                                      : AcuuyColors.slate700,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                const SizedBox(height: 12),

                // Dual Action Buttons: Tanya via WA (FR-M04) & Pilih Paket / Booking (FR-M05)
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: onAskWhatsApp,
                        icon: const Icon(Icons.chat_rounded, size: 16),
                        label: const Text('Tanya via WA'),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: isHighlighted
                              ? AcuuyColors.teal300
                              : AcuuyColors.whatsappDark,
                          side: BorderSide(
                            color: isHighlighted
                                ? AcuuyColors.teal400
                                : AcuuyColors.whatsappGreen,
                            width: 1.4,
                          ),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          textStyle: const TextStyle(
                            fontWeight: FontWeight.w800,
                            fontSize: 12.5,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: onBookPackage,
                        icon: const Icon(Icons.assignment_turned_in_rounded, size: 16),
                        label: const Text('Pilih Paket Ini'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: isHighlighted
                              ? AcuuyColors.teal400
                              : AcuuyColors.navy900,
                          foregroundColor: isHighlighted
                              ? AcuuyColors.navy950
                              : Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          textStyle: const TextStyle(
                            fontWeight: FontWeight.w900,
                            fontSize: 12.5,
                          ),
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
    );
  }
}

class _HardwarePill extends StatelessWidget {
  final IconData icon;
  final String label;

  const _HardwarePill({
    required this.icon,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
      decoration: BoxDecoration(
        color: Colors.black.withValues(alpha: 0.22),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: AcuuyColors.teal200),
          const SizedBox(width: 4),
          Flexible(
            child: Text(
              label,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 10,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
