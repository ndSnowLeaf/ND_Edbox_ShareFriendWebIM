/**
 * Created by Administrator on 2017/3/31.
 */
var path = require('path');

module.exports = {
    // devtool:'cheap-module-source-map',
    entry: {
        Dispatcher: path.resolve(__dirname,'./js/Dispatcher.js'),
        Interceptor: path.resolve(__dirname,'./js/Interceptor.js')
    },
    output: {
        path: path.resolve(__dirname,'../js'),
        filename:'[name].js'
    },
    module: {
        rules:[
            {
                test:/\.js/,
                loader:'babel-loader',
                exclude: [
                    path.resolve(__dirname, "node_modules")
                ],
                options:{
                    presets:['es2015']
                }
            }
        ]
    },
    watch:true
}