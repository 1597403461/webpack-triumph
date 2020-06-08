
// 分离基础库
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const HtmlWebpackExternalsPlugins = [
    new HtmlWebpackExternalsPlugin({
        externals: [
            {
                module: "react-dom",
                entry: "https://unpkg.com/react-dom@16.13.1/umd/react-dom.production.min.js",
                global: "ReactDOM",
                file:
            },
            {
                module: "react",
                entry: "https://unpkg.com/react@16.13.1/umd/react.production.min.js",
                global: "React",
            }
        ]
    })
];

module.exports = HtmlWebpackExternalsPlugins;