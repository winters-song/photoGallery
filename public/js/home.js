
require.config({
  baseUrl:'./js',

  shim: {
    underscore: {
      deps: ['jquery'],
      exports: '_'
    },
    bootstrap: {
      deps: ['jquery'],
      exports: '$.fn.popover'
    },
    bootbox: {
      deps: ['bootstrap'],
      exports: 'bootbox'
    }
  },

  paths: {
  	jquery: 'libs/jquery/jquery-1.11.0.min',
  	ezpz_hint: 'libs/jquery/jquery.ezpz_hint',
  	underscore: 'libs/underscore/underscore-min',
    text: 'libs/require/text',
    cookie: 'libs/jquery/jquery.cookie',
    queryString: 'libs/utils/queryString',
    bootstrap : 'libs/bootstrap/js/bootstrap.min',
    bootbox: 'libs/bootbox/bootbox.min'
  }
});

require([
	'jquery',
	'underscore',
  'views/header',
  'views/footer',
	'common',
	'bootstrap'
],function($, _, HeaderView, FooterView, Common){

  'use strict';

	// Common.initLocale();

  $.extend(Common, {
  });

  new HeaderView({
    logo: false,
    nav: false
  });

  new FooterView();

  //start gradient light animation
  var $box = $('#search-box');
  $('.rain, .border',$box).addClass('end');

  //search
  var $input = $('input', $box);
  var $searchBtn = $('.search-btn', $box);

  function doSearch(){
    var value = $.trim($input.val());

    if(value){
      window.location.href = '/photos?q='+ value;
    }else{
      $input.val('');
    }
  }

  $input.on('keyup', function(e){
    if(e.keyCode == 13){
      doSearch();
    }
  });

  $searchBtn.on('click', function(e){
    e.preventDefault();
    doSearch();
  });


});
