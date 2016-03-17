module.exports = function(app) {
  
  // Sample route
  app.server.get('/', function (req, res, next) {
    res.send({ 'result': 'home' });
    app.logger.info('HOME');
  });

};
