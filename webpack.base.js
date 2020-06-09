const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const friendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');const setMPA = require('./utils/setMPA');

const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
    entry,
    module: {
        rules: [
            {
                test: /\.js|jsx$/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    // 'style-loader',
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader' }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    // 'style-loader',
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader' },
                    { loader: 'less-loader' }
                ]
            },
            {
                test: /\.(ico|png|jpg|jpeg|mp4|mp3|gif|mov)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192, // 限制字节（如果图片或者字体的字节数小于此数值，自动转换为base64）
                            name: '[name]_[hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(), // 打包前清空dist目录
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css'
        }),
        new friendlyErrorsWebpackPlugin()
    ].concat(htmlWebpackPlugins)
}
