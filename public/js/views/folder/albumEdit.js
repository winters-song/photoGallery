define([
  'jquery',
  'underscore',
  'backbone',
  'collections/years',
  'collections/category',
  'collections/country',
  'text!templates/albumEdit.html',
  'common',
  'datepicker-zh'
], 
function($, _, Backbone, Years, Category, Country, albumEditTemplate, Common){

  var albumEditDialog = Backbone.View.extend({

    template:  _.template( albumEditTemplate ),

    events: {
      'click .submit-btn': 'submit'
    },

    initialize: function() {

      this.render();

    },

    set: function(model){

      this.model = model;
      this.$form[0].reset();

      var json = model.toJSON();

      _.each(json, function(value, key){
        $('[name='+key+']', this.$el).val(value);
      });

      var shoot_time = json.shoot_time || '';
      if(shoot_time){
        shoot_time = Common.timestampToString(shoot_time);
        this.$shoot_time.val(shoot_time);
      }

      // console
      return this;
    },

    show: function(){
      this.$el.modal('show');
    },

    hide: function(){
      this.$form[0].reset();
      this.$el.modal('hide');
    },

    submit: function(){
      var me = this;

      var data = me.$form.serializeArray();

      var cfg = {};

      _.each(data, function(obj, key){
        cfg[obj.name] = obj.value;
      });

      if(me.model){
        me.model.save(cfg, {
          wait: true,
          success: function(){
            me.hide();
          },
          error: function(model, response, option){
            Backbone.trigger('msg', response.responseText);
          }
        });
      }

    },

    render: function(){

      var me = this;

      me.$el = $(this.template());

      $("body").append(me.$el);

      me.$year = $('[name=years]', me.$el);
      me.$category = $('[name=category]', me.$el);
      me.$country = $('[name=country]', me.$el);
      me.$shoot_time = $('[name=shoot_time]', me.$el);
      me.$submit = $('.submit-btn', me.$el);

      me.$form = $('form', me.$el);

      this.listenTo(Years, 'sort', this.addYears);
      me.initDialog();

      return this;
    },

    initDialog: function(){
      var me = this;

      if(Common.yearsLoaded){
        this.addYears();
      }else{
        Years.fetch({
          silent: true,
          success: function(){
            Common.yearsLoaded = true;
            Years.sort();
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
          }
        });
      }

      me.$el.on('hidden.bs.modal', function (e) {
        Common.enableNiceScroll();
        me.reset();
      });

      me.$el.on('shown.bs.modal', function (e) {
        Common.disableNiceScroll();

        setTimeout(function(){
          me.$shoot_time.datepicker({
            language: "zh-CN",
            format: "yyyy-mm-dd",
            todayHighlight: true
          });
        },100);
        
      });
    },

    addYear: function(year){
      var val = year.get('title');
      this.$year.append('<option value="'+val+'" >'+val+'</option>');
    },

    addYears: function() {

      this.$year.empty();
      this.$year.append('<option value="" >请选择</option>');
      Years.each(this.addYear, this);
    },

    addCountry: function(country){
      var val = country.get('title');
      var id = country.get('id');
      this.$country.append('<option value="'+id+'" >'+val+'</option>');
    },

    addCountries: function() {
      this.$country.empty();
      this.$country.append('<option value="" >请选择</option>');
      Country.each(this.addCountry, this);
    },

    addCategory: function(category){
      var val = category.get('title');
      var id = category.get('id');
      this.$category.append('<option value="'+id+'" >'+val+'</option>');
    },

    addCategories: function() {

      this.$category.empty();
      this.$category.append('<option value="" >请选择</option>');
      Category.each(this.addCategory, this);
    },

    destroy: function(){

      this.stopListening();

      this.remove();

    }
  });

  return albumEditDialog;
});

