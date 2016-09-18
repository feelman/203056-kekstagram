'use strict';

var inherit = function(childComponent, inheritComponent) {
  var Empty = function() {};
  Empty.prototype = inheritComponent.prototype;
  childComponent.prototype = new Empty();
};

module.exports = inherit;
