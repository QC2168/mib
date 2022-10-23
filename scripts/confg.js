export default {
  entryPoints: ["src/index.ts"],
  bundle: true,
  external: ["./node_modules/*"],
  minify: false,
  outdir: "bin",
  platform: "node",
  format: "esm",
  treeShaking: true,
  tsconfig: "tsconfig.json",
  loader: { ".ts": "ts" },
  logLevel: "info",
};
