'use strict';

var Gallery = require('./gallery');
var load = require('./load');
var Picture = require('./picture');

var picturesContainer = document.querySelector('.pictures');
var footer = document.querySelector('.footer');
var pictures = [];
var PICTURES_LOAD_URL = '/api/pictures';
var THROTTLE_TIMEOUT = 100;
var GAP = 100;
var pageNumber = 0;
var pageSize = 12;
var activeFilter = null;
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
  getEndPage();
};

var loadPictures = function(filter, currentPageNumber) {
  load(PICTURES_LOAD_URL, {
    from: currentPageNumber,
    to: currentPageNumber + pageSize,
    filter: filter
  }, renderPictures);
};

var changeFilter = function(evt) {
  if (evt.target.classList.contains('filters-radio')) {
    picturesContainer.innerHTML = '';
    pageNumber = 0;
    loadPictures(evt.target.id, pageNumber);
  }
};

var lastCall = Date.now();

var getEndPage = function() {
  if(Date.now() - lastCall >= THROTTLE_TIMEOUT) {
    if(footer.getBoundingClientRect().bottom - window.innerHeight <= GAP) {
      loadPictures(activeFilter, pageNumber++);
    }
    lastCall = Date.now();
  }
};

window.addEventListener('scroll', getEndPage);
filters.addEventListener('change', changeFilter, true);

loadPictures(activeFilter, pageNumber++);
