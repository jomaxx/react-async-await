module.exports = {
  presets: [
    [
      'env',
      {
        modules: process.env.NODE_ENV === 'test' && 'commonjs',
      },
    ],
    'react',
  ],
};
