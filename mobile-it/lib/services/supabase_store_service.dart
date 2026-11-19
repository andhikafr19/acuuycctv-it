import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../data/default_data.dart';
import '../models/store_models.dart';

class SupabaseStoreService extends ChangeNotifier {
  // Public Supabase URL & Publishable Anon Key (NO secret/service role key inside APK — PRD 15.5)
  static const String supabaseUrl = 'https://zwvvjxsazvimwewlxndi.supabase.co';
  static const String supabaseAnonKey = 'sb_publishable_N3mr4i_yZruyBCF9OHdijA_QjdP5Fji';

  StoreSettings _settings = DefaultStoreData.settings;
  List<CctvPackage> _cctvPackages = DefaultStoreData.cctvPackages;
  List<Laptop> _laptops = DefaultStoreData.laptops;
  List<Certificate> _certificates = DefaultStoreData.certificates;
  List<Portfolio> _portfolios = DefaultStoreData.portfolios;
  final List<Technician> _technicians = DefaultStoreData.technicians;
  List<AppNotification> _notifications = DefaultStoreData.notifications;

  Set<String> _favoritePackageIds = {};
  Set<String> _favoriteLaptopIds = {};
  Set<String> _readNotificationIds = {};
  List<LocalSubmissionRecord> _localHistory = [];

  bool _subscribePromoCctv = true;
  bool _subscribeStokLaptop = true;
  bool _isLoading = false;
  bool _isOnlineSync = false;
  DateTime? _lastSyncedAt;

  StoreSettings get settings => _settings;
  List<CctvPackage> get cctvPackages =>
      _cctvPackages.where((p) => p.isActive).toList();
  List<CctvPackage> get popularThreePackages =>
      DefaultStoreData.selectThreePopularPackages(_cctvPackages);
  List<Laptop> get laptops => _laptops;
  List<Certificate> get certificates =>
      _certificates.where((c) => c.isActive).toList();
  List<Portfolio> get portfolios => _portfolios;
  List<Technician> get technicians => _technicians;
  List<AppNotification> get notifications {
    return _notifications.where((n) {
      if (n.category == 'promo_cctv' && !_subscribePromoCctv) return false;
      if (n.category == 'stok_laptop_baru' && !_subscribeStokLaptop) return false;
      return true;
    }).toList();
  }

  Set<String> get favoritePackageIds => _favoritePackageIds;
  Set<String> get favoriteLaptopIds => _favoriteLaptopIds;
  List<CctvPackage> get favoritePackages =>
      cctvPackages.where((p) => _favoritePackageIds.contains(p.id)).toList();
  List<Laptop> get favoriteLaptops =>
      _laptops.where((l) => _favoriteLaptopIds.contains(l.id)).toList();
  List<LocalSubmissionRecord> get localHistory => _localHistory;

  bool get subscribePromoCctv => _subscribePromoCctv;
  bool get subscribeStokLaptop => _subscribeStokLaptop;
  bool get isLoading => _isLoading;
  bool get isOnlineSync => _isOnlineSync;
  DateTime? get lastSyncedAt => _lastSyncedAt;

  int get unreadNotificationCount =>
      notifications.where((n) => !_readNotificationIds.contains(n.id)).length;

  bool isNotificationRead(String id) => _readNotificationIds.contains(id);
  bool isPackageFavorite(String id) => _favoritePackageIds.contains(id);
  bool isLaptopFavorite(String id) => _favoriteLaptopIds.contains(id);

  Map<String, String> get _headers => {
        'apikey': supabaseAnonKey,
        'Authorization': 'Bearer $supabaseAnonKey',
        'Content-Type': 'application/json',
      };

  Future<void> initialize() async {
    await _loadLocalPreferences();
    await refreshFromSupabase();
  }

  Future<void> _loadLocalPreferences() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      _favoritePackageIds =
          (prefs.getStringList('fav_packages') ?? []).toSet();
      _favoriteLaptopIds =
          (prefs.getStringList('fav_laptops') ?? []).toSet();
      _readNotificationIds =
          (prefs.getStringList('read_notifications') ?? []).toSet();
      _subscribePromoCctv = prefs.getBool('sub_promo_cctv') ?? true;
      _subscribeStokLaptop = prefs.getBool('sub_stok_laptop') ?? true;

      final historyJson = prefs.getString('local_history');
      if (historyJson != null && historyJson.isNotEmpty) {
        final decoded = jsonDecode(historyJson) as List;
        _localHistory = decoded
            .map((e) => LocalSubmissionRecord.fromJson(Map<String, dynamic>.from(e)))
            .toList();
      }

      // Load offline cached store data if available (FR-M11)
      final cachedPackages = prefs.getString('cache_cctv_packages');
      if (cachedPackages != null) {
        final list = (jsonDecode(cachedPackages) as List)
            .map((e) => CctvPackage.fromJson(Map<String, dynamic>.from(e)))
            .toList();
        if (list.isNotEmpty) _cctvPackages = list;
      }

      final cachedLaptops = prefs.getString('cache_laptops');
      if (cachedLaptops != null) {
        final list = (jsonDecode(cachedLaptops) as List)
            .map((e) => Laptop.fromJson(Map<String, dynamic>.from(e)))
            .toList();
        if (list.isNotEmpty) _laptops = list;
      }

      final cachedSettings = prefs.getString('cache_settings');
      if (cachedSettings != null) {
        _settings = StoreSettings.fromJson(
          Map<String, dynamic>.from(jsonDecode(cachedSettings)),
        );
      }

      notifyListeners();
    } catch (e) {
      debugPrint('Local preference load warning: $e');
    }
  }

  Future<void> refreshFromSupabase() async {
    _isLoading = true;
    notifyListeners();

    bool anySuccess = false;
    final prefs = await SharedPreferences.getInstance();

    // 1. Fetch store_settings
    try {
      final res = await http
          .get(
            Uri.parse('$supabaseUrl/rest/v1/store_settings?id=eq.default&select=*'),
            headers: _headers,
          )
          .timeout(const Duration(seconds: 6));
      if (res.statusCode == 200) {
        final list = jsonDecode(res.body) as List;
        if (list.isNotEmpty) {
          _settings = StoreSettings.fromJson(Map<String, dynamic>.from(list.first));
          await prefs.setString('cache_settings', jsonEncode(_settings.toJson()));
          anySuccess = true;
        }
      }
    } catch (_) {}

    // 2. Fetch cctv_packages
    try {
      final res = await http
          .get(
            Uri.parse('$supabaseUrl/rest/v1/cctv_packages?select=*&order=sort_order.asc'),
            headers: _headers,
          )
          .timeout(const Duration(seconds: 6));
      if (res.statusCode == 200) {
        final list = (jsonDecode(res.body) as List)
            .map((e) => CctvPackage.fromJson(Map<String, dynamic>.from(e)))
            .toList();
        if (list.isNotEmpty) {
          _cctvPackages = list;
          await prefs.setString(
            'cache_cctv_packages',
            jsonEncode(_cctvPackages.map((e) => e.toJson()).toList()),
          );
          anySuccess = true;
        }
      }
    } catch (_) {}

    // 3. Fetch laptops
    try {
      final res = await http
          .get(
            Uri.parse('$supabaseUrl/rest/v1/laptops?select=*&order=created_at.desc'),
            headers: _headers,
          )
          .timeout(const Duration(seconds: 6));
      if (res.statusCode == 200) {
        final list = (jsonDecode(res.body) as List)
            .map((e) => Laptop.fromJson(Map<String, dynamic>.from(e)))
            .toList();
        if (list.isNotEmpty) {
          _laptops = list;
          await prefs.setString(
            'cache_laptops',
            jsonEncode(_laptops.map((e) => e.toJson()).toList()),
          );
          anySuccess = true;
        }
      }
    } catch (_) {}

    // 4. Fetch portfolios
    try {
      final res = await http
          .get(
            Uri.parse('$supabaseUrl/rest/v1/portfolios?select=*&order=completion_date.desc'),
            headers: _headers,
          )
          .timeout(const Duration(seconds: 6));
      if (res.statusCode == 200) {
        final list = (jsonDecode(res.body) as List)
            .map((e) => Portfolio.fromJson(Map<String, dynamic>.from(e)))
            .toList();
        if (list.isNotEmpty) {
          _portfolios = list;
          anySuccess = true;
        }
      }
    } catch (_) {}

    // 5. Fetch certificates
    try {
      final res = await http
          .get(
            Uri.parse(
                '$supabaseUrl/rest/v1/certificates?is_active=eq.true&select=*&order=sort_order.asc'),
            headers: _headers,
          )
          .timeout(const Duration(seconds: 6));
      if (res.statusCode == 200) {
        final list = (jsonDecode(res.body) as List)
            .map((e) => Certificate.fromJson(Map<String, dynamic>.from(e)))
            .toList();
        if (list.isNotEmpty) {
          _certificates = list;
          anySuccess = true;
        }
      }
    } catch (_) {}

    // 6. Fetch app_notifications (Kotak Masuk Promo 🔔)
    try {
      final res = await http
          .get(
            Uri.parse(
                '$supabaseUrl/rest/v1/app_notifications?is_active=eq.true&select=*&order=created_at.desc&limit=30'),
            headers: _headers,
          )
          .timeout(const Duration(seconds: 6));
      if (res.statusCode == 200) {
        final list = (jsonDecode(res.body) as List)
            .map((e) => AppNotification.fromJson(Map<String, dynamic>.from(e)))
            .toList();
        if (list.isNotEmpty) {
          _notifications = list;
          anySuccess = true;
        }
      }
    } catch (_) {}

    _isOnlineSync = anySuccess;
    if (anySuccess) {
      _lastSyncedAt = DateTime.now();
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<void> toggleFavoritePackage(String packageId) async {
    if (_favoritePackageIds.contains(packageId)) {
      _favoritePackageIds.remove(packageId);
    } else {
      _favoritePackageIds.add(packageId);
    }
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList('fav_packages', _favoritePackageIds.toList());
  }

  Future<void> toggleFavoriteLaptop(String laptopId) async {
    if (_favoriteLaptopIds.contains(laptopId)) {
      _favoriteLaptopIds.remove(laptopId);
    } else {
      _favoriteLaptopIds.add(laptopId);
    }
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList('fav_laptops', _favoriteLaptopIds.toList());
  }

  Future<void> markNotificationRead(String notificationId) async {
    _readNotificationIds.add(notificationId);
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList('read_notifications', _readNotificationIds.toList());
  }

  Future<void> markAllNotificationsRead() async {
    for (final n in _notifications) {
      _readNotificationIds.add(n.id);
    }
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList('read_notifications', _readNotificationIds.toList());
  }

  Future<void> setTopicSubscription({
    bool? promoCctv,
    bool? stokLaptop,
  }) async {
    if (promoCctv != null) _subscribePromoCctv = promoCctv;
    if (stokLaptop != null) _subscribeStokLaptop = stokLaptop;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('sub_promo_cctv', _subscribePromoCctv);
    await prefs.setBool('sub_stok_laptop', _subscribeStokLaptop);
  }

  /// Tambah notifikasi simulasi (untuk Demo M1 review client sesuai BRD 4.4 & PRD 15.8)
  AppNotification triggerDemoPushNotification({required bool isLaptopPromo}) {
    final now = DateTime.now();
    final AppNotification demoNotif;
    if (isLaptopPromo && _laptops.isNotEmpty) {
      final target = _laptops.first;
      demoNotif = AppNotification(
        id: 'demo-${now.millisecondsSinceEpoch}',
        title: '🔥 Stok Baru Masuk: ${target.title}',
        body:
            '${target.processor} • RAM ${target.ram} • ${target.storage} (${target.conditionGrade}) siap pakai bergaransi toko!',
        category: 'stok_laptop_baru',
        promoLabel: 'Push Notif Stok Baru',
        imageUrl: target.images.isNotEmpty ? target.images.first : null,
        targetType: 'laptop',
        targetId: target.id,
        priceDisplay: 'Rp ${target.effectivePrice}',
        createdAt: now.toIso8601String(),
      );
    } else {
      final target = popularThreePackages.length > 1
          ? popularThreePackages[1]
          : _cctvPackages.first;
      demoNotif = AppNotification(
        id: 'demo-${now.millisecondsSinceEpoch}',
        title: '🎉 Flash Promo: ${target.name}!',
        body:
            'Pemasangan rapi terima beres di Garut termasuk ${target.recorderSpec}, HDD ${target.hddSize} & setting HP!',
        category: 'promo_cctv',
        promoLabel: 'Flash Promo CCTV',
        targetType: 'cctv_package',
        targetId: target.id,
        priceDisplay: target.price,
        createdAt: now.toIso8601String(),
      );
    }

    _notifications = [demoNotif, ..._notifications];
    notifyListeners();
    return demoNotif;
  }

  Future<void> addLocalHistory(LocalSubmissionRecord record) async {
    _localHistory = [record, ..._localHistory].take(30).toList();
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(
      'local_history',
      jsonEncode(_localHistory.map((e) => e.toJson()).toList()),
    );
  }

  /// Kirim Booking Jasa ke Supabase `orders` (FR-M05)
  Future<bool> submitBookingOrder({
    required String orderNumber,
    required String serviceType,
    required String customerName,
    required String customerPhone,
    required String address,
    required String description,
    required int estimatedCost,
    Map<String, dynamic>? specificDetails,
  }) async {
    final payload = {
      'order_number': orderNumber,
      'service_type': serviceType,
      'customer_name': customerName,
      'customer_phone': customerPhone,
      'address': address,
      'city': 'Garut',
      'description': description,
      'status': 'baru',
      'estimated_cost': estimatedCost,
      'final_cost': 0,
      'specific_details': specificDetails ?? {},
    };

    bool remoteSuccess = false;
    try {
      final res = await http
          .post(
            Uri.parse('$supabaseUrl/rest/v1/orders'),
            headers: {
              ..._headers,
              'Prefer': 'return=minimal',
            },
            body: jsonEncode(payload),
          )
          .timeout(const Duration(seconds: 7));
      remoteSuccess = res.statusCode >= 200 && res.statusCode < 300;
    } catch (_) {}

    await addLocalHistory(
      LocalSubmissionRecord(
        referenceNumber: orderNumber,
        type: serviceType,
        title: specificDetails?['selected_package']?.toString() ??
            (serviceType == 'cctv'
                ? 'Booking Instalasi CCTV'
                : serviceType == 'servis_komputer'
                    ? 'Pengajuan Servis Komputer/Laptop'
                    : 'Pengajuan Konsultasi IT'),
        subtitle: '$customerName • $address',
        priceOrEstimate: estimatedCost > 0 ? 'Rp $estimatedCost' : 'Menunggu Estimasi',
        createdAt: DateTime.now().toIso8601String(),
      ),
    );

    return remoteSuccess;
  }

  /// Kirim Pengajuan Jual Laptop ke Supabase `sell_submissions` (FR-M05)
  Future<bool> submitSellLaptop({
    required String submissionNumber,
    required String customerName,
    required String customerPhone,
    required String brand,
    required String model,
    required String specifications,
    required String conditionDescription,
    required int expectedPrice,
  }) async {
    final payload = {
      'submission_number': submissionNumber,
      'customer_name': customerName,
      'customer_phone': customerPhone,
      'brand': brand,
      'model': model,
      'specifications': specifications,
      'condition_description': conditionDescription,
      'expected_price': expectedPrice,
      'status': 'menunggu_review',
    };

    bool remoteSuccess = false;
    try {
      final res = await http
          .post(
            Uri.parse('$supabaseUrl/rest/v1/sell_submissions'),
            headers: {
              ..._headers,
              'Prefer': 'return=minimal',
            },
            body: jsonEncode(payload),
          )
          .timeout(const Duration(seconds: 7));
      remoteSuccess = res.statusCode >= 200 && res.statusCode < 300;
    } catch (_) {}

    await addLocalHistory(
      LocalSubmissionRecord(
        referenceNumber: submissionNumber,
        type: 'jual_laptop',
        title: 'Jual / Trade-In: $brand $model',
        subtitle: '$specifications • $conditionDescription',
        priceOrEstimate: 'Rp $expectedPrice',
        createdAt: DateTime.now().toIso8601String(),
      ),
    );

    return remoteSuccess;
  }
}
