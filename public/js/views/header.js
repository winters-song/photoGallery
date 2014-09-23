define([
  'jquery',
  'underscore',
  'text!templates/header.html',
  'common',
  'bootbox',
  'history',
  'queryString'
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
    me.initEvents();
    
  };

  HeaderView.prototype = {

    options: {
      hash: [],
      logo: true,
      nav: true,
      search: true
    },

    initHistory : function () {
      var me = this;

      History.Adapter.bind(window,'statechange',function(){
        var State = History.getState(); 
        var page = State.data.page||1;
        var hash = _.pick(State.data, me.options.hash);

        $(me).triggerHandler('hash', hash);
      });
    },

    initHash : function () {
      var me = this;
      var hash = window.location.href;
      var hashData = hash.queryStringToJSON(); 
      var hash = _.pick(hashData, me.options.hash);
      
      $(me).triggerHandler('hash', hash);
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

      me.$searchInput = $('input', $tpl);
      me.$searchButton = $('.search-btn', $tpl);

      if(Common.username){
        $('#login', $tpl).remove();
        $('.name', $tpl).text(Common.username);
      }else{
        $('#tbar', $tpl).remove();
      }

      if(!me.options.logo){
        $('#logo', $tpl).remove();
      }
      if(!me.options.search){
        $('#search', $tpl).remove();
      }
      if(!me.options.nav){
        $('#main-nav', $tpl).remove();
      }else{
        $('a[class='+ me.options.nav +']', $tpl).addClass('active');
      }

      me.$el.append($tpl);
    },

    initEvents: function(){
      var me =this;

      $('#login a').on('click', me, me.login);

      $('#logout').on('click', me, me.logout);

      me.$searchInput.on('keyup', me, function(e){
        if(e.keyCode == 13){
          me.search();
        }
      });

      me.$searchButton.on('click', me, function(e){
        me.search();
      });

      $(me).on('hash.me', function(e, hash){
        if(hash.q){
          me.$searchInput.val(hash.q);
        }
      });
      
    },

    search: function(){
      var me = this;
      var val = $.trim(me.$searchInput.val());

      History.pushState({ q: val }, Common.title, '?q='+val );
    },

    login: function(e){
      var me = e.data;
      var l = window.location;

      if(window.sessionStorage){
        sessionStorage.login_from = l.pathname + l.search;
      }
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

