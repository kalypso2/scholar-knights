// splash_redirect_screen.dart
import 'package:flutter/material.dart';
import '../utils/session_manager.dart';

class SplashRedirectScreen extends StatelessWidget {
  const SplashRedirectScreen({super.key});

  Future<void> _redirect(BuildContext context) async {
    final token = await SessionManager.getToken();
    if (token != null && token.isNotEmpty) {
      Navigator.pushReplacementNamed(context, '/home');
    } else {
      Navigator.pushReplacementNamed(context, '/login');
    }
  }

  @override
  Widget build(BuildContext context) {
    WidgetsBinding.instance.addPostFrameCallback((_) => _redirect(context));

    return const Scaffold(
      body: Center(child: CircularProgressIndicator()),
    );
  }
}


