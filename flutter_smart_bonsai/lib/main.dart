import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'views/dashboard_screen.dart';

void main() {
  runApp(const ProviderScope(child: SmartBonsaiApp()));
}

final GoRouter _router = GoRouter(
  routes: <RouteBase>[
    GoRoute(
      path: '/',
      builder: (BuildContext context, GoRouterState state) {
        return const DashboardScreen();
      },
    ),
  ],
);

class SmartBonsaiApp extends StatelessWidget {
  const SmartBonsaiApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Smart Bonsai',
      debugShowCheckedModeBanner: false,
      routerConfig: _router,
      themeMode: ThemeMode.dark,
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.light,
        colorSchemeSeed: const Color(0xFF10B981),
        textTheme: GoogleFonts.plusJakartaSansTextTheme(ThemeData.light().textTheme),
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF091310),
        cardColor: const Color(0xFF12231E),
        colorSchemeSeed: const Color(0xFF10B981),
        textTheme: GoogleFonts.plusJakartaSansTextTheme(ThemeData.dark().textTheme),
      ),
    );
  }
}
