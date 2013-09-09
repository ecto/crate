
(function () {

'use strict';

var Inode = Crate.Inode = function (options) {
  options = options || {};

  this.id = options.id;
  this.superblock = options.superblock;
  this.dentries = [];
  this.links = 0;
  this.dirty = true; // ?
  this.isDirectory = false;

  this.ctime = +new Date();
  this.mtime = +new Date();
  this.atime = 0; // never accessed? what is POSIX default?

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

  // create a self link
  var dentry = new Crate.Dentry({
    name: '.',
    id: this.id
  });
  this.dentries.push(dentry);
};

Inode.prototype.serialize = function () {
  var dentries = [];
  for (var i in this.dentries) {
    dentries.push(this.dentries[i].serialize());
  }

  var data = {
    id: this.id,
    uid: this.uid,
    dentries: dentries,
    links: this.links,
    atime: this.atime,
    mtime: this.mtime,
    ctime: this.ctime,
    mode: this.mode,
    version: this.version,
    size: this.size,
  };

  return data;
};

Inode.prototype.deserialize = function () {

};

Inode.prototype.lookup = function (name, callback) {
  for (var i in this.dentries) {
    if (this.dentries[i].name == name) {
      return this.superblock.loadInode(this.dentries[i].id, function (err, inode) {
        callback(err, inode, i);
      });
    }
  };

  callback('Could not find child');
};

// deserialize?
Inode.prototype.load = function (data) {
  // attach data to inode
  console.log('inode load', data);
};

Inode.prototype.link = function (options, callback) {
  var that = this;
  var name = options.name;
  var child = options.child;

  if (!name || !child) {
    return callback('Must supply name and child');
  }

  // check for existing link
  this.lookup(name, function (err, inode) {
    if (inode) {
      return callback('Link exists');
    }

    // create dentry
    var dentry = new Crate.Dentry({
      id: child.id,
      name: name
    });
    that.dentries.push(dentry);

    // child links++
    child.links++;
    
    // set this as parent (..)
    var childDentry = new Crate.Dentry({
      id: that.id,
      name: '..'
    });
    child.dentries.push(childDentry);

    // mark both as dirty
    that.dirty = true;
    child.dirty = true; // :(

    callback(null);
  });
};

Inode.prototype.unlink = function (name, callback) {
  if (!name) {
    return callback('Must supply name');
  }

  var that = this;

  // check for existing dentry
  this.lookup(name, function (err, inode, i) {
    if (!inode) {
      return callback('Link does not exist');
    }

    // remove dentry
    that.dentries.splice(i, 1);
    
    // child links--
    inode.links--;
    
    // remove this as parent (..) ?

    // mark both as dirty
    that.dirty = true;
    inode.dirty = true;

    callback(null);
  });
};

Inode.prototype.mkdir = function (dirname, callback) {
  var that = this;

  that.superblock.createInode(function (err, inode) {
    if (err) {
      return callback(err);
    }

    that.link({
      name: dirname,
      child: inode
    }, function (err) {
      inode.isDirectory = true;
      inode.dirty = true;

      callback(err, inode);
    });
  });
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
