/* global describe:true, before:true, after:true, it:true, global:true,
   baseURL:true, process:true */
"use strict";

const config = require('config'),
      MyApp = require('../app'),
      bunyan = require('bunyan'),
      PrettyStream = require('bunyan-prettystream'),
      chai = require('chai'),
      request = require('supertest'),
      path = require('path'),
      routes = ['test', 'index'];

var server;
const expect = chai.expect(),
    app = new MyApp(config);

var routesConnection = (routesArr) => {
  var routPath = '../routes/'
  routesArr.forEach((route) => {
    var reqRoute = require(routPath + route);
    reqRoute(app);
  })
};

before(function (done) {

  var bunyanToConsole = new PrettyStream();
  bunyanToConsole.pipe(process.stdout);
  
  var logger = bunyan.createLogger({
    name     : 'testLogger',
    streams  : [{
      level  : 'error',
      type   : 'raw',
      stream : bunyanToConsole
    }]
  });
  
  server = app.createServer();

  routesConnection(routes);

  // start listening
  var port = config.get('server.port');
  server.listen(port, function () {
    logger.info('%s listening at %s', server.name, server.url);
  });
  
  global.baseURL = 'http://localhost:' + port;

  // make sure the server is started
  setTimeout(function() {
    request(baseURL)
        .get('/')
        .end(function (err, res) {
          if (err && err.code === 'ECONNREFUSED') {
            return done(new Error('Server is not running.'));
          }
          return done(err);
        });
  }, 500);
});

after(function () {
  server.close();
});
