'use strict';

var Gallery = require('./gallery');
var load = require('./load');
var Picture = require('./picture');

var picturesContainer = document.querySelector('.pictures');
var pictures = [];
var PICTURES_LOAD_URL = 'http://localhost:1506/api/pictures';
var filters = document.querySelector('.filters');
filters.classList.add('hidden');

module.exports = function filtersHideOff() {
  filters.classList.remove('hidden');
};

var renderPictures = function(data) {
  pictures = data;
  pictures.forEach(function(picture, number) {
    picture = new Picture(picture, number);
    picturesContainer.appendChild(picture.element);
  });
  Gallery.setPictures(pictures);
};

load(PICTURES_LOAD_URL, renderPictures);
