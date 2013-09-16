
(function () {

'use strict';

var LocalStorage = Crate.drivers.localStorage = function (options) {
  options = options || {};
  this.prefix = options.prefix || '_crate';
  this.bootstrap();
};

LocalStorage.prototype.bootstrap = function () {

};

LocalStorage.prototype.load = function (data, callback) {
  callback && callback();
};

LocalStorage.prototype.getKey = function (name) {
  var key = this.prefix + '_' + name;
  var data = localStorage[key];

  try {
    data = JSON.parse(data);
  } catch (e) {}

  return data && data.value;
};

LocalStorage.prototype.setKey = function (name, value) {
  var key = this.prefix + '_' + name;
  var data = JSON.stringify({
    value: value
  });
  return localStorage[key] = data;
};

LocalStorage.prototype.removeKey = function (name) {
  var key = this.prefix + '_' + name;
  return localStorage.removeItem(key);
};

LocalStorage.prototype.getId = function () {
  if (!this.getKey('idCounter')) {
    this.setKey('idCounter', 0);
  }

  var id = parseInt(this.getKey('idCounter'), 10);
  id += 1;
  this.setKey('idCounter', id);

  return id;
};

/*
 * inode operations
 */

LocalStorage.prototype.createInode = function (callback) {
  var id = this.getId();
  var key = 'inode_' + id;

  if (this.getKey(key)) {
    callback('Inode already exists');
  }

  var inode = {};
  inode.id = id;
  this.setKey(key, inode);

  callback(null, inode);
};

LocalStorage.prototype.readInode = function (id, callback) {
  var key = 'inode_' + id;
  var data = this.getKey(key);

  if (!data) {
    return callback('Inode not found');
  }

  callback(null, data);
};

LocalStorage.prototype.updateInode = function (data, callback) {
  var id = data.id;
  var key = 'inode_' + id;
  this.setKey(key, data);
  callback(null);
};

LocalStorage.prototype.deleteInode = function (id, callback) {
  var key = 'inode_' + id;
  this.removeKey(key);
  callback(null);
};

/*
 * file operations
 */

LocalStorage.prototype.createFile = function (callback) {
  var id = this.getId();
  var key = 'file_' + id;

  if (this.getKey(key)) {
    callback('File already exists');
  }

  var fileData = new String();
  this.setKey(key, fileData);

  callback(null, id);
};

LocalStorage.prototype.readFile = function (id, callback) {
  var key = 'file_' + id;
  var data = this.getKey(key);

  if (typeof data == 'undefined') {
    return callback('File not found');
  }

  callback(null, data);
};

LocalStorage.prototype.updateFile = function (id, data, callback) {
  var key = 'file_' + id;
  this.setKey(key, data);
  callback(null);
};

LocalStorage.prototype.deleteFile = function (id, callback) {
  var key = 'file_' + id;
  this.removeKey(key);
  callback(null);
};

})();
