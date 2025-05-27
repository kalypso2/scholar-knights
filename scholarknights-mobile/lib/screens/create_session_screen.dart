import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../services/api.dart';
import '../utils/session_manager.dart';

class CreateSessionScreen extends StatefulWidget {
  const CreateSessionScreen({super.key});

  @override
  State<CreateSessionScreen> createState() => _CreateSessionScreenState();
}

class _CreateSessionScreenState extends State<CreateSessionScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _locationController = TextEditingController();
  final TextEditingController _capacityController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();

  List<dynamic> _userCourses = [];
  String? _selectedCourseId;
  String? _selectedTag;
  String? _selectedModality;
  String _privacy = "public";
  DateTime? _selectedDate;
  TimeOfDay? _selectedTime;

  final List<String> _tags = ["Group Study", "Exam Review", "Homework Help", "1-on-1 Help"];
  final List<String> _modalities = ["Online", "In-person", "Hybrid"];

  @override
  void initState() {
    super.initState();
    fetchUserCourses();
  }

  Future<void> fetchUserCourses() async {
    final userId = SessionManager.userId; // ✅ await here
    if (userId == null) {
      print("User ID is null");
      return;
    }

    final res = await http.get(Uri.parse('$baseUrl/user/$userId/courses'));

    if (res.statusCode == 200) {
      setState(() {
        _userCourses = jsonDecode(res.body)['courses'];
      });
    } else {
      print("Failed to load courses: ${res.body}");
    }
}


  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime.now().subtract(const Duration(days: 1)),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (picked != null) setState(() => _selectedDate = picked);
  }

  Future<void> _pickTime() async {
    final picked = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.now(),
    );
    if (picked != null) setState(() => _selectedTime = picked);
  }

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate() || _selectedCourseId == null || _selectedTag == null || _selectedModality == null || _selectedDate == null || _selectedTime == null) return;

    final userId = SessionManager.userId; // ✅ await here
    if (userId == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("User not logged in.")));
      return;
    }

    final dateTime = DateTime(
      _selectedDate!.year,
      _selectedDate!.month,
      _selectedDate!.day,
      _selectedTime!.hour,
      _selectedTime!.minute,
    );

    final payload = {
      "title": _titleController.text.trim(),
      "course": _selectedCourseId,
      "date": dateTime.toIso8601String(),
      "time": _selectedTime!.format(context),
      "location": _locationController.text.trim(),
      "capacity": int.parse(_capacityController.text),
      "privacy": _privacy == "private",
      "tags": [_selectedTag!],
      "modality": _selectedModality!,
      "description": _descriptionController.text.trim(),
      "creator": userId,
      "members": [userId],
    };

    final res = await http.post(
      Uri.parse('$baseUrl/addgroup'),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode(payload),
    );

    if (res.statusCode == 201) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Session created!")));
      _formKey.currentState?.reset();
      setState(() {
        _selectedDate = null;
        _selectedTime = null;
        _selectedTag = null;
        _selectedCourseId = null;
        _selectedModality = null;
        _privacy = "public";
      });
    } else {
      print("Add group error: ${res.body}");
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Failed to create session")));
    }
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Create Study Session"),
                     backgroundColor: Colors.deepPurple,
                    ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              _buildTextField("Group Title", _titleController),
              const SizedBox(height: 12),
              _buildDropdownField(
                label: "Course",
                value: _selectedCourseId,
                items: _userCourses.map((c) {
                  final code = c["courseCode"];
                  final title = c["title"];
                  return DropdownMenuItem(
                    value: c["_id"],
                    child: Text("$code – $title"),
                  );
                }).toList(),
                onChanged: (val) => setState(() => _selectedCourseId = val),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: _pickDate,
                      icon: const Icon(Icons.calendar_today),
                      label: Text(_selectedDate != null ? "${_selectedDate!.month}/${_selectedDate!.day}/${_selectedDate!.year}" : "Pick a Date"),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: _pickTime,
                      icon: const Icon(Icons.access_time),
                      label: Text(_selectedTime != null ? _selectedTime!.format(context) : "Pick a Time"),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              _buildTextField("Location", _locationController),
              const SizedBox(height: 12),
              _buildTextField("Capacity", _capacityController, inputType: TextInputType.number),
              const SizedBox(height: 12),
              _buildTextField("Description", _descriptionController, maxLines: 3),
              const SizedBox(height: 12),
              _buildDropdownField(
                label: "Modality",
                value: _selectedModality,
                items: _modalities.map((m) => DropdownMenuItem(value: m, child: Text(m))).toList(),
                onChanged: (val) => setState(() => _selectedModality = val),
              ),
              const SizedBox(height: 12),
              _buildDropdownField(
                label: "Privacy",
                value: _privacy,
                items: ["public", "private"].map((p) => DropdownMenuItem(value: p, child: Text(p.capitalize()))).toList(),
                onChanged: (val) => setState(() => _privacy = val!),
              ),
              const SizedBox(height: 12),
              _buildDropdownField(
                label: "Tag",
                value: _selectedTag,
                items: _tags.map((t) => DropdownMenuItem(value: t, child: Text(t))).toList(),
                onChanged: (val) => setState(() => _selectedTag = val),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _submitForm,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.deepPurple,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text("Create Session", style: TextStyle(color: Colors.white, fontSize: 16)),
              )
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTextField(String label, TextEditingController controller,
      {TextInputType inputType = TextInputType.text, int maxLines = 1}) {
    return TextFormField(
      controller: controller,
      keyboardType: inputType,
      maxLines: maxLines,
      validator: (val) => val == null || val.isEmpty ? '$label is required' : null,
      decoration: InputDecoration(
        labelText: label,
        border: const OutlineInputBorder(),
      ),
    );
  }

  Widget _buildDropdownField({
    required String label,
    required dynamic value,
    required List<DropdownMenuItem> items,
    required void Function(dynamic) onChanged,
  }) {
    return DropdownButtonFormField(
      value: value,
      items: items,
      onChanged: onChanged,
      decoration: InputDecoration(
        labelText: label,
        border: const OutlineInputBorder(),
      ),
      validator: (val) => val == null ? 'Please select $label' : null,
    );
  }
}

extension on String {
  String capitalize() => "${this[0].toUpperCase()}${substring(1)}";
}
