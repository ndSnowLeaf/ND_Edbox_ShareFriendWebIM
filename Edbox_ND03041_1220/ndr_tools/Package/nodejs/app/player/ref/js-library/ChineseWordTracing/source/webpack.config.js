/**
 * Created by Administrator on 2016/12/14.
 */
var path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");


module.exports = {

    devtool: "cheap-module-source-map",

    entry: {
        chinesewordtracing:  path.join(__dirname, "./src/chinesewordtracing.js"),
        test: path.join(__dirname, "./src/test.js")
    },

    output: {
        path: path.resolve(__dirname, "../script"),
        filename: "[name].js"
    },

    module: {
        rules: [
            {
                test: /\.js$/,

                exclude: [path.resolve(__dirname, "node_modules")],

                enforce: "pre",

                loader: "eslint-loader"
            },
            {
                test: /\.js$/,

                include: [
                    path.resolve(__dirname, "src")
                ],

                exclude: [
                    path.resolve(__dirname, "node_modules")
                ],

                loader: "babel-loader",

                options: {
                    presets: ["es2015"]
                }
            },
            {
                test:/\.html$/,

                loader: "html-loader"
            },
            {
                test: /\.json$/,

                loader: "json-loader"
            },
            {
                test:/\.css$/,

                loader: "css-loader"
            }

        ]
    },

    externals: ["jQuery"],

    plugins: [
        new HtmlWebpackPlugin({
            title: "aaaaaaaaa",
            template: "./index.html"
        })
    ]

};