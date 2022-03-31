import config from 'config';
import LOG from './Logger.js';

import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import express from 'express';
import http from 'http';
import morgan from 'morgan';

import bodyParser from 'body-parser';

import installApp from './app.js';

import webpackConfig from '../webpack.config.babel.js';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

////////////////////////////////

LOG.info("begin");

const compiler = webpack(webpackConfig);

const app = express();
const httpServer = http.Server(app);

app.set('view engine', 'ejs');

app.use(morgan('dev', {
    "stream": LOG.stream,
    skip: function(req, res) {
        return req.path === '/__webpack_hmr';
    }
}));

app.get('/', function(req, res) { res.render('index'); });

app.use('/', express.static('.'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: { colors: true }
}));

app.use(webpackHotMiddleware(compiler));

/// Business Logic

installApp(app);

/// HTTP endpoint startup

const httpPort = config.get('http_port');

httpServer.listen(httpPort, function () {
  LOG.info("Server listening on port " + httpPort + "!");
});
