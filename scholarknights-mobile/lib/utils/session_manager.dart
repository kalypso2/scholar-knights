import 'package:shared_preferences/shared_preferences.dart';

class SessionManager {
  static String? _cachedUserId;
  static String? _cachedToken;
  static SharedPreferences? _prefs;

  static Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
    _cachedUserId = _prefs?.getString('userId');
    _cachedToken = _prefs?.getString('token');
  }

  // Synchronous getters
  static String? get userId => _cachedUserId;
  static String? get token => _cachedToken;

  // Async setters
  static Future<void> setUserId(String id) async {
    _cachedUserId = id;
    await _prefs?.setString('userId', id);
  }

  static Future<void> setToken(String t) async {
    _cachedToken = t;
    await _prefs?.setString('token', t);
  }

  static Future<void> clear() async {
    _cachedUserId = null;
    _cachedToken = null;
    await _prefs?.clear();
  }
}





