import 'package:flutter/material.dart';
import 'dart:convert';


class ViewSessionsScreen extends StatelessWidget {
  final List<Map<String, String>> createdSessions = [
    {
      'title': 'Linear Algebra Review',
      'course': 'MAC2311',
      'date': 'April 11, 2025',
      'time': '3:00 PM',
      'location': 'ENG1 Room 281',
    },
    {
      'title': 'AI Homework Help',
      'course': 'CAP4630',
      'date': 'April 13, 2025',
      'time': '5:00 PM',
      'location': 'Library 3rd Floor',
    },
  ];

  final List<Map<String, String>> joinedSessions = [
    {
      'title': 'Exam Prep Group',
      'course': 'COP3503',
      'date': 'April 14, 2025',
      'time': '6:00 PM',
      'location': 'Virtual (Zoom)',
    },
  ];

  Widget buildSessionCard(Map<String, String> session) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              session['title'] ?? '',
              style: const TextStyle(
                  fontWeight: FontWeight.bold, fontSize: 18),
            ),
            const SizedBox(height: 4),
            Text("Course: ${session['course']}"),
            Text("Date: ${session['date']}"),
            Text("Time: ${session['time']}"),
            Text("Location: ${session['location']}"),
          ],
        ),
      ),
    );
  }

  Widget buildSessionSection(String title, List<Map<String, String>> sessions) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style:
              const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        if (sessions.isEmpty)
          const Text("No sessions available.")
        else
          ...sessions.map(buildSessionCard).toList(),
        const SizedBox(height: 24),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Your Sessions"),
        backgroundColor: const Color(0xFF7C4DFF),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: SingleChildScrollView(
          child: Column(
            children: [
              buildSessionSection("Created Sessions", createdSessions),
              buildSessionSection("Joined Sessions", joinedSessions),
            ],
          ),
        ),
      ),
    );
  }
}
