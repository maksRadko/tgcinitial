/* global process:true */

'use strict';
process.on('uncaughtException', (err) => {
  console.error(err);
  if (err && err.stack)
    console.error(err.stack);
});
const path      = require('path'),
      cluster   = require('cluster'),
      config    = require('config'),
      restify   = require('restify'),
      requireFu = require('require-fu'),

      MyApp     = require('./app');

// if process.env.NODE_ENV has not been set, default to development
var NODE_ENV = process.env.NODE_ENV || 'development';
global.env = NODE_ENV;
global.appDir = __dirname;

const app = new MyApp(config);
const logger = app.logger;

function spawnWorker () {
  // create servers
  var server = app.createServer();

  // start listening
  var port = config.get('server.port');

  server.listen(port, function () {
    logger.info(`${server.name} listening at ${server.url}`);
    console.info(`${server.url}`);
  });
  requireFu(__dirname + '/routes')(app);
}

function createCluster () {

  // Set up cluster and start servers
  if (cluster.isMaster) {
    var numCpus = require('os').cpus().length;

    logger.info('Starting master, pid ' + process.pid + ', spawning '
      + numCpus + ' workers');

    // fork workers
    for (var i = 0; i < numCpus; i++) {
      cluster.fork();
    }

    cluster.on('listening', function (worker) {
      logger.info('Worker ' + worker.id + ' started');
    });

    // if a worker dies, respawn
    cluster.on('death', function (worker) {
      logger.warn('Worker ' + worker.id + ' died, restarting...');
      cluster.fork();
    });

  }
  // Worker processes
  else {
    spawnWorker(logger);
  }
}

function run (cluster) {

   //In production environment, create a cluster
  if (NODE_ENV === 'production' || Boolean(config.get('server.cluster'))) {
    createCluster();
  }
  else {
    spawnWorker();
  }

}
//
run();
