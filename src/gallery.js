'use strict';

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
  this.pictures = pictures;
};

Gallery.prototype.show = function(number) {
  this.onCloseClick();
  this.onPictureClick();
  this.galleryOverlay.classList.remove('invisible');
  this.setActivePicture(number);
};

Gallery.prototype.hide = function() {
  this.galleryOverlay.classList.add('invisible');
  this.galleryOverlayClose.onlick = null;
  this.galleryOverlayImage.onlick = null;
};

Gallery.prototype.setActivePicture = function(number) {
  this.activePicture = number;
  this.galleryOverlayImage.src = this.pictures[number].url;
  this.likesCount.textContent = this.pictures[number].likes;
  this.commentsCount.textContent = this.pictures[number].comments;
};

Gallery.prototype.onCloseClick = function() {
  var self = this;

  this.galleryOverlayClose.onclick = function() {
    self.hide();
  };
};

Gallery.prototype.onPictureClick = function() {
  var self = this;
  var nextNumber;

  this.galleryOverlayImage.onclick = function() {
    if (self.activePicture >= self.activePicture.length - 1) {
      nextNumber = 0;
    } else {
      nextNumber = self.activePicture + 1;
    }
    self.setActivePicture(nextNumber);
  };
};

module.exports = new Gallery();
