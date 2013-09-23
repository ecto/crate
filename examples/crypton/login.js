$(document).ready(function () {
  $('input')[0].focus();

  $('#login form input[type=submit]').click(function () {
    $('input[type=submit]', $(this).parents('form')).removeAttr('clicked');
    $(this).attr('clicked', 'true');
  });

  $('#login form').submit(function (e) {
    e.preventDefault();
    var type = $('#login input[type=submit][clicked=true]').val();
    var username = $('#login input[type=text]').val();
    var password = $('#login input[type=password]').val();

    if (type == 'login') {
      doLogin(username, password);
    } else {
      doRegister(username, password);
    }
  });
});

function doLogin (username, password) {
  crypton.authorize(username, password, function (err, session) {
    if (err) {
      alert(err);
      return;
    }

    $('#login').hide();
    start(session);
  });
}

function doRegister (username, password) {
console.log(username, password);
  crypton.generateAccount(username, password, function (err, account) {
    if (err) {
      alert(err);
      return;
    }

console.log(arguments);
    doLogin(username, password);
  });
}
