'use strict';

var Gallery = require('./gallery');

var templateElement = document.querySelector('#picture-template');
var elementToClone;

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.picture');
} else {
  elementToClone = templateElement.querySelector('.picture');
}

var IMAGE_LOAD_TIMEOUT = 10000;

var Picture = function(data, number) {
  this.data = data;
  this.number = number;
  this.element = elementToClone.cloneNode(true);
  this.image = this.setImage();
  this.showGallery = this.showGallery.bind(this);
  this.element.addEventListener('click', this.showGallery);
};

Picture.prototype.showGallery = function(evt) {
  evt.preventDefault();
  Gallery.show(this.number);
};

Picture.prototype.setImage = function() {
  var self = this;
  var newImage = new Image(182, 182);
  var newImageLoadTimeout;
  var image = this.element.querySelector('img');

  newImage.onload = function(evt) {
    clearTimeout(newImageLoadTimeout);
    image.src = evt.target.src;
    var filtersHideOff = require('./pictures');
    filtersHideOff();
  };

  newImage.onerror = function() {
    this.element.classList.add('picture-load-failure');
  }.bind(this);

  newImage.src = self.data.url;

  newImageLoadTimeout = setTimeout(function() {
    image.src = '';
    self.element.classList.add('picture-load-failure');
  }, IMAGE_LOAD_TIMEOUT);
};

Picture.prototype.remove = function() {
  this.element.removeEventListener('click', this.shownGallery);
};

module.exports = Picture;
