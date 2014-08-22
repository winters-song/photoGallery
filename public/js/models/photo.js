define(['underscore', 'backbone'], function(_, Backbone) {
  
  var Photo = Backbone.Model.extend({
    defaults: {
      aid: '',
      title: '',
      author: '',
      school: '',
      shoot_time: '',
      shoot_site: '',
      description: '',
      upload_time: '',
      update_time: '',
      years: '',
      category: '',
      country: '',
      path: '',
      url: '',
      thumb_path: '',
      thumb: '',
      full_path: '',
      full: '',
      status: ''
    },
    parse: function(response) {
      response.id = response._id;
      return response;
    }
  });

  return Photo;

});