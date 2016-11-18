import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/asyncAwait.js',
  format: 'cjs',
  plugins: [
    babel(),
  ],
  dest: 'lib/asyncAwait.js'
};
