const path = require('path');
const {WebpackAssetsManifest} = require('webpack-assets-manifest');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const resolvePathFromRoot = (relativePath) => 
  path.resolve(__dirname, '../', relativePath);

module.exports = {
  mode: 'development',
  entry: resolvePathFromRoot('src/client/index.tsx'), 
  output: {
    filename: 'assets/js/bundle-[name]-[fullhash].js',
    path: resolvePathFromRoot('dist'),
  },
  devtool: 'inline-source-map',
  plugins: [
    new ReactRefreshPlugin(),
    new WebpackAssetsManifest({
      output: 'assets-manifest.json',
      entrypoints: true,
      integrity: true,
    }),
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_module/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [require.resolve('react-refresh/babel')].filter(Boolean),
          },
        },
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx',],
  },
};