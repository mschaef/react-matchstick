import path from 'path';
import webpack from 'webpack';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default {
    devtool: 'eval',
    mode: 'development',
    entry: [
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&overlay=true',
        'webpack/hot/only-dev-server',
        './client/index'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['react-hot-loader/webpack', 'babel-loader'],
                include: [
                    path.join(__dirname, 'client'),
                    path.join(__dirname, 'common')
                ]
            }, {
                test: /\.scss$/,
                use: ['style-loader','css-loader', 'sass-loader']
            }, {
                test: /\.css$/,
                use: ['style-loader','css-loader']
            }, {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: ['file-loader']
            }, {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                use: ['file-loader']
            }, {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                use: ['file-loader']
            }, {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                use: ['file-loader']
            }, {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                use: ['file-loader']
            }
        ]
    }
};

