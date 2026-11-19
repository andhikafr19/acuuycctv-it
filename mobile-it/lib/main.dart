import 'package:flutter/material.dart';
import 'models/store_models.dart';
import 'screens/cctv_catalog_screen.dart';
import 'screens/contact_screen.dart';
import 'screens/home_screen.dart';
import 'screens/laptop_catalog_screen.dart';
import 'screens/services_tools_screen.dart';
import 'services/supabase_store_service.dart';
import 'theme/app_theme.dart';
import 'utils/whatsapp_helper.dart';
import 'widgets/booking_form_sheet.dart';
import 'widgets/notification_center_sheet.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const AcuuyCctvApp());
}

class AcuuyCctvApp extends StatefulWidget {
  const AcuuyCctvApp({super.key});

  @override
  State<AcuuyCctvApp> createState() => _AcuuyCctvAppState();
}

class _AcuuyCctvAppState extends State<AcuuyCctvApp> {
  final SupabaseStoreService _storeService = SupabaseStoreService();

  @override
  void initState() {
    super.initState();
    _storeService.initialize();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Acuuy CCTV Garut',
      debugShowCheckedModeBanner: false,
      theme: AcuuyTheme.lightTheme,
      home: MainShellScreen(storeService: _storeService),
    );
  }
}

class MainShellScreen extends StatefulWidget {
  final SupabaseStoreService storeService;

  const MainShellScreen({
    super.key,
    required this.storeService,
  });

  @override
  State<MainShellScreen> createState() => _MainShellScreenState();
}

class _MainShellScreenState extends State<MainShellScreen> {
  int _currentTabIndex = 0;

  void _setTab(int index) {
    setState(() {
      _currentTabIndex = index;
    });
  }

  /// Deep-link handler saat pelanggan mengetuk Push Notification / Kotak Masuk Promo (PRD 15.9 Flow M3)
  void _handleNotificationDeepLink(AppNotification notification) {
    final store = widget.storeService;
    if (notification.targetType == 'laptop') {
      _setTab(2);
      final targetLaptop = store.laptops.cast<Laptop?>().firstWhere(
            (l) => l?.id == notification.targetId || l?.slug == notification.targetId,
            orElse: () => store.laptops.isNotEmpty ? store.laptops.first : null,
          );
      if (targetLaptop != null) {
        LaptopCatalogScreen.showLaptopDetailModal(
          context,
          laptop: targetLaptop,
          storeService: store,
        );
      }
      return;
    }

    if (notification.targetType == 'cctv_package') {
      _setTab(1);
      final targetPkg = store.cctvPackages.cast<CctvPackage?>().firstWhere(
            (p) => p?.id == notification.targetId,
            orElse: () =>
                store.cctvPackages.isNotEmpty ? store.cctvPackages.first : null,
          );
      if (targetPkg != null) {
        _showPromoPackageQuickModal(targetPkg, notification);
      }
      return;
    }
  }

  void _showPromoPackageQuickModal(CctvPackage pkg, AppNotification notif) {
    final store = widget.storeService;
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AcuuyColors.teal600,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    notif.promoLabel.toUpperCase(),
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
                const Spacer(),
                IconButton(
                  onPressed: () => Navigator.of(ctx).pop(),
                  icon: const Icon(Icons.close_rounded),
                ),
              ],
            ),
            Text(
              pkg.name,
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w900,
                color: AcuuyColors.navy900,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              pkg.price,
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w900,
                color: AcuuyColors.teal700,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              pkg.description,
              style: const TextStyle(fontSize: 12.5, color: AcuuyColors.slate600),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {
                      Navigator.of(ctx).pop();
                      BookingFormSheet.show(
                        context,
                        storeService: store,
                        initialServiceType: 'cctv',
                        presetPackage: pkg,
                      );
                    },
                    icon: const Icon(Icons.assignment_turned_in_rounded, size: 16),
                    label: const Text('Form Booking'),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Navigator.of(ctx).pop();
                      WhatsAppHelper.openCctvPackageInquiry(
                        pkg: pkg,
                        settings: store.settings,
                      );
                    },
                    icon: const Icon(Icons.chat_rounded, size: 16),
                    label: const Text('Ambil Promo WA'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AcuuyColors.whatsappDark,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final store = widget.storeService;

    return ListenableBuilder(
      listenable: store,
      builder: (context, _) {
        final unreadCount = store.unreadNotificationCount;
        final favCount =
            store.favoritePackageIds.length + store.favoriteLaptopIds.length;

        final screens = [
          HomeScreen(
            storeService: store,
            onNavigateToTab: _setTab,
          ),
          CctvCatalogScreen(storeService: store),
          LaptopCatalogScreen(storeService: store),
          ServicesToolsScreen(storeService: store),
          ContactScreen(storeService: store),
        ];

        return Scaffold(
          appBar: AppBar(
            titleSpacing: 14,
            title: Row(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.asset(
                    'assets/images/acuuy_cctv_mark.png',
                    width: 32,
                    height: 32,
                    fit: BoxFit.contain,
                    errorBuilder: (_, _, _) => Container(
                      width: 32,
                      height: 32,
                      decoration: BoxDecoration(
                        color: AcuuyColors.teal500,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(
                        Icons.videocam_rounded,
                        size: 18,
                        color: AcuuyColors.navy950,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'ACUUY CCTV',
                        style: TextStyle(
                          fontSize: 15.5,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 0.6,
                          color: Colors.white,
                        ),
                      ),
                      Text(
                        'CCTV • Servis PC • Laptop Bekas Garut',
                        style: TextStyle(
                          fontSize: 10,
                          color: AcuuyColors.teal300,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            actions: [
              // Tombol Favorit / Bookmark (FR-M09)
              IconButton(
                tooltip: 'Favorit Saya',
                onPressed: () => _setTab(3),
                icon: Badge(
                  isLabelVisible: favCount > 0,
                  label: Text('$favCount'),
                  backgroundColor: AcuuyColors.rose500,
                  child: const Icon(Icons.favorite_border_rounded),
                ),
              ),

              // Tombol Kotak Masuk Promo 🔔 (FR-M12 & FR-M12a)
              Padding(
                padding: const EdgeInsets.only(right: 8),
                child: IconButton(
                  tooltip: 'Kotak Masuk Promo & Barang Baru',
                  onPressed: () => NotificationCenterSheet.show(
                    context,
                    storeService: store,
                    onOpenNotificationTarget: _handleNotificationDeepLink,
                  ),
                  icon: Badge(
                    isLabelVisible: unreadCount > 0,
                    label: Text('$unreadCount'),
                    backgroundColor: AcuuyColors.amber500,
                    textColor: AcuuyColors.navy950,
                    child: const Icon(Icons.notifications_none_rounded),
                  ),
                ),
              ),
            ],
          ),
          body: IndexedStack(
            index: _currentTabIndex,
            children: screens,
          ),
          floatingActionButton: FloatingActionButton.extended(
            onPressed: () => WhatsAppHelper.openDirectConsultation(
              settings: store.settings,
            ),
            backgroundColor: AcuuyColors.whatsappDark,
            foregroundColor: Colors.white,
            icon: const Icon(Icons.chat_rounded, size: 19),
            label: const Text(
              'Tanya WA',
              style: TextStyle(fontWeight: FontWeight.w900, fontSize: 12.5),
            ),
          ),
          bottomNavigationBar: NavigationBar(
            selectedIndex: _currentTabIndex,
            onDestinationSelected: _setTab,
            backgroundColor: Colors.white,
            indicatorColor: AcuuyColors.teal100,
            destinations: const [
              NavigationDestination(
                icon: Icon(Icons.home_outlined),
                selectedIcon: Icon(Icons.home_rounded, color: AcuuyColors.teal800),
                label: 'Beranda',
              ),
              NavigationDestination(
                icon: Icon(Icons.videocam_outlined),
                selectedIcon: Icon(Icons.videocam_rounded, color: AcuuyColors.teal800),
                label: 'Paket CCTV',
              ),
              NavigationDestination(
                icon: Icon(Icons.laptop_chromebook_outlined),
                selectedIcon: Icon(
                  Icons.laptop_chromebook_rounded,
                  color: AcuuyColors.teal800,
                ),
                label: 'Laptop',
              ),
              NavigationDestination(
                icon: Icon(Icons.calculate_outlined),
                selectedIcon: Icon(Icons.calculate_rounded, color: AcuuyColors.teal800),
                label: 'Simulasi & IT',
              ),
              NavigationDestination(
                icon: Icon(Icons.storefront_outlined),
                selectedIcon: Icon(Icons.storefront_rounded, color: AcuuyColors.teal800),
                label: 'Kontak',
              ),
            ],
          ),
        );
      },
    );
  }
}
