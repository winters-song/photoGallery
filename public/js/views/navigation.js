define([
  'jquery',
  'underscore',
  'backbone',
  'views/menuitem',
  'collections/menu',
  'common'
], 
function($, _, Backbone, menuItemView, menuItems, Common){

  var MenuView = Backbone.View.extend({

    el: '#main-nav',

    initialize: function() {

      this.$list = $('ul', this.$el);

      this.listenTo(menuItems, 'add', this.addOne);

      if(!Common.isRoot){
        Common.menu.pop();
      }
      
      menuItems.add(Common.menu);

      if(Common.currentPage){
        this.setActive(Common.currentPage);
      }

    },

    addOne: function( todo ) {
      var view = new menuItemView({ model: todo });
      this.$list.append( view.render().el );
    },

    setActive: function(term){
      var me = this;

      var model = menuItems.findWhere({ 
        name: term
      });

      var index = menuItems.indexOf(model);
      $('a',this.$list).removeClass('active')
      .eq(index).addClass('active');

    }
  
  });

  return MenuView;

});