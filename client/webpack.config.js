const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript'
            ],
            plugins: [
              isDevelopment && require.resolve('react-refresh/babel')
            ].filter(Boolean)
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
        type: 'asset/resource'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "assert": require.resolve("assert/"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "url": require.resolve("url/")
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      favicon: './public/favicon.ico'
    }),
    isDevelopment && new ReactRefreshWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    new CopyPlugin({
      patterns: [
        { 
          from: 'public',
          to: '',
          globOptions: {
            ignore: ['**/index.html']
          }
        }
      ]
    })
  ].filter(Boolean),
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    historyApiFallback: true,
    hot: true,
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    static: {
      directory: path.join(__dirname, 'public')
    }
  },
  devtool: isDevelopment ? 'eval-source-map' : 'source-map'
}; 