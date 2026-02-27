import nextConfig from "eslint-config-next";
import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescriptConfig from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";

const eslintConfig = [
  ...nextConfig,
  ...coreWebVitals,
  ...typescriptConfig,
  prettierConfig,
  // Disable Pages-Router-only rules that don't apply to the App Router
  {
    rules: {
      "@next/next/no-page-custom-font": "off",
    },
  },
];

export default eslintConfig;
