
(function () {

'use strict';

var Superblock = Crate.Superblock = function (options, callback) {
  this.inodes = {};
  this.rootNode = options.rootNode || 1;
  this.system = options.system;

  if (!this.system) {
    // throw or callback with err?
  }

  this.loadInode(this.rootNode, function (err, inode) {
    callback && callback();
  });
};

Superblock.prototype.resolveInode = function (rawPath, callback) {
  var path = Crate.util.path.parse(rawPath);

  // recurse path into lowest inode starting at root
  recurse(this.inodes[this.rootNode], path, callback);

  function recurse (inode, path, callback) {
    // fully followed path
    if (!path.length) {
      return callback(null, inode);
    }

    var current = path.shift();

    // if current == null, pass
    // e.g. /foo//bar or /
    if (!current) {
      return recurse(inode, path, callback);
    }

    // look current up in the current inode's dentries
    inode.lookup(current, function (err, inode) {
      if (err) {
        return callback(err);
      }

      recurse(inode, path, callback);
    });
  }
};

Superblock.prototype.createInode = function (id, /*parentId,*/ callback) {
  var that = this;

  this.system.driver.createInode(id, function (err) {
    if (err) {
      callback(err);
      return;
    }

    var inode = new Crate.Inode(that);
    inode.id = id;

/*
    // TODO save inode with dentries
    // or dirty the inode?

    var currentDentry = new Crate.Dentry();
    currentDentry.parentInode = id;
    currentDentry.childInode = id;
    currentDentry.name = '.';
    inode.dentries.push(currentDentry);

    var parentDentry = new Crate.Dentry();
    parentDentry.parentInode = id;
    parentDentry.childInode = parentId;
    parentDentry.name = '..';
    inode.dentries.push(parentDentry);
*/

    that.cacheInode(inode);
    callback(null, inode);
  });
};

Superblock.prototype.loadInode = function (id, callback) {
  if (this.inodes[id]) {
    callback(null, this.inodes[id]);
    return;
  }

  var that = this;

  this.system.driver.loadInode(id, function (err, data) {
    if (err || !inode) {
      that.createInode(id, callback);
      return;
    }

    var inode = new Crate.Inode(that);
    inode.load(data);

    that.cacheInode(inode);
    callback(null, inode);
  });
};

Superblock.prototype.cacheInode = function (inode) {
  this.inodes[inode.id] = inode;
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
};

})();
