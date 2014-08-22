define([
  'jquery',
  'underscore',
  'backbone',
  'collections/users',
  'views/user',
  'text!templates/userBoard.html',
  'common',
  'ezpz_hint'
], 
function($, _, Backbone, Users, UserView, userBoardTemplate, Common){

  var userBoard = Backbone.View.extend({

    tagName: 'div',

    template:  _.template( userBoardTemplate ),

    events: {
      'keypress .create': 'createOnEnter',
      'click .create-btn': 'create'
    },

    initialize: function() {

      this.listenTo(Users, 'add', this.addOne);

    },

    resetBoard: function(collection, options){
      var models = options.previousModels;
      _.each(models, function(model){
        model.id = null;
        model.destroy();
      });
    }, 

    render: function(){

      this.$el.html( this.template() );

      this.$name = $('input[name=name]', this.$el);
      this.$password = $('input[name=password]', this.$el);
      this.$list = $('.user-list', this.$el);

      if(!Modernizr.indexeddb){
        this.$name.ezpz_hint();
        this.$password.ezpz_hint();
      }

      return this;
    },

    afterrender: function(){

      Users.fetch();
    },

    addOne: function( user ) {
      var view = new UserView({ model: user });
      this.$list.append( view.render().el );
    },

    create: function(){
      var name = this.$name.val().trim();
      var password = this.$password.val().trim();
      if(name && password){

        Users.create({
          name: name,
          password: password
        }, Common.syncOption);

        this.$name.val('');
        this.$password.val('');

      }
    },

    createOnEnter: function( event ) {
      var val = this.$input.val().trim();
      if ( event.which !== Common.ENTER_KEY || !val ) {
        return;
      }
  
    },

    destroy: function(){
      
      this.undelegateEvents();
      Users.reset();
      this.stopListening();

      // this.$el.remove();
      this.remove();

    }
  });

  return userBoard;
});

