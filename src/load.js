'use strict';

module.exports = function(url, callbackFunction) {
  var scriptEl = document.createElement('script');
  scriptEl.src = url + '?callback=' + callbackFunction;
  document.body.appendChild(scriptEl);
};
