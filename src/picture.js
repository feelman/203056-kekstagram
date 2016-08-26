'use strict';

module.exports = (function() {
  var templateElement = document.querySelector('#picture-template');
  var elementToClone;

  if ('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.picture');
  } else {
    elementToClone = templateElement.querySelector('.picture');
  }

  var IMAGE_LOAD_TIMEOUT = 10000;

  return function(data, container) {
    var element = elementToClone.cloneNode(true);
    container.appendChild(element);

    var newImage = new Image(182, 182);
    var newImageLoadTimeout;
    var image = element.querySelector('img');

    newImage.onload = function(evt) {
      clearTimeout(newImageLoadTimeout);
      image.src = evt.target.src;
      var filtersHideOff = require('./pictures');
      filtersHideOff();
    };

    newImage.onerror = function() {
      element.classList.add('picture-load-failure');
    };

    newImage.src = data.url;

    newImageLoadTimeout = setTimeout(function() {
      image.src = '';
      element.classList.add('picture-load-failure');
    }, IMAGE_LOAD_TIMEOUT);

    return element;
  };
})();
