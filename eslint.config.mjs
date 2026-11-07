import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  { ignores: [".next/**", "out/**", "content-plan/**", "demos/**", "public/**", "next-env.d.ts", "worker/worker-configuration.d.ts"] },
];

export default config;
