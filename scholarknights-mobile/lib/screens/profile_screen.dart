import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../utils/session_manager.dart';
import '../services/api.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool isEditing = false;
  Map<String, dynamic> user = {};
  bool isLoading = true;
  String error = "";

  final TextEditingController _firstNameController = TextEditingController();
  final TextEditingController _lastNameController = TextEditingController();
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();

  List<String> courses = [];

  @override
  void initState() {
    super.initState();
    fetchProfile();
  }

  Future<void> fetchProfile() async {
    final userId = SessionManager.userId; // ✅ Await it
    final token = SessionManager.token;   // ✅ Await it

    if (userId == null || token == null) {
      setState(() => error = "Missing user session data");
      return;
    }

    try {
      final response = await http.get(
        Uri.parse("$baseUrl/fetch-profile/$userId"),
        headers: {"Authorization": "Bearer $token"},
      );

      final response2 = await http.get(
        Uri.parse("$baseUrl/user/$userId/courses"),
        headers: {"Authorization": "Bearer $token"},
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final userData = data['user'];
        _firstNameController.text = userData['first_name'] ?? '';
        _lastNameController.text = userData['last_name'] ?? '';
        _usernameController.text = userData['username'] ?? '';
        _descriptionController.text = userData['description'] ?? '';
        setState(() => user = userData);
      } else {
        setState(() => error = "Failed to fetch user profile");
      }

      if (response2.statusCode == 200) {
        final courseData = jsonDecode(response2.body);
        setState(() => courses =
            List<String>.from(courseData['courses'].map((c) => c['courseCode'])));
      }
    } catch (e) {
      setState(() => error = e.toString());
    } finally {
      setState(() => isLoading = false);
    }
  }


  Future<void> saveProfile() async {
    final userId = SessionManager.userId; // ✅ Await
    final token = SessionManager.token;   // ✅ Await

    if (userId == null || token == null) return;

    try {
      await http.post(
        Uri.parse("$baseUrl/update-first-name/$userId"),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token"
        },
        body: jsonEncode({"first_name": _firstNameController.text}),
      );

      await http.post(
        Uri.parse("$baseUrl/update-last-name/$userId"),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token"
        },
        body: jsonEncode({"last_name": _lastNameController.text}),
      );

      await http.post(
        Uri.parse("$baseUrl/update-username/$userId"),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token"
        },
        body: jsonEncode({"newUserName": _usernameController.text}),
      );

      await http.post(
        Uri.parse("$baseUrl/update-description/$userId"),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token"
        },
        body: jsonEncode({"newDescription": _descriptionController.text}),
      );

      setState(() => isEditing = false);
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text("Profile updated")));
    } catch (e) {
      print("Save error: $e");
    }
  }


  Widget buildTextField(String label, TextEditingController controller,
      {int maxLines = 1}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: TextField(
        controller: controller,
        maxLines: maxLines,
        decoration: InputDecoration(
          labelText: label,
          border: OutlineInputBorder(),
        ),
      ),
    );
  }

  @override
    Widget build(BuildContext context) {
      if (isLoading) return const Center(child: CircularProgressIndicator());
      if (error.isNotEmpty) return Center(child: Text(error));

      return Scaffold(
        appBar: AppBar(
          title: const Text('Your Profile'), 
          backgroundColor: Colors.deepPurple,
          actions: [
            IconButton(
              icon: Icon(isEditing ? Icons.check : Icons.edit, color: Colors.green),
              onPressed: () {
                if (isEditing) {
                  saveProfile();
                }
                setState(() => isEditing = !isEditing);
              },
            )
          ],
        ),
        body: Padding(
          padding: const EdgeInsets.all(16),
          child: SingleChildScrollView(
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 600),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    isEditing
                        ? buildTextField("First Name", _firstNameController)
                        : Text(
                            "First Name: ${_firstNameController.text}",
                            style: const TextStyle(fontSize: 20),
                            textAlign: TextAlign.center,
                          ),
                    const SizedBox(height: 12),
                    isEditing
                        ? buildTextField("Last Name", _lastNameController)
                        : Text(
                            "Last Name: ${_lastNameController.text}",
                            style: const TextStyle(fontSize: 20),
                            textAlign: TextAlign.center,
                          ),
                    const SizedBox(height: 12),
                    isEditing
                        ? buildTextField("Username", _usernameController)
                        : Text(
                            "Username: ${_usernameController.text}",
                            style: const TextStyle(fontSize: 20),
                            textAlign: TextAlign.center,
                          ),
                    const SizedBox(height: 12),
                    isEditing
                        ? buildTextField("Description", _descriptionController, maxLines: 4)
                        : Text(
                            "Description: ${_descriptionController.text}",
                            style: const TextStyle(fontSize: 20),
                            textAlign: TextAlign.center,
                          ),
                    const SizedBox(height: 24),
                    const Text(
                      "Courses You're Taking:",
                      style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 10),
                    Wrap(
                      alignment: WrapAlignment.center,
                      spacing: 8,
                      runSpacing: 8,
                      children: courses
                          .map((c) => Chip(
                                label: Text(
                                  c,
                                  style: const TextStyle(fontSize: 16),
                                ),
                              ))
                          .toList(),
                    ),
                    const Padding(
                      padding: EdgeInsets.only(top: 12.0),
                      child: Text(
                        "To edit courses, visit the Courses tab.",
                        style: TextStyle(fontSize: 16, color: Colors.grey),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      );
    }

}