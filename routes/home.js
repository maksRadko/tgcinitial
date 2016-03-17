module.exports = function(app) {
  
  // Sample route
  app.server.get('/home', function (req, res, next) {
    res.send({ 'result': 'home' });
    app.logger.info('HOME');
  });

};
