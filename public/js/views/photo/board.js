define([
  'jquery',
  'underscore',
  'text!templates/photo/item.html',
  'views/photo/addDialog',
  'views/photo/editDialog',
  'common',
  'nicescroll'
], 
function($, _, itemTpl, AddDialog, EditDialog, Common){
  'use strict';


  var BoardView = function(){
    var me = this;

    me.render();
    me.initEvents();
  };

  BoardView.prototype = {

    start: 0,
    limit: 10,

    params: ['q'],

    render: function(){
      var me = this;

      me.$el = $('#main');
      me.$list = $('.thumbs', me.$el);
      me.$more = $('.more-link', me.$el);
      me.$upload = $('.add-button', me.$el);

      me.$topBtn = $('#top-btn');
      me.$topBtn.affix({
        offset: {
          top: 180
        }
      });

      $("body").niceScroll({
        cursorcolor:"#ccc",
        cursoropacitymin : 0.3,
        cursorwidth : 8,
        scrollspeed : 50,
        mousescrollstep :80,
        zindex:100
      });

      me.tpl = _.template(itemTpl);

      me.authorize();

    },

    authorize: function(){
      var me = this;

      if(Common.username){
        me.addDialog = new AddDialog();
        me.editDialog = new EditDialog();
        me.$upload.show();
      }else{
        me.$upload.remove();
      }
      
    },

    initEvents: function(){
      var me = this;

      me.$more.on('click', function(){
        me.loadPage();
      });

      me.$topBtn.on('click', me.scrollToTop);

      $(Common).on('prepend', me, me.prepend);

      $(Common).on('update', me, me.updateItem);
    },

    scrollToTop: function(e){
      e.preventDefault();

      $('html, body').animate({
        scrollTop: 0
      });
    },

    getFilters: function(){
      return {}
    },

    setFilters: function(cfg){
      var me = this;

      me.filters = cfg;
      me.$searchInput.val(cfg.name);
    },

    loadPage: function(reload, cfg){
      var me = this;

      if(reload){
        me.start = 0;
        me.$list.empty();
      }

      var params = $.extend({
        q: ''
      },cfg, {
        start: me.start,
        limit: me.limit
      });

      this.enableMore();

      me.xhr = $.ajax({
        url: Common.listUrl,
        cache: false,
        dataType: 'json',
        data: params
      }).done(function(data){
        me.start += me.limit;
        me.initList(data);

        if(data.length < me.limit){
          me.disableMore();
        }
      });
    },

    updateItem: function(e, el, data, imgChanged){
      if(imgChanged){
        el.find('img').attr('src', data.thumb);
      }
      var $info = el.find('.info');
      $('h4', $info).text(data.name);
      $('span', $info).text( data.width + 'x' + data.height );

      me.highlight(el);
    },

    highlight: function(el){
      el.addClass('highlight');

      setTimeout(function(){
        el.removeClass('highlight');
      }, 2000);
    },

    getItemEl: function(data){
      var me = this;
      var html = me.tpl(data);
      var $item = $(html);

      $item.data('model', data);

      if(!Common.username){
        $item.find('.edit-icon').remove();
        $item.find('.delete-icon').remove();
      }else{
        me.addEvents($item);
      }
      
      return $item;
    },

    prepend: function(e, data){
      var me = e.data;

      var $item = me.getItemEl(data);
      me.$list.prepend($item);

      me.highlight($item);
    },

    initList: function(data){
      var me = this;

      _.each(data, function(json){
        var $item = me.getItemEl(json);
        me.$list.append($item);
      });
    },

    addEvents: function($el){
      var me = this;

      $el.find('.edit-icon').on('click', {scope: me, $el: $el}, me.edit);
      $el.find('.delete-icon').on('click', {scope: me, $el: $el}, me.confirmDelete);
    },

    edit: function(e) {
      e.preventDefault();
      e.stopPropagation();

      var me = e.data.scope;
      var $el = e.data.$el;
      var model = $el.data('model');

      me.editDialog.set($el, model).show();
    },

    confirmDelete: function(e){
      e.preventDefault();
      e.stopPropagation();

      var me = e.data.scope;
      var $el = e.data.$el;
      var model = $el.data('model');

      bootbox.confirm("Are you sure to remove this photo？", function(state){
        if(!state){
          return;
        }

        $.ajax({
          url: Common.deleteUrl + model._id,
          type:'delete',
          cache: false
        });
        
        $el.remove();
      });
    },

    enableMore: function(){
      this.$more.text('More');
      this.$more.removeAttr('disabled');
    },

    disableMore: function(){
      this.$more.text('No More');
      this.$more.attr('disabled', 'disabled');
    },

    destroy: function(){
    }
  };

  return BoardView;
});

