define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/photo/item.html',
  'bootbox',
  'common'
], 
function($, _, Backbone, itemTpl, bootbox, Common){

  bootbox.dialog({
    title: "That html",
    message: 'asdfasdf'
  }).show();


  var PhotoView = Backbone.View.extend({

    tagName: 'div',

    className: 'thumb',

    template: _.template( itemTpl ),

    speed: 200,

    events: {
      'click a': 'navigate',
      'click .edit-icon': 'edit',
      'click .delete-icon': 'confirmDelete',
      'mouseenter a': 'onMouseOver',
      'mouseleave a': 'onMouseOut'
    },

    initialize: function(cfg) {
      this.hasTools = !!cfg.hasTools;

      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    authorize: function(){
      var user = Common.user;

      if(!(user.editable || user.deletable) || !this.hasTools){

        this.$tools.remove();

      }else if(!user.editable){

        $('.edit-icon', this.$el).remove();

      }else if(!user.deletable){

        $('.delete-icon', this.$el).remove();

      }

    },

    render: function() {

      this.$el.html( this.template( this.model.toJSON() ) );

      this.$tools = $('.thumb-tools', this.$el);
      this.$title = $('.thumb-bottom', this.$el);

      this.authorize();

      return this;
    },

    edit: function(e) {

      e.preventDefault();
      e.stopPropagation();

      Common.photoEditDialog.set(this.model).show();
    },

    confirmDelete: function(e){

      e.preventDefault();
      e.stopPropagation();
      var me = this;

      bootbox.confirm("确定要删除该图片吗？", function(state){
        if(!state){
          return;
        }
        
        me.model.destroy();
      });
    },

    navigate: function(e){

      e.preventDefault();

      var id = this.model.id;
      var aid = this.model.get('aid');

      var currentPage = Common.pageStack[Common.pageStack.length - 1];

      var p = currentPage.params;
      if(p && p.query){
        Backbone.history.navigate('photo/'+id + '/'+ p.query, true);
      }else if(aid){
        Backbone.history.navigate('album/'+ aid + '/' + id, true);
      }else{
        Backbone.history.navigate('photo/'+id, true);
      }
      
    },

    onMouseOver: function(e){
      if(!Modernizr.csstransitions){
        if(this.hasTools){
          this.$tools.animate({
            top: 0
          }, this.speed);
        }

        this.$title.animate({
          bottom: 0
        }, this.speed);
      }
    },

    onMouseOut: function(e){
      if(!Modernizr.csstransitions){
        if(this.hasTools){
          this.$tools.animate({
            top: -35
          }, this.speed);
        }

        this.$title.animate({
          bottom: -35
        }, this.speed);
      }
    }
  });

  return PhotoView;

});