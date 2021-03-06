/* global Resizer: true */

/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';

(function() {
  /** @enum {string} */
  var FileType = {
    'GIF': '',
    'JPEG': '',
    'PNG': '',
    'SVG+XML': ''
  };

  /** @enum {number} */
  var Action = {
    ERROR: 0,
    UPLOADING: 1,
    CUSTOM: 2
  };

  /**
   * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
   * из ключей FileType.
   * @type {RegExp}
   */
  var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

  /**
   * @type {Object.<string, string>}
   */
  var filterMap;

  /**
   * Объект, который занимается кадрированием изображения.
   * @type {Resizer}
   */
  var currentResizer;

  /**
   * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
   * изображением.
   */
  function cleanupResizer() {
    if (currentResizer) {
      currentResizer.remove();
      currentResizer = null;
    }
  }

  /**
   * Ставит одну из трех случайных картинок на фон формы загрузки.
   */
  function updateBackground() {
    var images = [
      'img/logo-background-1.jpg',
      'img/logo-background-2.jpg',
      'img/logo-background-3.jpg'
    ];

    var backgroundElement = document.querySelector('.upload');
    var randomImageNumber = Math.round(Math.random() * (images.length - 1));
    backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
  }

  /**
   * Проверяет, валидны ли данные, в форме кадрирования.
   * @return {boolean}
   */
  function resizeFormIsValid() {
    return true;
  }

  /**
   * Форма загрузки изображения.
   * @type {HTMLFormElement}
   */
  var uploadForm = document.forms['upload-select-image'];

  /**
   * Форма кадрирования изображения.
   * @type {HTMLFormElement}
   */
  var resizeForm = document.forms['upload-resize'];

  /**
   * Форма добавления фильтра.
   * @type {HTMLFormElement}
   */
  var filterForm = document.forms['upload-filter'];

  /**
   * @type {HTMLImageElement}
   */
  var filterImage = filterForm.querySelector('.filter-image-preview');

  /**
   * @type {HTMLElement}
   */
  var uploadMessage = document.querySelector('.upload-message');

  /**
   * @param {Action} action
   * @param {string=} message
   * @return {Element}
   */
  function showMessage(action, message) {
    var isError = false;

    switch (action) {
      case Action.UPLOADING:
        message = message || 'Кексограмим&hellip;';
        break;

      case Action.ERROR:
        isError = true;
        message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
        break;
    }

    uploadMessage.querySelector('.upload-message-container').innerHTML = message;
    uploadMessage.classList.remove('invisible');
    uploadMessage.classList.toggle('upload-message-error', isError);
    return uploadMessage;
  }

  function hideMessage() {
    uploadMessage.classList.add('invisible');
  }

  /**
   * Обработчик изменения изображения в форме загрузки. Если загруженный
   * файл является изображением, считывается исходник картинки, создается
   * Resizer с загруженной картинкой, добавляется в форму кадрирования
   * и показывается форма кадрирования.
   * @param {Event} evt
   */
  uploadForm.addEventListener('change', function(evt) {
    var element = evt.target;
    if (element.id === 'upload-file') {
      // Проверка типа загружаемого файла, тип должен быть изображением
      // одного из форматов: JPEG, PNG, GIF или SVG.
      if (fileRegExp.test(element.files[0].type)) {
        var fileReader = new FileReader();

        showMessage(Action.UPLOADING);

        fileReader.onload = function() {
          cleanupResizer();

          currentResizer = new Resizer(fileReader.result);
          currentResizer.setElement(resizeForm);
          uploadMessage.classList.add('invisible');

          uploadForm.classList.add('invisible');
          resizeForm.classList.remove('invisible');

          hideMessage();

          formChecker();
        };

        fileReader.readAsDataURL(element.files[0]);
      } else {
        // Показ сообщения об ошибке, если формат загружаемого файла не поддерживается
        showMessage(Action.ERROR);
      }
    }
  });

  function formChecker() {
    var sizeLeft = document.querySelector('#resize-x');
    var sizeTop = document.querySelector('#resize-y');
    var sizeSide = document.querySelector('#resize-size');
    var buttonForward = document.querySelector('#resize-fwd');

    sizeLeft.addEventListener('input', function() {
      checkFormInputs(sizeLeft, sizeTop, sizeSide, buttonForward);
    });
    sizeTop.addEventListener('input', function() {
      checkFormInputs(sizeLeft, sizeTop, sizeSide, buttonForward);
    });
    sizeSide.addEventListener('input', function() {
      checkFormInputs(sizeLeft, sizeTop, sizeSide, buttonForward);
    });
  }

  var checkFormInputs = function(sizeLeft, sizeTop, sizeSide, buttonForward) {
    if (parseInt(sizeLeft.value, 10) + parseInt(sizeSide.value, 10) > currentResizer._image.naturalWidth || parseInt(sizeTop.value, 10) + parseInt(sizeSide.value, 10) > currentResizer._image.naturalHeight || parseInt(sizeLeft.value, 10) < 0 || parseInt(sizeTop.value, 10) < 0 || parseInt(sizeLeft.value, 10) > currentResizer._image.naturalWidth || parseInt(sizeTop.value, 10) > currentResizer._image.naturalHeight) {
      buttonForward.disabled = true;
    } else {
      buttonForward.disabled = false;
    }
  };

  var resizeControls = document.querySelector('.upload-resize-controls');
  var sizeLeft = document.querySelector('#resize-x');
  var sizeTop = document.querySelector('#resize-y');
  var sizeSide = document.querySelector('#resize-size');

  function changeResizer(evt) {
    if (evt.target.classList.contains('upload-resize-control')) {
      uploadResizer();
    }
  }

  function uploadResizer() {
    currentResizer.setConstraint(Number(sizeLeft.value), Number(sizeTop.value), Number(sizeSide.value));
  }

  function calculateResize() {
    sizeLeft.value = currentResizer.getConstraint().x;
    sizeTop.value = currentResizer.getConstraint().y;
    sizeSide.value = currentResizer.getConstraint().side;
  }

  resizeControls.addEventListener('change', changeResizer);
  window.addEventListener('resizerchange', calculateResize);

  // Сохраняем в cookies последний выбранный фильтр
  var browserCookies = require('browser-cookies');
  var submitButton = document.querySelector('#filter-fwd');
  var elems = filterForm['upload-filter'];
  var defaultFilter = elems[0].value;
  elems.value = browserCookies.get('upload-filter') || defaultFilter;
  submitButton.addEventListener('click', function() {
    browserCookies.set('upload-filter', elems.value, {expires: days});
  });

  // Считаем дату рождения Грейс, в зависимости от текущей даты
  var now = new Date();
  var yearNow = now.getFullYear();
  var yearLast = yearNow - 1;
  var birthdayGrace = new Date(yearNow, 11, 9);

  if (now >= birthdayGrace) {
    birthdayGrace = new Date(yearNow, 11, 9);
  } else {
    birthdayGrace = new Date(yearLast, 11, 9);
  }

  // Считаем количество дней жизни cookie
  var diff = now - birthdayGrace;
  var milliseconds = diff;
  var seconds = milliseconds / 1000;
  var minutes = seconds / 60;
  var hours = minutes / 60;
  var days = hours / 24;

  /**
   * Обработка сброса формы кадрирования. Возвращает в начальное состояние
   * и обновляет фон.
   * @param {Event} evt
   */
  resizeForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  });

  /**
   * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
   * кропнутое изображение в форму добавления фильтра и показывает ее.
   * @param {Event} evt
   */
  resizeForm.addEventListener('submit', function(evt) {
    evt.preventDefault();

    if (resizeFormIsValid()) {
      var image = currentResizer.exportImage().src;

      var thumbnails = filterForm.querySelectorAll('.upload-filter-preview');
      for (var i = 0; i < thumbnails.length; i++) {
        thumbnails[i].style.backgroundImage = 'url(' + image + ')';
      }

      filterImage.src = image;

      resizeForm.classList.add('invisible');
      filterForm.classList.remove('invisible');
    }
  });

  /**
   * Сброс формы фильтра. Показывает форму кадрирования.
   * @param {Event} evt
   */
  filterForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  });

  /**
   * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
   * записав сохраненный фильтр в cookie.
   * @param {Event} evt
   */
  filterForm.addEventListener('submit', function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    filterForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  });

  /**
   * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
   * выбранному значению в форме.
   */
  filterForm.addEventListener('change', function() {
    if (!filterMap) {
      // Ленивая инициализация. Объект не создается до тех пор, пока
      // не понадобится прочитать его в первый раз, а после этого запоминается
      // навсегда.
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia',
        'marvin': 'filter-marvin'
      };
    }

    var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
      return item.checked;
    })[0].value;

    // Класс перезаписывается, а не обновляется через classList потому что нужно
    // убрать предыдущий примененный класс. Для этого нужно или запоминать его
    // состояние или просто перезаписывать.
    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
  });

  cleanupResizer();
  updateBackground();
})();
