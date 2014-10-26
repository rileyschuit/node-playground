$(document).ready(function() {
  $.getJSON('public/js/my_app_jquery.js', function(data) {
    var users = [];
    $.each(data.query.results.quote, function(key, val) {
      users.push('<li id="' + key + '">' + val + '</li>');
      });
      $('<ul/>', { 'class': 'my-new-list', html: users.join('')}).appendTo('body');
      console.log( data );
  });
});
