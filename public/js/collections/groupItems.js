define([
  'underscore',
  'backbone',
  'models/photo'
], 
function(_, Backbone, photo){

  var GroupItemsCollection = Backbone.Collection.extend({
    model: photo,
    url: '/api/photos'
  });

  return new GroupItemsCollection();

});