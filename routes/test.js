module.exports = function(app) {
  
  // Sample route
  app.server.get('/test', function (req, res, next) {
    res.send({ 'result': 'test' });
    console.log('sdfgdfgd');
  });

};
