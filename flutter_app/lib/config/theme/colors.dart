import 'package:flutter/material.dart';

/// GOV.UK inspired color palette shared across the app.
class AppColors {
  AppColors._();

  static const Color primary = Color(0xFF1D70B8);
  static const Color success = Color(0xFF00703C);
  static const Color error = Color(0xFFD4351C);
  static const Color darkText = Color(0xFF0B0C0C);
  static const Color darkGrey = Color(0xFF505A5F);
  static const Color lightGrey = Color(0xFFF3F2F1);
  static const Color white = Color(0xFFFFFFFF);
  static const Color background = Color(0xFFF7F7F7);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color border = Color(0xFFE1E1E1);

  // Bin colors
  static const Color binRubbish = Color(0xFF595959);
  static const Color binRecycling = Color(0xFF3366CC);
  static const Color binGarden = Color(0xFF00A651);
  static const Color binFood = Color(0xFF8B6914);
  static const Color binRecyclingCentre = Color(0xFF999999);

  static const Color urgent = error;
  static const Color warning = Color(0xFFF47738);
  static const Color info = primary;
}
