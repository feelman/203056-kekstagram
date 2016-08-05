function getMessage(a, b) {
  if (a == true) {
    return 'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров';
  }
  else if (a == false) {
    return 'Переданное GIF-изображение не анимировано';
  }

  else if (a) {
    return 'Переданное SVG-изображение содержит ' + a + ' объектов ' + 'и ' + (b * 4) + ' атрибутов';
  }

  else if (a == []) {
    return 'Количество красных точек во всех строчках изображения: ' + amountOfRedPoints;
  }
}
