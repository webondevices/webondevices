import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  { ignores: [".next/**", "out/**", "docs/**", "content-plan/**", "public/**", "next-env.d.ts", "worker/worker-configuration.d.ts"] },
];

export default config;
