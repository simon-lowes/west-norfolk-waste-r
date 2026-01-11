import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../presentation/screens/alert_detail/alert_detail_screen.dart';
import '../../presentation/screens/find_bin_day/find_bin_day_screen.dart';
import '../../presentation/screens/home/home_screen.dart';
import '../../presentation/screens/recycling_centres/recycling_centres_screen.dart';
import '../../presentation/screens/settings/settings_screen.dart';
import '../../presentation/screens/service_alerts/service_alerts_screen.dart';
import '../../presentation/screens/what_goes_where/what_goes_where_screen.dart';
import '../../presentation/screens/splash/splash_screen.dart';
import '../../presentation/screens/report_issue/report_issue_screen.dart';
import '../../presentation/screens/admin/admin_screen.dart';

const String splashRoute = '/';
const String homeRoute = '/home';
const String settingsRoute = '/settings';
const String findBinDayRoute = '/find-bin-day';
const String whatGoesWhereRoute = '/what-goes-where';
const String recyclingCentresRoute = '/recycling-centres';
const String serviceAlertsRoute = '/service-alerts';
const String alertDetailRoute = '/alert';
const String reportIssueRoute = '/report-issue';
const String adminRoute = '/admin';

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: homeRoute,
    routes: [
      GoRoute(
        path: splashRoute,
        name: 'splash',
        builder: (BuildContext context, GoRouterState state) =>
            const SplashScreen(),
      ),
      GoRoute(
        path: homeRoute,
        name: HomeScreen.routeName,
        builder: (BuildContext context, GoRouterState state) =>
            const HomeScreen(),
      ),
      GoRoute(
        path: settingsRoute,
        name: SettingsScreen.routeName,
        builder: (BuildContext context, GoRouterState state) =>
            const SettingsScreen(),
      ),
      GoRoute(
        path: findBinDayRoute,
        name: 'findBinDay',
        builder: (BuildContext context, GoRouterState state) =>
            const FindBinDayScreen(),
      ),
      GoRoute(
        path: whatGoesWhereRoute,
        name: 'whatGoesWhere',
        builder: (BuildContext context, GoRouterState state) =>
            const WhatGoesWhereScreen(),
      ),
      GoRoute(
        path: recyclingCentresRoute,
        name: RecyclingCentresScreen.routeName,
        builder: (BuildContext context, GoRouterState state) =>
            const RecyclingCentresScreen(),
      ),
      GoRoute(
        path: serviceAlertsRoute,
        name: ServiceAlertsScreen.routeName,
        builder: (BuildContext context, GoRouterState state) =>
            const ServiceAlertsScreen(),
      ),
      GoRoute(
        path: '$alertDetailRoute/:alertId',
        name: AlertDetailScreen.routeName,
        builder: (BuildContext context, GoRouterState state) {
          final alertId = state.pathParameters['alertId'] ?? '';
          return AlertDetailScreen(alertId: alertId);
        },
      ),
      GoRoute(
        path: reportIssueRoute,
        name: 'reportIssue',
        builder: (BuildContext context, GoRouterState state) =>
            const ReportIssueScreen(),
      ),
      GoRoute(
        path: adminRoute,
        name: AdminScreen.routeName,
        builder: (BuildContext context, GoRouterState state) =>
            const AdminScreen(),
      ),
    ],
  );
});
