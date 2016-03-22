'use strict';

var path    = require('path'),
    restify = require('restify'),
    db = require('./dynamo'),
    logging = require('./logging');

let _settings = new WeakMap();

class MyApp {
  constructor(config) {
    this[_settings] = config.get('app'); // Private property
    this.name   = config.get('server.name') || require(path.join(__dirname, 'package')).name;
    this.logger = logging.createLogger(config.get('logging'));
    this.dynamo = db.initDb();
  }
  createServer() {
    this.server = restify.createServer(this.name);
    this.server.use(restify.CORS({
      origins: this[_settings].origins,
      credentials: this[_settings].credentials,
      headers: this[_settings].headers
    }));
    // Allow five requests/second by IP, and burst to 10
    this.server.use(restify.throttle({
      burst: 10,
      rate: 5,
      ip: true
    }));
    this.server.use(restify.acceptParser(this.server.acceptable));
    this.server.use(restify.queryParser());
    //this.server.use(req.log);
    //this.server.use(restify.bodyParser());

    this.server.on('NotFound', (req, res, next) => {
      this.logger.debug('404', 'No route that matches request for ' + req.url);
      res.send(404, req.url + ' was not found');
    });
    this.server.on('MethodNotAllowed', function (request, response, cb) {});
    this.server.on('UnsupportedMediaType', function (request, response, cb) {});
    this.server.on('uncaughtException', function (request, response, route, error) {});
    return this.server;
  }
}

module.exports = MyApp;
