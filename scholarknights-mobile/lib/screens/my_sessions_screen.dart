import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../utils/session_manager.dart';
import 'session_details_screen.dart';

class MySessionsScreen extends StatefulWidget {
  final String token;
  const MySessionsScreen({Key? key, required this.token}) : super(key: key);

  @override
  State<MySessionsScreen> createState() => _MySessionsScreenState();
}

class _MySessionsScreenState extends State<MySessionsScreen> {
  List createdGroups = [];
  List joinedGroups = [];
  bool isLoading = true;
  String error = "";

  @override
  void initState() {
    super.initState();
    fetchUserSessions();
  }

  Future<void> fetchUserSessions() async {
    final userId = SessionManager.userId; // ✅ Await added
    if (userId == null) {
      setState(() {
        error = "User ID not found.";
        isLoading = false;
      });
      return;
    }

    try {
      final response = await http.get(
        Uri.parse("http://www.scholarknights.com/api/user/groups/$userId"),
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer ${widget.token}"
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          createdGroups = data['createdGroups'];
          joinedGroups = data['joinedGroups'];
          isLoading = false;
        });
      } else {
        setState(() {
          error = "Failed to load sessions.";
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        error = "Error fetching sessions.";
        isLoading = false;
      });
    }
  }


  String formatDate(String isoDate) {
    try {
      final date = DateTime.parse(isoDate);
      return "${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}-${date.year}";
    } catch (e) {
      return isoDate;
    }
  }

  Future<void> leaveSession(String groupId) async {
    final userId = SessionManager.userId; // ✅ Await added
    if (userId == null) return;

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Leave Session"),
        content: const Text("Are you sure you want to leave this session?"),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text("Cancel")),
          TextButton(onPressed: () => Navigator.pop(context, true), child: const Text("Leave")),
        ],
      ),
    );

    if (confirmed != true) return;

    try {
      final response = await http.post(
        Uri.parse("http://www.scholarknights.com/api/leave-group"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"userId": userId, "groupId": groupId}),
      );

      if (response.statusCode == 200) {
        setState(() {
          joinedGroups.removeWhere((s) => s['_id'] == groupId);
        });
      }
    } catch (e) {
      print("Leave session error: $e");
    }
  }

  Widget buildSessionCard(Map session, {bool isJoined = false}) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
      elevation: 3,
      child: ListTile(
        title: Text(session['title'] ?? 'No Title'),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (session['course'] != null && session['course'] is Map && session['course']['courseCode'] != null)
              Text("Course: ${session['course']['courseCode']}"),
            if (session['course'] != null && session['course'] is String)
              Text("Course: ${session['course']}"),
            if (session['date'] != null)
              Text(
                "Date: ${formatDate(session['date'])}",
                style: const TextStyle(fontSize: 12),
              ),

            if (session['time'] != null) Text("Time: ${session['time']}", style: const TextStyle(fontSize: 12)),
            if (session['location'] != null)
              Text("Location: ${session['location']}", style: const TextStyle(fontSize: 12)),
          ],
        ),
        trailing: isJoined
            ? IconButton(
                icon: const Icon(Icons.logout),
                onPressed: () => leaveSession(session['_id']),
                tooltip: "Leave Session",
              )
            : null,
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => SessionDetailsScreen(sessionId: session['_id']),
            ),
          );
        },
      ),
    );
  }

  Widget buildSessionSection(String title, List sessions, {bool isJoined = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 16),
          Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          if (sessions.isEmpty)
            const Text("No sessions available.")
          else
            ...sessions.map((s) => buildSessionCard(s, isJoined: isJoined)).toList(),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("My Sessions"),
                     backgroundColor: Colors.deepPurple,
                    ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : error.isNotEmpty
              ? Center(child: Text(error))
              : SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      buildSessionSection("Created Sessions", createdGroups),
                      buildSessionSection("Joined Sessions", joinedGroups, isJoined: true),
                    ],
                  ),
                ),
    );
  }
}

