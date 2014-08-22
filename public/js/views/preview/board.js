define([
  'jquery',
  'underscore',
  'backbone',
  'collections/groupItems',
  'views/preview/groupMenu',
  'text!templates/preview/board.html',
  'common',
  'smoothZoom',
  'fullscreen'
], 
function($, _, Backbone, groupItems, groupMenuView, previewTpl, Common){

  var PreviewBoard = Backbone.View.extend({

    tagName: 'div',

    id: 'smoothZoom',

    className: 'thumb',

    template: _.template( previewTpl ),

    events: {
      'click .back-btn': 'close',
      'click .full-btn': 'onFullscreen',
      'click .group-btn': 'toggleMenu',
      'click .prev-btn': 'goPrev',
      'click .next-btn': 'goNext'
    },

    fullscreen: false,

    initialize: function(cfg) {

      var p = cfg.params;

      $.extend(this, {
        photoId : p.id,
        // type : p.type,
        query : p.query,
        aid: p.aid
      });

      if(this.aid){
        this.isGroup  = true;
      }

      this.render();

    },

    onFullscreen: function(e){
      e.preventDefault;

      var me = this;

      if($.support.fullscreen){

        this.$photo.fullScreen({
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
      }else{

        var state = this.state;
        me.fullscreen = state;

        if(!state){
          $("html").addClass('fullScreen');
          $(".photo_info").hide();

          $(".hidable").stop().fadeOut(600);
          me.$zoomer.z("hideControl");
         
         
        } else{
          $("html").removeClass('fullScreen');
          $(".photo_info").show();

          $(".hidable").stop().fadeIn(600);
          me.$zoomer.z("showControl");

        }
        $(window).resize();
        this.state = !state;
      }
    },

    render: function() {

      var me = this;

      me.$el.html( me.template() );

      $('body').append(me.$el);

      me.$photo = $('.sz-container', me.$el);

      me.$zoomer = $('.zoom_container', me.$el);

      me.$prev = $('.prev-btn', me.$el);
      me.$next = $('.next-btn', me.$el);

      me.$groupBtn = $('.group-btn', me.$el);
      me.$groupEl = $('.thumb-box', me.$el);

      me.$title = $('.photo-title', me.$el);
      me.$author = $('.photo-author', me.$el);
      me.$country = $('.photo-country', me.$el);
      me.$shoot_time = $('.photo-shoot_time', me.$el);
      me.$shoot_site = $('.photo-shoot_site', me.$el);
      me.$years = $('.photo-years', me.$el);
      me.$category = $('.photo-category', me.$el);
      me.$description = $('.photo-description', me.$el);

      me.load();

      if(me.isGroup){
        me.groupMenu = new groupMenuView();
        me.initGroup();
      }

      $("body").on('keydown', me, me.hotkey);

      return this;
    },

    toggleMenu: function(){
      this.groupMenu.toggle();
    },

    initGroup: function(){
      var me = this;

      var params = $.param({
        aid: me.aid
      });

      groupItems.fetch({
        data: params,
        remove:false,
        context: this,
        error: function (collection, response, options) {
          if(response.responseText){
            alert(response.responseText);
          }
        },
        success: function(collection, response, options){
          if(response.length){
            me.$groupBtn.show();
            me.groupMenu.setLength(response.length);
            me.groupMenu.setActive(me.photoId);
          }
        }
      });

    },

    hotkey: function(e){

      var _this = e.data;
      //esc
      if(e.keyCode == 27){
        // me.hideGroup();
        _this.close(e);
      }
      //page up
      else if(e.keyCode == 33){
        _this.goPrev(e);    
      }
      //page down
      else if(e.keyCode == 34){
        _this.goNext(e);
      }

    },

    paging: function(params){

      var me = this;

      me.photoId = params.id;

      me.load();

      if(me.isGroup){
        me.groupMenu.setActive(me.photoId);
      }
    },

    load: function(id){

      var data = this.query || '';

      if(this.aid){
        data = $.param({
          aid: this.aid
        });
      }

      $.ajax({
        url: '/api/photos/' + this.photoId,
        type: 'get',
        data: data,
        dataType: 'json',
        context:this
      }).done(function(data){
        if(data.errorMsg){
          console.log(data.errorMsg);
        }else{
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

      this.$zoomer.z("destroy").z({
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

    close: function(e){

      e.preventDefault();

      if(this.query){
        var length = Common.pageStack.length;
        if(length > 1 && Common.pageStack[length - 2].term == 'home'){
          Backbone.history.navigate('/home', true);
        }else{
          Backbone.history.navigate('/photos/'+ this.query, true);
        }
        
      }else if(this.aid){
        Backbone.history.navigate('/album/' + this.aid, true);
      }else{
        Backbone.history.navigate('/photos', true);
      }

    },

    goPrev: function(e){
      e.preventDefault();

      if(this.prevId){
        this.navigate(this.prevId);
      }
      
    },

    goNext: function(e){
      e.preventDefault();
      
      if(this.nextId){
        this.navigate(this.nextId);
      }
    },

    navigate: function(id){

      if(this.fullscreen && $.support.fullscreen){
        this.photoId = id;
        this.load(id);

      }else if(this.aid){
        Backbone.history.navigate('/album/' + this.aid + '/' + id, true);
      }else if(this.query){
        Backbone.history.navigate('/photo/' + id + '/'+ this.query, true);
      }else{
        Backbone.history.navigate('/photo/' + id, true);
      }
      
    },


    destroy: function(){

      $("body").off('keydown', this.hotkey);

      this.remove();
    }
  });

  return PreviewBoard;

});