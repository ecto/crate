
(function () {

'use strict';

var CryptonDriver = Crate.drivers.crypton = function (options) {
  options = options || {};
  this.session = options.session;
  this.prefix = options.prefix || '_crate';
  this.containers = {};

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

CryptonDriver.prototype.makeContainerName = function (type, id) {
  return this.prefix + '_' + type + '_' + id;
};

CryptonDriver.prototype.loadContainer = function (containerName, callback) {
  var that = this;

  if (this.containers[containerName]) {
    return callback(null, this.containers[containerName]);
  }

  that.session.load(containerName, function (err, container) {
    if (err) {
      return callback(err);
    }

    that.containers[containerName] = container;
    callback(null, container);
  });
};

CryptonDriver.prototype.getKey = function (type, id, callback) {
  var that = this;
  var containerName = this.makeContainerName(type, id);
  var keyName = 'key';

  that.loadContainer(containerName, function (err, container) {
    if (err) {
      console.log(err);
      return callback(err);
    }

    var value = container.keys[keyName];
    var clone = value && JSON.parse(JSON.stringify(value));
    callback(null, clone);
  });
};

CryptonDriver.prototype.setKey = function (type, id, value, callback) {
  var that = this;
  var containerName = this.makeContainerName(type, id);
  var keyName = 'key';

  that.loadContainer(containerName, function (err, container) {
    if (err == 'Container does not exist') {
      return that.session.create(containerName, function (err, container) {
        if (err) throw err;

        // give the server 1/10th of a second to process
        // container creation before adding new record
        setTimeout(function () {
          set(container);
        }, 100);
      });
    } else if (err) {
      console.log(err);
      return callback(err);
    }

    set(container);
  });

  function set (container) {
    var clone = JSON.parse(JSON.stringify(value));
    container.keys[keyName] = clone;

    container.save(function (err) {
      if (err) {
        console.log(err);
      }

      callback(err);
    });
  }
};

CryptonDriver.prototype.removeKey = function (type, id, callback) {
  var that = this;
  var containerName = this.makeContainerName(type, id);

  that.session.remove(containerName, function (err) {
    callback(err);
  });
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
        console.log(err);
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
  this.getKey('inode', id, function (err, key) {
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

      var fileData = {
        value: new String()
      };

      that.setKey('file', id, fileData, function (err) {
        callback(err, id);
      });
    });
  });
};

CryptonDriver.prototype.readFile = function (id, callback) {
  this.getKey('file', id, function (err, key) {
    if (typeof key.value == 'undefined') {
      return callback('File not found');
    }

    callback(null, key.value);
  });
};

CryptonDriver.prototype.updateFile = function (id, data, callback) {
  var fileData = {
    value: data
  };

  this.setKey('file', id, fileData, function (err) {
    callback(err);
  });
};

CryptonDriver.prototype.deleteFile = function (id, callback) {
  this.removeKey('file', id, function (err) {
    callback(err);
  });
};

})();
