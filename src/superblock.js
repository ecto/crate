
(function () {

'use strict';

var Superblock = Crate.Superblock = function (callback) {
  this.inodes = {};

  this.sync(callback);
};

Superblock.prototype.createInode = function () {

};

Superblock.prototype.destroyInode = function () {

};

Superblock.prototype.dirtyInode = function () {

};

Superblock.prototype.writeInode = function () {

};

Superblock.prototype.deleteInode = function () {

};

Superblock.prototype.write = function () {

};

Superblock.prototype.sync = function (callback) {
  callback && callback(null);
};

})();
