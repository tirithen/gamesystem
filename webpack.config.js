var WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
  entry: './example/main.js',
  output: {
    filename: 'script.js',
    path: __dirname + '/example/dist'
  },
  devtool: 'cheap-source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0']
        }
      }
    ]
  },
  plugins: [
    new WebpackNotifierPlugin()
  ]
};
