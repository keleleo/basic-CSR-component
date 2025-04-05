export default {
  entry: ['src/core/index.ts'],
  // format: ['cjs'],
  format: ['esm', 'cjs'],
  target: ['es2020', 'chrome58', 'edge16', 'firefox57'],
  dts: true,
  sourcemap: false,
  // minify: true,
  clean: true,
  bundle: true,
};
