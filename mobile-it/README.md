# Acuuy CCTV — Aplikasi Mobile Android Pelanggan (`mobile-it`)

Implementasi aplikasi mobile Android khusus pelanggan (**Acuuy CCTV — App Customer**) menggunakan **Flutter** berdasarkan spesifikasi **BRD v1.8** (Bagian 4.4 & 6.5) dan **PRD v1.8** (Bagian 12, 13, 14, dan 15).

## Fitur Utama yang Diimplementasikan

1. **Beranda Visual & Interaktif (`FR-M01`, `FR-M02`)**
   - Identitas visual **Acuuy CCTV** (Teal & Navy) lengkap dengan indikator status sinkronisasi database Supabase / Offline Cache.
   - **Section Paket Populer CCTV** (PRD Bagian 14): 3 kartu paket dinamis dari database dengan logika `selectThreePopularPackages` dan sorotan **`⭐ Rekomendasi Teknisi`** di posisi tengah.
   - **Section Edukasi CCTV Analog vs IP Camera** (PRD Bagian 12): 2 kartu pengantar bergambar + tabel perbandingan 10 aspek + tombol konsultasi survei via WhatsApp.
   - **Section Certificate Showcase** (PRD Bagian 13, `FR-M07`): Carousel otomatis 6 sertifikat kemitraan resmi (*Hikvision, Dahua, HiLook, EZVIZ, IMOU, AVTECH*) dengan modal **Pinch-to-Zoom & Double-Tap Zoom (75%–325%)** serta *tab switcher* antar-brand.
   - **Section Portofolio Pemasangan di Garut** (`FR-M07`): Filter kategori lokasi (*Rumah, Toko, Kantor, Gudang*) lengkap dengan testimoni pelanggan & pratinjau foto *zoomable*.

2. **Katalog & Harga Paket CCTV (`FR-M03`)**
   - Desain kartu poster **Hybrid Modern** (visual rincian kamera Indoor + Outdoor, DVR/NVR, kapasitas HDD, harga transparan & harga coret).
   - **Multi-Filter Interaktif**:
     - Filter Brand (*Semua, Hikvision, HiLook, Dahua, EZVIZ / IMOU*)
     - Filter Jenis Kamera (*Semua, CCTV Analog, CCTV IP Camera*)
     - Filter Seri Fitur (*Semua, Standard, Audio, ColorVu Audio*)
     - Filter Jumlah Titik Kamera (*Semua, 2, 4, 6, 8, 16 Kamera*)
   - Pemuatan bertahap (*pagination* 8 paket + tombol *"Lihat Lainnya (+8 Paket)"* & *"Tampilkan Lebih Sedikit"*).

3. **Katalog Laptop Bekas & Form Jual/Trade-In (`FR-M05`, `FR-M06`)**
   - Katalog laptop bekas bergaransi dengan filter merek, pencarian spesifikasi, filter *Ready Stock*, modal detail spesifikasi lengkap, dan galeri foto *pinch-to-zoom*.
   - Form **Jual / Tukar Tambah Laptop** yang menghasilkan nomor referensi `SELL-...`, menyimpan ke tabel `sell_submissions` Supabase, dan mengarahkan konfirmasi ke WhatsApp.

4. **Kotak Masuk Promo (`🔔`) & Simulasi Push Notification (`FR-M12`, `FR-M12a`, `FR-M12b`)**
   - Ikon lonceng `🔔` di AppBar dengan badge jumlah promo belum dibaca.
   - Pengaturan langganan topik notifikasi (*Promo Paket CCTV* & *Stok Laptop Baru*) tanpa perlu login akun.
   - Fitur **Uji Simulasi Push Notification Masuk (Demo M1)** yang menampilkan *rich notification banner* beserta *deep-link* langsung ke detail paket CCTV atau unit laptop terkait.
   - Terintegrasi dengan tabel `app_notifications` di Supabase dan kotak centang *"🔔 Kirim Notifikasi ke Aplikasi Mobile"* pada `dashboard-it`.

5. **Fitur Nilai Tambah & Pengalihan Kontekstual WhatsApp (`FR-M04`, `FR-M05`, `FR-M08`, `FR-M09`, `FR-M10`, `FR-M11`)**
   - **Kalkulator Simulasi Kebutuhan Paket CCTV**: merekomendasikan paket CCTV berdasarkan jenis bangunan, jumlah ruangan indoor/outdoor, dan prioritas fitur.
   - **Simpan Favorit / Bookmark Lokal** & **Riwayat Nomor Order Lokal**.
   - **Form Booking Terstruktur** (*Pasang CCTV, Servis Komputer/Laptop, Konsultasi IT*) dengan nomor order unik (`ACY-CCTV-...`, `ACY-SRV-...`, `ACY-CON-...`).
   - **Offline Caching** via `SharedPreferences` agar daftar harga tetap tampil saat sinyal lemah/offline.
   - **Keamanan APK (`PRD 15.5`)**: Hanya menggunakan *publishable anon key* publik; tidak ada *service role key* atau kunci rahasia admin di dalam kode aplikasi.

---

## Cara Menjalankan & Build APK

Pastikan Flutter SDK (`C:\Users\andhi\flutter\bin`) sudah berada di `PATH`:

```bash
cd mobile-it

# 1. Unduh dependencies
flutter pub get

# 2. Jalankan di Emulator / Perangkat Android
flutter run

# 3. Build APK Release untuk Demo / Review Client (Fase M1)
flutter build apk --release

# 4. Build Android App Bundle (AAB) untuk Google Play Store (Fase M2)
flutter build appbundle --release
```
