import 'package:flutter/material.dart';

import '../../../data/models/enums.dart';

class IssueTypeDropdown extends StatelessWidget {
  const IssueTypeDropdown({
    super.key,
    this.value,
    this.onChanged,
    this.validator,
    this.errorText,
  });

  final ReportType? value;
  final ValueChanged<ReportType?>? onChanged;
  final FormFieldValidator<ReportType>? validator;
  final String? errorText;

  @override
  Widget build(BuildContext context) {
    return DropdownButtonFormField<ReportType>(
      key: ValueKey(value?.name ?? 'issue-type'),
      initialValue: value,
      decoration: InputDecoration(
        labelText: 'Issue type',
        prefixIcon: Icon(Icons.report_problem_outlined),
        errorText: errorText,
      ),
      validator: validator ?? _defaultValidator,
      items: ReportType.values
          .map((type) => DropdownMenuItem(value: type, child: Text(type.label)))
          .toList(),
      onChanged: onChanged,
    );
  }

  String? _defaultValidator(ReportType? value) {
    if (value == null) {
      return 'Choose an issue type';
    }
    return null;
  }
}
