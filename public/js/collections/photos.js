define([
  'underscore',
  'backbone',
  'models/photo'
], 
function(_, Backbone, photo){

  var PhotosCollection = Backbone.Collection.extend({
    model: photo,
    url: '/api/photos'
  });

  return new PhotosCollection();

});