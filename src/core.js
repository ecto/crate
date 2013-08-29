
'use strict';

var Crate = function Crate (options) {
  options = options || {};

  var driver = options.driver || 'memory';
  this.driver = new Crate.drivers[driver];
};

Crate.drivers = {};

Crate.prototype.load = function (data) {
  this.driver.load(data);  

  this.superblock = new Crate.Superblock();
};

Crate.prototype.save = function () {
  this.driver.save(data);  
};

Crate.prototype.sync = function () {
  this.driver.sync(data);
};

Crate.prototype.on = function (eventName, listener) {
  
};

Crate.prototype.emit = function (eventName, data) {

};

/*
 * API calls
 */

Crate.prototype.read = function (path) {

};

Crate.prototype.write = function (path, data) {

};

Crate.prototype.exists = function () {

};

Crate.prototype.ls = function (path) {

};

Crate.prototype.rm = function (path) {

};

Crate.prototype.touch = function (path) {

};

