import config from "./confg.js";
import esbuild from "esbuild";

esbuild
  .build({
    ...config,
    watch: true,
    sourcemap: true,
  })
  .catch(() => process.exit(1));
