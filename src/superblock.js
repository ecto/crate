
(function () {

'use strict';

var Superblock = Crate.Superblock = function (options, callback) {
  this.inodes = {};
  this.rootNode = options.rootNode || 1;
  this.system = options.system;

  if (!this.system) {
    // throw or callback with err?
  }

  this.bootstrap(function (err) {
    callback && callback();
    // this.loadInode(this.rootNode, function (err, inode) { });
  });
};

// create a root inode
Superblock.prototype.bootstrap = function (callback) {
  this.createInode(function (err, inode) {
    inode.isDirectory = true;
    inode.dirty = true;

    // manually create a parent link to itself
    inode.dentries.push({
      name: '..',
      id: inode.id
    });

    callback();
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

Superblock.prototype.createInode = function (callback) {
  var that = this;

  this.system.driver.createInode(function (err, tempNode) {
    if (err) {
      callback(err);
      return;
    }

    var inode = new Crate.Inode({
      id: tempNode.id,
      superblock: that
    });
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
    // TODO should we be creating inodes here or erring?
    if (err || !inode) {
      that.createInode(callback);
      return;
    }

    var inode = new Crate.Inode({
      id: data.id,
      superblock: that
    });
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
