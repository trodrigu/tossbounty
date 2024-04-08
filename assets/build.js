const esbuild = require("esbuild");

const args = process.argv.slice(2);
const watch = args.includes('--watch');
const deploy = args.includes('--deploy');
//import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
const globalsPolyfill = require("@esbuild-plugins/node-globals-polyfill");
//const { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
const modulesPolyfill = require('@esbuild-plugins/node-modules-polyfill');

const loader = {
  // Add loaders for images/fonts/etc, e.g. { '.svg': 'file' }
};

const plugins = [
  // Add and configure plugins here
  modulesPolyfill.NodeModulesPolyfillPlugin(),
  globalsPolyfill.NodeGlobalsPolyfillPlugin({
            //process: true,
            buffer: true,
            //define: { 'process.env.var': '"hello"' }, // inject will override define, to keep env vars you must also pass define here https://github.com/evanw/esbuild/issues/660
        })
];

// Define esbuild options
let opts = {
  entryPoints: ["js/app.ts"],
  bundle: true,
  logLevel: "info",
  target: "es2017",
  outdir: "../priv/static/assets",
  external: ["*.css", "fonts/*", "images/*"],
  loader: loader,
  plugins: plugins,
};

if (deploy) {
  opts = {
    ...opts,
    minify: true,
  };
}

if (watch) {
  opts = {
    ...opts,
    sourcemap: "inline",
  };
  esbuild
    .context(opts)
    .then((ctx) => {
      ctx.watch();
    })
    .catch((_error) => {
      process.exit(1);
    });
} else {
  esbuild.build(opts);
}
