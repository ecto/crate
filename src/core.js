
'use strict';

var Crate = function Crate (options) {
  options = options || {};

  var driver = options.driver || 'memory';
  this.driver = new Crate.drivers[driver];

  this.listeners = {};

  this.superblock = new Crate.Superblock({
    system: this
  });
};

Crate.drivers = {};

Crate.prototype.load = function (data, callback) {
  this.driver.load(data, callback);
};

Crate.prototype.save = function () {
  this.driver.save(data);
};

Crate.prototype.sync = function () {
  this.driver.sync(data);
};

Crate.prototype.on = function (eventName, listener) {
  if (!this.listeners[eventName]) {
    this.listeners[eventName] = [];
  }

  this.listeners[eventName].push(listener);
};

Crate.prototype.emit = function (eventName, data) {
  for (var i in this.listeners[eventName]) {
    this.listeners[eventName][i](data);
  }
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

Crate.prototype.ls = function (rawPath, callback) {
  this.superblock.resolveInode(rawPath, function () {
console.log(arguments);
    callback(null, []); // Object.keys(inode.dentries)
  });
};

Crate.prototype.rm = function (path) {

};

Crate.prototype.touch = function (path) {

};

