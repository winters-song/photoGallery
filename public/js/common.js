/*global define*/
'use strict';

define([], function () {
	return {

		checkLoginUrl: '/api/checkLogin',
		logoutUrl: '/api/logout',

		awardId: '52f43525c0cbba280b1eb2c8',
		
		TodoFilter: '', // empty, active, completed

		ENTER_KEY: 13,

		currentPage: null,

		pageStack : [],

		menu: [{
			title: '首页',
			cls: 'home',
			name: 'home'
		},{
			title: '单图管理',
			cls: 'picture',
			name: 'photos'
		},{
			title: '组图管理',
			cls: 'folder-open',
			name: 'albums'
		},{
			title: '用户管理',
			cls: 'user',
			name: 'users'
		}],

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
        $("body").getNiceScroll().resize();
      },100);
		},

		disableNiceScroll: function(){
			$("body").getNiceScroll()[0].locked = true;
		},

		enableNiceScroll: function(){
			$("body").getNiceScroll()[0].locked = false;
		},

		//for Backbone
		resetBoard: function(collection, options){
		  var models = options.previousModels;
		  _.each(models, function(model){
		    model.id = null;
		    model.destroy();
		  });
		},

		syncOption: {
			wait: true,
			error: function(model, response, option){
				Backbone.trigger('msg', response.responseText);
			}
		}
		
	};
});
