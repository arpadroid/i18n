const argv = require('yargs').argv;
const MODE = argv.mode === 'production' ? 'production' : 'development';
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = (async () => {
    return [
        {
            entry: './src/index.js',
            target: 'web',
            mode: MODE,
            stats: 'errors-only',
            devServer: {
                port: 9001,
                hot: true,
                open: true,
                watchFiles: ['src/**/*'],
                static: {
                    directory: path.join(__dirname, 'dist')
                }
            },
            experiments: {
                outputModule: true,
            },
            resolve: {
                extensions: ['.js']
            },
            module: {
                rules: [{
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                    }
                }]
            },
            cache: {
                type: 'filesystem'
            },
            output: {
                path: path.resolve(__dirname, 'dist'),
                clean: true,
                module: true,
                publicPath: '/',
                filename: 'arpadroid-i18n.js',
                library: {
                    type: 'module'
                }
            },
            plugins: [
                new HtmlWebpackPlugin({
                    template: 'src/demo.html'
                }),
                new webpack.optimize.ModuleConcatenationPlugin(),
                new webpack.DefinePlugin({
                    APPLICATION_MODE: JSON.stringify(MODE)
                }),
                new CopyPlugin({
                    patterns: [
                        {
                            from: 'src/lang',
                            to: 'lang'
                        },
                    ]
                })
            ]
        }
    ];
})();
