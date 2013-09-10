
'use strict';

var Crate = function Crate (options) {
  options = options || {};

  var driver = options.driver || 'memory';
  this.driver = new Crate.drivers[driver];

  this.listeners = {};
  this.cwd = '/';

  this.superblock = new Crate.Superblock({
    system: this
  });
};

Crate.drivers = {};

Crate.prototype.load = function (data, callback) {
  this.driver.load(data, callback);
};

Crate.prototype.save = function (data, callback) {
  this.driver.save(data, callback);
};

Crate.prototype.sync = function () {
  this.superblock.sync(data);
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

Crate.prototype.touch = function (rawPath, callback) {
  var that = this;

  this.exists(rawPath, function (exists) {
    if (exists) {
      return callback('Path exists');
    }

    var filename = Crate.util.path.filename(rawPath);
    var parentPath = Crate.util.path.dirPath(rawPath);

    that.superblock.resolveInode(parentPath, function (err, inode) {
      if (err) {
        return callback(err);
      }

      // create new inode
      that.superblock.createInode(function (err, newInode) {
        // link parent to child
        inode.link({
          name: filename,
          child: newInode
        }, function (err) {
          // create empty file
          // this may not be the right place to do so
          that.driver.createFile(function (err, id) {
            newInode.fileId = id;
            that.superblock.dirtyInode(newInode);
            callback(err, newInode);
          });
        });
      });
    });
  });
};

Crate.prototype.open = function (rawPath, callback) {
  var that = this;

  that.superblock.resolveInode(rawPath, function (err, inode) {
    if (err) {
      return callback(err);
    }

    var file = new Crate.File({
      id: inode.fileId,
      system: that
    });

    callback(null, file);
  });
};

Crate.prototype.write = function (rawPath, data, callback) {
  var that = this;

  this.exists(rawPath, function (exists) {
    if (exists) {
      write();
    } else {
      console.log('path does not exist');
      // create
      //write();
    }
  });

  function write () {
    this.superblock.resolveInode(rawPath, function (err, inode) {
      if (err) {
        return callback(err);
      }

console.log('getting file from inode');
      inode.getFile(function () {

      });
    });
  }
};

Crate.prototype.exists = function (rawPath, callback) {
  this.superblock.resolveInode(rawPath, function (err, inode) {
    if (!err && inode) {
      callback(true);
    } else {
      callback(false);
    }
  });
};

Crate.prototype.mkdir = function (rawPath, callback) {
  // get parent inode
  // tell it to mkdir
  // callback with new inode
  var that = this;
  var dirname = Crate.util.path.filename(rawPath);
  var parentPath = Crate.util.path.dirPath(rawPath);

  that.superblock.resolveInode(parentPath, function (err, inode) {
    if (err) {
      return callback(err);
    }

    inode.mkdir(dirname, function (err, newInode) {
      callback(err, newInode);
    });
  });
};

Crate.prototype.ls = function (rawPath, callback) {
  this.superblock.resolveInode(rawPath, function (err, inode) {
    var filenames = [];

    // we should loop through inodes and provide an array
    // containing objects with
    // { name, isDirectory, mime? }
    for (var i in inode.dentries) {
      filenames.push(inode.dentries[i].name);
    }

    callback(null, filenames);
  });
};

Crate.prototype.rm = function (rawPath, callback) {
  var that = this;

  this.exists(rawPath, function (exists) {
    if (!exists) {
      return callback(null);
    }

    var filename = Crate.util.path.filename(rawPath);
    var parentPath = Crate.util.path.dirPath(rawPath);

    that.superblock.resolveInode(parentPath, function (err, inode) {
      if (err) {
        return callback(err);
      }

      // unlink child from parent
      inode.unlink(filename, function (err) {
        callback(err);
      });
    });
  });
};

Crate.prototype.stat = function (rawPath, callback) {
  this.superblock.resolveInode(rawPath, function (err, inode) {
    if (err) {
      return callback(err);
    }

    var info = {
      id: inode.id,
      uid: null,
      version: 0,
      isDirectory: inode.isDirectory
      // size
      // atime
      // mtime
      // ctime
      // mode
    };

    callback(null, info);
  });
};

Crate.prototype.cd = function (rawPath, callback) {
  var that = this;
  var realPath = Crate.util.path.resolve(this.cwd, rawPath);

  that.superblock.resolveInode(realPath, function (err, inode) {
    if (err) {
      return callback(err);
    }

    that.cwd = realPath;
    callback(null, inode);
  });
};
