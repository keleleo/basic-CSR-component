/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  mount: {
    src: { url: '/' },
    public: { url: '/', static: true /*, resolve:false*/ },
  },
  plugins: [
    ['@snowpack/plugin-typescript',]
  ],
  routes: [],
  optimize: {
    bundle: true,
    minify: true,
    // sourcemap:false // Remove .js.map

    // preload: true,
    // splitting:true,
    // treeshake:true,
    // manifest:true,
  },
  buildOptions: {}
}