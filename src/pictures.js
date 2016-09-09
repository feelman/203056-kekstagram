'use strict';

(function() {

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
  var lastCall = Date.now();
  var filters = document.querySelector('.filters');
  filters.classList.add('hidden');

  module.exports = function filtersHideOff() {
    filters.classList.remove('hidden');
  };

  var getEndPage = function() {
    if(Date.now() - lastCall >= THROTTLE_TIMEOUT) {
      if(footer.getBoundingClientRect().bottom - window.innerHeight <= GAP) {
        loadPictures(activeFilter, pageNumber++);
      }
      lastCall = Date.now();
    }
  };

  var changeFilter = function(evt) {
    if (evt.target.classList.contains('filters-radio')) {
      picturesContainer.innerHTML = '';
      pageNumber = 0;
      activeFilter = evt.target.id;
      loadPictures(evt.target.id, pageNumber);
      localStorage.setItem('defaultFilterStorage', activeFilter);
    }
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

  var isBottomReached = function() {
    var footerPosition = footer.getBoundingClientRect();
    return footerPosition.top - window.innerHeight - 100 <= GAP;
  };

  var loadPictures = function(filter, currentPageNumber) {
    do {
      load(PICTURES_LOAD_URL, {
        from: currentPageNumber * pageSize,
        to: currentPageNumber * pageSize + pageSize,
        filter: filter
      }, renderPictures);
    } while (!isBottomReached);
  };

  window.addEventListener('scroll', getEndPage);
  filters.addEventListener('change', changeFilter, true);

  loadPictures(activeFilter, pageNumber++);

})();
