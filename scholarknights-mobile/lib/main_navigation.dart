import 'package:flutter/material.dart';
import 'screens/home_screen.dart';
import 'screens/find_sessions_screen.dart';
import 'screens/profile_screen.dart';
import 'widgets/bottom_nav.dart';
import 'screens/create_session_screen.dart';
import 'screens/courses_screen.dart';
import 'screens/my_sessions_screen.dart';
import 'utils/session_manager.dart';

class MainNavigation extends StatefulWidget {
  const MainNavigation({Key? key}) : super(key: key);

  @override
  _MainNavigationState createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> {
  int _selectedIndex = 0;
  String? token;

  @override
  void initState() {
    super.initState();
    if (SessionManager.token == null) {
      // Handle case where user isn't logged in
    }
  }
  
  @override
  Widget build(BuildContext context) {
    if (SessionManager.token == null) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    final List<Widget> _pages = [
      const HomeScreen(),
      MySessionsScreen(token: SessionManager.token!),
      FindSessionsScreen(token: SessionManager.token!),
      const CreateSessionScreen(),
      const CoursesScreen(),
      const ProfileScreen(),
    ];

    return Scaffold(
      body: _pages[_selectedIndex],
      bottomNavigationBar: BottomNavBar(
        currentIndex: _selectedIndex,
        onTap: (int index) {
          setState(() => _selectedIndex = index);
        },
      ),
    );
  }
}






