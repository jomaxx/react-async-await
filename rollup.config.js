import babel from "rollup-plugin-babel";
import pkg from "./package.json";

export default {
  input: require.resolve("./src"),

  output: [
    {
      file: pkg.main,
      format: "cjs"
    },
    pkg.module && {
      file: pkg.module,
      format: "es"
    }
  ].filter(Boolean),

  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ],

  plugins: [babel()]
};
