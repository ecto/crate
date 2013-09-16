
(function () {

'use strict';

var Superblock = Crate.Superblock = function (options, callback) {
  this.inodes = {};
  this.rootNode = options.rootNode || 1;
  this.system = options.system;
  this.syncInterval = 1000;

  if (!this.system) {
    // throw or callback with err?
  }

  var that = this;
  that.bootstrap(function (err) {
    callback && callback();

    setInterval(function () {
      that.sync();
    }, that.syncInterval);
  });
};

// create a root inode
Superblock.prototype.bootstrap = function (callback) {
  var that = this;

  that.loadInode(that.rootNode, function (err) {
    if (!err) {
      // root node already exists
      return callback();
    }

    that.createInode(function (err, inode) {
      inode.isDirectory = true;
      that.dirtyInode(inode);

      // manually create a self link
      var dentry = new Crate.Dentry({
        name: '.',
        id: inode.id
      });
      inode.dentries.push(dentry);

      // manually create a parent link to itself
      var dentry = new Crate.Dentry({
        name: '..',
        id: inode.id
      });
      inode.dentries.push(dentry);

      callback();
    });
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

  this.system.driver.readInode(id, function (err, data) {
    if (err || !data) {
      return callback('Inode does not exist');
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

Superblock.prototype.dirtyInode = function (inode) {
  inode.mtime = +new Date();
  inode.dirty = true;
};

Superblock.prototype.updateInode = function (id, callback) {
  var that = this;
  var inode = this.inodes[id];
  var data = inode.serialize();

  that.system.driver.updateInode(data, function (err) {
    that.inodes[id].dirty = false;
    callback(err);
  });
};

Superblock.prototype.deleteInode = function (id, callback) {
  var that = this;
  var inode = this.inodes[id];
  console.log(inode);

  that.system.driver.deleteInode(id, function (err) {
    if (!inode.isDirectory) {
      that.system.driver.deleteFile(inode.fileId, function (err) {
        callback(err);
      });
      return;
    }

    callback(err);
  });
};

Superblock.prototype.write = function () {
};

// TODO what if save takes longer than syncInterval?
Superblock.prototype.sync = function (callback) {
  for (var i in this.inodes) {
    if (this.inodes[i].dirty) {
      this.updateInode(this.inodes[i].id, function (err) {
      });
    }
  }
};

})();
