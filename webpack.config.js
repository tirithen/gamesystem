'use strict';

let WebpackNotifierPlugin = require('webpack-notifier');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    canvas: './example/canvas/main.js'
  },
  output: {
    path: __dirname + '/build',
    filename: '[name]/script.js'
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
    new WebpackNotifierPlugin(),
    new HtmlWebpackPlugin({
      title: 'Basic canvas example',
      filename: './canvas/index.html',
      template: './example/template.html',
      inject: 'body',
      chunks: ['canvas']
    })
  ]
};
