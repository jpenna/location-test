require('dotenv').config();
const path = require('path');
const pkg = require('./package.json');
const _ = require('lodash');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const {
  GMAPS_KEY,
} = process.env;

const vendorPackages = _.filter(Object.keys(pkg.dependencies), name => !/bulma/.test(name));

module.exports = {
  entry: {
    bundle: [
      'react-hot-loader/patch',
      './index.js',
    ],
    vendor: vendorPackages,
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
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.([cs][ac]?ss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader'],
        }),
      },
    ],
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules',
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('style.css'),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        GMAPS_KEY: JSON.stringify(GMAPS_KEY),
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.[hash].js',
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: '[name].[hash].js.map',
      exclude: ['vendor.[hash].js'],
    }),
  ],
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true,
    contentBase: './',
    host: '0.0.0.0',
  },
};
