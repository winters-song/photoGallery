define(['underscore', 'backbone'], function(_, Backbone) {
  
  var User = Backbone.Model.extend({
    defaults: {
      name: '',
      creatable: false,
      editable: false,
      deletable: false,
      root: '',
      password: '',
      create_time: ''
    },
    parse: function(response) {
      response.id = response._id;
      return response;
    }
  });

  return User;

});