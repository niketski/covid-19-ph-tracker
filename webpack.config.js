const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        app: ['babel-polyfill', './src/index.js']
    },
    output: {
        filename: `[name].bundle.js`,
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: ["@babel/plugin-transform-async-to-generator"]
                    }
                }
            },
            {
                test: /\.(scss|sass|css)$/,
                use: [ MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
            },
            {
                test: /\.html$/,
                use: ['html-loader']
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'images',
                        publicPath: 'images',
                        esModule: false
                    }
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf)/,
                use: ['url-loader']
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: './styles/[name].css'
        }),
        new htmlWebpackPlugin({
            title: 'COVID-19 PH',
            filename: 'index.html',
            template: 'src/index.html'
        }),
        new CleanWebpackPlugin()
    ],
    mode: 'development',
    devServer: {
        port: 3000
    }
}