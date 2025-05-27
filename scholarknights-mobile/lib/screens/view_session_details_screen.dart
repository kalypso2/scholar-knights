import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class ViewSessionDetailsScreen extends StatefulWidget {
  final String sessionId;

  const ViewSessionDetailsScreen({Key? key, required this.sessionId}) : super(key: key);

  @override
  State<ViewSessionDetailsScreen> createState() => _ViewSessionDetailsScreenState();
}

class _ViewSessionDetailsScreenState extends State<ViewSessionDetailsScreen> {
  Map<String, dynamic>? session;
  String creatorName = '';
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchSession();
  }

  Future<Map<String, dynamic>> fetchUser(String userId) async {
    final res = await http.get(Uri.parse('https://www.scholarknights.com/api/fetch-profile/$userId'));
    if (res.statusCode != 200) {
      print("User fetch failed for ID: $userId → ${res.statusCode}");
      return {}; // safe fallback
    }
    final data = jsonDecode(res.body);
    return data['user'] ?? {};
  }


  Future<void> fetchSession() async {
    try {
      final sessionRes = await http.get(Uri.parse('https://www.scholarknights.com/api/groups/${widget.sessionId}'));
      if (sessionRes.statusCode != 200) throw Exception('Failed to fetch session');

      final data = jsonDecode(sessionRes.body);
      final group = data['group'] as Map<String, dynamic>?; // Cast to nullable map

      if (group == null) {
        throw Exception('Group data not found');
      }

      final creatorId = group['creator'] as String?;
      String displayName = "Unknown Host";

      if (creatorId != null) {
        final creatorProfile = await fetchUser(creatorId);
        final first = creatorProfile['first_name'] ?? '';
        final last = creatorProfile['last_name'] ?? '';
        displayName = (first + ' ' + last).trim();
        if (displayName.isEmpty) {
          displayName = creatorProfile['username'] ?? 'Unknown Host';
        }
      }

      setState(() {
        session = group;
        creatorName = displayName;
        isLoading = false;
      });
    } catch (e) {
      print('Error fetching session: $e');
      setState(() {
        isLoading = false;
      });
    }
  }

  String formatDate(String? isoDate) {
    if (isoDate == null) return '';
    final d = DateTime.tryParse(isoDate);
    if (d == null) return isoDate;
    return "${d.month}/${d.day}/${d.year}";
  }

  String formatTime(String? time) {
    if (time == null || !time.contains(":")) return "";
    final parts = time.split(":");
    final h = int.parse(parts[0]);
    final m = parts[1];
    final ampm = h >= 12 ? "PM" : "AM";
    final hour = h % 12 == 0 ? 12 : h % 12;
    return "$hour:$m $ampm";
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (session == null) {
      return const Scaffold(
        body: Center(child: Text('Failed to load session')),
      );
    }

    final isPrivate = session!['privacy'] == true;

    return Scaffold(
      appBar: AppBar(
        title: Text(session!['title'] ?? 'Session Details'),
        backgroundColor: Colors.deepPurple,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: ListView(
          children: [
            Text(session!['description'] ?? 'No description provided.', style: const TextStyle(fontSize: 16)),

            const SizedBox(height: 12),
            if (session!["course"] != null)
              Text("Course: ${session!["course"] is Map ? session!["course"]["courseCode"] : session!["course"]}"),

            if (session!["modality"] != null)
              Text("Modality: ${session!["modality"]}"),

            Text("Hosted by: $creatorName"),

            const SizedBox(height: 12),
            Text("Date: ${formatDate(session!["date"])}"),
            Text("Time: ${formatTime(session!["time"])}"),
            Text("Privacy: ${isPrivate ? 'Private 🔒' : 'Public 🌍'}"),
            Text("Location: ${isPrivate ? 'Hidden until approved' : session!["location"] ?? ''}"),

            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                // RSVP / Request logic
              },
              child: Text(isPrivate ? "Request to Join" : "RSVP to Join"),
              style: ElevatedButton.styleFrom(backgroundColor: Colors.deepPurple),
            )
          ],
        ),
      ),
    );
  }
}

