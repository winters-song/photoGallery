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
    me.loadPage();
  };

  BoardView.prototype = {

    start: 0,
    limit: 10,

    render: function(){
      var me = this;

      me.$el = $('#main');
      me.$list = $('.thumbs', me.$el);
      me.$more = $('.more-link', me.$el);

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

      me.addDialog = new AddDialog();
      me.editDialog = new EditDialog();
    },

    initEvents: function(){
      var me = this;

      me.$more.on('click', function(){
        me.loadPage();
      });

      me.$topBtn.on('click', me.scrollToTop);

      $(Common).on('prepend', me, me.prepend);
    },

    scrollToTop: function(e){
      e.preventDefault();

      $('html, body').animate({
        scrollTop: 0
      });
    },

    loadPage: function(){
      var me = this;

      this.enableMore();

      me.xhr = $.ajax({
        url: Common.listUrl,
        cache: false,
        dataType: 'json',
        data: $.param({
          start: me.start,
          limit: me.limit
        })
      }).done(function(data){
        me.start += me.limit;
        me.initList(data);

        if(data.length < me.limit){
          me.disableMore();
        }
      });
    },

    getItemEl: function(data){
      var me = this;
      var html = me.tpl(data);
      var $item = $(html);

      $item.data('model', data);
      me.addEvents($item);
      return $item;
    },

    prepend: function(e, data){
      var me = e.data;

      var $item = me.getItemEl(data);
      me.$list.prepend($item);
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

