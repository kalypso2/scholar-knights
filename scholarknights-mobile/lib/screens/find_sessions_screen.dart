import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../utils/session_manager.dart';
import 'package:intl/intl.dart';
import 'session_details_screen.dart';

class FindSessionsScreen extends StatefulWidget {
  final String token;
  const FindSessionsScreen({Key? key, required this.token}) : super(key: key);

  @override
  State<FindSessionsScreen> createState() => _FindSessionsScreenState();
}

class _FindSessionsScreenState extends State<FindSessionsScreen> {

  DateTime? selectedDate;
  String? selectedModality;
  String? selectedPrivacy;

  List<dynamic> sessions = [];
  List<String> joinedSessionIds = [];
  List<String> requestedSessionIds = [];
  List<dynamic> userCourses = [];
  List<dynamic> filteredSessions = [];
  final List<String> modalityOptions = ['Online', 'In-person'];
  final List<String> privacyOptions = ['Public', 'Private'];

  
  // Filter state
  String searchQuery = '';
  final Set<String> selectedCourses = {};
  final Set<String> selectedTags = {};
  bool showRelevantOnly = false;
  bool isLoading = true;
  
  // Pagination
  int currentPage = 0;
  final int itemsPerPage = 6;

  // Constants
  static const List<String> tagOptions = [
    "Group Study", 
    "Exam Review", 
    "Homework Help", 
    "1-on-1 Help"
  ];

  @override
  void initState() {
    super.initState();
    _loadInitialData();
  }

  Future<void> _loadInitialData() async {
    setState(() => isLoading = true);
    
    try {
      await Future.wait([
        _fetchSessions(),
        _fetchUserCourses(),
        _fetchUserGroups(),
      ]);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Error loading data: ${e.toString()}")),
        );
      }
    } finally {
      if (mounted) {
        setState(() => isLoading = false);
      }
    }
  }

  Future<void> _fetchSessions() async {
    try {
      final response = await http.get(
        Uri.parse("http://www.scholarknights.com/api/groups"),
        headers: {"Authorization": "Bearer ${widget.token}"},
      );
      
      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        
        // Add null checks and proper type casting
        if (body is! Map<String, dynamic>) {
          throw Exception("Invalid response format");
        }
        
        final groups = body["groups"] as List<dynamic>? ?? [];
        
        setState(() {
          sessions = groups.where((g) => g is Map<String, dynamic>).toList();
          filteredSessions = List.from(sessions);
        });
      } else {
        throw Exception("Failed to load sessions: ${response.statusCode}");
      }
    } catch (e) {
      print("Error fetching sessions: $e");
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Error loading sessions: ${e.toString()}")),
        );
      }
    }
  }

  Future<void> _fetchUserCourses() async {
    final userId = SessionManager.userId;
    if (userId == null) return;
    
    final response = await http.get(
      Uri.parse("http://www.scholarknights.com/api/user/$userId/courses"),
      headers: {"Authorization": "Bearer ${widget.token}"},
    );
    
    if (response.statusCode == 200) {
      setState(() {
        userCourses = jsonDecode(response.body)["courses"];
      });
    }
  }

  Future<void> _fetchUserGroups() async {
    final userId = SessionManager.userId;
    if (userId == null) return;
    
    final response = await http.get(
      Uri.parse("http://www.scholarknights.com/api/user/groups/$userId"),
    );
    
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      setState(() {
        joinedSessionIds = List<String>.from(data["joinedGroups"].map((g) => g["_id"]));
        requestedSessionIds = List<String>.from(
          data["joinedGroups"]
              .where((g) => (g["joinRequests"] as List?)?.contains(userId) == true)
              .map((g) => g["_id"]),
        );
      });
    }
  }

  void _applyFilters() {
    setState(() {
      filteredSessions = sessions.where((session) {
        final title = (session["title"] ?? "").toString().toLowerCase();
        final description = (session["description"] ?? "").toString().toLowerCase();

        // Search filter
        if (searchQuery.isNotEmpty &&
            !(title.contains(searchQuery) || description.contains(searchQuery))) {
          return false;
        }

        // Course filter
        final course = session["course"];
        final courseCode = course is Map ? course["courseCode"] : course.toString();
        if (selectedCourses.isNotEmpty && !selectedCourses.contains(courseCode)) {
          return false;
        }

        // Tag filter
        final sessionTags = List<String>.from(session["tags"] ?? []);
        if (selectedTags.isNotEmpty &&
            !sessionTags.any((tag) => selectedTags.contains(tag))) {
          return false;
        }

        // Relevant only filter
        if (showRelevantOnly &&
            !userCourses.any((c) => c["courseCode"] == courseCode)) {
          return false;
        }

        // Date filter
        if (selectedDate != null) {
          final sessionDateStr = session["date"];
          if (sessionDateStr == null) return false;
          final sessionDate = DateTime.tryParse(sessionDateStr);
          if (sessionDate == null ||
              sessionDate.year != selectedDate!.year ||
              sessionDate.month != selectedDate!.month ||
              sessionDate.day != selectedDate!.day) {
            return false;
          }
        }

        // Modality filter
        if (selectedModality != null) {
          final modality = session["modality"]?.toString().toLowerCase();
          if (modality != selectedModality!.toLowerCase()) {
            return false;
          }
        }

        // Privacy filter
        if (selectedPrivacy != null) {
          final isPrivate = session["privacy"] == true;
          final privacyStr = isPrivate ? "Private" : "Public";
          if (privacyStr != selectedPrivacy) {
            return false;
          }
        }

        return true;
      }).toList();

      currentPage = 0; // Reset pagination
    });
  }

  Future<void> _joinSession(String groupId, bool isPrivate) async {
    final userId = SessionManager.userId;
    if (userId == null) return;

    try {
      if (isPrivate) {
        await http.post(
          Uri.parse("http://www.scholarknights.com/api/groups/$groupId/request-join"),
          headers: {"Content-Type": "application/json"},
          body: jsonEncode({"userId": userId}),
        );
        setState(() => requestedSessionIds.add(groupId));
      } else {
        await http.post(
          Uri.parse("http://www.scholarknights.com/api/join-group"),
          headers: {"Content-Type": "application/json"},
          body: jsonEncode({"userId": userId, "groupId": groupId}),
        );
        setState(() => joinedSessionIds.add(groupId));
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Error joining session: ${e.toString()}")),
        );
      }
    }
  }

  Widget _buildFilters() {
    return Padding(
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Search Field
          TextField(
            decoration: const InputDecoration(
              labelText: "Search",
              prefixIcon: Icon(Icons.search),
              border: OutlineInputBorder(),
            ),
            onChanged: (value) {
              searchQuery = value.toLowerCase();
              _applyFilters();
            },
          ),
          const SizedBox(height: 12),

          // Date Picker
          Row(
            children: [
              const Text("Date: "),
              TextButton(
                onPressed: () async {
                  final picked = await showDatePicker(
                    context: context,
                    initialDate: selectedDate ?? DateTime.now(),
                    firstDate: DateTime.now().subtract(const Duration(days: 365)),
                    lastDate: DateTime.now().add(const Duration(days: 365)),
                  );
                  if (picked != null) {
                    setState(() {
                      selectedDate = picked;
                      _applyFilters();
                    });
                  }
                },
                child: Text(
                  selectedDate != null
                      ? DateFormat('MM/dd/yyyy').format(selectedDate!)
                      : "Select Date",
                ),
              ),
              if (selectedDate != null)
                IconButton(
                  icon: const Icon(Icons.clear),
                  onPressed: () {
                    setState(() {
                      selectedDate = null;
                      _applyFilters();
                    });
                  },
                ),
            ],
          ),

          const SizedBox(height: 12),
          const Text("Modality", style: TextStyle(fontWeight: FontWeight.w600)),
          Wrap(
            spacing: 8,
            children: modalityOptions.map((modality) {
              return FilterChip(
                label: Text(modality),
                selected: selectedModality == modality,
                onSelected: (_) {
                  setState(() {
                    selectedModality =
                        selectedModality == modality ? null : modality;
                    _applyFilters();
                  });
                },
              );
            }).toList(),
          ),

          const SizedBox(height: 12),
          const Text("Privacy", style: TextStyle(fontWeight: FontWeight.w600)),
          Wrap(
            spacing: 8,
            children: privacyOptions.map((privacy) {
              return FilterChip(
                label: Text(privacy),
                selected: selectedPrivacy == privacy,
                onSelected: (_) {
                  setState(() {
                    selectedPrivacy =
                        selectedPrivacy == privacy ? null : privacy;
                    _applyFilters();
                  });
                },
              );
            }).toList(),
          ),

          const SizedBox(height: 12),
          const Text("Courses", style: TextStyle(fontWeight: FontWeight.w600)),
          Wrap(
            spacing: 8,
            children: userCourses.map<Widget>((course) {
              final code = course["courseCode"];
              return FilterChip(
                label: Text(code),
                selected: selectedCourses.contains(code),
                onSelected: (_) {
                  setState(() {
                    selectedCourses.contains(code)
                        ? selectedCourses.remove(code)
                        : selectedCourses.add(code);
                    _applyFilters();
                  });
                },
              );
            }).toList(),
          ),

          const SizedBox(height: 12),
          const Text("Session Tags", style: TextStyle(fontWeight: FontWeight.w600)),
          Wrap(
            spacing: 8,
            children: tagOptions.map((tag) {
              return FilterChip(
                label: Text(tag),
                selected: selectedTags.contains(tag),
                onSelected: (_) {
                  setState(() {
                    selectedTags.contains(tag)
                        ? selectedTags.remove(tag)
                        : selectedTags.add(tag);
                    _applyFilters();
                  });
                },
              );
            }).toList(),
          ),

          const SizedBox(height: 12),
          Row(
            children: [
              Checkbox(
                value: showRelevantOnly,
                onChanged: (value) {
                  setState(() {
                    showRelevantOnly = value ?? false;
                    _applyFilters();
                  });
                },
              ),
              const Text("Show only my courses"),
            ],
          ),
        ],
      ),
    );
  }




  Widget _buildSessionCard(Map<String, dynamic> session) {
    final id = session["_id"];
    final isJoined = joinedSessionIds.contains(id);
    final isRequested = requestedSessionIds.contains(id);
    final isPrivate = session["privacy"] == true;
    final course = session["course"];
    final courseCode = course is Map ? course["courseCode"] : course.toString();
    final date = session["date"] != null 
        ? DateFormat('MM-dd-yyyy').format(DateTime.parse(session["date"]))
        : "TBD";
    final time = session["time"] ?? "TBD";

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      child: InkWell(
        onTap: () => Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => SessionDetailsScreen(sessionId: id),
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                session["title"] ?? "Untitled Session",
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: 8),
              Text("Course: $courseCode"),
              Text("Date: $date at $time"),
              Text("Location: ${isPrivate ? "Private" : session["location"] ?? "TBD"}"),
              if (session["tags"] != null && session["tags"].isNotEmpty) ...[
                const SizedBox(height: 8),
                Wrap(
                  spacing: 4,
                  children: List<String>.from(session["tags"])
                      .map((tag) => Chip(
                            label: Text(tag),
                            materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                          ))
                      .toList(),
                ),
              ],
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => SessionDetailsScreen(sessionId: id),
                      ),
                    ),
                    child: const Text("Details"),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton(
                    onPressed: isJoined || isRequested 
                        ? null 
                        : () => _joinSession(id, isPrivate),
                    child: Text(
                      isJoined ? "Joined" :
                      isRequested ? "Requested" :
                      isPrivate ? "Request" : "Join",
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final paginatedSessions = filteredSessions
        .skip(currentPage * itemsPerPage)
        .take(itemsPerPage)
        .toList();
    final totalPages = (filteredSessions.length / itemsPerPage).ceil();

    return Scaffold(
      appBar: AppBar(title: const Text("Find Study Sessions")),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // Give filters about half the screen height
                SizedBox(height: MediaQuery.of(context).size.height * 0.5, child: SingleChildScrollView(child: _buildFilters())),
                const Divider(height: 0),
                Expanded(
                  child: ListView.builder(
                    itemCount: paginatedSessions.length,
                    itemBuilder: (context, index) =>
                        _buildSessionCard(paginatedSessions[index]),
                  ),
                ),
                if (totalPages > 1)
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.chevron_left),
                          onPressed: currentPage > 0
                              ? () => setState(() => currentPage--)
                              : null,
                        ),
                        Text("Page ${currentPage + 1} of $totalPages"),
                        IconButton(
                          icon: const Icon(Icons.chevron_right),
                          onPressed: currentPage < totalPages - 1
                              ? () => setState(() => currentPage++)
                              : null,
                        ),
                      ],
                    ),
                  ),
              ],
            ),
    );
  }

}
