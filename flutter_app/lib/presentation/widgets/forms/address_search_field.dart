import 'package:flutter/material.dart';

import '../../../data/models/property.dart';
import '../../../utils/postcode_utils.dart';
import '../common/empty_state.dart';
import 'postcode_input.dart';

class AddressSearchField extends StatefulWidget {
  const AddressSearchField({
    super.key,
    required this.properties,
    required this.onPropertySelected,
    this.initialPostcode,
    this.selectedPropertyId,
    this.isLoading = false,
    this.helperText,
    this.onPostcodeChanged,
  });

  final List<Property> properties;
  final ValueChanged<Property> onPropertySelected;
  final String? initialPostcode;
  final String? selectedPropertyId;
  final bool isLoading;
  final String? helperText;
  final ValueChanged<String>? onPostcodeChanged;

  @override
  State<AddressSearchField> createState() => _AddressSearchFieldState();
}

class _AddressSearchFieldState extends State<AddressSearchField> {
  late final TextEditingController _postcodeController;
  Property? _selectedProperty;
  String _query = '';

  @override
  void initState() {
    super.initState();
    _postcodeController = TextEditingController(text: widget.initialPostcode);
    _selectedProperty = _findPropertyById(widget.selectedPropertyId);
    _query = widget.initialPostcode ?? '';
  }

  @override
  void didUpdateWidget(covariant AddressSearchField oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.selectedPropertyId != oldWidget.selectedPropertyId) {
      _selectedProperty = _findPropertyById(widget.selectedPropertyId);
    }
  }

  @override
  void dispose() {
    _postcodeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final helper =
        widget.helperText ??
        'Enter your postcode then pick the correct address from the list.';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        PostcodeInputField(
          controller: _postcodeController,
          onChanged: (value) {
            setState(() => _query = value);
            widget.onPostcodeChanged?.call(value);
          },
        ),
        const SizedBox(height: 8),
        Text(helper, style: Theme.of(context).textTheme.bodySmall),
        const SizedBox(height: 16),
        if (widget.isLoading)
          const Center(child: CircularProgressIndicator())
        else if (_filteredProperties.isEmpty)
          const EmptyState(
            title: 'No matching addresses',
            message: 'Try a different postcode or check the spelling.',
            icon: Icons.home_work_outlined,
          )
        else
          DropdownButtonFormField<Property>(
            key: ValueKey(_selectedProperty?.id ?? 'address-field'),
            // ignore: deprecated_member_use
            initialValue: _selectedProperty,
            decoration: const InputDecoration(
              labelText: 'Select address',
              prefixIcon: Icon(Icons.home_outlined),
            ),
            items: _filteredProperties
                .map(
                  (property) => DropdownMenuItem(
                    value: property,
                    child: Text('${property.address} (${property.postcode})'),
                  ),
                )
                .toList(),
            onChanged: (property) {
              if (property == null) {
                return;
              }
              setState(() => _selectedProperty = property);
              widget.onPropertySelected(property);
            },
          ),
      ],
    );
  }

  List<Property> get _filteredProperties {
    if (_query.trim().isEmpty) {
      return widget.properties;
    }
    final normalized = normalizePostcode(_query).toLowerCase();
    final raw = _query.trim().toLowerCase();

    return widget.properties.where((property) {
      final postcode = property.postcode.toLowerCase();
      final address = property.address.toLowerCase();
      return postcode.contains(normalized) ||
          postcode.replaceAll(' ', '').contains(raw.replaceAll(' ', '')) ||
          address.contains(raw);
    }).toList();
  }

  Property? _findPropertyById(String? id) {
    if (id == null) {
      return null;
    }
    try {
      return widget.properties.firstWhere((property) => property.id == id);
    } catch (_) {
      return null;
    }
  }
}
