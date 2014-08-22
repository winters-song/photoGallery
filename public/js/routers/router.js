/*global define*/
define([
  'jquery',
  'backbone',
  'common'
], function ($, Backbone, Common) {
  'use strict';

  var Router = Backbone.Router.extend({
    routes: {
      '': 'home',
      'home': 'home',
      
      'photos': 'photos',
      "photos/*query": "photos",

      'photo/:id': 'photo',
      'photo/:id/*query': 'photo',

      'albums': 'albums',
      'albums/*query': 'albums',

      'album/:aid': 'album',
      'album/:aid/:id': 'group',
      'users': 'users'
    },

    home: function () {
      this.handle('home', 1);
    },

    photos: function(q){
      if(q){
        this.handle('photos', 1, {
          query: q
        });
      }else{
        this.handle('photos', 1);
      }
    },

    photo: function(id, q){

      var params = {
        id: id,
        type: 'single'
      }

      if(q){
        params.query = q;
      }

      this.handle('photo', 2, params);
    },

    albums: function (q) {
      if(q){
        this.handle('albums', 1, {
          query: q
        });
      }else{
        this.handle('albums', 1);
      }
    },

    album: function(aid){
      this.handle('album', 2, {
        id: aid
      });
    },

    group: function(aid, id){

      this.handle('group', 3, {
        aid: aid,
        id: id
      });
    },

    users: function () {
      if(!Common.isRoot){
        return window.location.href = "/home";
      }
      this.handle('users', 1);
    },


    handle: function (term, level, params) {

      var len = Common.pageStack.length;

      var page,desPage;

      if(len){
        var currentPage = Common.pageStack[len - 1];

        //enter
        if(level > currentPage.level){

          page = {
            term: term,
            level: level,
            params: params
          };

          Common.pageStack.push(page);
          Backbone.trigger('in', page, currentPage);
          
        }else if(level == currentPage.level){

          if(term == currentPage.term){

            currentPage.params = params;

            Backbone.trigger('paging', currentPage);
            
          }
          //change navigation
          else{

            page = Common.pageStack.pop();

            Common.pageStack.push({
              term: term,
              level: level,
              params: params
            });
            desPage = Common.pageStack[Common.pageStack.length -1];

            Backbone.trigger('out-in', page, desPage);
          }
        }
        // out 
        else if(level < currentPage.level){

          page = Common.pageStack.pop();

          var parentPage;

          desPage = {
            term: term,
            level: level,
            params: params
          };

          if(Common.pageStack.length){
            parentPage = Common.pageStack[Common.pageStack.length -1];

            // back to parent's siblings page
            if(parentPage.term !== term ){
              parentPage = Common.pageStack.pop();
            }
            // back to parent page
            else{
              desPage = parentPage;
              parentPage = null;
            }

          }
    
          Backbone.trigger('out', page, desPage, parentPage);
        }

      }
      // init page
      else{

        page = {
          term: term,
          level: level,
          params: params
        };

        Common.pageStack.push(page);
        Backbone.trigger('in', page);
      }
      
    }

  });

  return Router;
});
