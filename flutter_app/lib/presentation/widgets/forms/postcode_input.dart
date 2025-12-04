import 'package:flutter/material.dart';

import '../../../utils/postcode_utils.dart';

class PostcodeInputField extends StatelessWidget {
  const PostcodeInputField({
    super.key,
    this.controller,
    this.focusNode,
    this.initialValue,
    this.onChanged,
    this.validator,
  });

  final TextEditingController? controller;
  final FocusNode? focusNode;
  final String? initialValue;
  final ValueChanged<String>? onChanged;
  final FormFieldValidator<String>? validator;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      focusNode: focusNode,
      initialValue: controller == null ? initialValue : null,
      decoration: const InputDecoration(
        labelText: 'Postcode',
        hintText: 'e.g. PE30 1XX',
        prefixIcon: Icon(Icons.location_pin),
      ),
      textCapitalization: TextCapitalization.characters,
      keyboardType: TextInputType.text,
      autofillHints: const [AutofillHints.postalCode],
      validator: validator ?? _defaultValidator,
      onChanged: onChanged,
    );
  }

  String? _defaultValidator(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Enter a postcode';
    }
    if (!validatePostcode(value)) {
      return 'Enter a valid UK postcode';
    }
    return null;
  }
}
