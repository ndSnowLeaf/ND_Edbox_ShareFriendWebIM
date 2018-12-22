/**
 * Created by Administrator on 2017/3/31.
 */
var path = require('path');

module.exports = {
  //devtool: 'source-map',
  entry: {
    main: path.resolve(__dirname, './js/index.js')
  },
  output: {
    path: path.resolve(__dirname, '../js'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js/,
        loader: 'babel-loader',
        exclude: [
          path.resolve(__dirname, "node_modules")
        ],
        options: {
          presets: ['es2015']
        }
      },
      {
        test: /\.html$/,
        use: ["raw-loader", "html-minify-loader"]
      }, {
        test: /\.(png|jpg)$/,
        loaders: "url-loader?limit=8192"
      }
    ]
  },
  externals: {
    'vue': 'Vue',
    'vuex': 'Vuex',
    'vue-router': 'VueRouter',
    '$': '$'
  },
  watch: true
}