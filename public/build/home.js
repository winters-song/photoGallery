({
  baseUrl:'../js',

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
  },
  findNestedDependencies : true,
  preserveLicenseComments: false,
	name: "home",
 	out: "../built/home.js"
})
