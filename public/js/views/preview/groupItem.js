define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/preview/groupItem.html',
  'bootbox',
  'common'
], 
function($, _, Backbone, itemTpl, Common){

  var GroupItemView = Backbone.View.extend({

    tagName: 'li',

    template: _.template( itemTpl ),

    events: {
      'click a': 'navigate'
    },

    initialize: function() {
      this.listenTo(this.model, 'destroy', this.remove);
      this.listenTo(this.model, 'active', this.activate);
      this.listenTo(this.model, 'inactive', this.inactivate);
    },

    activate: function(){
      this.$link.addClass('active');
    },

    inactivate: function(){
      this.$link.removeClass('active');
    },

    render: function() {

      this.$el.html( this.template( this.model.toJSON() ) );

      this.$link = $('a', this.$el);

      return this;
    },

    navigate: function(e){

      e.preventDefault();

      var aid = this.model.get('aid');
      var id = this.model.id;

      Backbone.history.navigate('album/'+ aid + '/' + id, true);
    }
  });

  return GroupItemView;

});