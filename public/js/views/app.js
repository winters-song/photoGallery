define([
  'jquery',
  'underscore',
  'backbone',
  'views/login',
  'views/navigation',
  // 'views/search',
  'views/home/board',
  'views/photo/board',
  // 'views/albumBoard',
  // 'views/albumPhoto',
  // 'views/admin',
  'views/preview/board',
  'bootbox',
  'common',
  'hexbin'
],
function($, _, Backbone, 
  LoginView, 
  NavigationView, 
  // SearchView, 
  HomeBoard, 
  PhotoBoard, 
  // AlbumBoard,
  // AlbumPhoto,
  // AdminView,
  PreviewBoard, 
  bootbox,
  Common){

	var AppView = Backbone.View.extend({
    
		el: '#app',

    events: {
      'click #top-btn': 'scrollToTop'
    },

		initialize: function() {

      var me = this;

      Backbone.on('msg', function(msg){
        bootbox.alert(msg);
      });

      $.ajax({
        url: Common.checkLoginUrl,
        cache: false,
        dataType: 'json',
        context: me
      }).done(function(data){

        if(data && data.success){
          this.render(data);
        }else{
          bootbox.alert("您还没有登录！", function() {
            window.location.href = "/login";
          });
        }

      }).fail(function(){
        bootbox.alert("您还没有登录！", function() {
          window.location.href = "/login";
        });
      });

      this.$board = $("#board");
      this.$subboard = $("#sub-board");
      
    },

    render: function(data){

      this.$topBtn = $('#top-btn');

      this.$topBtn.affix({
        offset: {
          top: 180
        }
      });

      Common.user = data;

      Common.isRoot = Common.user.root;

      Backbone.on('in', this.enter, this);
      Backbone.on('out', this.exit, this);
      Backbone.on('out-in', this.toggle, this);
      Backbone.on('paging', this.paging, this);

      this.loginView = new LoginView({ name: data.name });

      this.navigationView = new NavigationView();

      // this.searchView = new SearchView();
      // this.$el.append(this.searchView.render().el);
      // this.searchView.expand();

      var page = Common.pageStack[0];

      this.enter(page);

    },

    scrollToTop: function(e){
      e.preventDefault();

      $("body").animate({
        scrollTop: 0
      });
      $("html").animate({
        scrollTop: 0
      });
    },

    createBasePage: function(type, params){
      var view;

      switch(type){
        case 'home': 
          view = new HomeBoard();
          break;
        case 'photos': 
          view = new PhotoBoard(params);
          break;
        case 'albums': 
          // view = new AlbumBoardView(params);
          break;
        case 'users': 
          // view = new AdminView();
          break;
      }

      this.$board.html(view.render().el);
      view.trigger('afterrender');

      return view;

    },


    enter: function(page, parent){

      if(!page){
        return;
      }

      var currentView;

      if(page.level == 1){
        this.navigationView.setActive(page.term);

        currentView = this.createBasePage(page.term, page.params);

      } else if (page.level == 2){

        switch(page.term){
          case 'photo': 
            currentView = new PreviewBoard({
              params: page.params
            });
            Common.disableNiceScroll();
            break;
          case 'album':

            if(parent){
              parent.view.$el.hide();

              if(parent.term == 'home'){
                this.navigationView.setActive('home');
              }
            }else{
              this.navigationView.setActive('albums');
            }

            currentView = new AlbumPhotoView({
              params: page.params
            });
            this.$subboard.html(currentView.render().el);
            break;

        } // end of switch

      } else if (page.level == 3){

        switch(page.term){
          case 'group': 
            currentView = new PreviewBoard({
              params: page.params
            });
            Common.disableNiceScroll();
            break;
        }
      }

      // this.searchView.set(page);

      if(currentView){
        page.view = currentView;
        currentView.$el.css({ opacity: 0}).animate({ opacity: 1});
      }
      
      // this.currentView.destroy();
    },

    exit: function(page, desPage, parent){

      var currentView;

      if(page.view){
        page.view.destroy();
        Common.enableNiceScroll();
      }

      if(parent && parent.view){
        parent.view.destroy();
      }else if(desPage && desPage.view) {
        desPage.view.$el.show();
      }

      if(!Common.pageStack.length){
        Common.pageStack.push(desPage);
        this.enter(desPage);
      }

    },

    toggle: function(page, desPage){

      var currentView;

      if(page.level == 1){

        if(page.view){
          page.view.destroy();
        }

        this.navigationView.setActive(desPage.term);

        currentView = this.createBasePage(desPage.term, desPage.params);

        // this.searchView.set(desPage);

        if(currentView){
          desPage.view = currentView;
          currentView.$el.css({ opacity: 0}).animate({ opacity: 1});
        }
        
      }
      
    },

    paging: function(page){
      if(page.view){
        page.view.paging(page.params);
      }
    }

  });

	return AppView;

});