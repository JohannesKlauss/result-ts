const esbuild = require('esbuild');

// Build CommonJS version
esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node12',
  outfile: 'dist/index.cjs.js',
  format: 'cjs',
  external: ['some-external-dependency'] // add external dependencies if needed
});

// Build ES Modules version
esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'neutral',
  outfile: 'dist/index.esm.js',
  format: 'esm',
  external: ['some-external-dependency'] // add external dependencies if needed
});
