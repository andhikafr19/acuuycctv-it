import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/store_models.dart';

class FormatHelper {
  static final NumberFormat _idrFormat = NumberFormat.currency(
    locale: 'id_ID',
    symbol: 'Rp ',
    decimalDigits: 0,
  );

  static String rupiah(num value) => _idrFormat.format(value);

  static String formatWaPhone(String phone) {
    String cleaned = phone.replaceAll(RegExp(r'\D'), '');
    if (cleaned.startsWith('0')) {
      cleaned = '62${cleaned.substring(1)}';
    } else if (!cleaned.startsWith('62')) {
      cleaned = '62$cleaned';
    }
    return cleaned;
  }

  static String generateOrderNumber(String serviceType) {
    final now = DateTime.now();
    final yy = (now.year % 100).toString().padLeft(2, '0');
    final mm = now.month.toString().padLeft(2, '0');
    final dd = now.day.toString().padLeft(2, '0');
    final rand = (now.millisecondsSinceEpoch % 900 + 100).toString();
    final prefix = serviceType == 'cctv'
        ? 'ACY-CCTV'
        : serviceType == 'servis_komputer'
            ? 'ACY-SRV'
            : 'ACY-CON';
    return '$prefix-$yy$mm$dd-$rand';
  }

  static String generateSellNumber() {
    final now = DateTime.now();
    final yy = (now.year % 100).toString().padLeft(2, '0');
    final mm = now.month.toString().padLeft(2, '0');
    final dd = now.day.toString().padLeft(2, '0');
    final rand = (now.millisecondsSinceEpoch % 900 + 100).toString();
    return 'SELL-$yy$mm$dd-$rand';
  }
}

class WhatsAppHelper {
  static Future<bool> launchExternalUrl(String url) async {
    final uri = Uri.parse(url);
    try {
      return await launchUrl(uri, mode: LaunchMode.externalApplication);
    } catch (_) {
      return false;
    }
  }

  static Future<bool> openCctvPackageInquiry({
    required CctvPackage pkg,
    required StoreSettings settings,
  }) async {
    final phone = FormatHelper.formatWaPhone(settings.whatsappNumber);
    final text = '''*Halo Admin ${settings.storeName}*,

Saya melihat katalog di *Aplikasi Mobile Acuuy CCTV* dan tertarik dengan paket berikut:
- *Nama Paket:* ${pkg.name}
- *Brand / Seri:* ${pkg.brand} (${pkg.type} - ${pkg.series})
- *Jumlah Kamera:* ${pkg.cameraCount} Kamera (${pkg.indoorCount} Indoor + ${pkg.outdoorCount} Outdoor)
- *Penyimpanan:* HDD ${pkg.hddSize} + ${pkg.recorderSpec}
- *Harga Paket:* ${pkg.price}

Saya ingin tanya-tanya / konsultasi jadwal survei pemasangan. Terima kasih!''';

    final url = 'https://wa.me/$phone?text=${Uri.encodeComponent(text)}';
    return launchExternalUrl(url);
  }

  static Future<bool> openLaptopInquiry({
    required Laptop laptop,
    required StoreSettings settings,
  }) async {
    final phone = FormatHelper.formatWaPhone(settings.whatsappNumber);
    final priceFormatted = FormatHelper.rupiah(laptop.effectivePrice);
    final text = '''*Halo ${settings.storeName}*,

Saya tertarik dengan unit laptop bekas di *Aplikasi Mobile Acuuy CCTV*:
- *Unit:* ${laptop.title}
- *Spesifikasi:* ${laptop.processor}, RAM ${laptop.ram}, ${laptop.storage}
- *Kondisi:* ${laptop.conditionGrade}
- *Harga:* $priceFormatted

Apakah unit ini masih tersedia? Bisa minta info foto detail / kelengkapannya? Terima kasih.''';

    final url = 'https://wa.me/$phone?text=${Uri.encodeComponent(text)}';
    return launchExternalUrl(url);
  }

  static Future<bool> openBookingConfirmation({
    required String orderNumber,
    required String serviceType,
    required String customerName,
    required String customerPhone,
    required String address,
    required String description,
    String? selectedPackage,
    String? packagePrice,
    required StoreSettings settings,
  }) async {
    final phone = FormatHelper.formatWaPhone(settings.whatsappNumber);
    final serviceLabel = serviceType == 'cctv'
        ? 'Instalasi / Survei CCTV'
        : serviceType == 'servis_komputer'
            ? 'Servis Komputer / Laptop'
            : 'Konsultasi IT & Jaringan';

    final packageInfo = (selectedPackage != null && selectedPackage.isNotEmpty)
        ? '\n- *Paket Dipilih:* $selectedPackage (${packagePrice ?? "-"})'
        : '';

    final text = '''*Halo Admin ${settings.storeName}*,

Saya baru saja membuat pengajuan jasa via *Aplikasi Android Acuuy CCTV*:
- *No. Order:* $orderNumber
- *Layanan:* $serviceLabel$packageInfo
- *Nama Pelanggan:* $customerName
- *No. HP:* $customerPhone
- *Alamat:* $address (Garut)
- *Keterangan / Kendala:* $description

Mohon bantuan konfirmasi dan tindak lanjutnya. Terima kasih!''';

    final url = 'https://wa.me/$phone?text=${Uri.encodeComponent(text)}';
    return launchExternalUrl(url);
  }

  static Future<bool> openSellLaptopConfirmation({
    required String submissionNumber,
    required String customerName,
    required String customerPhone,
    required String brandModel,
    required String specifications,
    required String condition,
    required int expectedPrice,
    required StoreSettings settings,
  }) async {
    final phone = FormatHelper.formatWaPhone(settings.whatsappNumber);
    final priceText = FormatHelper.rupiah(expectedPrice);
    final text = '''*Halo Admin ${settings.storeName}*,

Saya mengajukan penjualan / tukar tambah laptop via *Aplikasi Android Acuuy CCTV*:
- *No. Pengajuan:* $submissionNumber
- *Nama:* $customerName ($customerPhone)
- *Unit Laptop:* $brandModel
- *Spesifikasi:* $specifications
- *Kondisi & Kelengkapan:* $condition
- *Ekspektasi Harga:* $priceText

Mohon info estimasi penawaran dari toko. Terima kasih!''';

    final url = 'https://wa.me/$phone?text=${Uri.encodeComponent(text)}';
    return launchExternalUrl(url);
  }

  static Future<bool> openDirectConsultation({
    required StoreSettings settings,
    String? topic,
  }) async {
    final phone = FormatHelper.formatWaPhone(settings.whatsappNumber);
    final text = '''*Halo ${settings.storeName}*,

Saya menggunakan *Aplikasi Mobile Acuuy CCTV* dan ingin konsultasi seputar kebutuhan ${topic ?? 'Pemasangan CCTV & Layanan IT'} di Garut. Mohon info ketersediaan jadwal survei atau konsultasi. Terima kasih!''';

    final url = 'https://wa.me/$phone?text=${Uri.encodeComponent(text)}';
    return launchExternalUrl(url);
  }

  static Future<bool> openGoogleMaps(StoreSettings settings) async {
    return launchExternalUrl(settings.googleMapsUrl);
  }

  static Future<bool> callStorePhone(StoreSettings settings) async {
    final cleaned = settings.whatsappNumber.replaceAll(RegExp(r'\D'), '');
    return launchExternalUrl('tel:+$cleaned');
  }
}
