import 'package:flutter/material.dart';
import 'dart:convert';


class EmailVerificationScreen extends StatelessWidget {
  final String email;

  const EmailVerificationScreen({Key? key, required this.email}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.email_outlined, size: 80, color: Colors.purple),
              SizedBox(height: 20),
              Text(
                "A verification email has been sent to",
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 18),
              ),
              Text(
                email,
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
              ),
              SizedBox(height: 20),
              Text("Please check your inbox to complete registration.", textAlign: TextAlign.center),
              SizedBox(height: 30),
              ElevatedButton(
                onPressed: () => Navigator.pushReplacementNamed(context, '/login'),
                child: Text("Back to Login"),
              ),
            ],
          ),
        ),
      ),
    );
  }
}