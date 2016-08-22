'use strict';

window.jsonpCallback = function(data) {
  window.pictures = data;
};

var createCallback = function(url, callbackFunction) {
  var scriptEl = document.createElement('script');
  scriptEl.src = url + '?callback=' + callbackFunction;
  document.body.appendChild(scriptEl);
};

createCallback('http://localhost:1506/api/pictures', 'jsonpCallback');
