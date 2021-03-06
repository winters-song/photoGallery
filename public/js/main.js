/*global require*/
'use strict';

require.config({
  baseUrl:'/js/',

	shim: {
    'jquery.ui.widget': { 
      deps: ["jquery"]
    },
    nicescroll: {
      deps: ['jquery'],
      exports: '$.niceScroll'
    },
    transit: {
      deps: ['jquery'],
      exports: '$.transit'
    },
    underscore: {
      deps: ['jquery'],
      exports: '_'
    },
    backbone: {
      deps: [
        'underscore',
        'jquery'
      ],
      exports: 'Backbone'
    },
    bootstrap: {
      deps: ["jquery"],
      exports: "$.fn.popover"
    },
    bootbox: {
      deps: ["bootstrap"],
      exports: "bootbox"
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

    mousewheel:{
      deps: ["jquery"]
    },

    fullscreen:{
      deps: ["jquery"]
    },

    ezpz_hint:{
      deps: ["jquery"]
    },

    smoothZoom: {
      deps: ["jquery", "mousewheel"],
      exports: "$.z"
    },

    hexbin: {
      deps: ["d3"]
    }

  },

  paths: {
    jquery: 'libs/jquery/jquery-1.11.0.min',
    'jquery.ui.widget' : 'libs/jquery/jquery.ui.widget',
    fileupload: 'libs/blueimp/jquery.fileupload',
    'load-image': 'libs/blueimp/load-image',
    'load-image-meta': 'libs/blueimp/load-image-meta',
    'load-image-exif': 'libs/blueimp/load-image-exif',
    'load-image-ios': 'libs/blueimp/load-image-ios',
    'canvas-to-blob': 'libs/blueimp/canvas-to-blob.min',
    tmpl: 'libs/blueimp/tmpl.min',
    nicescroll: "libs/jquery/jquery.nicescroll.min",
    transit: "libs/jquery/jquery.transit.min",
    underscore: 'libs/underscore/underscore-min',
    backbone: 'libs/backbone/backbone-min',
    text: 'libs/require/text',
    bootstrap : "libs/bootstrap/js/bootstrap.min",
    bootbox : "libs/bootbox/bootbox.min",
    'iframe-transport' : 'libs/blueimp/jquery.iframe-transport',
    'fileupload-process' : 'libs/blueimp/jquery.fileupload-process',
    'fileupload-image' : 'libs/blueimp/jquery.fileupload-image',
    'fileupload-validate' : 'libs/blueimp/jquery.fileupload-validate',
    mousewheel: 'libs/jquery/jquery.mousewheel',
    fullscreen: 'libs/jquery/jquery.fullscreen',
    ezpz_hint: 'libs/jquery/jquery.ezpz_hint',
    smoothZoom: 'libs/smoothZoom/smoothZoom',
    queryString: 'libs/utils/queryString',

    d3: 'libs/d3/d3.min',
    hexbin: 'libs/d3/hexbin/hexbin'
  }
});

require([
  'backbone',
  'views/app',
  'routers/router',
  'bootbox',
  'bootstrap',
  'nicescroll'
], function (Backbone, AppView, Router, bootbox) {

  var router = new Router();

  Backbone.history.start({
    root: '/',
    pushState: true
  });

  //preset bootbox
  bootbox.setDefaults({
    locale: "zh_CN"
  });

  new AppView();

  $("body").niceScroll({
    cursorcolor:"#ccc",
    cursoropacitymin : 0.3,
    cursorwidth : 8,
    scrollspeed : 50,
    mousescrollstep :80,
    zindex:100
  });


});