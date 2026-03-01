import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  {languageOptions: { globals: globals.browser }},
  ...tseslint.configs.recommended,
  { ...pluginReactConfig, settings: { react: { version: "detect" } } },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: { "react-refresh": reactRefresh },
    rules: {
        "react-refresh/only-export-components": "warn"
    }
  },
  {
    ignores: ["dist", "eslint.config.js"]
  }
];
