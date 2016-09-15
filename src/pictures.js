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
  var filters = document.querySelector('.filters');
  filters.classList.add('hidden');

  module.exports = function filtersHideOff() {
    filters.classList.remove('hidden');
  };

  var getEndPage = function() {
    if(footer.getBoundingClientRect().bottom - window.innerHeight <= GAP) {
      loadPictures(activeFilter, pageNumber++);
    }
  };

  var optimizedScroll = throttle(getEndPage, THROTTLE_TIMEOUT);

  function throttle(performFunction, delay) {
    var isThrottled = false;
    var saveArguments = null;
    var saveThis = null;

    function wrapper() {
      if (isThrottled) {
        saveArguments = arguments;
        saveThis = this;
        return;
      }

      performFunction.apply(this, arguments);

      isThrottled = true;

      setTimeout(function() {
        isThrottled = false;
        if (saveArguments) {
          wrapper.apply(saveThis, saveArguments);
          saveArguments = null;
          saveThis = null;
        }
      }, delay);
    }
    return wrapper;
  }

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
    optimizedScroll();
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

  window.addEventListener('scroll', optimizedScroll);
  filters.addEventListener('change', changeFilter, true);

  loadPictures(activeFilter, pageNumber++);

})();
