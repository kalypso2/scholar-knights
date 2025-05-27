// lib/widgets/filter_widget.dart
import 'package:flutter/material.dart';

class FilterWidget extends StatelessWidget {
  final List<String> userCourses;
  final bool showRelevantOnly;
  final Set<String> selectedCourses;
  final Set<String> selectedTags;
  final String privacy;
  final String modality;
  final DateTime? selectedDate;
  final TimeOfDay? startTime;
  final TimeOfDay? endTime;
  final ValueChanged<String>? onPrivacyChanged;
  final ValueChanged<String>? onModalityChanged;
  final ValueChanged<DateTime?>? onDateChanged;
  final ValueChanged<TimeOfDay?>? onStartTimeChanged;
  final ValueChanged<TimeOfDay?>? onEndTimeChanged;
  final ValueChanged<String> onSearchChanged;
  final VoidCallback onClearFilters;
  final Function(String) onCourseToggle;
  final Function(String) onTagToggle;
  final ValueChanged<bool> onRelevantOnlyChanged;

  const FilterWidget({
    Key? key,
    required this.userCourses,
    required this.showRelevantOnly,
    required this.selectedCourses,
    required this.selectedTags,
    required this.privacy,
    required this.modality,
    required this.selectedDate,
    required this.startTime,
    required this.endTime,
    required this.onPrivacyChanged,
    required this.onModalityChanged,
    required this.onDateChanged,
    required this.onStartTimeChanged,
    required this.onEndTimeChanged,
    required this.onSearchChanged,
    required this.onClearFilters,
    required this.onCourseToggle,
    required this.onTagToggle,
    required this.onRelevantOnlyChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ExpansionTile(
      title: const Text("Filters", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
      initiallyExpanded: true,
      children: [
        Padding(
          padding: const EdgeInsets.all(12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TextField(
                decoration: const InputDecoration(
                  labelText: "Search For Sessions",
                  border: OutlineInputBorder(),
                ),
                onChanged: onSearchChanged,
              ),
              const SizedBox(height: 16),
              SwitchListTile(
                title: const Text("Show only relevant study sessions"),
                value: showRelevantOnly,
                onChanged: onRelevantOnlyChanged,
              ),
              const Divider(),
              _buildSectionTitle("Privacy"),
              Wrap(
                children: [
                  _buildFilterChip("Public", privacy == 'public', () => onPrivacyChanged?.call('public')),
                  _buildFilterChip("Private", privacy == 'private', () => onPrivacyChanged?.call('private')),
                ],
              ),
              const Divider(),
              _buildSectionTitle("Mode"),
              Wrap(
                children: [
                  _buildFilterChip("Online", modality == 'Online', () => onModalityChanged?.call('Online')),
                  _buildFilterChip("In-Person", modality == 'In-person', () => onModalityChanged?.call('In-person')),
                ],
              ),
              const Divider(),
              _buildSectionTitle("Courses"),
              Wrap(
                spacing: 8,
                children: userCourses.map((c) => FilterChip(
                  label: Text(c),
                  selected: selectedCourses.contains(c),
                  onSelected: (_) => onCourseToggle(c),
                )).toList(),
              ),
              const Divider(),
              _buildSectionTitle("Tags"),
              Wrap(
                spacing: 8,
                children: ["Group Study", "Exam Review", "Homework Help", "1-on-1 Help"].map((t) => FilterChip(
                  label: Text(t),
                  selected: selectedTags.contains(t),
                  onSelected: (_) => onTagToggle(t),
                )).toList(),
              ),
              const Divider(),
              _buildDateAndTimeSection(context), // Pass context here
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: onClearFilters,
                child: const Text("Clear All Filters"),
              ),
            ],
          ),
        )
      ],
    );
  }

  Widget _buildSectionTitle(String text) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 8.0),
    child: Text(text, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
  );

  Widget _buildFilterChip(String label, bool selected, VoidCallback onTap) => Padding(
    padding: const EdgeInsets.symmetric(horizontal: 4.0),
    child: FilterChip(
      label: Text(label),
      selected: selected,
      onSelected: (_) => onTap(),
    ),
  );

  Widget _buildDateAndTimeSection(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      _buildSectionTitle("Date & Time"),
      Row(
        children: [
          Expanded(
            child: TextButton.icon(
              icon: const Icon(Icons.calendar_today),
              label: Text(selectedDate != null 
                  ? "${selectedDate!.month}/${selectedDate!.day}/${selectedDate!.year}"
                  : "Select Date"),
              onPressed: () async {
                final date = await showDatePicker(
                  context: context,
                  initialDate: selectedDate ?? DateTime.now(),
                  firstDate: DateTime.now(),
                  lastDate: DateTime(2100),
                );
                onDateChanged?.call(date);
              },
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: TextButton.icon(
              icon: const Icon(Icons.access_time),
              label: Text(startTime != null 
                  ? "${startTime!.hour}:${startTime!.minute.toString().padLeft(2, '0')}"
                  : "Start Time"),
              onPressed: () async {
                final time = await showTimePicker(
                  context: context,
                  initialTime: startTime ?? TimeOfDay.now(),
                );
                onStartTimeChanged?.call(time);
              },
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: TextButton.icon(
              icon: const Icon(Icons.access_time),
              label: Text(endTime != null 
                  ? "${endTime!.hour}:${endTime!.minute.toString().padLeft(2, '0')}"
                  : "End Time"),
              onPressed: () async {
                final time = await showTimePicker(
                  context: context,
                  initialTime: endTime ?? TimeOfDay.now(),
                );
                onEndTimeChanged?.call(time);
              },
            ),
          ),
        ],
      ),
    ],
  );
}