
$(function(){

  //start gradient light animation
  var $login = $('#login-box');
  $('.rain, .border',$login).addClass('end');

  if(!Modernizr.indexeddb){
    $(".form-control").ezpz_hint();
  }

  var $form = $('form');
  var $error = $('.error-info');
  var $name = $('[name=username]', $form);
  var $password = $('[name=password]', $form);

  function show_error(msg){
    $error.html(msg).slideDown();
  }

  $form.on('submit', function(e){
    e.preventDefault();

    var username = $name.val();
    var password = $password.val();

    $error.html('').hide();

    if(username && password){

      $.ajax({
        url: '/api/login',
        type: 'post',
        data: $.param({
          username: username,
          password: password
        }),
        dataType: 'json'
      }).done(function(data){

        if(data.success){

          var to = '/home';

          if(window.sessionStorage){
            window.location.href = window.sessionStorage.login_from || to;
          }else{
            window.location.href = to;
          }

        }else if( data.error_code == 2){
          show_error('Your account or password were incorrect.');
        }else{
          show_error('Server is busy!');
        }

      }).fail(function(response){
        show_error('Server is busy!');
      });

    }else{
      show_error('You do have to fill this stuff out, you know.');
    }
  });

});
