define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/home/board.html',
  'views/home/hexbin',
  'common'
], 
function($, _, Backbone, homeTpl, Hexbin, Common ){


  var HomeBoard = Backbone.View.extend({

    tagName: 'div',

    template: _.template( homeTpl ),

    events: {
      // 'click .nav li': 'onSwitch'
    },

    currentTab: 0,

    initialize: function() {
      this.on('afterrender', this.afterRender);
    },

    render: function () {

      this.$el.html( this.template() );

      return this;

    },

    afterRender: function(){

      var el = this.$el.find('#examples');
      this.hexbin = new Hexbin(el);

    },

    destroy: function(){

      this.$el.remove();

      this.undelegateEvents();
      //Remove view from DOM
      this.remove();

    }

  });

  return HomeBoard;
});

