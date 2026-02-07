module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@react-native-async-storage/async-storage|react-native-svg|lucide-react-native|react-native-safe-area-context|react-native-screens)',
  ],
  testMatch: [
    '**/__tests__/**/*.test.{ts,tsx}',
    '**/src/**/*.test.{ts,tsx}',
  ],
};
