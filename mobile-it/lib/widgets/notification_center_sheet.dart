import 'package:flutter/material.dart';
import '../models/store_models.dart';
import '../services/supabase_store_service.dart';
import '../theme/app_theme.dart';

class NotificationCenterSheet extends StatelessWidget {
  final SupabaseStoreService storeService;
  final void Function(AppNotification notification) onOpenNotificationTarget;

  const NotificationCenterSheet({
    super.key,
    required this.storeService,
    required this.onOpenNotificationTarget,
  });

  static Future<void> show(
    BuildContext context, {
    required SupabaseStoreService storeService,
    required void Function(AppNotification notification) onOpenNotificationTarget,
  }) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => NotificationCenterSheet(
        storeService: storeService,
        onOpenNotificationTarget: onOpenNotificationTarget,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: storeService,
      builder: (context, _) {
        final items = storeService.notifications;

        return Container(
          height: MediaQuery.of(context).size.height * 0.84,
          decoration: const BoxDecoration(
            color: AcuuyColors.backgroundOffWhite,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Header
              Container(
                padding: const EdgeInsets.fromLTRB(20, 18, 14, 16),
                decoration: const BoxDecoration(
                  color: AcuuyColors.navy900,
                  borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(9),
                          decoration: BoxDecoration(
                            color: AcuuyColors.teal500.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(
                            Icons.notifications_active_rounded,
                            color: AcuuyColors.teal300,
                            size: 22,
                          ),
                        ),
                        const SizedBox(width: 12),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Kotak Masuk Promo & Stok Baru',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 16.5,
                                  fontWeight: FontWeight.w900,
                                ),
                              ),
                              Text(
                                'Ketuk promo untuk langsung melihat detail & tanya via WA',
                                style: TextStyle(
                                  color: AcuuyColors.slate400,
                                  fontSize: 11.5,
                                ),
                              ),
                            ],
                          ),
                        ),
                        if (storeService.unreadNotificationCount > 0)
                          TextButton(
                            onPressed: storeService.markAllNotificationsRead,
                            child: const Text(
                              'Tandai Dibaca',
                              style: TextStyle(
                                color: AcuuyColors.teal300,
                                fontSize: 11.5,
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
                    const SizedBox(height: 12),

                    // Topic Subscription Toggles (FR-M12: Tanpa Login)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.07),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: Colors.white12),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'TOPIK PUSH NOTIFICATION AKTIF (TANPA PERLU LOGIN):',
                            style: TextStyle(
                              color: AcuuyColors.teal300,
                              fontSize: 9.5,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 0.6,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Row(
                            children: [
                              Expanded(
                                child: FilterChip(
                                  selected: storeService.subscribePromoCctv,
                                  onSelected: (v) => storeService.setTopicSubscription(
                                    promoCctv: v,
                                  ),
                                  label: const Text('Promo Paket CCTV'),
                                  selectedColor: AcuuyColors.teal400,
                                  backgroundColor: AcuuyColors.navy800,
                                  checkmarkColor: AcuuyColors.navy950,
                                  labelStyle: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w800,
                                    color: storeService.subscribePromoCctv
                                        ? AcuuyColors.navy950
                                        : Colors.white,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: FilterChip(
                                  selected: storeService.subscribeStokLaptop,
                                  onSelected: (v) => storeService.setTopicSubscription(
                                    stokLaptop: v,
                                  ),
                                  label: const Text('Stok Laptop Baru'),
                                  selectedColor: AcuuyColors.teal400,
                                  backgroundColor: AcuuyColors.navy800,
                                  checkmarkColor: AcuuyColors.navy950,
                                  labelStyle: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w800,
                                    color: storeService.subscribeStokLaptop
                                        ? AcuuyColors.navy950
                                        : Colors.white,
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

              // Demo Simulation Bar (Fase M1 Client Review — BRD 4.4 / PRD 15.8)
              Container(
                margin: const EdgeInsets.fromLTRB(16, 12, 16, 4),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AcuuyColors.teal50,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AcuuyColors.teal200),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.bolt_rounded, size: 16, color: AcuuyColors.teal700),
                        SizedBox(width: 4),
                        Text(
                          'Uji Simulasi Push Notification Masuk (Demo M1)',
                          style: TextStyle(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w900,
                            color: AcuuyColors.teal900,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () {
                              final notif = storeService.triggerDemoPushNotification(
                                isLaptopPromo: false,
                              );
                              Navigator.of(context).pop();
                              _showSimulatedPushBanner(context, notif);
                            },
                            icon: const Icon(Icons.videocam_rounded, size: 15),
                            label: const Text(
                              'Simulasi Promo CCTV',
                              style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800),
                            ),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: AcuuyColors.teal800,
                              side: const BorderSide(color: AcuuyColors.teal600),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () {
                              final notif = storeService.triggerDemoPushNotification(
                                isLaptopPromo: true,
                              );
                              Navigator.of(context).pop();
                              _showSimulatedPushBanner(context, notif);
                            },
                            icon: const Icon(Icons.laptop_chromebook_rounded, size: 15),
                            label: const Text(
                              'Simulasi Laptop Baru',
                              style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800),
                            ),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: AcuuyColors.navy900,
                              side: const BorderSide(color: AcuuyColors.navy900),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              // Notification List
              Expanded(
                child: items.isEmpty
                    ? const Center(
                        child: Text(
                          'Belum ada notifikasi promo untuk kategori terpilih.',
                          style: TextStyle(color: AcuuyColors.slate500),
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: items.length,
                        itemBuilder: (context, index) {
                          final item = items[index];
                          final isRead = storeService.isNotificationRead(item.id);
                          final isLaptop = item.category == 'stok_laptop_baru';

                          return GestureDetector(
                            onTap: () {
                              storeService.markNotificationRead(item.id);
                              Navigator.of(context).pop();
                              onOpenNotificationTarget(item);
                            },
                            child: Container(
                              margin: const EdgeInsets.only(bottom: 12),
                              padding: const EdgeInsets.all(14),
                              decoration: BoxDecoration(
                                color: isRead ? Colors.white : const Color(0xFFF0FDFA),
                                borderRadius: BorderRadius.circular(18),
                                border: Border.all(
                                  color: isRead
                                      ? AcuuyColors.slate200
                                      : AcuuyColors.teal400,
                                  width: isRead ? 1 : 1.6,
                                ),
                              ),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Container(
                                    width: 44,
                                    height: 44,
                                    decoration: BoxDecoration(
                                      color: isLaptop
                                          ? const Color(0xFFE0F2FE)
                                          : AcuuyColors.teal100,
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Icon(
                                      isLaptop
                                          ? Icons.laptop_mac_rounded
                                          : Icons.campaign_rounded,
                                      color: isLaptop
                                          ? const Color(0xFF0369A1)
                                          : AcuuyColors.teal700,
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          children: [
                                            Container(
                                              padding: const EdgeInsets.symmetric(
                                                horizontal: 8,
                                                vertical: 2,
                                              ),
                                              decoration: BoxDecoration(
                                                color: isLaptop
                                                    ? const Color(0xFF0284C7)
                                                    : AcuuyColors.teal600,
                                                borderRadius: BorderRadius.circular(6),
                                              ),
                                              child: Text(
                                                item.promoLabel.toUpperCase(),
                                                style: const TextStyle(
                                                  color: Colors.white,
                                                  fontSize: 9.5,
                                                  fontWeight: FontWeight.w900,
                                                ),
                                              ),
                                            ),
                                            if (item.priceDisplay != null) ...[
                                              const SizedBox(width: 8),
                                              Text(
                                                item.priceDisplay!,
                                                style: const TextStyle(
                                                  fontSize: 12,
                                                  fontWeight: FontWeight.w900,
                                                  color: AcuuyColors.teal700,
                                                ),
                                              ),
                                            ],
                                            const Spacer(),
                                            if (!isRead)
                                              Container(
                                                width: 8,
                                                height: 8,
                                                decoration: const BoxDecoration(
                                                  color: AcuuyColors.rose500,
                                                  shape: BoxShape.circle,
                                                ),
                                              ),
                                          ],
                                        ),
                                        const SizedBox(height: 6),
                                        Text(
                                          item.title,
                                          style: const TextStyle(
                                            fontSize: 13.5,
                                            fontWeight: FontWeight.w900,
                                            color: AcuuyColors.navy900,
                                          ),
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          item.body,
                                          style: const TextStyle(
                                            fontSize: 12,
                                            color: AcuuyColors.slate600,
                                            height: 1.35,
                                          ),
                                        ),
                                        const SizedBox(height: 8),
                                        const Row(
                                          children: [
                                            Text(
                                              'Ketuk untuk buka detail produk',
                                              style: TextStyle(
                                                fontSize: 11,
                                                fontWeight: FontWeight.w800,
                                                color: AcuuyColors.teal700,
                                              ),
                                            ),
                                            SizedBox(width: 4),
                                            Icon(
                                              Icons.arrow_forward_rounded,
                                              size: 13,
                                              color: AcuuyColors.teal700,
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
                        },
                      ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _showSimulatedPushBanner(BuildContext context, AppNotification notif) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        duration: const Duration(seconds: 6),
        behavior: SnackBarBehavior.floating,
        backgroundColor: AcuuyColors.navy900,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AcuuyColors.teal400, width: 1.5),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(
                  Icons.notifications_active_rounded,
                  color: AcuuyColors.teal300,
                  size: 16,
                ),
                const SizedBox(width: 6),
                Text(
                  'PUSH NOTIFICATION • ${notif.promoLabel.toUpperCase()}',
                  style: const TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w900,
                    color: AcuuyColors.teal300,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Text(
              notif.title,
              style: const TextStyle(
                fontWeight: FontWeight.w900,
                fontSize: 13,
                color: Colors.white,
              ),
            ),
            Text(
              notif.body,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontSize: 11.5, color: AcuuyColors.slate200),
            ),
          ],
        ),
        action: SnackBarAction(
          label: 'BUKA DETAIL',
          textColor: AcuuyColors.amber400,
          onPressed: () {
            storeService.markNotificationRead(notif.id);
            onOpenNotificationTarget(notif);
          },
        ),
      ),
    );
  }
}
