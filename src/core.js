
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

Crate.prototype.touch = function (rawPath, callback) {
  var that = this;
  this.exists(rawPath, function (exists) {
    if (exists) {
      return callback(null);
    }

    var parentPath = Crate.util.path.dirPath(rawPath);
    that.superblock.resolveInode(parentPath, function (err, inode) {
      if (err) {
        return callback(err);
      }

console.log(inode);
      // create new inode
      // create new dentry
    });
  });
};

Crate.prototype.read = function (path, callback) {

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

Crate.prototype.mkdir = function () {

};

Crate.prototype.ls = function (rawPath, callback) {
  this.superblock.resolveInode(rawPath, function (err, inode) {
    // should we keep . and .. in dentries or fake them?
    // in dentries would be easier to resolve
    var filenames = ['.','..'];

    for (var i in inode.dentries) {
      filenames.push(inode.dentries[i].name);
    }

    callback(null, filenames);
  });
};

Crate.prototype.rm = function (path) {

};

