define([
  'jquery',
  'underscore',
  'backbone',
  'collections/albums',
  'views/album',
  'views/albumAdd',
  'views/albumEdit',
  'text!templates/albumBoard.html',
  'common'
], 
function($, _, Backbone, albums, albumView, albumAddDialog, albumEditDialog, albumBoardTemplate, Common){


  var albumBoard = Backbone.View.extend({

    tagName: 'div',

    template:  _.template( albumBoardTemplate ),

    events: {
      'click .more-link': 'append'
    },

    limit: 10,

    initialize: function(cfg) {

      $.extend(this, cfg);

      this.listenTo(albums, 'add', this.appendOne);
      this.listenTo(albums, 'prepend', this.prependOne);
      this.listenTo(albums, 'reset', this.resetBoard);

    },

    authorize: function(){
      var user = Common.user;

      if(!user.creatable){
        $('.add-button', this.$el).remove();
      }else if(!Common.albumAddDialog){
        Common.albumAddDialog = new albumAddDialog();
      }

      if(user.editable && !Common.albumEditDialog){
        Common.albumEditDialog = new albumEditDialog();
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

      albums.reset();

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
        start: albums.length,
        limit: this.limit
      });

      if(this.query){
        data += '&' + this.query;
      }

      this.enableMore();

      albums.fetch({
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
      var album = albums.get(id);
      var view = new albumView({ 
        model: album, 
        hasTools: true
      });

      this.$list.prepend( view.render().el );

      Common.resize();
    },

    appendOne: function( album ) {
      var view = new albumView({ 
        model: album, 
        hasTools: true
      });

      this.$list.append( view.render().el );
    },

    destroy: function(){

      this.$el.remove();
      albums.reset();

      this.undelegateEvents();
      this.stopListening();

      this.remove();

    }
  });

  return albumBoard;
});

