"use strict";

//const fs = require('fs');
const path = require('path');

//let namespace = "__StatisticsComponent";

// function loadComponents() {
//     let folders = fs.readdirSync(path.join(__dirname, './components'));
//     if (folders.length) {
//         let script = `window['${namespace}']={};\n`;
//         for (let folder of folders) {
//             if (fs.statSync(path.join(__dirname, './components', folder)).isDirectory()) {
//                 script += `import ${folder} from './${folder}';\nwindow['${namespace}']['${folder}'] = ${folder};\n`;
//             }
//         }
//         fs.writeFileSync(path.join(__dirname, './components/index.ts'), script);
//     }
// }

// loadComponents();

module.exports = {
    devtool: "cheap-module-eval-source-map",
    entry: {
        component: "./components/index.ts"
    },
    output: {
        path: path.join(__dirname, "../"),
        filename: "complexstatistics.dist.js"
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module: {
        rules: [{
            test: /\.html$/,
            use: ["raw-loader", "html-minify-loader"]
        }, {
            test: /\.ts$/,
            loaders: "ts-loader"
        },{
            test: /\.css$/,
            loaders: "style-loader!css-loader"
        },{
            test: /\.(png|jpg)$/,
            loaders: "url-loader?limit=8192"
        }],
        
    },
    externals: {
        'vue': 'Vue',
        'vuex': 'Vuex'
    },
    watch: true
};