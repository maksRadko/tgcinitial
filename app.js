/* global process:true, __dirname:true */

'use strict';

var path    = require('path'),
    restify = require('restify'),
    db = require('./dynamo'),
    logging = require('./logging');

let _settings = new WeakMap();

class MyApp {
  constructor(config) {
    this[_settings] = config; // Private property
    this.name   = (this[_settings].has('server.name') && this[_settings].get('server.name'))
      ? this[_settings].get('server.name')
      : require(path.join(__dirname, 'package')).name;
    this.logger = logging.createLogger(config.get('logging'));
    this.db     = db.hello();
  }
  createServer() {
    this.server = restify.createServer(this.name);
    this.server.use(restify.acceptParser(this.server.acceptable));
    this.server.use(restify.queryParser());

    this.server.on('NotFound', (req, res, next) => {
      this.logger.debug('404', 'No route that matches request for ' + req.url);
      res.send(404, req.url + ' was not found');
    });
    return this.server;
  }
}

module.exports = MyApp;
