const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const fs = require('fs');
const path = require('path');
const package = require('../package.json');

fs.open('./build/env.js', 'w', function (err, fd) {
    const buf = 'export default "production";';
    fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer) {
    });
});

module.exports = merge(webpackBaseConfig, {
    output: {
        publicPath: "dist/",
        /* publicPath: "/",*/
        filename: '[name].[hash].js',
        chunkFilename: '[name].[hash].chunk.js'
    },
    plugins: [
        new cleanWebpackPlugin(['result/*'], {
            root: path.resolve(__dirname, '../')
        }),
        new ExtractTextPlugin({
            filename: '[name].[hash].css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vender-exten', 'vender-base'],
            minChunks: Infinity
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new HtmlWebpackPlugin({
            title: '',
            favicon: './td_icon.ico',
            filename: '../index.html',
            template: './src/template/index.ejs',
            inject: false
        }),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, "../resource/sp500.csv"),
            to: path.resolve(__dirname, "../result/resource/sp500.csv")
        }, {
            from: path.resolve(__dirname, "../resource/canvg.js"),
            to: path.resolve(__dirname, "../result/resource/canvg.js")
        }, {
            from: path.resolve(__dirname, "../resource/html2canvas.js"),
            to: path.resolve(__dirname, "../result/resource/html2canvas.js")
        }, {
            from: path.resolve(__dirname, "../resource/rgbcolor.js"),
            to: path.resolve(__dirname, "../result/resource/rgbcolor.js")
        }, {
            from: path.resolve(__dirname, "../resource/world1.json"),
            to: path.resolve(__dirname, "../result/resource/world1.json")
        }, {
            from: path.resolve(__dirname, "../resource/tree.png"),
            to: path.resolve(__dirname, "../result/resource/tree.png")
        }, {
            from: path.resolve(__dirname, "../resource/city.png"),
            to: path.resolve(__dirname, "../result/resource/city.png")
        }, {
            from: path.resolve(__dirname, "../resource/topodata.xml"),
            to: path.resolve(__dirname, "../result/resource/topodata.xml")
        }])
    ]
});