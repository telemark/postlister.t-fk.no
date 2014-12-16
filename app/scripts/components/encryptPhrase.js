'use strict';

var crypto = require('crypto')
  ;

function encryptPhrase(phrase){
  var password = 'SoylentGreenIsPeople';
  var cipher = crypto.createCipher('aes192', password);
  var encrypted = cipher.update(phrase, 'utf8', 'hex');

  encrypted += cipher.final('hex');

  return encrypted;
}

module.exports = encryptPhrase;