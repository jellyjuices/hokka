import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const emotionTemplate = "TaggedTemplateExpression > TemplateLiteral";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.styles*.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: `${emotionTemplate} > TemplateElement[value.raw=/#[0-9a-fA-F]{3,8}\\b/]`,
          message: "No colour literals in styles. Use a token from @/src/lib/theme.",
        },
        {
          selector: `${emotionTemplate} > TemplateElement[value.raw=/@media[^;]*\\b(min|max)-width/]`,
          message: "No raw width media queries. Use mediaUp/mediaDown from @/src/lib/breakpoints.",
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "scripts/**",
    "public/ocr/**",
    "public/models/**",
  ]),
]);

export default eslintConfig;
