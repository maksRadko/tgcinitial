/* global describe:true, before:true, after:true, it:true, baseURL:true */

'use strict';

const should  = require('chai').should(),
    request = require('supertest')

describe("/test", () => {

  it('should return { "result": "test" }', (done) => {
    request(baseURL)
      .get('/test')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json')
      .expect(200)
      .end( (err, res) => {
        if (err) return done(err);
        
        res.body.should.be.an('object');
        res.body.should.have.ownProperty('result');
        res.body.result.should.equal("test");
        
        return done();
      });
  });
});
