/* global process:true */

'use strict';
const path      = require('path'),
      cluster   = require('cluster'),
      config    = require('config'),
      restify   = require('restify'),
      requireFu = require('require-fu'),

      MyApp     = require('./app');

// if process.env.NODE_ENV has not been set, default to development
var NODE_ENV = process.env.NODE_ENV || 'development';
console.log(NODE_ENV);
//exports.run = run;

const app = new MyApp(config);
const logger = app.logger;
global.ROOT_DIR = __dirname;

function spawnWorker () {
  // create servers
  var server = app.createServer();

  // start listening
  var port = config.get('server.port');

  server.listen(port, function () {
    console.log(`${server.name} listening at ${server.url}`);
  });
  requireFu(__dirname + '/routes')(app);
}

//spawnWorker();

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
  if (NODE_ENV === 'production'
      || Boolean(config.get('server.cluster'))) {
    createCluster();
  }
  else {
    spawnWorker();
  }

}
//
run();
