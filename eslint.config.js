const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const security = require('eslint-plugin-security');

module.exports = defineConfig([
  globalIgnores(['dist/*', 'node_modules/*', '.expo/*']),
  expoConfig,
  security.configs.recommended,
]);
