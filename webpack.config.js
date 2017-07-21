const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    bundle: './index.js',
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: './[name].[hash].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader?cacheDirectory=true',
        exclude: /node_modules/
      },
      {
        test: /\.([cs][ac]?ss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
    ],
  },
  resolve: {
    modules: [
      path.resolve(__dirname),
      'node_modules',
    ],
  },
  plugins: [
    new ExtractTextPlugin('style.css'),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
  ],
  devServer: {
    historyApiFallback: true,
    contentBase: './',
    host: '0.0.0.0',
  }
}
