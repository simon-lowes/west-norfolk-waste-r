import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Nunito_700Bold } from '@expo-google-fonts/nunito';
import * as SplashScreen from 'expo-splash-screen';
import {
  Home,
  Calendar,
  Search,
  MapPin,
  MoreHorizontal,
} from 'lucide-react-native';

import { ThemeProvider, useTheme, setFontsLoaded } from './src/theme';
import { DevModeProvider } from './src/context/DevModeContext';

// Keep the splash screen visible while we fetch fonts
SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore errors - splash may already be hidden
});
import {
  HomeScreen,
  FindBinDayScreen,
  WhatGoesWhereScreen,
  RecyclingCentresScreen,
  ServiceAlertsScreen,
  ReportIssueScreen,
  SettingsScreen,
} from './src/screens';
import { MoreScreen } from './src/screens/MoreScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MORE_RESET_TIMEOUT_MS = 30_000;

// Stack navigator for More section
function MoreStack() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MoreHome" component={MoreScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Alerts" component={ServiceAlertsScreen} />
      <Stack.Screen name="Report" component={ReportIssueScreen} />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  const { colors, layout, isDark } = useTheme();
  const moreResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <NavigationContainer>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: layout.tabBarHeight,
            paddingTop: layout.tabBarPadding,
            paddingBottom: 24,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textTertiary,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
            marginTop: 4,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Home size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tab.Screen
          name="Schedule"
          component={FindBinDayScreen}
          options={{
            tabBarLabel: 'Schedule',
            tabBarIcon: ({ color, size }) => (
              <Calendar size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tab.Screen
          name="WhatGoesWhere"
          component={WhatGoesWhereScreen}
          options={{
            tabBarLabel: 'Search',
            tabBarIcon: ({ color, size }) => (
              <Search size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tab.Screen
          name="Centres"
          component={RecyclingCentresScreen}
          options={{
            tabBarLabel: 'Centres',
            tabBarIcon: ({ color, size }) => (
              <MapPin size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tab.Screen
          name="More"
          component={MoreStack}
          options={{
            tabBarLabel: 'More',
            tabBarIcon: ({ color, size }) => (
              <MoreHorizontal size={size} color={color} strokeWidth={2} />
            ),
          }}
          listeners={({ navigation }) => ({
            blur: () => {
              moreResetTimeoutRef.current = setTimeout(() => {
                const state = navigation.getState();
                const routes = state.routes.map((route: any) =>
                  route.name === 'More'
                    ? { ...route, state: { routes: [{ name: 'MoreHome' }], index: 0 } }
                    : route
                );
                navigation.reset({ ...state, routes });
                moreResetTimeoutRef.current = null;
              }, MORE_RESET_TIMEOUT_MS);
            },
            focus: () => {
              if (moreResetTimeoutRef.current) {
                clearTimeout(moreResetTimeoutRef.current);
                moreResetTimeoutRef.current = null;
              }
            },
          })}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      setFontsLoaded(true);
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <DevModeProvider>
        <ThemeProvider>
          <AppNavigator />
        </ThemeProvider>
      </DevModeProvider>
    </SafeAreaProvider>
  );
}
