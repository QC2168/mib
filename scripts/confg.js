module.exports = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  external: ["./node_modules/*"],
  minify: false,
  outfile: "bin/index.js",
  platform: "node",
  format: "cjs",
  treeShaking: true,
  tsconfig: "tsconfig.json",
  loader: { ".ts": "ts" },
  logLevel: "info",
};
