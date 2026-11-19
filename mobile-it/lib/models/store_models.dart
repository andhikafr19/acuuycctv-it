class StoreSettings {
  final String id;
  final String storeName;
  final String tagline;
  final String whatsappNumber;
  final String email;
  final String addressStreet;
  final String city;
  final String province;
  final String postalCode;
  final String googleMapsUrl;
  final String openingHours;

  const StoreSettings({
    required this.id,
    required this.storeName,
    required this.tagline,
    required this.whatsappNumber,
    required this.email,
    required this.addressStreet,
    required this.city,
    required this.province,
    required this.postalCode,
    required this.googleMapsUrl,
    required this.openingHours,
  });

  factory StoreSettings.fromJson(Map<String, dynamic> json) {
    return StoreSettings(
      id: (json['id'] ?? 'default').toString(),
      storeName: (json['store_name'] ?? 'Acuuy CCTV & Komputer Garut').toString(),
      tagline: (json['tagline'] ??
              'Pusat Instalasi CCTV, Servis Komputer Cepat & Jual Beli Laptop Bekas Bergaransi di Garut')
          .toString(),
      whatsappNumber: (json['whatsapp_number'] ?? '6285158722545').toString(),
      email: (json['email'] ?? 'admin@acuuycctv.com').toString(),
      addressStreet:
          (json['address_street'] ?? 'Jl. Dayeuhandap No.35, Kota Kulon, Kec. Garut Kota')
              .toString(),
      city: (json['city'] ?? 'Kabupaten Garut').toString(),
      province: (json['province'] ?? 'Jawa Barat').toString(),
      postalCode: (json['postal_code'] ?? '44112').toString(),
      googleMapsUrl: (json['google_maps_url'] ??
              'https://www.google.com/maps/search/?api=1&query=Acuuy+CCTV+Jl.+Dayeuhandap+No.35+Kota+Kulon+Garut')
          .toString(),
      openingHours:
          (json['opening_hours'] ?? 'Senin - Sabtu: 08:30 - 18:00 WIB').toString(),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'store_name': storeName,
        'tagline': tagline,
        'whatsapp_number': whatsappNumber,
        'email': email,
        'address_street': addressStreet,
        'city': city,
        'province': province,
        'postal_code': postalCode,
        'google_maps_url': googleMapsUrl,
        'opening_hours': openingHours,
      };
}

class CctvPackage {
  final String id;
  final String name;
  final String brand;
  final String brandTagline;
  final String type; // 'CCTV Analog' | 'CCTV IP Camera'
  final String series; // 'Standard' | 'Audio' | 'ColorVu Audio'
  final String seriesLabel;
  final String resolution;
  final int cameraCount;
  final int indoorCount;
  final int outdoorCount;
  final String hddSize;
  final String cableLength;
  final String recorderSpec;
  final String price;
  final int estimatedCost;
  final String? originalPrice;
  final String? tag;
  final bool popular;
  final String bestFor;
  final String description;
  final List<String> features;
  final int sortOrder;
  final bool isActive;

  const CctvPackage({
    required this.id,
    required this.name,
    required this.brand,
    required this.brandTagline,
    required this.type,
    required this.series,
    required this.seriesLabel,
    required this.resolution,
    required this.cameraCount,
    required this.indoorCount,
    required this.outdoorCount,
    required this.hddSize,
    required this.cableLength,
    required this.recorderSpec,
    required this.price,
    required this.estimatedCost,
    this.originalPrice,
    this.tag,
    this.popular = false,
    required this.bestFor,
    required this.description,
    required this.features,
    this.sortOrder = 100,
    this.isActive = true,
  });

  bool get isIpCamera => type.toLowerCase().contains('ip');

  factory CctvPackage.fromJson(Map<String, dynamic> json) {
    final rawFeatures = json['features'];
    final List<String> parsedFeatures = rawFeatures is List
        ? rawFeatures.map((e) => e.toString()).toList()
        : <String>[];

    return CctvPackage(
      id: (json['id'] ?? '').toString(),
      name: (json['name'] ?? '').toString(),
      brand: (json['brand'] ?? 'Hikvision').toString(),
      brandTagline: (json['brand_tagline'] ?? json['brandTagline'] ?? '').toString(),
      type: (json['type'] ?? 'CCTV Analog').toString(),
      series: (json['series'] ?? 'Standard').toString(),
      seriesLabel: (json['series_label'] ?? json['seriesLabel'] ?? '').toString(),
      resolution: (json['resolution'] ?? '2MP Full HD').toString(),
      cameraCount: int.tryParse((json['camera_count'] ?? json['cameraCount'] ?? 4).toString()) ?? 4,
      indoorCount: int.tryParse((json['indoor_count'] ?? json['indoorCount'] ?? 2).toString()) ?? 2,
      outdoorCount:
          int.tryParse((json['outdoor_count'] ?? json['outdoorCount'] ?? 2).toString()) ?? 2,
      hddSize: (json['hdd_size'] ?? json['hddSize'] ?? '1TB').toString(),
      cableLength: (json['cable_length'] ?? json['cableLength'] ?? '60 Meter').toString(),
      recorderSpec: (json['recorder_spec'] ?? json['recorderSpec'] ?? 'DVR 4Ch').toString(),
      price: (json['price'] ?? 'Rp 0').toString(),
      estimatedCost:
          num.tryParse((json['estimated_cost'] ?? json['estimatedCost'] ?? 0).toString())
                  ?.toInt() ??
              0,
      originalPrice: json['original_price']?.toString() ?? json['originalPrice']?.toString(),
      tag: json['tag']?.toString(),
      popular: json['popular'] == true,
      bestFor: (json['best_for'] ?? json['bestFor'] ?? '').toString(),
      description: (json['description'] ?? '').toString(),
      features: parsedFeatures,
      sortOrder: int.tryParse((json['sort_order'] ?? 100).toString()) ?? 100,
      isActive: json['is_active'] != false,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'brand': brand,
        'brand_tagline': brandTagline,
        'type': type,
        'series': series,
        'series_label': seriesLabel,
        'resolution': resolution,
        'camera_count': cameraCount,
        'indoor_count': indoorCount,
        'outdoor_count': outdoorCount,
        'hdd_size': hddSize,
        'cable_length': cableLength,
        'recorder_spec': recorderSpec,
        'price': price,
        'estimated_cost': estimatedCost,
        'original_price': originalPrice,
        'tag': tag,
        'popular': popular,
        'best_for': bestFor,
        'description': description,
        'features': features,
        'sort_order': sortOrder,
        'is_active': isActive,
      };
}

class Laptop {
  final String id;
  final String slug;
  final String title;
  final String brand;
  final String model;
  final String processor;
  final String ram;
  final String storage;
  final String graphics;
  final String display;
  final String batteryHealth;
  final String conditionGrade;
  final int price;
  final int? discountPrice;
  final String warrantyInfo;
  final String status; // 'tersedia' | 'booking' | 'terjual'
  final List<String> images;
  final String description;
  final List<String> features;

  const Laptop({
    required this.id,
    required this.slug,
    required this.title,
    required this.brand,
    required this.model,
    required this.processor,
    required this.ram,
    required this.storage,
    required this.graphics,
    required this.display,
    required this.batteryHealth,
    required this.conditionGrade,
    required this.price,
    this.discountPrice,
    required this.warrantyInfo,
    required this.status,
    required this.images,
    required this.description,
    required this.features,
  });

  int get effectivePrice => (discountPrice != null && discountPrice! > 0) ? discountPrice! : price;
  bool get hasDiscount => discountPrice != null && discountPrice! > 0 && discountPrice! < price;
  bool get isAvailable => status.toLowerCase() == 'tersedia';

  factory Laptop.fromJson(Map<String, dynamic> json) {
    final rawImages = json['images'];
    final rawFeatures = json['features'];
    return Laptop(
      id: (json['id'] ?? '').toString(),
      slug: (json['slug'] ?? '').toString(),
      title: (json['title'] ?? '').toString(),
      brand: (json['brand'] ?? '').toString(),
      model: (json['model'] ?? '').toString(),
      processor: (json['processor'] ?? '').toString(),
      ram: (json['ram'] ?? '').toString(),
      storage: (json['storage'] ?? '').toString(),
      graphics: (json['graphics'] ?? 'Integrated Graphics').toString(),
      display: (json['display'] ?? '14" FHD').toString(),
      batteryHealth: (json['battery_health'] ?? 'Baterai Normal 3-4 Jam').toString(),
      conditionGrade: (json['condition_grade'] ?? 'Grade A (Mulus)').toString(),
      price: num.tryParse((json['price'] ?? 0).toString())?.toInt() ?? 0,
      discountPrice: json['discount_price'] != null
          ? num.tryParse(json['discount_price'].toString())?.toInt()
          : null,
      warrantyInfo: (json['warranty_info'] ?? 'Garansi Toko 1 Bulan').toString(),
      status: (json['status'] ?? 'tersedia').toString(),
      images: rawImages is List ? rawImages.map((e) => e.toString()).toList() : <String>[],
      description: (json['description'] ?? '').toString(),
      features: rawFeatures is List ? rawFeatures.map((e) => e.toString()).toList() : <String>[],
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'slug': slug,
        'title': title,
        'brand': brand,
        'model': model,
        'processor': processor,
        'ram': ram,
        'storage': storage,
        'graphics': graphics,
        'display': display,
        'battery_health': batteryHealth,
        'condition_grade': conditionGrade,
        'price': price,
        'discount_price': discountPrice,
        'warranty_info': warrantyInfo,
        'status': status,
        'images': images,
        'description': description,
        'features': features,
      };
}

class Certificate {
  final String id;
  final String brand;
  final String title;
  final String tier;
  final String issuer;
  final String validPeriod;
  final String imageUrl;
  final int sortOrder;
  final bool isActive;

  const Certificate({
    required this.id,
    required this.brand,
    required this.title,
    required this.tier,
    required this.issuer,
    required this.validPeriod,
    required this.imageUrl,
    this.sortOrder = 100,
    this.isActive = true,
  });

  factory Certificate.fromJson(Map<String, dynamic> json) {
    return Certificate(
      id: (json['id'] ?? '').toString(),
      brand: (json['brand'] ?? '').toString(),
      title: (json['title'] ?? '').toString(),
      tier: (json['tier'] ?? '').toString(),
      issuer: (json['issuer'] ?? '').toString(),
      validPeriod: (json['valid_period'] ?? '2025 – 2026').toString(),
      imageUrl: (json['image_url'] ?? '').toString(),
      sortOrder: int.tryParse((json['sort_order'] ?? 100).toString()) ?? 100,
      isActive: json['is_active'] != false,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'brand': brand,
        'title': title,
        'tier': tier,
        'issuer': issuer,
        'valid_period': validPeriod,
        'image_url': imageUrl,
        'sort_order': sortOrder,
        'is_active': isActive,
      };
}

class Portfolio {
  final String id;
  final String title;
  final String category; // 'rumah' | 'toko' | 'kantor' | 'gudang'
  final String location;
  final int cameraCount;
  final String cameraType;
  final String completionDate;
  final List<String> images;
  final String description;
  final String? clientName;
  final String? review;
  final int rating;

  const Portfolio({
    required this.id,
    required this.title,
    required this.category,
    required this.location,
    required this.cameraCount,
    required this.cameraType,
    required this.completionDate,
    required this.images,
    required this.description,
    this.clientName,
    this.review,
    this.rating = 5,
  });

  factory Portfolio.fromJson(Map<String, dynamic> json) {
    final rawImages = json['images'];
    final testimonial = json['testimonial'];
    return Portfolio(
      id: (json['id'] ?? '').toString(),
      title: (json['title'] ?? '').toString(),
      category: (json['category'] ?? 'rumah').toString(),
      location: (json['location'] ?? 'Garut').toString(),
      cameraCount: int.tryParse((json['camera_count'] ?? 4).toString()) ?? 4,
      cameraType: (json['camera_type'] ?? 'CCTV Full HD').toString(),
      completionDate: (json['completion_date'] ?? '').toString(),
      images: rawImages is List ? rawImages.map((e) => e.toString()).toList() : <String>[],
      description: (json['description'] ?? '').toString(),
      clientName: testimonial is Map ? testimonial['client_name']?.toString() : null,
      review: testimonial is Map ? testimonial['review']?.toString() : null,
      rating: testimonial is Map
          ? (int.tryParse((testimonial['rating'] ?? 5).toString()) ?? 5)
          : 5,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'category': category,
        'location': location,
        'camera_count': cameraCount,
        'camera_type': cameraType,
        'completion_date': completionDate,
        'images': images,
        'description': description,
        'testimonial': clientName != null
            ? {
                'client_name': clientName,
                'review': review ?? '',
                'rating': rating,
              }
            : null,
      };
}

class Technician {
  final String id;
  final String name;
  final String phone;
  final String specialization;
  final String status;

  const Technician({
    required this.id,
    required this.name,
    required this.phone,
    required this.specialization,
    required this.status,
  });

  factory Technician.fromJson(Map<String, dynamic> json) {
    return Technician(
      id: (json['id'] ?? '').toString(),
      name: (json['name'] ?? '').toString(),
      phone: (json['phone'] ?? '').toString(),
      specialization: (json['specialization'] ?? '').toString(),
      status: (json['status'] ?? 'active').toString(),
    );
  }
}

class AppNotification {
  final String id;
  final String title;
  final String body;
  final String category; // 'promo_cctv' | 'stok_laptop_baru' | 'info_toko'
  final String promoLabel;
  final String? imageUrl;
  final String targetType; // 'cctv_package' | 'laptop' | 'general'
  final String? targetId;
  final String? priceDisplay;
  final String createdAt;

  const AppNotification({
    required this.id,
    required this.title,
    required this.body,
    required this.category,
    required this.promoLabel,
    this.imageUrl,
    this.targetType = 'general',
    this.targetId,
    this.priceDisplay,
    required this.createdAt,
  });

  factory AppNotification.fromJson(Map<String, dynamic> json) {
    return AppNotification(
      id: (json['id'] ?? '').toString(),
      title: (json['title'] ?? '').toString(),
      body: (json['body'] ?? '').toString(),
      category: (json['category'] ?? 'promo_cctv').toString(),
      promoLabel: (json['promo_label'] ?? 'Info Promo').toString(),
      imageUrl: json['image_url']?.toString(),
      targetType: (json['target_type'] ?? 'general').toString(),
      targetId: json['target_id']?.toString(),
      priceDisplay: json['price_display']?.toString(),
      createdAt: (json['created_at'] ?? DateTime.now().toIso8601String()).toString(),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'body': body,
        'category': category,
        'promo_label': promoLabel,
        'image_url': imageUrl,
        'target_type': targetType,
        'target_id': targetId,
        'price_display': priceDisplay,
        'created_at': createdAt,
      };
}

class LocalSubmissionRecord {
  final String referenceNumber;
  final String type; // 'booking_cctv' | 'servis_komputer' | 'konsultasi_it' | 'jual_laptop' | 'tanya_wa'
  final String title;
  final String subtitle;
  final String priceOrEstimate;
  final String createdAt;

  const LocalSubmissionRecord({
    required this.referenceNumber,
    required this.type,
    required this.title,
    required this.subtitle,
    required this.priceOrEstimate,
    required this.createdAt,
  });

  factory LocalSubmissionRecord.fromJson(Map<String, dynamic> json) {
    return LocalSubmissionRecord(
      referenceNumber: (json['reference_number'] ?? '').toString(),
      type: (json['type'] ?? 'booking_cctv').toString(),
      title: (json['title'] ?? '').toString(),
      subtitle: (json['subtitle'] ?? '').toString(),
      priceOrEstimate: (json['price_or_estimate'] ?? '').toString(),
      createdAt: (json['created_at'] ?? '').toString(),
    );
  }

  Map<String, dynamic> toJson() => {
        'reference_number': referenceNumber,
        'type': type,
        'title': title,
        'subtitle': subtitle,
        'price_or_estimate': priceOrEstimate,
        'created_at': createdAt,
      };
}
