
require.config({
  baseUrl:'./js',

  shim: {
    underscore: {
      deps: ['jquery'],
      exports: '_'
    },
    history:{
      deps: ['jquery']
    },
    mousewheel:{
      deps: ["jquery"]
    },
    fullscreen:{
      deps: ["jquery"]
    },
    smoothZoom: {
      deps: ["jquery", "mousewheel"],
      exports: "$.z"
    }
  },

  paths: {
  	jquery: 'libs/jquery/jquery-1.11.0.min',
    history: 'libs/jquery/jquery.history',
  	underscore: 'libs/underscore/underscore-min',
    text: 'libs/require/text',
    cookie: 'libs/jquery/jquery.cookie',
    queryString: 'libs/utils/queryString',
    mousewheel: 'libs/jquery/jquery.mousewheel',
    fullscreen: 'libs/jquery/jquery.fullscreen',
    ezpz_hint: 'libs/jquery/jquery.ezpz_hint',
    smoothZoom: 'libs/smoothZoom/smoothZoom'
  }
});

require([
	'jquery',
	'underscore',
  'views/preview/board',
	'common'
],function($, _, BoardView, Common){

  'use strict';

  $.extend(Common, {
    infoUrl: '/api/photos',
    deleteUrl: '/api/photo/'
  });

  new BoardView();

});
