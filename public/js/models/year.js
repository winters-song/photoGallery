define(['underscore', 'backbone'], function(_, Backbone) {
  
  var Year = Backbone.Model.extend({
    defaults: {
      title: ''
    },
    parse: function(response) {
      response.id = response._id;
      return response;
    }
  });

  return Year;
});