const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');
const path = require('path');
const optimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
// const webpack = require('webpack');
// const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const prodConfig = {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]_[chunkhash:8].js'
    },
    plugins: [
        new optimizeCssAssetsWebpackPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')
        }),
        // new webpack.DllReferencePlugin({
        //     manifest: require('./build/library/library.json')
        // }),
        // new AddAssetHtmlPlugin({
        //     filepath: path.resolve(__dirname, 'build/library/*.dll.js')
        // }),
        new HardSourceWebpackPlugin(),
        // new BundleAnalyzerPlugin()
    ]
    // stats: "errors-only"
};
module.exports = merge(baseConfig, prodConfig);