import 'package:flutter/material.dart';

class AppNavigation extends StatelessWidget {
  const AppNavigation({
    super.key,
    required this.currentIndex,
    required this.onDestinationSelected,
  });

  final int currentIndex;
  final ValueChanged<int> onDestinationSelected;

  static const _destinations = [
    _NavDestination('Home', Icons.home_outlined),
    _NavDestination('Find Bin Day', Icons.event_available_outlined),
    _NavDestination('What Goes Where', Icons.search_outlined),
    _NavDestination('Centres', Icons.location_on_outlined),
    _NavDestination('Alerts', Icons.warning_amber_outlined),
    _NavDestination('Report', Icons.report_problem_outlined),
  ];

  @override
  Widget build(BuildContext context) {
    // Clamp selectedIndex to valid range (0 to destinations.length - 1)
    // If currentIndex is -1 or out of range, default to 0 to avoid crash
    final safeIndex = currentIndex.clamp(0, _destinations.length - 1);

    return NavigationBar(
      selectedIndex: safeIndex,
      onDestinationSelected: onDestinationSelected,
      destinations: [
        for (final destination in _destinations)
          NavigationDestination(
            icon: Icon(destination.icon),
            label: destination.label,
          ),
      ],
    );
  }
}

class _NavDestination {
  const _NavDestination(this.label, this.icon);

  final String label;
  final IconData icon;
}
