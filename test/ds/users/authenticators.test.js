var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../app/ds/users/authenticators');


describe('ds/users/authenticators', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.have.length(2);
    expect(factory['@implements'][0]).to.equal('http://schemas.authnomicon.org/js/login/mfa/UserAuthenticatorsDirectory');
    expect(factory['@implements'][1]).to.equal('http://schemas.authnomicon.org/js/login/mfa/opt/auth0/UserAuthenticatorsDirectory');
    expect(factory['@singleton']).to.equal(true);
  });
  
  describe('UserAuthenticatorsDirectory', function() {
    var directory;
    
    var client = {
      users: { getEnrollments: function(){} },
      guardian: { enrollments: { delete: function(){} } }
    };
    var idmap;
    
    
    describe('#list', function() {
      
      describe('user with Auth0 Guardian', function() {
        var authenticators;
        
        before(function() {
          var enrollments = [ {
            id: 'dev_xxxXxxX0XXXxXx0X',
            status: 'confirmed',
            type: 'pn',
            name: 'John’s iPhone 7',
            phone_number: null,
            identifier: '0000000X-000X-00X0-0X00-00X000XX000X',
            enrolled_at: '2016-12-15T23:43:48.724Z',
            last_auth: '2016-12-16T00:44:51.084Z'
          } ];
          
          sinon.stub(client.users, 'getEnrollments').yields(null, enrollments);
          idmap = sinon.stub().yields(null, 'auth0|00xx00x0000x00x0000x0000');
        });
      
        after(function() {
          client.users.getEnrollments.restore();
        });
        
        before(function(done) {
          var directory = factory(idmap, client);
          directory.list({ id: '1', username: 'johndoe' }, function(_err, _authenticators) {
            if (_err) { return done(_err); }
            authenticators = _authenticators;
            done();
          });
        });
      
        it('should map user identifier', function() {
          expect(idmap).to.have.been.calledOnce;
          var call = idmap.getCall(0);
          expect(call.args[0]).to.deep.equal({
            id: '1',
            username: 'johndoe'
          });
        });
        
        it('should request enrollments from Management API', function() {
          expect(client.users.getEnrollments).to.have.been.calledOnce;
          var call = client.users.getEnrollments.getCall(0);
          expect(call.args[0]).to.deep.equal({
            id: 'auth0|00xx00x0000x00x0000x0000'
          });
        });
        
        it('should yield authenticators', function() {
          expect(authenticators).to.be.an('array');
          expect(authenticators).to.have.length(1);
          expect(authenticators[0]).to.deep.equal({
            vendor: 'auth0',
            id: 'dev_xxxXxxX0XXXxXx0X',
            active: true,
            type: [ 'oob', 'otp', 'lookup-secret' ],
            channels: [ 'auth0' ],
            _userID: 'auth0|00xx00x0000x00x0000x0000'
          });
        });
      }); // user with Auth0 Guardian
      
      describe('user with SMS', function() {
        var authenticators;
        
        before(function() {
          var enrollments = [ {
            id: 'dev_xxxXxxX0XXXxXx0X',
            status: 'confirmed',
            type: 'sms',
            phone_number: 'XXXXXXXX1234',
            enrolled_at: '2016-12-16T20:01:54.565Z',
            last_auth: '2016-12-16T20:01:54.564Z'
          } ];
          
          sinon.stub(client.users, 'getEnrollments').yields(null, enrollments);
          idmap = sinon.stub().yields(null, 'auth0|00xx00x0000x00x0000x0000');
        });
      
        after(function() {
          client.users.getEnrollments.restore();
        });
        
        before(function(done) {
          var directory = factory(idmap, client);
          directory.list({ id: '1', username: 'johndoe' }, function(_err, _authenticators) {
            if (_err) { return done(_err); }
            authenticators = _authenticators;
            done();
          });
        });
      
        it('should map user identifier', function() {
          expect(idmap).to.have.been.calledOnce;
          var call = idmap.getCall(0);
          expect(call.args[0]).to.deep.equal({
            id: '1',
            username: 'johndoe'
          });
        });
        
        it('should request enrollments from Management API', function() {
          expect(client.users.getEnrollments).to.have.been.calledOnce;
          var call = client.users.getEnrollments.getCall(0);
          expect(call.args[0]).to.deep.equal({
            id: 'auth0|00xx00x0000x00x0000x0000'
          });
        });
        
        it('should yield authenticators', function() {
          expect(authenticators).to.be.an('array');
          expect(authenticators).to.have.length(1);
          expect(authenticators[0]).to.deep.equal({
            vendor: 'auth0',
            id: 'dev_xxxXxxX0XXXxXx0X',
            active: true,
            type: [ 'oob', 'lookup-secret' ],
            channels: [ 'sms' ],
            confirmation: {
              channel: 'primary'
            },
            _userID: 'auth0|00xx00x0000x00x0000x0000'
          });
        });
      }); // user with SMS
      
      describe('user with Google Authenticator', function() {
        var authenticators;
        
        before(function() {
          var enrollments = [ {
            id: 'dev_xxxXxxX0XXXxXx0X',
            status: 'confirmed',
            type: 'authenticator',
            enrolled_at: '2016-12-14T02:24:32.306Z',
            last_auth: '2016-12-14T02:26:59.776Z'
          } ];
          
          sinon.stub(client.users, 'getEnrollments').yields(null, enrollments);
          idmap = sinon.stub().yields(null, 'auth0|00xx00x0000x00x0000x0000');
        });
      
        after(function() {
          client.users.getEnrollments.restore();
        });
        
        before(function(done) {
          var directory = factory(idmap, client);
          directory.list({ id: '1', username: 'johndoe' }, function(_err, _authenticators) {
            if (_err) { return done(_err); }
            authenticators = _authenticators;
            done();
          });
        });
      
        it('should map user identifier', function() {
          expect(idmap).to.have.been.calledOnce;
          var call = idmap.getCall(0);
          expect(call.args[0]).to.deep.equal({
            id: '1',
            username: 'johndoe'
          });
        });
        
        it('should request enrollments from Management API', function() {
          expect(client.users.getEnrollments).to.have.been.calledOnce;
          var call = client.users.getEnrollments.getCall(0);
          expect(call.args[0]).to.deep.equal({
            id: 'auth0|00xx00x0000x00x0000x0000'
          });
        });
        
        it('should yield authenticators', function() {
          expect(authenticators).to.be.an('array');
          expect(authenticators).to.have.length(1);
          expect(authenticators[0]).to.deep.equal({
            vendor: 'auth0',
            id: 'dev_xxxXxxX0XXXxXx0X',
            active: true,
            type: [ 'otp', 'lookup-secret' ],
            _userID: 'auth0|00xx00x0000x00x0000x0000'
          });
        });
      }); // user with Google Authenticator
      
      describe('user with pending enrollment', function() {
        var authenticators;
        
        before(function() {
          var enrollments = [ {
            id: 'dev_xxxXxxX0XXXxXx0X',
            status: 'confirmation_pending',
            type: 'authenticator',
            enrolled_at: null
          } ];
          
          sinon.stub(client.users, 'getEnrollments').yields(null, enrollments);
          idmap = sinon.stub().yields(null, 'auth0|00xx00x0000x00x0000x0000');
        });
      
        after(function() {
          client.users.getEnrollments.restore();
        });
        
        before(function(done) {
          var directory = factory(idmap, client);
          directory.list({ id: '1', username: 'johndoe' }, function(_err, _authenticators) {
            if (_err) { return done(_err); }
            authenticators = _authenticators;
            done();
          });
        });
      
        it('should map user identifier', function() {
          expect(idmap).to.have.been.calledOnce;
          var call = idmap.getCall(0);
          expect(call.args[0]).to.deep.equal({
            id: '1',
            username: 'johndoe'
          });
        });
        
        it('should request enrollments from Management API', function() {
          expect(client.users.getEnrollments).to.have.been.calledOnce;
          var call = client.users.getEnrollments.getCall(0);
          expect(call.args[0]).to.deep.equal({
            id: 'auth0|00xx00x0000x00x0000x0000'
          });
        });
        
        it('should yield authenticators', function() {
          expect(authenticators).to.be.an('array');
          expect(authenticators).to.have.length(1);
          expect(authenticators[0]).to.deep.equal({
            vendor: 'auth0',
            id: 'dev_xxxXxxX0XXXxXx0X',
            active: false,
            type: [ 'otp', 'lookup-secret' ],
            _userID: 'auth0|00xx00x0000x00x0000x0000'
          });
        });
        
      }); // user with pending enrollment
      
      describe('user without authenticators', function() {
        var authenticators;
        
        before(function() {
          var enrollments = [];
          
          sinon.stub(client.users, 'getEnrollments').yields(null, enrollments);
          idmap = sinon.stub().yields(null, 'auth0|00xx00x0000x00x0000x0000');
        });
      
        after(function() {
          client.users.getEnrollments.restore();
        });
        
        before(function(done) {
          var directory = factory(idmap, client);
          directory.list({ id: '1', username: 'johndoe' }, function(_err, _authenticators) {
            if (_err) { return done(_err); }
            authenticators = _authenticators;
            done();
          });
        });
      
        it('should map user identifier', function() {
          expect(idmap).to.have.been.calledOnce;
          var call = idmap.getCall(0);
          expect(call.args[0]).to.deep.equal({
            id: '1',
            username: 'johndoe'
          });
        });
        
        it('should request enrollments from Management API', function() {
          expect(client.users.getEnrollments).to.have.been.calledOnce;
          var call = client.users.getEnrollments.getCall(0);
          expect(call.args[0]).to.deep.equal({
            id: 'auth0|00xx00x0000x00x0000x0000'
          });
        });
        
        it('should yield authenticators', function() {
          expect(authenticators).to.be.an('array');
          expect(authenticators).to.have.length(0);
        });
        
      }); // user without authenticators
      
    }); // #list
    
    describe('#revoke', function() {
    
      describe('success', function() {
        before(function() {
          sinon.stub(client.guardian.enrollments, 'delete').yields(null);
          idmap = sinon.stub().yields(null, 'auth0|00xx00x0000x00x0000x0000');
        });
      
        after(function() {
          client.guardian.enrollments.delete.restore();
        });
        
        before(function(done) {
          var directory = factory(idmap, client);
          directory.revoke({ id: '1', username: 'johndoe' }, 'dev_xxxXxxX0XXXxXx0X', function(_err) {
            if (_err) { return done(_err); }
            done();
          });
        });
      
        it('should map user identifier', function() {
          expect(idmap).to.have.been.calledOnce;
          var call = idmap.getCall(0);
          expect(call.args[0]).to.deep.equal({
            id: '1',
            username: 'johndoe'
          });
        });
        
        it('should request Management API to delete enrollment', function() {
          expect(client.guardian.enrollments.delete).to.have.been.calledOnce;
          var call = client.guardian.enrollments.delete.getCall(0);
          expect(call.args[0]).to.deep.equal({
            id: 'dev_xxxXxxX0XXXxXx0X'
          });
        });
      }); // success
    
      describe('error due to insufficient scope', function() {
        var err;
        
        before(function() {
          var e = new Error();
          e.message = 'Insufficient scope, expected any of: delete:guardian_enrollments';
          e.statusCode = 403;
          e.error = 'Forbidden';
          e.errorCode = 'insufficient_scope';
          
          sinon.stub(client.guardian.enrollments, 'delete').yields(e);
          idmap = sinon.stub().yields(null, 'auth0|00xx00x0000x00x0000x0000');
        });
      
        after(function() {
          client.guardian.enrollments.delete.restore();
        });
        
        before(function(done) {
          var directory = factory(idmap, client);
          directory.revoke({ id: '1', username: 'johndoe' }, 'dev_xxxXxxX0XXXxXx0X', function(_err) {
            err = _err;
            done();
          });
        });
      
        it('should map user identifier', function() {
          expect(idmap).to.have.been.calledOnce;
          var call = idmap.getCall(0);
          expect(call.args[0]).to.deep.equal({
            id: '1',
            username: 'johndoe'
          });
        });
        
        it('should request Management API to delete enrollment', function() {
          expect(client.guardian.enrollments.delete).to.have.been.calledOnce;
          var call = client.guardian.enrollments.delete.getCall(0);
          expect(call.args[0]).to.deep.equal({
            id: 'dev_xxxXxxX0XXXxXx0X'
          });
        });
        
        it('should yield error', function() {
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.equal('Insufficient scope, expected any of: delete:guardian_enrollments');
          expect(err.errorCode).to.equal('insufficient_scope');
        });
        
      }); // error due to insufficient scope
      
    }); // #revoke
    
  }); // Directory
  
});
