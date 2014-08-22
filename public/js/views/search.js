define([
  'jquery',
  'underscore',
  'backbone',
  'collections/years',
  'collections/category',
  'collections/country',
  'text!templates/search.html',
  'common',
  'ezpz_hint',
  'transit',
  'queryString'
], 
function($, _, Backbone, Years, Category, Country, searchTemplate, Common){

  var SearchView = Backbone.View.extend({

    tagName: 'div',

    id: 'search',

    template: _.template( searchTemplate ),

    events: {
      'submit form' : 'doSearch',
      'click .search-btn': 'doSearch',
      'click h2': 'toggle',
      'click .collapse': 'collapse'
    },

    isAnimating: false,

    isExpanded: false,

    initialize: function(cfg) {

    },

    set: function(page){

      var term = page.term;

      // if(term == 'users'){
      //   this.collapse();
      // }else{
      //   this.expand();
      // }

      if(page.params && page.params.query){
        var json = page.params.query.queryStringToJSON();

        $.extend(this, {
          years: json.years,
          category : json.category,
          country : json.country
        });

        if(json.title){
          this.$keywords.val(json.title);
          this.$by.val('title');
        }

        if(json.author){
          this.$keywords.val(json.author);
          this.$by.val('author');
        }


        if(json.years){
          if(Common.yearsLoaded){
            this.$year.val(json.years);
          }
        }
        
        if(json.category){
          if(Common.categoryLoaded){
            this.$category.val(json.category);
          }
        }

        if(json.country){
          if(Common.countryLoaded){
            this.$country.val(json.country);
          }
        }

      }

    },

    render: function(){

      var me = this;

      me.$el.html(me.template());

      me.$el.affix({
        offset: {
          top: 180
        }
      });

      me.$form      = $('form', me.$el);
      me.$keywords  = $('[name=keywords]', me.$el);
      me.$by        = $('[name=by]', me.$el);
      me.$year      = $('[name=years]', me.$el);
      me.$category  = $('[name=category]', me.$el);
      me.$country  = $('[name=country]', me.$el);

      if(!Modernizr.indexeddb){
        me.$keywords.ezpz_hint();
      }

      this.listenTo(Years, 'sort', this.addYears);

      if(Common.yearsLoaded){
        this.addYears();
      }else{
        Years.fetch({
          silent: true,
          success: function(){
            Common.yearsLoaded = true;
            Years.sort();
            me.$year.val(me.years);
          }
        });
      }

      if(Common.categoryLoaded){
        this.addCategories();
      }else{
        Category.fetch({
          silent: true,
          success: function(){
            Common.categoryLoaded = true;
            me.addCategories();
            me.$category.val(me.category);
          }
        });
      }

      if(Common.countryLoaded){
        this.addCountries();
      }else{
        Country.fetch({
          silent: true,
          success: function(){
            Common.countryLoaded = true;
            me.addCountries();
            me.$country.val(me.country);
          }
        });
      }

      return this;
    },

    doSearch: function(e){

      e.preventDefault();

      var values = this.$form.serializeArray();

      var result = {};

      _.each(values, function(i){
        result[i.name] = i.value;
      });

      var type = result.type;

      if(result.keywords){
        var by = result.by;
        result[by] = result.keywords;
        delete result.keywords;
      }

      delete result.type;
      delete result.by;

      _.each(result, function(value, key, obj){
        if(value === ''){
          delete obj[key];
        }
      });

      var str = $.param(result);

      Backbone.history.navigate(type + '/' + str, true);
    },

    addYear: function(year){
      var val = year.get('title');
      this.$year.append('<option value="'+val+'" >'+val+'</option>');
    },

    addYears: function() {

      this.$year.empty();
      this.$year.append('<option value="" >不限</option>');
      Years.each(this.addYear, this);
    },

    addCountry: function(country){
      var val = country.get('title');
      var id = country.get('id');
      this.$country.append('<option value="'+id+'" >'+val+'</option>');
    },

    addCountries: function() {
      this.$country.empty();
      this.$country.append('<option value="" >不限</option>');
      Country.each(this.addCountry, this);
    },

    addCategory: function(category){
      var val = category.get('title');
      var id = category.get('id');
      this.$category.append('<option value="'+id+'" >'+val+'</option>');
    },

    addCategories: function() {

      this.$category.empty();
      this.$category.append('<option value="" >不限</option>');
      Category.each(this.addCategory, this);
    },

    toggle: function(e){
      if(e){
        e.preventDefault();
      }

      if(this.isExpanded){
        this.collapse();
      }else{
        this.expand();
      }
    },

    expand: function(){
      var me = this;

      if(me.isAnimating){
        return;
      }
      me.isAnimating = true;

      me.$form.fadeIn();

      me.$el.animate({
        right: 0
      }, function(){
        $("#main").css({
          'padding-right': 300
        });

        me.isAnimating = false;
        me.isExpanded = true;
        Common.resize();
      });
      
    },

    collapse:function(e){
      var me = this;

      if(e){
        e.preventDefault();
      }

      if(me.isAnimating){
        return;
      }
      me.isAnimating = true;

      me.$form.fadeOut();

      var pos = me.$el.position();

      var right = -235;

      me.$el.animate({
        right: right
      }, function(){
        $("#main").css({
          'padding-right': 65
        });

        me.isAnimating = false;
        me.isExpanded = false;
      });

    }
  
  });

  return SearchView;

});