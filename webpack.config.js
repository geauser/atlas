const path = require('path');

module.exports = {
  entry: './src/index.js',

  output: {
    path: path.resolve('bin'),
    filename: 'atlas.min.js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      },

      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  }
};
