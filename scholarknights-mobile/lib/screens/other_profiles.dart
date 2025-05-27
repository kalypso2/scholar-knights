import 'package:flutter/material.dart';
import 'dart:convert';

class ProfileOfOtherUserScreen extends StatelessWidget {
  final String username;
  final String name;

  const ProfileOfOtherUserScreen({Key? key, required this.username, required this.name}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("$name's Profile")),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CircleAvatar(
              radius: 40,
              backgroundColor: Colors.purple,
              child: Text(name.isNotEmpty ? name[0] : '?', style: TextStyle(fontSize: 30, color: Colors.white)),
            ),
            SizedBox(height: 20),
            Text("Name: $name", style: TextStyle(fontSize: 18)),
            SizedBox(height: 10),
            Text("Username: @$username", style: TextStyle(fontSize: 16, color: Colors.grey[700])),
            // Add more fields if needed
          ],
        ),
      ),
    );
  }
}