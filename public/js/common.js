
define(['jquery'], function ($) {
	'use strict';

	return {

		checkLoginUrl: '/api/checkLogin',
		logoutUrl: '/api/logout',

		//utils
    timestampToString: function(timestamp){
      var date = new Date(timestamp*1);

      var month = date.getMonth() + 1;
      var day = date.getDate();
      month = month < 10 ? '0'+ month : month;
      day = day < 10 ? '0'+ day : day;
      return '' + date.getFullYear() + '-' + month + '-' + day;
    },

		resize: function(){
			setTimeout(function(){
        $('body').getNiceScroll().resize();
      },100);
		},

		disableNiceScroll: function(){
			$('body').getNiceScroll()[0].locked = true;
		},

		enableNiceScroll: function(){
			$('body').getNiceScroll()[0].locked = false;
		}
		
	};
});
