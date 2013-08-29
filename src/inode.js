
(function () {

'use strict';

var Inode = Crate.Inode = function (superblock) {
  this.superblock = superblock;

  // id
  // uid
  // version
  // size
  // atime
  // mtime
  // ctime
  // mode?
  // parent (dentry?)
  // inodes
  // dentries
};

Inode.prototype.lookup = function (name, callback) {
  for (var i in this.dentries) {
    console.log(i);
    callback('failed');
  };
};

Inode.prototype.load = function (data) {
  // attach data to inode
  console.log('inode load', data);
};

Inode.prototype.link = function () {

};

Inode.prototype.unlink = function () {

};

Inode.prototype.mkdir = function () {

};

Inode.prototype.rmdir = function () {

};

Inode.prototype.mknod = function () {

};

Inode.prototype.rename = function () {

};

Inode.prototype.truncate = function () {

};

Inode.prototype.setattr = function () {

};

Inode.prototype.getattr = function () {

};

Inode.prototype.removeattr = function () {

};

Inode.prototype.listattr = function () {

};

})();
