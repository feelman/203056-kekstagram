'use strict';

var pictures = [];
window.jsonpCallback = function(data) {
  pictures = data;
  pictures.forEach(function(picture) {
    getPictureElement(picture, picturesContainer);
  });
};

var createCallback = function(url, callbackFunction) {
  var scriptEl = document.createElement('script');
  scriptEl.src = url + '?callback=' + callbackFunction;
  document.body.appendChild(scriptEl);
};

createCallback('http://localhost:1506/api/pictures', 'jsonpCallback');

var filters = document.querySelector('.filters');
filters.classList.add('hidden');

var picturesContainer = document.querySelector('.pictures');
var templateElement = document.querySelector('#picture-template');
var elementToClone;

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.picture');
} else {
  elementToClone = templateElement.querySelector('.picture');
}

var IMAGE_LOAD_TIMEOUT = 10000;

var getPictureElement = function(data, container) {
  var element = elementToClone.cloneNode(true);
  container.appendChild(element);

  var newImage = new Image(182, 182);
  var newImageLoadTimeout;
  var image = element.querySelector('img');

  newImage.onload = function(evt) {
    clearTimeout(newImageLoadTimeout);
    image.src = evt.target.src;
    filters.classList.remove('hidden');
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