import babel from "rollup-plugin-babel";
import packageJson from "./package.json";

export default {
  input: require.resolve("./src"),

  output: [
    {
      file: packageJson.main,
      format: "cjs"
    },
    packageJson.module && {
      file: packageJson.module,
      format: "es"
    }
  ].filter(Boolean),

  plugins: [babel()]
};
