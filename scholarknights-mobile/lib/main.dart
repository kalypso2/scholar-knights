import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'screens/home_screen.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/view_session_details_screen.dart';
import 'screens/reset_password_screen.dart';
import 'screens/verification_screen.dart';
import 'screens/other_profiles.dart';
import 'screens/find_sessions_screen.dart';
import 'utils/session_manager.dart';
import 'main_navigation.dart'; // includes bottom nav pages

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await SessionManager.init(); 
  runApp(const ScholarKnightsApp());
}

class ScholarKnightsApp extends StatelessWidget {
  const ScholarKnightsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Scholar Knights',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.deepPurple,
          foregroundColor: Colors.white, // title and icon color
          titleTextStyle: TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
          iconTheme: IconThemeData(color: Colors.white),
        ),
      ),
      initialRoute: '/',
      onGenerateRoute: (settings) {
        switch (settings.name) {
          case '/':
            return MaterialPageRoute(builder: (_) => LoginScreen());
          case '/login':
            return MaterialPageRoute(builder: (_) => LoginScreen());
          case '/register':
            return MaterialPageRoute(builder: (_) => RegisterScreen());
          case '/home':
            return MaterialPageRoute(builder: (_) => MainNavigation());
          case '/find-session':
            final args = settings.arguments as Map<String, dynamic>;
            return MaterialPageRoute(
              builder: (_) => FindSessionsScreen(token: args['token']),
            );
          case '/view-session-details':
            final args = settings.arguments as Map<String, dynamic>;
            return MaterialPageRoute(
              builder: (_) => ViewSessionDetailsScreen(sessionId: args['sessionId']),
            );
          case '/reset-password':
            final args = settings.arguments as Map<String, dynamic>;
            return MaterialPageRoute(
              builder: (_) => ResetPasswordScreen(token: args['token']),
            );
          case '/verify-email':
            final args = settings.arguments as Map<String, dynamic>;
            return MaterialPageRoute(
              builder: (_) => EmailVerificationScreen(email: args['email']),
            );
          case '/profile-user':
            final args = settings.arguments as Map<String, dynamic>;
            return MaterialPageRoute(
              builder: (_) => ProfileOfOtherUserScreen(
                username: args['username'],
                name: args['name'],
              ),
            );
          default:
            return MaterialPageRoute(
              builder: (_) => Scaffold(
                body: Center(child: Text('No route defined for ${settings.name}')),
              ),
            );
        }
      },
    );
  }
}




