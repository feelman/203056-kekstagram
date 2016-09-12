'use strict';

var pictureElements;
var Gallery = function() {
  this.pictures = [];
  this.activePicture = 0;
  this.galleryOverlay = document.querySelector('.gallery-overlay');
  this.galleryOverlayClose = document.querySelector('.gallery-overlay-close');
  this.galleryOverlayImage = document.querySelector('.gallery-overlay-image');
  this.likesCount = document.querySelector('.likes-count');
  this.commentsCount = document.querySelector('.comments-count');
};

Gallery.prototype.setPictures = function(pictures) {
  pictureElements = document.querySelectorAll('.picture');
  this.pictures = pictures;
};

Gallery.prototype.show = function(number) {
  this.addEvent();
  this.galleryOverlay.classList.remove('invisible');
  this.setActivePicture(number);
};

Gallery.prototype.hide = function() {
  this.galleryOverlay.classList.add('invisible');
  this.removeEvent();
};

Gallery.prototype.setActivePicture = function(number) {
  while(pictureElements[number].classList.contains('picture-load-failure')) {
    number++;
    if(number === this.pictures.length) {
      number = 0;
    }
  }
  this.activePicture = number;
  this.galleryOverlayImage.src = this.pictures[number].url;
  this.likesCount.textContent = this.pictures[number].likes;
  this.commentsCount.textContent = this.pictures[number].comments;
};

Gallery.prototype.addEvent = function() {
  this.onCloseClick = this.onCloseClick.bind(this);
  this.onPictureClick = this.onPictureClick.bind(this);
  this.galleryOverlayClose.addEventListener('click', this.onCloseClick);
  this.galleryOverlayImage.addEventListener('click', this.onPictureClick);
};

Gallery.prototype.removeEvent = function() {
  this.galleryOverlayClose.removeEventListener('click', this.onCloseClick);
  this.galleryOverlayImage.removeEventListener('click', this.onPictureClick);
};

Gallery.prototype.onCloseClick = function(evt) {
  evt.preventDefault();
  this.hide();
};

Gallery.prototype.onPictureClick = function(evt) {
  evt.preventDefault();
  var nextNumber = this.activePicture;

  if (this.activePicture >= this.activePicture.length - 1) {
    nextNumber = 0;
  } else {
    nextNumber = this.activePicture + 1;
  }
  this.setActivePicture(nextNumber);
};

module.exports = new Gallery();
