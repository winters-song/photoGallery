define(['underscore', 'backbone'], function(_, Backbone) {
  
  var MenuItem = Backbone.Model.extend({
    defaults: {
      title: '',
      name: ''
    }
  });

  return MenuItem;

});