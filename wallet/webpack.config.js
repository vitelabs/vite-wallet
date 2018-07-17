const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const merge = require('webpack-merge');
const devConfig = require('./config/dev.config.js');
const mapConfig = require('./config/map.config.js');

const SRC_PATH = path.join(__dirname, 'src');

let webpackConfig = {
    mode: process.env.NODE_ENV || 'development',
    entry: {
        index: path.join(__dirname, 'src/index.js'),
        vendor: ['vue', 'vue-router']
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].[hash].js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Vite-Wallet',
            template: path.join(__dirname, 'index.html')
        }),
        new VueLoaderPlugin()
    ],
    module: {
        rules: [{
            test: /\.vue$/,
            use: [{
                loader: 'vue-loader'
            }]
        }, {
            test: /\.(png|jpg|gif)$/,
            use: [
                {
                    loader: 'file-loader'
                }
            ]
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }, {
            test: /(\.scss$|\.css$|\.sass$)/,
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader'
            }, {
                loader: 'sass-loader'
            }]
        }]
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js',
            src: SRC_PATH,
            utils: path.join(SRC_PATH, '/utils'),
            components: path.join(SRC_PATH, '/components'),
            pages: path.join(SRC_PATH, '/pages'),
            assets: path.join(SRC_PATH, '/assets'),
            routes: path.join(SRC_PATH, '/routes'),
            i18n: path.join(SRC_PATH, '/i18n'),
        },
        extensions: ['.js','.scss','.vue','.json']
    }
};

if (process.env.MAP === 'true') {
    webpackConfig = merge(webpackConfig, mapConfig);
}
if (process.env.NODE_ENV === 'development') {
    webpackConfig = merge(webpackConfig, devConfig);
}

module.exports = webpackConfig;
