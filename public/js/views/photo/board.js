define([
  'jquery',
  'underscore',
  'backbone',
  'collections/photos',
  'views/photo/photo',
  'views/photo/addDialog',
  'views/photo/editDialog',
  'text!templates/photo/board.html',
  'common'
], 
function($, _, Backbone, photos, photoView, addDialog, editDialog, boardTpl, Common){

  var photoBoard = Backbone.View.extend({

    tagName: 'div',

    template:  _.template( boardTpl ),

    events: {
      'click .more-link': 'append'
    },

    limit: 20,

    initialize: function(cfg) {

      $.extend(this, cfg);

      this.listenTo(photos, 'add', this.appendOne);
      this.listenTo(photos, 'prepend', this.prependOne);
      this.listenTo(photos, 'reset', Common.resetBoard);
    },

    authorize: function(){
      var user = Common.user;

      if(!user.creatable){
        $('.add-button', this.$el).remove();
      }else if(!Common.photoAddDialog){
        Common.photoAddDialog = new addDialog();
      }

      if(user.editable && !Common.photoEditDialog){
        Common.photoEditDialog = new editDialog();
      }

    },

    render: function(){

      this.$el.html( this.template() );

      this.$list = $('.thumbs', this.$el);

      this.$more = $('.more-link', this.$el);

      this.authorize();

      this.append();

      return this;
    },

    paging: function(params){

      this.$list.empty();

      photos.reset();

      if(params){
        this.query = params.query;
      }else{
        this.query = null;
      }
      
      this.append();
    },

    enableMore: function(){
      this.$more.text('更多');
      this.$more.removeAttr('disabled');
    },

    disableMore: function(){
      this.$more.text('就这些了');
      this.$more.attr('disabled', 'disabled');
    },

    append: function(){

      var me = this;

      var data = $.param({
        start: photos.length,
        limit: this.limit
      });

      if(this.query){
        data += '&' + this.query;
      }

      this.enableMore();

      photos.fetch({
        data: data,
        remove:false,
        context: this,
        error: function (collection, response, options) {
          if(response.responseText){
            Backbone.trigger('msg', response.responseText);
          }
        },
        success: function(collection, response, options){
          if(!response.length){
            me.disableMore();
          }else{

            if(response.length < me.limit){
              me.disableMore();
            }

            Common.resize();
          }
          
        }
      });

    },

    prependOne: function(id) {
      var photo = photos.get(id);
      var view = new photoView({ 
        model: photo, 
        hasTools: true
      });

      this.$list.prepend( view.render().el );

      Common.resize();
    },

    appendOne: function( photo ) {
      var view = new photoView({ 
        model: photo, 
        hasTools: true
      });

      this.$list.append( view.render().el );
    },

    destroy: function(){
      
      this.$el.remove();
      photos.reset();

      this.undelegateEvents();
      this.stopListening();

      this.remove();

    }
  });

  return photoBoard;
});

