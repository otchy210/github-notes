const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/app.tsx',
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: 'app.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: false,
              sourceMap: true,
              importLoaders: 2,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'docs'),
    },
  },
  target: ['web', 'es2020'],
  performance: {
    maxEntrypointSize: 1_024_000,
    maxAssetSize: 1_024_000,
  },
};
