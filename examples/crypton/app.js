var fs;

function start (session) {
  $('#app').show();

  fs = new Crate({
    driver: 'crypton',
    options: {
      session: session
    }
  });

  setTimeout(function () {
    // render the result of an ls() on page log
    displayFiles();
  }, 1000);

  // when a delete button is clicked
  $('#files .file .delete').live('click', function (e) {
    var name = $(this).parent().find('.name').text();
    var realPath = Crate.util.path.resolve(fs.cwd, name);

    fs.stat(realPath, function (err, info) {
      if (!info.isDirectory) {
        // if the delete button is clicked on a file
        closeFile();
        deleteFile(name);
      } else {
        // if the delete button is clicked on a directory
        // we need to see if the directory is empty
        fs.ls(realPath, function (err, list) {
          var shouldDelete = true;
          var empty = list.length == 2;

          // list includes . and ..
          // are there any more files in the directory?
          if (!empty) {
            shouldDelete = confirm('Directory not empty. Continue?');
          }

          // to continue, let's recurse
          if (shouldDelete) {
            if (empty) {
              // just rm
              deleteDirectory(name);
              return;
            }

            // we have to recurse through the child
            // TODO
            alert('Not implemented yet. Delete children manually first');
          }
        });
      }
    });
  });

  $('#files .file').live('click', function (e) {
    // don't cd() when clicking delete
    if (e.srcElement.className == 'delete') {
      return;
    }

    var name = $(this).find('.name').text();

    var realPath = Crate.util.path.resolve(fs.cwd, name);
    fs.stat(realPath, function (err, info) {
      if (info.isDirectory) {
        fs.cd(name, function () {
          displayFiles();
        });
      } else {
        openFile(realPath);
      }
    });
  }); 
}

function displayFiles () {
  fs.ls(fs.cwd, function (err, items) {
    if (err) {
      return alert(err);
    }

    var $files = $('#files');
    $files.html('');

    for (var i in items) {
      var $row = $('<div />').addClass('file');
      $('<span />').addClass('name').text(items[i]).appendTo($row);

      if (items[i] != '.' && items[i] != '..') {
        $('<button />').addClass('delete').text('delete').appendTo($row);
      }

      $files.append($row);
    }

    $('#cwd').text(fs.cwd);
  });
}

function createFile () {
  var name = prompt('Filename?');
  var realPath = Crate.util.path.resolve(fs.cwd, name);
  fs.touch(realPath, function () {
    displayFiles();
  });
}

function createDirectory () {
  var name = prompt('Directory name?');
  var realPath = Crate.util.path.resolve(fs.cwd, name);
  fs.mkdir(realPath, function () {
    displayFiles();
  });
}

function deleteFile (name) {
  var realPath = Crate.util.path.resolve(fs.cwd, name);
  fs.rm(realPath, function () {
    console.log(arguments);
    displayFiles();
  });
}

function deleteDirectory (name) {
  var realPath = Crate.util.path.resolve(fs.cwd, name);
  fs.rm(realPath, function () {
    console.log(arguments);
    displayFiles();
  });
}

function openFile (path) {
  fs.open(path, function (err, file) {
    window.file = file;
    file.read(function (err, data) {
      if (err) {
        return alert(err);
      }

      renderFile();
    });
  });
}

function renderFile () {
  var data = file.data.toString();
  $('#data').val(data).focus();
  $('#file').addClass('active');
}

function save () {
  var data = $('#data').val();
  file.write(data, function (err) {
    if (err) {
      alert(err);
    }
  });
}

function closeFile () {
  $('#file').removeClass('active');
}
