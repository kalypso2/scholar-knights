// ResetPasswordScreen.dart
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ResetPasswordScreen extends StatefulWidget {
  final String token;

  const ResetPasswordScreen({Key? key, required this.token}) : super(key: key);

  @override
  _ResetPasswordScreenState createState() => _ResetPasswordScreenState();
}

class _ResetPasswordScreenState extends State<ResetPasswordScreen> {
  final newPasswordController = TextEditingController();
  final confirmPasswordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  String message = "";
  String error = "";

  Future<void> resetPassword() async {
    if (!_formKey.currentState!.validate()) return;

    if (newPasswordController.text != confirmPasswordController.text) {
      setState(() => error = "Passwords do not match.");
      return;
    }

    try {
      final res = await http.post(
        Uri.parse("http://www.scholarknights.com/api/reset-password/${widget.token}"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"newPassword": newPasswordController.text}),
      );

      if (res.statusCode == 200) {
        setState(() => message = "Password reset! Redirecting to login...");
        Future.delayed(Duration(seconds: 3), () => Navigator.pushReplacementNamed(context, '/login'));
      } else {
        final data = jsonDecode(res.body);
        setState(() => error = data['message'] ?? 'Reset failed');
      }
    } catch (e) {
      setState(() => error = "Network error.");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Reset Password")),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              if (message.isNotEmpty)
                Text(message, style: TextStyle(color: Colors.green)),
              if (error.isNotEmpty)
                Text(error, style: TextStyle(color: Colors.red)),
              TextFormField(
                controller: newPasswordController,
                obscureText: true,
                decoration: InputDecoration(labelText: "New Password"),
                validator: (val) => val == null || val.length < 6 ? "At least 6 characters" : null,
              ),
              SizedBox(height: 10),
              TextFormField(
                controller: confirmPasswordController,
                obscureText: true,
                decoration: InputDecoration(labelText: "Confirm Password"),
                validator: (val) => val!.isEmpty ? "Confirm your password" : null,
              ),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: resetPassword,
                child: Text("Reset Password"),
              ),
            ],
          ),
        ),
      ),
    );
  }
}