'use strict';

var Gallery = require('./gallery');
var BaseComponent = require('./base-component');
var inherit = require('./inherit');

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
  BaseComponent.call(this, this.getElement());
  this.onclick = this.onclick.bind(this);
  this.element.addEventListener('click', this.onclick);
};

inherit(Picture, BaseComponent);

Picture.prototype.onclick = function(evt) {
  evt.preventDefault();
  Gallery.show(this.number);
};

Picture.prototype.getElement = function() {
  this.element = elementToClone.cloneNode(true);
  this.image = this.setImage();
  return this.element;
};

Picture.prototype.setImage = function() {
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

  newImage.src = this.data.url;

  newImageLoadTimeout = setTimeout(function() {
    image.src = '';
    this.element.classList.add('picture-load-failure');
  }.bind(this), IMAGE_LOAD_TIMEOUT);
};

Picture.prototype.remove = function() {
  this.element.removeEventListener('click', this.onclick);
  BaseComponent.prototype.remove.call(this);
};

module.exports = Picture;
