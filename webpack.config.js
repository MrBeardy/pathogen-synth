var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var WebpackPlugins = [
  new CopyWebpackPlugin([
      { from: 'static' }
  ]),

  new HtmlWebpackPlugin({
    template: __dirname + '/app/index.html',
    filename: 'index.html',
    inject: 'body'
  })
]

module.exports = {
  devtool: 'source-map',
  entry: [
    'babel-polyfill',
    './app/App.jsx'
  ],
  output: {
    path: __dirname + '/build',
    filename: "bundle.js"
  },
  module: {
    loaders: [
      { test: /\.jsx$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  },
  plugins: WebpackPlugins
}
