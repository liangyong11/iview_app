const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const fs = require('fs');
const path = require('path');
const package = require('../package.json');

fs.open('./env.js', 'w', function (err, fd) {
    const buf = 'export default "development";';
    fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer) {
    });
});

module.exports = merge(webpackBaseConfig, {
    //devtool: '#source-map',
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, '../dist/dist'),
        publicPath: 'dist/',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
    },
    module: {
        rules: []
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vender-exten', 'vender-base'],
            minChunks: Infinity
        }),
        new HtmlWebpackPlugin({
            title: '',
            filename: '../index.html',
            template: './src/template/index.ejs',
            inject: false
        })
    ]
});