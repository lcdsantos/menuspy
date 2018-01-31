import buble  from 'rollup-plugin-buble';
import eslint from 'rollup-plugin-eslint';

const pkg    = require('./package.json');
const banner = `/*! ${pkg.title} v${pkg.version} (${new Date().toString().substr(4, 11)}) - ${pkg.homepage} - Copyright (c) ${new Date().getFullYear()} Leonardo Santos; MIT License */`;

export default {
  input: 'src/menuspy.js',
  output: {
    name: 'MenuSpy',
    file: 'dist/menuspy.js',
    format: 'umd',
    banner: banner
  },
  plugins: [
    eslint(),
    buble()
  ]
};
