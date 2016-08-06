function getMessage(a, b) {
  if (a == true) {
    return 'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров';
  }

  else if (a == false) {
    return 'Переданное GIF-изображение не анимировано';
  }

  else if (+a) {
    return 'Переданное SVG-изображение содержит ' + a + ' объектов ' + 'и ' + (b * 4) + ' атрибутов';
  }

  else if ([], b == undefined) {
    var amountOfRedPoints = 0;
    for (var i = 0; i < a.length; i++) {
      amountOfRedPoints += a[i];
    }
    return 'Количество красных точек во всех строчках изображения: ' + amountOfRedPoints;
  }

  else if ([],[]) {
    var artifactsSquare = 0;
    for (var i = 0; i < b.length; i++) {
      artifactsSquare += a[i] * b[i];
    }
    return 'Общая площадь артефактов сжатия: ' + artifactsSquare + ' пикселей';
  }

}
