import  config from "./confg.js"

require("esbuild")
  .build({
    ...config,
  })
  .catch(() => process.exit(1));
