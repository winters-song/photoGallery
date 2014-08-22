define([
  'jquery',
  'underscore',
  'backbone',
  'models/album',
  'collections/photos',
  'views/photo',
  'views/photoAdd',
  'views/photoEdit',
  'text!templates/albumPhoto.html',
  'common'
], 
function($, _, Backbone, Album, photos, photoView, photoAddDialog, photoEditDialog, albumPhotoTemplate, Common){

  var album = new Album();

  var photoBoard = Backbone.View.extend({

    tagName: 'div',

    template:  _.template( albumPhotoTemplate ),

    events: {
      'click .back-btn': 'close',
      'click .more-link': 'append',
      'click .add-button': 'setAid'
    },

    limit: 10,

    initialize: function(cfg) {

      $.extend(this, cfg);

      this.aid = cfg.params.id;

      album.set(cfg.params);

      this.listenTo(album, 'load', this.renderTitle);

      this.listenTo(photos, 'add', this.appendOne);
      this.listenTo(photos, 'prepend', this.prependOne);
      this.listenTo(photos, 'reset', Common.resetBoard);

    },

    setAid: function(){
      Common.photoAddDialog.setAid(this.aid);
    },

    renderTitle: function(){

      this.$title.html(album.get('title'));
    },

    authorize: function(){
      var user = Common.user;

      if(!user.creatable){
        $('.add-button', this.$el).remove();
      }else if(!Common.photoAddDialog){
        Common.photoAddDialog = new photoAddDialog();
      }

      if(user.editable && !Common.photoEditDialog){
        Common.photoEditDialog = new photoEditDialog();
      }

    },

    render: function(){

      this.$el.html( this.template() );

      this.$list = $('.thumbs', this.$el);

      this.$more = $('.more-link', this.$el);

      this.authorize();

      this.append();

      this.$title = $('.title', this.$el);

      album.fetch({
        success: function(model){
          model.trigger('load');
        }
      });

      return this;
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
        aid: this.aid,
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

    close: function(e){

      e.preventDefault();

      var length = Common.pageStack.length;
      if(length > 1 && Common.pageStack[length - 2].term == 'home'){
        Backbone.history.navigate('/home', true);
      }else{
        Backbone.history.navigate('/albums', true);
      }

      
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

