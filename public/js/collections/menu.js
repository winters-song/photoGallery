define([
  'underscore',
  'backbone',
  'models/menuitem'
], 
function(_, Backbone, MenuItem){

  var menuCollection = Backbone.Collection.extend({
    model: MenuItem
  });

  return new menuCollection();

});