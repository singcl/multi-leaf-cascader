import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import path from 'path';
import typescript from "@rollup/plugin-typescript";
import jsx from "acorn-jsx";
import less from "rollup-plugin-less";
import pkg from "./package.json";
import { getBabelOutputPlugin } from "@rollup/plugin-babel";

export default [
  //? // browser-friendly UMD build
  // {
  // 	input: 'src/main.ts',
  // 	output: {
  // 		name: 'howLongUntilLunch',
  // 		file: pkg.browser,
  // 		format: 'umd'
  // 	},
  // 	acornInjectPlugins: [jsx()],
  // 	plugins: [
  // 		resolve(),   // so Rollup can find `ms`
  // 		commonjs(),  // so Rollup can convert `ms` to an ES module
  // 		typescript(), // so Rollup can convert TypeScript to JavaScript
  // 		less(), // generate css will be auto insert to the head tag if you set insert be true
  // 		babel({ babelHelpers: 'bundled' })
  // 	]
  // },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: "src/main.ts",
    external: ["ms"],
    acornInjectPlugins: [jsx()],
    plugins: [
      typescript(), // so Rollup can convert TypeScript to JavaScript
      less({ output: "dist/rollup.build.css" }), // generate css will be auto insert to the head tag if you set insert be true
      getBabelOutputPlugin({
		configFile: path.resolve(__dirname, 'babel.config.js'),
	  })
    ],
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" },
    ],
  },
];
