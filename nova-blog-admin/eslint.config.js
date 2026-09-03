import { defineConfig, globalIgnores } from "eslint/config";
import PluginVue from "eslint-plugin-vue";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
  ...PluginVue.configs["flat/base"],
  ...PluginVue.configs["flat/essential"],
  ...PluginVue.configs["flat/strongly-recommended"],
  ...PluginVue.configs["flat/recommended"],
  globalIgnores(["dist/**", "node_modules/**"]),
  {
    ignores: ["dist/**", "node_modules/**"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "vue/multi-word-component-names": "off",
    },
  },
  eslintConfigPrettier,
]);
