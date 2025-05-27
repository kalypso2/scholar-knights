// /lib/widgets/session_card_widget.dart

import 'package:flutter/material.dart';
import '../screens/session_details_screen.dart';

class SessionCardWidget extends StatelessWidget {
  final Map session;
  final bool isJoined;
  final bool isRequested;
  final VoidCallback onJoin;
  final VoidCallback onDetails;

  const SessionCardWidget({
    Key? key,
    required this.session,
    required this.isJoined,
    required this.isRequested,
    required this.onJoin,
    required this.onDetails,
  }) : super(key: key);

  String formatDate(String? iso) {
    if (iso == null) return "Date TBD";
    final d = DateTime.tryParse(iso);
    return d == null ? iso : "${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}-${d.year}";
  }

  String formatTime(String? time) {
    if (time == null || !time.contains(":")) return "TBD";
    final parts = time.split(":");
    int h = int.parse(parts[0]);
    final m = parts[1];
    final ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 == 0 ? 12 : h % 12;
    return "$h:$m $ampm";
  }

  @override
  Widget build(BuildContext context) {
    final id = session["_id"]?.toString() ?? '';
    final isPrivate = session["privacy"] == true;
    final course = session["course"];
    final code = course is Map ? course["courseCode"]?.toString() : course?.toString() ?? 'N/A';
    
    // Add null checks for all session data accesses
    final title = session["title"]?.toString() ?? 'Untitled Session';
    final date = session["date"]?.toString() ?? 'TBD';
    final time = session["time"]?.toString() ?? 'TBD';
    final location = isPrivate ? 'Private' : session["location"]?.toString() ?? 'TBD';
    final modality = session["modality"]?.toString() ?? 'N/A';
    final tags = List<String>.from(session["tags"] ?? []);

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      elevation: 3,
      child: ListTile(
        title: Text(session["title"] ?? "Untitled", style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (code != null) Text("Course: $code"),
            Text("${formatDate(session["date"])} at ${formatTime(session["time"])}"),
            Text("Modality: ${session["modality"]} | Location: ${isPrivate ? 'Hidden' : session["location"]}"),
            Text("Privacy: ${isPrivate ? 'Private 🔒' : 'Public 🌍'}"),
            if (session["description"] != null)
                Padding(
                    padding: const EdgeInsets.only(top: 6.0),
                    child: Text(
                    session["description"],
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    ),
                ),
                if (session["attendees"] != null)
                Text("Attendees: ${session["attendees"].length}"),
                if (session["creator"] != null && session["creator"]["name"] != null)
                Text("Host: ${session["creator"] != null ? session["creator"]["name"] ?? 'Unknown' 'Unknown'}"),
            Wrap(
              spacing: 6,
              children: List<String>.from(session["tags"] ?? []).map((t) {
                return Chip(label: Text(t), backgroundColor: Colors.purple.shade50);
              }).toList(),
            ),
          ],
        ),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: isJoined || isRequested ? null : onJoin,
              child: Text(
                isJoined
                    ? "Joined"
                    : isRequested
                        ? "Requested"
                        : isPrivate
                            ? "Request"
                            : "Join",
              ),
            ),
            const SizedBox(height: 4),
            TextButton(
              child: const Text("View Details →"),
              onPressed: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => ViewSessionDetailsScreen(sessionId: session['_id']),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
