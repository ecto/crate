
(function () {

'use strict';

var CryptonDriver = Crate.drivers.crypton = function (options) {
  options = options || {};
  this.session = options.session;
  this.prefix = options.prefix || '_crate';

  if (!options.session) {
    throw new Error('Must supply Crypton session to Crate driver');
  }

  this.bootstrap();
};

CryptonDriver.prototype.bootstrap = function () {

};

CryptonDriver.prototype.load = function (data, callback) {
  callback && callback();
};

CryptonDriver.prototype.getKey = function (containerName, keyName, callback) {
  this.session.load(containerName, function (err, container) {
    if (err) {
      return callback(err);
    }

    container.get(keyName, function (err, key) {
      if (err) {
        return callback(err);
      }

      callback(err, key && key.value);
    });
  });
};

CryptonDriver.prototype.setKey = function (containerName, keyName, value, callback) {
  var that = this;

console.log('setkey', arguments);
  that.session.create(containerName, function (err) {
    that.session.load(containerName, function (err, container) {
      container.add(keyName, function (err) {
        container.get(keyName, function (err, key) {
          key.value = value;

          container.save(function (err) {
            callback(err);
          });
        });
      });
    });
  });
};

CryptonDriver.prototype.removeKey = function (name) {
  throw 'oops';
  // delete for now?
  var key = this.prefix + '_' + name;
  return localStorage.removeItem(key);
};

CryptonDriver.prototype.getId = function (callback) {
  var id;
  var that = this;

  that.getKey('meta', 'idCounter', function (err, internalId) {
    if (!internalId) {
      id = 0;
    } else {
      id = internalId;
    }

    id += 1;

    that.setKey('meta', 'idCounter', id, function (err) {
      if (err) {
        throw err;
      }

      callback(id);
    });
  });
};

/*
 * inode operations
 */

CryptonDriver.prototype.createInode = function (callback) {
  var that = this;

  that.getId(function (id) {
    that.getKey('inode', id, function (err, key) {
      if (key) {
        return callback('Inode already exists');
      }

      var inode = {};
      inode.id = id;
      that.setKey('inode', id, inode, function (err) {
        callback(err, inode);
      });
    });
  });
};

CryptonDriver.prototype.readInode = function (id, callback) {
console.log('readinode', id);
  this.getKey('inode', id, function (err, key) {
console.log(arguments);
    if (!key) {
      return callback('Inode not found');
    }

    callback(null, key);
  });
};

CryptonDriver.prototype.updateInode = function (data, callback) {
  var id = data.id;

  this.setKey('inode', id, data, function (err) {
    callback(err);
  });
};

CryptonDriver.prototype.deleteInode = function (id, callback) {
  this.removeKey('inode', id, function (err) {
    callback(err);
  });
};

/*
 * file operations
 */

CryptonDriver.prototype.createFile = function (callback) {
  var that = this;

  that.getId(function (id) {
    that.getKey('file', id, function (err, key) {
      if (key) {
        return callback('File already exists');
      }

      var fileData = new String();

      that.setKey('file', id, fileData, function (err) {
        callback(err, id);
      });
    });
  });
};

CryptonDriver.prototype.readFile = function (id, callback) {
  this.getKey('file', id, function (err, key) {
    if (typeof key == 'undefined') {
      return callback('File not found');
    }

    callback(null, key);
  });
};

CryptonDriver.prototype.updateFile = function (id, data, callback) {
  this.setKey('file', id, data, function (err) {
    callback(err);
  });
};

CryptonDriver.prototype.deleteFile = function (id, callback) {
  this.removeKey('file', id, function (err) {
    callback(err);
  });
};

})();
