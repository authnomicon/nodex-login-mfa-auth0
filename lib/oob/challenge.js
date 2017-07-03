exports = module.exports = function(client) {
  
  
  return function challenge(authenticator, options, cb) {
    if (typeof options == 'function') {
      cb = options;
      options = undefined;
    }
    options = options || {};
    
    
    /*
    client.sendSMS(authenticator._userID, function(err, token) {
      if (err) { return cb(err); }
      // TODO: Parse and supply parameters (txnid)
      //return cb(null, { type: 'oob', transactionID: token });
      return cb(null);
    });
    return;
    */
      
    client.sendPush(authenticator._userID, function(err, token) {
      if (err) { return cb(err); }
      // TODO: Parse and supply parameters (txnid)
      return cb(null, { type: 'oob', transactionID: token });
    });
  };
};

exports['@implements'] = [
  'http://schemas.authnomicon.org/js/login/mfa/oob/challenge',
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/oob/challenge'
];
exports['@singleton'] = true;
exports['@require'] = [
  'http://schemas.authnomicon.org/js/login/mfa/opt/auth0/Client'
];