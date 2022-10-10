const imageminMozjpeg = require('imagemin-mozjpeg');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');
//const CopyWebpackPlugin = require('copy-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
//const UglifyJS = require('uglify-es');
const env_vars = require('../ENV_VARS');
const allowedConnections = require('../connections');

type SourceMapConfig = {
  filename: string;
  exclude?: RegExp;
};
const sourceMapsConfig: SourceMapConfig = {
  filename: 'sourcemaps/[file].map'
};
console.log('in');
const webpackConfig = {
  devtool: 'inline-source-map',
  externalsPresets: { node: true },
  resolve: {
    // fallback: {
    //   assert: require.resolve('assert'),
    //   buffer: require.resolve('buffer'),
    //   console: require.resolve('console-browserify'),
    //   constants: require.resolve('constants-browserify'),
    //   crypto: require.resolve('crypto-browserify'),
    //   domain: require.resolve('domain-browser'),
    //   events: require.resolve('events'),
    //   http: require.resolve('stream-http'),
    //   https: require.resolve('https-browserify'),
    //   os: require.resolve('os-browserify/browser'),
    //   path: require.resolve('path-browserify'),
    //   punycode: require.resolve('punycode'),
    //   process: require.resolve('process/browser'),
    //   querystring: require.resolve('querystring-es3'),
    //   stream: require.resolve('stream-browserify'),
    //   string_decoder: require.resolve('string_decoder'),
    //   sys: require.resolve('util'),
    //   timers: require.resolve('timers-browserify'),
    //   tty: require.resolve('tty-browserify'),
    //   url: require.resolve('url'),
    //   util: require.resolve('util'),
    //   vm: require.resolve('vm-browserify'),
    //   zlib: require.resolve('browserify-zlib')
    // }
  },
  devServer: {
    server: 'https',
    host: 'localhost',
    hot: true,
    port: 8080,
    headers: {
      'Strict-Transport-Security':
        'max-age=63072000; includeSubdomains; preload',
      'Content-Security-Policy':
        "font-src 'self' data: js.intercomcdn.com:443; media-src js.intercomcdn.com:443 'self'; default-src 'self' blob:; frame-src 'self' www.walletlink.org:443 connect.trezor.io:443 intercom-sheets.com:443; img-src 'self' downloads.intercomcdn.com:443  gifs.intercomcdn.com:443 js.intercomcdn.com:443 images.ctfassets.net static.intercomassets.com:443 nft.mewapi.io:443 mewcard.mewapi.io:443 img.mewapi.io:443 app.lokalise.com:443 data: blob: ; script-src 'unsafe-eval' 'unsafe-inline' blob: https:; style-src 'self' 'unsafe-inline' https:; object-src 'none'; connect-src " +
        allowedConnections.join(' ') +
        ';',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'same-origin'
    }
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin(sourceMapsConfig),
    new webpack.NormalModuleReplacementPlugin(/^any-promise$/, 'bluebird'),
    // new BundleAnalyzerPlugin(),
    new NodePolyfillPlugin(),
    // new webpack.ProvidePlugin({
    //   assert: 'assert',
    //   Buffer: ['buffer', 'Buffer'],
    //   console: 'console-browserify',
    //   constants: 'constants-browserify',
    //   crypto: 'crypto-browserify',
    //   domain: 'domain-browser',
    //   events: 'events',
    //   http: 'stream-http',
    //   https: 'https-browserify',
    //   os: 'os-browserify/browser',
    //   path: 'path-browserify',
    //   punycode: 'punycode',
    //   process: 'process/browser',
    //   querystring: 'querystring-es3',
    //   stream: 'stream-browserify',
    //   string_decoder: 'string_decoder',
    //   sys: 'util',
    //   timers: 'timers-browserify',
    //   tty: 'tty-browserify',
    //   url: 'url',
    //   util: 'util',
    //   vm: 'vm-browserify',
    //   zlib: 'browserify-zlib'
    // }),
    new ImageminPlugin({
      disable: process.env.NODE_ENV !== 'production',
      test: /\.(jpe?g|png|gif|svg)$/i,
      pngquant: {
        quality: '100'
      },
      plugins: [
        imageminMozjpeg({
          quality: 100,
          progressive: true,
          chunks: 'all'
        })
      ]
    }),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: 'security.txt',
    //       to: '.well-known/security.txt'
    //     },
    //     {
    //       from: 'public',
    //       transform: function (content, filePath) {
    //         if (filePath.split('.').pop() === ('js' || 'JS'))
    //           return UglifyJS.minify(content.toString()).code;
    //         return content;
    //       }
    //     }
    //   ]
    // }),
    new webpack.DefinePlugin(env_vars)
  ],
  optimization: {
    splitChunks: {
      minSize: 1000000,
      maxSize: 5242880
    }
  },
  output: {
    filename: '[name].[chunkHash].js'
  }
};

export default { webpackConfig, sourceMapsConfig, env_vars };
