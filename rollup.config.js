import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import postcss from "rollup-plugin-postcss";
import alias from "@rollup/plugin-alias";
import typescript from "@rollup/plugin-typescript";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  {
    input: "src/index.ts",
    output: [
      { file: "dist/slider-captcha.umd.js", format: "umd", name: "SliderCaptcha" },
      { file: "dist/slider-captcha.esm.js", format: "es" }
    ],
    external: ["react", "react-dom"],
    plugins: [
      alias({
        entries: [
          { find: "slider-captcha.css", replacement: path.resolve(__dirname, "src/slider-captcha.css") }
        ]
      }),
      resolve({ extensions: [".js", ".ts"] }),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      babel({ babelHelpers: "bundled" }),
      postcss({
        inject: true
      })
    ]
  },
  {
    input: "src/react/SliderCaptcha.tsx",
    output: [
      { file: "dist/react-slider-captcha.js", format: "cjs" },
      { file: "dist/react-slider-captcha.esm.js", format: "es" }
    ],
    external: ["react", "react-dom"],
    plugins: [
      alias({
        entries: [
          { find: "slider-captcha.css", replacement: path.resolve(__dirname, "src/slider-captcha.css") }
        ]
      }),
      resolve({ extensions: [".js", ".jsx", ".ts", ".tsx"] }),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      babel({
        babelHelpers: "runtime",
        presets: [
          ["@babel/preset-react", { runtime: "automatic" }]
        ],
        plugins: ["@babel/plugin-transform-runtime"]
      }),
      postcss({
        inject: true
      })
    ]
  }
];
