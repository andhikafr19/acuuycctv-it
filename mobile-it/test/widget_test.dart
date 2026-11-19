import 'package:flutter_test/flutter_test.dart';
import 'package:acuuy_cctv_mobile/main.dart';

void main() {
  testWidgets('Acuuy CCTV mobile app renders home and bottom navigation',
      (WidgetTester tester) async {
    await tester.pumpWidget(const AcuuyCctvApp());
    await tester.pump();

    expect(find.text('ACUUY CCTV'), findsOneWidget);
    expect(find.text('Beranda'), findsOneWidget);
    expect(find.text('Paket CCTV'), findsOneWidget);
    expect(find.text('Laptop'), findsOneWidget);
  });
}
