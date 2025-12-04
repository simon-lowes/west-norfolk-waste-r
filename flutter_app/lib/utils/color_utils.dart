import 'package:flutter/material.dart';

import '../config/theme/colors.dart';
import '../data/models/enums.dart';

Color binTypeColor(BinType type) {
  switch (type) {
    case BinType.general:
      return AppColors.binRubbish;
    case BinType.recycling:
      return AppColors.binRecycling;
    case BinType.garden:
      return AppColors.binGarden;
    case BinType.food:
      return AppColors.binFood;
    case BinType.recyclingCentre:
      return AppColors.binRecyclingCentre;
  }
}

Color alertSeverityColor(AlertSeverity severity) {
  switch (severity) {
    case AlertSeverity.urgent:
      return AppColors.urgent;
    case AlertSeverity.warning:
      return AppColors.warning;
    case AlertSeverity.info:
      return AppColors.info;
  }
}

Color alertSeverityBackground(AlertSeverity severity) {
  switch (severity) {
    case AlertSeverity.urgent:
      return const Color(0xFFFFE6E0);
    case AlertSeverity.warning:
      return const Color(0xFFFFF4E5);
    case AlertSeverity.info:
      return const Color(0xFFE7F0FA);
  }
}
