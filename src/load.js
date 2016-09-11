'use strict';

module.exports = function(url, params, callbackFunction) {
  var xhr = new XMLHttpRequest();

  var defaultFilterStorage = localStorage.getItem('defaultFilterStorage') || 'filter-popular';
  document.querySelector('#' + defaultFilterStorage).checked = true;

  xhr.onload = function(evt) {
    var loadedData = JSON.parse(evt.target.response);
    callbackFunction(loadedData);
  };

  xhr.open('GET', url + '?from=' + (params.from || 0) + '&to=' + (params.to || Infinity) + '&filter=' + (params.filter || defaultFilterStorage));
  xhr.send();
};
