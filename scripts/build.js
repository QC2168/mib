const config = require("./confg.js");

require("esbuild")
  .build({
    ...config,
  })
  .catch(() => process.exit(1));
