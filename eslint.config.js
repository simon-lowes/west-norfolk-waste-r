const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const security = require('eslint-plugin-security');

module.exports = defineConfig([
  globalIgnores(['dist/*', 'node_modules/*', '.expo/*']),
  expoConfig,
  security.configs.recommended,
  {
    rules: {
      // eslint-config-expo 57 pulls in eslint-plugin-react-hooks 6, whose new
      // rules flag long-standing React Native idioms used throughout this app:
      // - react-hooks/refs: `useRef(new Animated.Value(..)).current` — the
      //   canonical RN Animated initialisation pattern (32 call sites)
      // - react-hooks/set-state-in-effect: setLoading(true) before an awaited
      //   fetch in data hooks — intentional loading-state pattern
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
]);
