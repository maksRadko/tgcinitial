/* global describe:true, before:true, after:true, it:true, baseURL:true */

'use strict';

const should  = require('chai').should(),
    request = require('supertest');

describe("/", () => {

  it('should return a message', (done) => {
    request(baseURL)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        
        res.body.should.be.an('object');
        res.body.should.have.ownProperty('message');
        res.body.message.should.exist;
        res.body.message.should.match(/.+/);
        
        return done();
      });
  });

});
