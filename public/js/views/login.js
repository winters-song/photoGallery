define([
  'jquery',
  'underscore',
  'backbone',
  'bootbox',
  'common'
], 
function($, _, Backbone, bootbox, Common){

  var LoginView = Backbone.View.extend({

    el: '#tbar',

    events: {
      'click #logout' : 'logout'
    },

    initialize: function(cfg) {

      this.setName(cfg.name);

    },

    setName: function(name){

      this.name = name;
      $('.name', this.$el).text(name);

      if($('html').hasClass('lt-ie8')){
        this.$el.css('z-index', 21).prependTo($('#app'));
      }

    },

    logout: function(e){

      e.preventDefault();

      bootbox.confirm("确定要退出吗？", function(state){
        if(!state){
          return;
        }
        
        $.ajax({
          url: Common.logoutUrl,
          cache: false
        }).always(function(){
          window.location.href="/login";
        });
      });
    }
  
  });

  return LoginView;

});