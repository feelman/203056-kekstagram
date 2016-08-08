function getMessage(a, b) {
  var i;

  if (typeof(a) === 'boolean') {
    if (a) {
      return 'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров';
    }
    else {
      return 'Переданное GIF-изображение не анимировано';
    }
  }

  if (typeof(a) === 'number') {
    return 'Переданное SVG-изображение содержит ' + a + ' объектов ' + 'и ' + (b * 4) + ' атрибутов';
  }

  if (Array.isArray(a)) {
    if (Array.isArray(b)) {
      var artifactsSquare = 0;
      var minLength = Math.min(a.length, b.length);

      for (i = 0; i < minLength; i++) {
        artifactsSquare += a[i] * b[i];
      }
      return 'Общая площадь артефактов сжатия: ' + artifactsSquare + ' пикселей';
    }

    var amountOfRedPoints = 0;
    var arrayLength = a.length;

    for (i = 0; i < arrayLength; i++) {
      amountOfRedPoints += a[i];
    }
    return 'Количество красных точек во всех строчках изображения: ' + amountOfRedPoints;
  }

}
