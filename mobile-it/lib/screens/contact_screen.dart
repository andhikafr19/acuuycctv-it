import 'package:flutter/material.dart';
import '../services/supabase_store_service.dart';
import '../theme/app_theme.dart';
import '../utils/whatsapp_helper.dart';

class ContactScreen extends StatelessWidget {
  final SupabaseStoreService storeService;

  const ContactScreen({
    super.key,
    required this.storeService,
  });

  @override
  Widget build(BuildContext context) {
    final settings = storeService.settings;
    final technicians = storeService.technicians;

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 92),
      children: [
        // Store Identity Card
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [AcuuyColors.navy950, AcuuyColors.navy800],
            ),
            borderRadius: BorderRadius.circular(24),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Image.asset(
                      'assets/images/acuuy_cctv_mark.png',
                      width: 48,
                      height: 48,
                      fit: BoxFit.contain,
                      errorBuilder: (_, _, _) => Container(
                        width: 48,
                        height: 48,
                        color: AcuuyColors.teal600,
                        child: const Icon(Icons.shield_rounded, color: Colors.white),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          settings.storeName,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 17.5,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                        const SizedBox(height: 2),
                        const Text(
                          'Authorized CCTV Dealer & IT Service Center Garut',
                          style: TextStyle(
                            color: AcuuyColors.teal300,
                            fontSize: 11.5,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              _InfoTile(
                icon: Icons.location_on_rounded,
                label: 'Alamat Workshop & Toko',
                value:
                    '${settings.addressStreet}, ${settings.city}, ${settings.province} ${settings.postalCode}',
              ),
              const SizedBox(height: 10),
              _InfoTile(
                icon: Icons.access_time_filled_rounded,
                label: 'Jam Operasional',
                value: settings.openingHours,
              ),
              const SizedBox(height: 10),
              _InfoTile(
                icon: Icons.phone_in_talk_rounded,
                label: 'WhatsApp & Hotline Resmi',
                value: '+${settings.whatsappNumber} • ${settings.email}',
              ),
              const SizedBox(height: 18),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () => WhatsAppHelper.openDirectConsultation(
                        settings: settings,
                      ),
                      icon: const Icon(Icons.chat_rounded, size: 17),
                      label: const Text('Chat WhatsApp'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AcuuyColors.whatsappGreen,
                        foregroundColor: AcuuyColors.navy950,
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () => WhatsAppHelper.openGoogleMaps(settings),
                      icon: const Icon(Icons.map_rounded, size: 17),
                      label: const Text('Rute Google Maps'),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.white,
                        side: const BorderSide(color: AcuuyColors.teal400),
                        padding: const EdgeInsets.symmetric(vertical: 13),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              SizedBox(
                width: double.infinity,
                child: TextButton.icon(
                  onPressed: () => WhatsAppHelper.callStorePhone(settings),
                  icon: const Icon(Icons.call_rounded, color: AcuuyColors.teal300, size: 17),
                  label: const Text(
                    'Telepon Langsung Toko Acuuy CCTV',
                    style: TextStyle(
                      color: AcuuyColors.teal300,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),

        // Team Teknisi Lapangan
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(22),
            border: Border.all(color: AcuuyColors.slate200),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Tim Teknisi Berpengalaman Acuuy CCTV',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                  color: AcuuyColors.navy900,
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                'Siap melayani survei lokasi dan instalasi rapi di seluruh kecamatan Kabupaten Garut.',
                style: TextStyle(fontSize: 12, color: AcuuyColors.slate600),
              ),
              const SizedBox(height: 12),
              ...technicians.map(
                (tech) => ListTile(
                  contentPadding: EdgeInsets.zero,
                  leading: CircleAvatar(
                    backgroundColor: AcuuyColors.teal100,
                    child: Text(
                      tech.name.isNotEmpty ? tech.name[0] : 'T',
                      style: const TextStyle(
                        fontWeight: FontWeight.w900,
                        color: AcuuyColors.teal900,
                      ),
                    ),
                  ),
                  title: Text(
                    tech.name,
                    style: const TextStyle(
                      fontWeight: FontWeight.w900,
                      fontSize: 13.5,
                      color: AcuuyColors.navy900,
                    ),
                  ),
                  subtitle: Text(
                    tech.specialization,
                    style: const TextStyle(fontSize: 12, color: AcuuyColors.slate600),
                  ),
                  trailing: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AcuuyColors.teal50,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Text(
                      'Siap Survei',
                      style: TextStyle(
                        fontSize: 10.5,
                        fontWeight: FontWeight.w800,
                        color: AcuuyColors.teal700,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _InfoTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;

  const _InfoTile({
    required this.icon,
    required this.label,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, color: AcuuyColors.teal400, size: 18),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(
                  color: AcuuyColors.slate400,
                  fontSize: 10.5,
                  fontWeight: FontWeight.w700,
                ),
              ),
              Text(
                value,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 12.5,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
