define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/menuitem.html',
  'common'
], 
function($, _, Backbone, menuitemTemplate, Common){

  var MenuItemView = Backbone.View.extend({

    tagName: 'li',

    events: {
      'click a': 'navigate'
    },

    template: _.template( menuitemTemplate ),

    initialize: function() {

    },
    // Rerenders the titles of the todo item.
    render: function() {
      this.$el.html( this.template( this.model.toJSON() ) );

      return this;
    },


    navigate: function(e){

      e.preventDefault();

      var term = this.model.get('name');

      Backbone.history.navigate(term, true);
    }
  });

  return MenuItemView;

});