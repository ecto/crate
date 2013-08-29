
(function () {

'use strict';

var Memory = Crate.drivers.memory = function () {
  alert('hi from driver!');
};

Memory.prototype.load = function () {
  this.data = {};
};

Memory.prototype.save = function () {
  console.log(this.data);
};

})();
