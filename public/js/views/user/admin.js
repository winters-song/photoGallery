define([
  'jquery',
  'underscore',
  'backbone',
  'views/yearBoard',
  'views/categoryBoard',
  'views/userBoard',
  'text!templates/admin.html',
  'common'
], 
function($, _, Backbone, YearBoard, CategoryBoard, UserBoard, adminTemplate, Common){


  var AdminView = Backbone.View.extend({

    tagName: 'div',

    template: _.template( adminTemplate ),

    events: {
      'click .nav li': 'onSwitch'
    },

    currentTab: 0,

    initialize: function() {

    },

    onSwitch: function(e){

      e.preventDefault();

      var tab = $(e.target).data('label');

      this.switchTab(tab);
    },

    switchTab: function(tab){

      this.$navs.removeClass('active').eq(tab).addClass('active');

      if(this.currentBoard){
        this.currentBoard.destroy();
      }

      if(tab == 0){

        this.currentBoard = new YearBoard();

      }else if(tab == 1){

        this.currentBoard = new CategoryBoard();

      }else if(tab == 2){

        this.currentBoard = new UserBoard();

      }

      if(this.currentBoard){
        this.$el.append( this.currentBoard.render().el );
        this.currentBoard.afterrender();
      }


    },

    render: function () {

      this.$el.html( this.template() );

      this.$navs = $('.nav li', this.$el);

      this.switchTab(this.currentTab);

      return this;

    },

    destroy: function(){

      this.$el.remove();

      this.currentBoard.destroy();

      this.undelegateEvents();

      //Remove view from DOM
      this.remove();

    }

  });

  return AdminView;
});

