define(['underscore', 'backbone'], function(_, Backbone) {
  
  var Album = Backbone.Model.extend({
    defaults: {
      title: '',
      author: '',
      shoot_time: '',
      shoot_site: '',
      description: '',
      create_time: '',
      update_time: '',
      years: '',
      category: '',
      country: '',
      thumb: "/img/default-thumb.jpg",
      status: ''
    },
    urlRoot: function(){
      return "/api/albums";
    },
    parse: function(response) {
      response.id = response._id;
      return response;
    }
  });

  return Album;

});