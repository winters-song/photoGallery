define([
  'underscore',
  'backbone',
  'models/album'
], 
function(_, Backbone, album){

  var albumsCollection = Backbone.Collection.extend({
    model: album,
    url: '/api/albums'
  });

  return new albumsCollection();

});