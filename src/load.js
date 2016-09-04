'use strict';

module.exports = function(url, callbackFunction) {
  var xhr = new XMLHttpRequest();

  xhr.onload = function(evt) {
    var loadedData = JSON.parse(evt.target.response);
    callbackFunction(loadedData);
  };

  xhr.open('GET', url);
  xhr.send();
};
