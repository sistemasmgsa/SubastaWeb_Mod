// config-overrides.js
const { override, addWebpackRule } = require('customize-cra');

module.exports = override(
  addWebpackRule({
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    use: [
      {
        loader: 'file-loader',
        options: {
          outputPath: 'fonts',
          name: '[name].[ext]',
        },
      },
    ],
  })
);
