define([
  'jquery',
  'underscore',
  'backbone',
  'collections/groupItems',
  'views/preview/groupItem',
  'common',
  'transit',
  'queryString'
], 
function($, _, Backbone, groupItems, groupItem, Common){

  var GroupMenuView = Backbone.View.extend({

    el: '#thumb-list',

    events: {
      'click .close-btn' : 'onHide'
    },

    speed: 500,

    isExpanded: false,

    initialize: function() {
      this.$list = $('.thumb-list ul', this.$el);
      this.$counter = $('.counter', this.$el);

      this.listenTo(groupItems, 'add', this.add);
      this.listenTo(groupItems, 'reset', Common.resetBoard);
    },

    add: function( photo ) {
      var view = new groupItem({ 
        model: photo
      });

      this.$list.append( view.render().el );
    },

    setLength: function(num){
      this.$counter.text(num);
    },

    setActive: function(id){
      var me = this;

      var item = groupItems.get(id);

      if(this.lastActive){
        this.lastActive.trigger('inactive');
      }

      if(item){
        item.trigger('active');
        this.lastActive = item;
      }

    },

    toggle: function(){
      if(this.isExpanded){
        this.collapse();
      }else{
        this.expand();
      }
    },

    expand: function(){

      var me = this;

      if(me.isAnimating){
        return;
      }

      me.isAnimating = true;

      var height = me.$el.height();

      me.$el.css({
        bottom: -height
      }).show().stop().animate({
        bottom:0
      }, me.speed, function(){
        me.isAnimating = false;
        me.isExpanded = true;
      });
    },

    collapse:function(){

      var me = this;

      if(me.isAnimating){
        return;
      }

      me.isAnimating = true;

      var height = me.$el.height();

      me.$el.stop().animate({
        bottom: -height
      }, me.speed, function(){
        me.isAnimating = false;
        me.isExpanded = false;
        $(this).hide();
      });
    },

    onHide: function(e){
      e.preventDefault();
      this.collapse();
    },

    destroy: function(){
      this.lastActive = null;
    }
  
  });

  return GroupMenuView;

});