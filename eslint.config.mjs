import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      "import/no-anonymous-default-export": "off",
    },
  },
  {
    ignores: [
      ".next/**",
      "out/**",
      "node_modules/**",
      "android/**",
      "ios/**",
      "mobile-expo/**",
      "*.py",
      "capacitor.config.ts",
    ],
  },
];

export default eslintConfig;
