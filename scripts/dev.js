const config = require("./confg.js");

require("esbuild")
  .build({
    ...config,
    watch: true,
    sourcemap: true,
  })
  .catch(() => process.exit(1));
