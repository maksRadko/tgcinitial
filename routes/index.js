/**
 * Created by maksym on 3/17/16.
 */
module.exports = function(app) {

    // Sample route
    app.server.get('/', function (req, res, next) {
        res.send({ 'message': 'index' });
    });

};