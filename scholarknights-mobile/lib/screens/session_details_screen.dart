// session_details_screen.dart
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../utils/session_manager.dart';

class SessionDetailsScreen extends StatefulWidget {
  final String sessionId;
  const SessionDetailsScreen({Key? key, required this.sessionId}) : super(key: key);

  @override
  State<SessionDetailsScreen> createState() => _SessionDetailsScreenState();
}

class _SessionDetailsScreenState extends State<SessionDetailsScreen> {
  Map session = {};
  List attendees = [];
  List joinRequests = [];
  bool isLoading = true;
  bool isCreator = false;
  bool joined = false;
  bool requested = false;

  @override
  void initState() {
    super.initState();
    fetchSession();
  }

  Future<void> fetchSession() async {
    final userId = SessionManager.userId;
    try {
      final response = await http.get(
        Uri.parse('http://www.scholarknights.com/api/groups/${widget.sessionId}'),
      );
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body)['group'];
        final attendeeProfiles = await Future.wait((data['members'] as List).map((m) => fetchUser(m)));

        bool isUserIn = data['members'].contains(userId);
        bool isRequesting = data['joinRequests'].contains(userId);

        List reqs = [];
        if (data['creator'] == userId && data['privacy'] == true) {
          final uid = SessionManager.userId;
          if (uid == null) return;
          reqs = await fetchJoinRequests(uid);

        }

        setState(() {
          session = data;
          attendees = attendeeProfiles;
          joinRequests = reqs;
          isCreator = data['creator'] == userId;
          joined = isUserIn;
          requested = isRequesting;
          isLoading = false;
        });
      }
    } catch (e) {
      print("Error fetching session: $e");
      setState(() => isLoading = false);
    }
  }

  Future<Map<String, dynamic>> fetchUser(String userId) async {
    final response = await http.get(Uri.parse('http://www.scholarknights.com/api/fetch-profile/$userId'));
    return jsonDecode(response.body)['user'];
  }

  Future<List> fetchJoinRequests(String userId) async {
    final response = await http.get(Uri.parse(
      'http://www.scholarknights.com/api/groups/${widget.sessionId}/requests?userId=$userId',
    ));
    final data = jsonDecode(response.body);
    return data['joinRequests'];
  }

  Future<void> handleJoin() async {
    final userId = SessionManager.userId;
    final uri = session['privacy']
        ? 'http://www.scholarknights.com/api/groups/${session['_id']}/request-join'
        : 'http://www.scholarknights.com/api/join-group';

    final response = await http.post(Uri.parse(uri),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({"userId": userId, "groupId": session['_id']}));
    fetchSession();
  }

  Future<void> handleKick(String userId) async {
    await http.post(Uri.parse('http://www.scholarknights.com/api/leave-group'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({"userId": userId, "groupId": session['_id']}));
    fetchSession();
  }

  Future<void> handleApprove(String userId) async {
    final creatorId = SessionManager.userId;
    await http.post(Uri.parse(
      'http://www.scholarknights.com/api/groups/${session['_id']}/approve-request'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({"userId": userId, "creatorId": creatorId})
    );
    fetchSession();
  }

  Future<void> handleDeny(String userId) async {
    final creatorId = SessionManager.userId;
    await http.post(Uri.parse(
      'http://www.scholarknights.com/api/groups/${session['_id']}/deny-request'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({"userId": userId, "creatorId": creatorId})
    );
    fetchSession();
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) return const Center(child: CircularProgressIndicator());

    return Scaffold(
      appBar: AppBar(title: Text(session['title'] ?? 'Session Details')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(session['description'] ?? '', style: const TextStyle(fontSize: 16)),
              const SizedBox(height: 8),
              Row(
                children: [
                  Icon(Icons.calendar_today, size: 16),
                  const SizedBox(width: 6),
                  Text(session['date'] ?? '')
                ],
              ),
              Row(
                children: [
                  Icon(Icons.access_time, size: 16),
                  const SizedBox(width: 6),
                  Text(session['time'] ?? '')
                ],
              ),
              Row(
                children: [
                  Icon(Icons.place, size: 16),
                  const SizedBox(width: 6),
                  Text(session['location'] ?? '')
                ],
              ),
              Row(
                children: [
                  Icon(session['privacy'] == true ? Icons.lock : Icons.public, size: 16),
                  const SizedBox(width: 6),
                  Text(session['privacy'] == true ? 'Private' : 'Public')
                ],
              ),
              const SizedBox(height: 20),
              Text("Attendees (${attendees.length}):", style: const TextStyle(fontWeight: FontWeight.bold)),
              ...attendees.map((u) => ListTile(
                leading: CircleAvatar(child: Text(u['first_name'][0])),
                title: Text("${u['first_name']} ${u['last_name']}"),
                subtitle: Text("@${u['username']}"),
                trailing: isCreator && u['_id'] != SessionManager.userId
                  ? IconButton(
                      icon: const Icon(Icons.remove_circle_outline),
                      onPressed: () => handleKick(u['_id']),
                    )
                  : null,
              )),
              if (isCreator && session['privacy'] == true && joinRequests.isNotEmpty) ...[
                const SizedBox(height: 20),
                const Text("Join Requests:", style: TextStyle(fontWeight: FontWeight.bold)),
                ...joinRequests.map((u) => ListTile(
                      leading: CircleAvatar(child: Text(u['first_name'][0])),
                      title: Text("${u['first_name']} ${u['last_name']}"),
                      subtitle: Text("@${u['username']}"),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.check, color: Colors.green),
                            onPressed: () => handleApprove(u['_id']),
                          ),
                          IconButton(
                            icon: const Icon(Icons.clear, color: Colors.red),
                            onPressed: () => handleDeny(u['_id']),
                          )
                        ],
                      ),
                    ))
              ],
              if (!isCreator && !joined && !requested)
                Center(
                  child: ElevatedButton(
                    onPressed: handleJoin,
                    child: Text(session['privacy'] == true ? 'Request' : 'Join'),
                  ),
                ),
              if (!isCreator && joined)
                const Center(
                  child: Padding(
                    padding: EdgeInsets.only(top: 12.0),
                    child: Text("You are a member of this session."),
                  ),
                ),
              if (!isCreator && requested)
                const Center(
                  child: Padding(
                    padding: EdgeInsets.only(top: 12.0),
                    child: Text("Request pending approval."),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

