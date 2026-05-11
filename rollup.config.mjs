import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/ev-smart-charging-card.ts",
  output: {
    file: "dist/ev-smart-charging-card.js",
    format: "es",
    sourcemap: false,
    inlineDynamicImports: true,
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.json" }),
    terser({ format: { comments: false } }),
  ],
};
