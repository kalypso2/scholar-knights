import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../services/api.dart';
import '../utils/session_manager.dart';

class CoursesScreen extends StatefulWidget {
  const CoursesScreen({super.key});

  @override
  State<CoursesScreen> createState() => _CoursesScreenState();
}

class _CoursesScreenState extends State<CoursesScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _subjectController = TextEditingController();
  final TextEditingController _numberController = TextEditingController();

  List<dynamic> _userCourses = [];
  List<dynamic> _suggestions = [];
  bool _dropdownVisible = false;
  bool isLoading = true;
  String? _lookupError;
  String? _selectedCourseId;

  @override
  void initState() {
    super.initState();
    fetchCourses();
    _subjectController.addListener(_handleCourseInputChange);
    _numberController.addListener(_handleCourseInputChange);
  }

  Future<void> fetchCourses() async {
    final userId = SessionManager.userId; // ✅ Await it!
    if (userId == null) {
      print("User ID is null.");
      return;
    }

    try {
      final userCoursesRes = await http.get(Uri.parse('$baseUrl/user/$userId/courses'));
      if (userCoursesRes.statusCode == 200) {
        final user = jsonDecode(userCoursesRes.body)['courses'];
        setState(() {
          _userCourses = user;
          isLoading = false;
        });
      } else {
        print("Failed to fetch courses: ${userCoursesRes.statusCode}");
      }
    } catch (e) {
      print("Error loading courses: $e");
    }
  }


  void _handleCourseInputChange() async {
    final subject = _subjectController.text.trim().toUpperCase();
    final number = _numberController.text.trim().toUpperCase();
    final fullCode = '$subject$number';

    if (subject.length < 3 || number.length < 3) {
      setState(() {
        _suggestions = [];
        _dropdownVisible = false;
        _lookupError = null;
      });
      return;
    }

    try {
      final res = await http.get(Uri.parse('$baseUrl/courses/code/$fullCode'));
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);

        if (data is Map<String, dynamic>) {
          if (data.containsKey('title') && data.containsKey('_id')) {
            setState(() {
              _nameController.text = data['title'];
              _suggestions = [data];
              _dropdownVisible = true;
              _lookupError = null;
              _selectedCourseId = data['_id'];
            });
          } else {
            setState(() {
              _nameController.clear();
              _suggestions = [];
              _dropdownVisible = false;
              _lookupError = "Unexpected course format.";
            });
          }
        } else if (data is List) {
          setState(() {
            _suggestions = List<Map<String, dynamic>>.from(data);
            _dropdownVisible = _suggestions.isNotEmpty;
            _lookupError = null;
            _nameController.clear();
            _selectedCourseId = null;
          });
        } else {
          setState(() {
            _nameController.clear();
            _suggestions = [];
            _dropdownVisible = false;
            _lookupError = "Unexpected response format.";
          });
        }
      } else {
        setState(() {
          _nameController.clear();
          _suggestions = [];
          _dropdownVisible = false;
          _lookupError = "Course not found.";
        });
      }
    } catch (e) {
      setState(() {
        _nameController.clear();
        _suggestions = [];
        _dropdownVisible = false;
        _lookupError = "Network error while searching.";
      });
    }
  }

  void _selectSuggestion(Map<String, dynamic> course) {
    setState(() {
      _subjectController.text = course['courseCode'].substring(0, 3);
      _numberController.text = course['courseCode'].substring(3);
      _nameController.text = course['title'];
      _dropdownVisible = false;
      _lookupError = null;
      _selectedCourseId = course['_id'];
    });
  }

  Future<void> _addCourse() async {
    final userId = SessionManager.userId;
    if (_selectedCourseId == null) return;

    final res = await http.post(
      Uri.parse('$baseUrl/user/$userId/courses'),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        "courseCode": _subjectController.text.toUpperCase() + _numberController.text.toUpperCase(),
        "title": _nameController.text.trim()
      }),
    );

    if (res.statusCode == 200) {
      fetchCourses();
      _nameController.clear();
      _subjectController.clear();
      _numberController.clear();
      _selectedCourseId = null;
    }
  }

  Future<void> _removeCourse(String courseId) async {
    final userId = SessionManager.userId;
    final res = await http.delete(Uri.parse('$baseUrl/user/$userId/courses/$courseId'));
    if (res.statusCode == 200) {
      fetchCourses();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Your Courses"),
                     backgroundColor: Colors.deepPurple,
                    ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  Form(
                    key: _formKey,
                    child: Column(
                      children: [
                        TextFormField(
                          controller: _nameController,
                          readOnly: true,
                          decoration: const InputDecoration(
                            labelText: "Course Title (auto-filled)",
                            hintText: "Auto-fills if course exists",
                          ),
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            Expanded(
                              child: TextFormField(
                                controller: _subjectController,
                                decoration: const InputDecoration(labelText: "Subject (e.g. PHY)"),
                                textCapitalization: TextCapitalization.characters,
                                validator: (val) => val == null || val.isEmpty ? 'Required' : null,
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: TextFormField(
                                controller: _numberController,
                                decoration: const InputDecoration(labelText: "Number (e.g. 2049L)"),
                                keyboardType: TextInputType.text,
                                validator: (val) => val == null || val.isEmpty ? 'Required' : null,
                              ),
                            ),
                          ],
                        ),
                        if (_dropdownVisible && _suggestions.isNotEmpty)
                          Container(
                            margin: const EdgeInsets.only(top: 10),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              border: Border.all(color: Colors.grey.shade300),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Column(
                              children: _suggestions.map((course) {
                                return ListTile(
                                  title: Text("${course['courseCode']} – ${course['title']}"),
                                  onTap: () => _selectSuggestion(course),
                                );
                              }).toList(),
                            ),
                          ),
                        if (_lookupError != null)
                          Padding(
                            padding: const EdgeInsets.only(top: 8.0),
                            child: Text(
                              _lookupError!,
                              style: const TextStyle(color: Colors.red, fontSize: 13),
                            ),
                          ),
                        const SizedBox(height: 12),
                        ElevatedButton(
                          onPressed: () async {
                            if (_formKey.currentState!.validate()) {
                              await _addCourse();
                            }
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.deepPurple,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: const Text("Add Course", style: TextStyle(color: Colors.white)),
                        )
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  const Divider(),
                  _userCourses.isEmpty
                      ? const Padding(
                          padding: EdgeInsets.only(top: 20),
                          child: Text("No courses added yet."),
                        )
                      : ListView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: _userCourses.length,
                          itemBuilder: (context, index) {
                            final course = _userCourses[index];
                            return Card(
                              margin: const EdgeInsets.symmetric(vertical: 6),
                              child: ListTile(
                                title: Text(course['title'] ?? ""),
                                subtitle: Text("Code: ${course['courseCode'] ?? ""}"),
                                trailing: IconButton(
                                  icon: const Icon(Icons.delete, color: Colors.red),
                                  onPressed: () => _removeCourse(course['_id']),
                                ),
                              ),
                            );
                          },
                        ),
                ],
              ),
            ),
    );
  }
}




