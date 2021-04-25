const HtmlWebpackPlugin = require('html-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
var webpack = require("webpack");
const path = require('path');
require('dotenv').config();
require("regenerator-runtime");

module.exports = (env, argv) => ({
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    path: path.join(__dirname, 'dist/js'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    watchContentBase: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react', '@babel/preset-env'],
              plugins: [
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-transform-runtime"
              ]
            }
          }
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(jpg|png|svg)$/,
        loader: 'url-loader'
      },
      {
        test: /\.(scss|css)$/,
        use: [
            {
              loader:  'style-loader',
            },
           {
             loader: 'css-loader',
             options: {
             url: false
            }
           },
           {
             loader: 'sass-loader'
           }
        ],
        include: [
            path.join(__dirname, 'src'),
            /node_modules/
        ]
      },
    ]
  },
  resolve: {
    modules: [path.join(__dirname,'src'), 'node_modules'],
    extensions: ['.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: './index.html',
      manifest: './public/manifest.json',
      favicon: './public/favicon.ico',
    }),
    new ManifestPlugin({
        basePath: './public/manifest.json'
    }),
    new webpack.DefinePlugin ({
        'process.env.REACT_APP_API_KEY': JSON.stringify("AIzaSyC-uG628wZlufA1CjJ0betXF7WDiJG-G6o"),
        'process.env.REACT_APP_AUTH_DOMAIN': JSON.stringify("weathernoti-33bdc.firebaseapp.com" ),
        'process.env.REACT_APP_DATABASE_URL': JSON.stringify('https://weathernoti-33bdc-default-rtdb.firebaseio.com'),
        'process.env.REACT_APP_PROJECT_ID': JSON.stringify('weathernoti-33bdc'),
        'process.env.REACT_APP_STORAGE_BUCKET': JSON.stringify('weathernoti-33bdc.appspot.com'),
        'process.env.REACT_APP_MESSAGING_SENDER_ID': JSON.stringify('590479012159'),
        'process.env.REACT_APP_OPEN_WEATHER_API_KEY': JSON.stringify("78e81a9a7425b24350cdb14a615c1edf" ),
        'process.env.REACT_APP_BACKEND': JSON.stringify('http://localhost:5000/')
      })
  ]
});