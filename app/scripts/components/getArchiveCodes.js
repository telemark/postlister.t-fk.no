'use strict';

function getArchiveCodes(klassering){
  var codes = [];
  var output = '';
  if (klassering) {
    klassering.forEach(function(item){
      if(item.KL_OPLTEKST !== '---'){
        codes.push(item.KL_OPLTEKST);
      }
    });
  }

  if(codes.length > 0){
    output += 'Arkivkode: ' + codes.join(', ') + '<br />'
  }

  return output;
}

module.exports = getArchiveCodes;
