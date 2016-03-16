module.exports = function(server) {
  
  // Sample route
  server.get('/', function (req, res, next) {
    res.send({ 'result': 'test' });
    console.log('sdfgdfgd');
  });

};
