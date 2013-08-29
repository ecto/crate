
(function () {

'use strict';

var Inode = Crate.Inode = function (superblock) {
  this.superblock = superblock;
  this.dentries = [];

  // id
  // uid
  // version
  // size
  // atime
  // mtime
  // ctime
  // mode?
  // parent (dentry?)
  // inodes?
  // dentries
};

Inode.prototype.lookup = function (name, callback) {
  for (var i in this.dentries) {
    if (this.dentries[i].name == name) {
      this.superblock.loadInode(this.dentries[i].childId, function (err, inode) {
        return callback(err, inode);
      });
    }
  };

  callback('Could not find child');
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
