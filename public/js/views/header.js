define([
  'jquery',
  'underscore',
  'text!templates/header.html',
  'common',
  'bootbox'
], 
function($, _, tpl, Common){
  'use strict';

  var HeaderView = function(cfg){
    var me = this;

    $.extend(me.options, cfg);

    var username = me.getUsername();
    if(!username){
      me.checkLogin();
    }else{
      Common.username = username;
    }
    me.render();
    
  };

  HeaderView.prototype = {

    options: {
      logo: true,
      nav: true
    },

    getUsername: function(){
      if(!window.sessionStorage){
        return;
      }

      return sessionStorage.username;
    },

    setUsername: function(username){
      if(window.sessionStorage){
        sessionStorage.username = username;
      }
    },

    clearUsername: function(){
      if(window.sessionStorage){
        delete sessionStorage.username;
      }
    },

    checkLogin: function(){
      var me = this;

      var json = $.ajax({
        url: Common.checkLoginUrl,
        cache: false,
        async: false,
        dataType: 'json'
      }).responseJSON;

      if(json && json.success){
        Common.username = json.name;
        me.setUsername(json.name);
      }
    
    },

    render: function( ){
      var me = this;
      me.$el = $('#main-header');

      var $tpl = $(tpl);

      if(Common.username){
        $('#login', $tpl).remove();
        $('.name', $tpl).text(Common.username);
      }else{
        $('#tbar', $tpl).remove();
      }

      if(!me.options.logo){
        $('#logo', $tpl).remove();
      }
      if(!me.options.nav){
        $('#main-nav', $tpl).remove();
      }else{
        $('a[class='+ me.options.nav +']', $tpl).addClass('active');
      }

      me.$el.append($tpl);
      
      $('#logout').on('click', me, me.logout);

    },

    logout: function(e){
      var me = e.data;

      e.preventDefault();

      $.ajax({
        url: Common.logoutUrl,
        cache: false,
        context: me
      }).always(function(){
        this.clearUsername();
        window.location.reload();
      });
    }

  };

  return HeaderView;
});

