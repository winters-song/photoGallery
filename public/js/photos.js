
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
    },
    fileupload :{ 
      deps: ["jquery"]
    },
    tmpl: {
      deps: ["jquery"]
    },
    'iframe-transport': {
      deps: ['fileupload']
    },
    'fileupload-process': {
      deps: ['fileupload']
    },
    'fileupload-image': {
      deps: ['fileupload']
    },
    'fileupload-validate': {
      deps: ['fileupload']
    },
    history:{
      deps: ['jquery']
    }
  },

  paths: {
  	jquery: 'libs/jquery/jquery-1.11.0.min',
    history: 'libs/jquery/jquery.history',
  	ezpz_hint: 'libs/jquery/jquery.ezpz_hint',
  	underscore: 'libs/underscore/underscore-min',
    text: 'libs/require/text',
    cookie: 'libs/jquery/jquery.cookie',
    queryString: 'libs/utils/queryString',
    bootstrap : 'libs/bootstrap/js/bootstrap.min',
    bootbox: 'libs/bootbox/bootbox.min',
    'jquery.ui.widget' : 'libs/jquery/jquery.ui.widget',
    fileupload: 'libs/blueimp/jquery.fileupload',
    'load-image': 'libs/blueimp/load-image',
    'load-image-meta': 'libs/blueimp/load-image-meta',
    'load-image-exif': 'libs/blueimp/load-image-exif',
    'load-image-ios': 'libs/blueimp/load-image-ios',
    'canvas-to-blob': 'libs/blueimp/canvas-to-blob.min',
    tmpl: 'libs/blueimp/tmpl.min',
    'iframe-transport' : 'libs/blueimp/jquery.iframe-transport',
    'fileupload-process' : 'libs/blueimp/jquery.fileupload-process',
    'fileupload-image' : 'libs/blueimp/jquery.fileupload-image',
    'fileupload-validate' : 'libs/blueimp/jquery.fileupload-validate'
  }
});

require([
	'jquery',
	'underscore',
  'views/header',
  'views/photo/board',
	'common',
	'bootstrap'
],function($, _, HeaderView, BoardView, Common){

  'use strict';

  $.extend(Common, {
    listUrl: '/api/photos',
    deleteUrl: '/api/photo/'
  });

  var header = new HeaderView({
    nav:'photo',
    hash: ['q']
  });
  var board = new BoardView();

  $(header).on('hash', function(e, hash){
    board.loadPage(true, hash);
  });

  header.initHistory();
  header.initHash();

});
