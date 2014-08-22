define(['underscore', 'backbone'], function(_, Backbone) {
  
  var Country = Backbone.Model.extend({
    defaults: {
      title: ''
    }
  });

  return Country;
});