define([
  'jquery',
  'underscore',
  'common',
  'history',
  'queryString',
  'smoothZoom',
  'fullscreen'
], 
function($, _, Common){

  'use strict';

  var BoardView = function(){
    var me = this;

    me.render();
    me.initEvents();

    me.initHistory();
    me.initHash();
  };

  BoardView.prototype = {

    hash: ['pid', 'aid'],

    fullscreen: false,

    initHistory : function () {
      var me = this;

      History.Adapter.bind(window,'statechange',function(){
        var State = History.getState(); 
        var page = State.data.page||1;
        var hash = _.pick(State.data, me.hash);

        me.loadPage(hash);
      });
    },

    initHash : function () {
      var me = this;
      var hash = window.location.href;
      var hashData = hash.queryStringToJSON(); 
      var hash = _.pick(hashData, me.hash);
      
      me.loadPage(hash);
    },

    render: function() {

      var me = this;

      me.$photo = $('.sz-container');

      me.$zoomer = $('.zoom_container');

      me.$prev = $('.prev-btn');
      me.$next = $('.next-btn');

      me.$groupBtn = $('.group-btn');
      me.$groupEl = $('.thumb-box');

      me.$title = $('.photo-title');
      me.$description = $('.photo-description');

      return this;
    },

    initEvents: function(){
      var me = this;

      $(document).on('keydown', me, me.hotkey);
      $(".full-btn").on('click', me, me.onFullscreen);
      $(".prev-btn").on('click', me, me.goPrev);
      $(".next-btn").on('click', me, me.goNext);

  //   events: {
  //     'click .full-btn': 'onFullscreen',
  //     'click .group-btn': 'toggleMenu',
  //   },
    },

    loadPage: function(hash){
      var me = this;

      me.params = hash;

      var data = $.param(hash);

      $.ajax({
        url: '/api/photo/' + hash.pid,
        type: 'get',
        data: data,
        dataType: 'json',
        context:this
      }).done(function(data){
        if(data._id){
          this.setPager(data);
          this.changeImage(data);
        }
      });
    },

    setPager: function(data){
      var me = this;

      if(data.prev){

        me.prevId = data.prev;
        if(!me.fullscreen){
          me.$prev.show();
        }   
      }else{
        me.prevId = null;
        me.$prev.hide();
      }

      if(data.next){

        me.nextId = data.next;
        if(!me.fullscreen){
          me.$next.show();
        }   
      }else{
        me.nextId = null;
        me.$next.hide();
      }
    },

    changeImage: function(data){
      var me = this;    

      me.$zoomer.z("destroy").z({
        background_COLOR: "#222222",
      //  zoom_MIN: 50,
        width: '100%',
        height: '100%',
        responsive:true,
        responsive_maintain_ratio:true,
        image_url: data.file,
        max_WIDTH:'',
        max_HEIGHT:'',
        button_ICON_IMAGE: '/img/zoom_assets/icons.png',
        hideControls: me.fullscreen,
        on_IMAGE_LOAD: function(){

          me.$title.html(data.tags ||'');

          me.$description.html(data.description ||'');

        }
      });

    },

    hotkey: function(e){

      var me = e.data;
      //esc
      if(e.keyCode == 27){
        // me.hideGroup();
        // me.close(e);
      }
      //page up
      else if(e.keyCode == 33){
        me.goPrev(e);    
      }
      //page down
      else if(e.keyCode == 34){
        me.goNext(e);
      }

    },

    goPrev: function(e){
      e.preventDefault();
      var me = e.data;

      if(me.prevId){
        me.navigate(me.prevId);
      }
      
    },

    goNext: function(e){
      e.preventDefault();
      var me = e.data;
      
      if(me.nextId){
        me.navigate(me.nextId);
      }
    },

    navigate: function(id){
      var me = this;
      var p = $.extend({
        q: '',
        aid: ''
      },me.params, {
        pid: id
      });

      if(this.fullscreen && $.support.fullscreen){
        me.loadPage(p);
      }else{
        History.pushState(p, Common.title, '?pid='+ p.pid||'' + '&aid='+p.aid + '&q='+p.q );
      }
    },

    onFullscreen: function(e){
      e.preventDefault;

      var me = e.data;

      if($.support.fullscreen){

        me.$photo.fullScreen({
          callback: function(state){

            me.fullscreen = state;

            if(state){
              $(".hidable").stop().fadeOut(600);
              me.$zoomer.z("hideControl");

              if(me.isGroup){
                me.hideGroup();
                me.$groupBtn.stop().fadeOut(600);
              }
            } else{
              $(window).resize();
              $(".hidable").stop().fadeIn(600);
              me.$zoomer.z("showControl");

              if(me.isGroup){
                me.$groupBtn.stop().fadeIn(600);
              }
            }
          }
        });
      }
    }
  };

  return BoardView;

});