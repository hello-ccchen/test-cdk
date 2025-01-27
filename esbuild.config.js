const esbuild = require("esbuild");
const path = require("path");

esbuild
  .build({
    entryPoints: [
      "src/handlers/list-todos-handler.ts", // Lambda for getting todos
      "src/handlers/add-todo-handler.ts", // Lambda for creating todos
    ],
    outdir: "dist", // Output folder for bundled files
    bundle: true,
    platform: "node", // Target platform for Node.js Lambda runtime
    target: "node14", // Set Node.js version target
    external: ["aws-sdk"], // Do not bundle aws-sdk (it's available in Lambda environment)
    sourcemap: true, // Generate source maps for debugging
  })
  .catch(() => process.exit(1));
