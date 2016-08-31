'use strict';

var Gallery = require('./gallery');
var load = require('./load');
var getPictureElement = require('./picture');

var picturesContainer = document.querySelector('.pictures');
var pictures = [];
var PICTURES_LOAD_URL = 'http://localhost:1506/api/pictures';
var filters = document.querySelector('.filters');
filters.classList.add('hidden');

module.exports = function filtersHideOff() {
  filters.classList.remove('hidden');
};

window.jsonpCallback = function(data) {
  pictures = data;
  pictures.forEach(function(picture, number) {
    getPictureElement(picture, picturesContainer, number);
  });
  Gallery.setPictures(pictures);
};

load(PICTURES_LOAD_URL, 'jsonpCallback');
