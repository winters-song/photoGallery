define([
  'jquery',
  'underscore',
  'text!templates/photo/editDialog.html',
  'common',
  'fileupload',
  'load-image',
  'tmpl',
  'iframe-transport',
  'fileupload-image',
  'fileupload-validate'
], 
function($, _, tpl, Common){
  'use strict';

  var EditDialog = function(){
    this.render();
  };

  EditDialog.prototype = {

    targetEl: null,
    model: null,

    submitText: 'OK',

    uploadUrl: '/api/photo/',

    fields: ['name', 'tags', 'description'],

    render: function(){
      var me = this;

      me.$el = $(tpl);

      $('body').append(me.$el);

      me.$form = $('form', me.$el);

      me.$err = $('.error-info', me.$el);

      me.$submit = $('.submit-btn', me.$el);
      me.$preview = $('.preview', me.$el);
      me.$file = $('.fileupload', me.$el);

      me.initEvents();

      me.initFileUpload();

      return this;
    },

    submit: function(e){
      e.preventDefault();

      var me = e.data;

      var $this = me.$submit,
        data = $this.data();

      if(me.validate()){
        if(data.files && data.files.length){

          $this
          .off('click')
          .text('Abort')
          .on('click', function () {
            data.abort();
          });
          data.submit().always(function () {
            $this.text(me.submitText);
          });

        }else{

          data = me.$form.serializeArray();

          var cfg = {};

          _.each(data, function(obj){
            cfg[obj.name] = obj.value;
          });

          delete cfg.file;

          if(me.model){

            $.ajax({
              url: me.uploadUrl + me.model._id,
              data: data,
              type: 'PUT',
              cache: false,
              dataType: 'json'
            }).done(function(data){
              if(data && data.success){
                me.$el.modal('hide');
                $(Common).triggerHandler('update', [me.targetEl, data, true]);
              }else{
                bootbox.alert('Edit Failed!');
              }
              
            }).fail(function(){
              bootbox.alert('Edit Failed!');
            });
            
          }
          
        }
      }
      
    },

    set: function(el, model){
      var me = this;

      me.targetEl = el;
      me.model = model;
      me.$form[0].reset();

      _.each(me.fields, function(val){
        $('[name='+val+']', me.$el).val(model[val]);
      });

      me.$preview.html('<img src='+model.thumb+' style="width:100px;" >');

      return me;
    },

    show: function(){
      this.$el.modal('show');
    },

    hide: function(){
      this.$form[0].reset();
      this.$el.modal('hide');
    },

    edit: function(e) {

      e.preventDefault();
      e.stopPropagation();

      Common.photoEditDialog.set(this.model).show();
    },

    validate: function(){
      return true;
    },


    initEvents: function(){
      var me = this;

      me.$el.on('hidden.bs.modal', function (e) {
        Common.enableNiceScroll();
        me.reset();
      });

      me.$el.on('shown.bs.modal', function (e) {
        Common.disableNiceScroll();
      });

      me.$submit.on('click', me, me.submit);
    },

    reset: function(){
      var me = this;

      me.$form[0].reset();
      me.$preview.empty();
      me.$err.html('');
    },

    initFileUpload: function(){
      var me = this;

      me.$file.fileupload({
        // url: '/api/photos',
        type: 'PUT',
        dataType: 'json',
        autoUpload: false,
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        maxFileSize: 5000000, // 5 MB
        maxNumberOfFiles: 1,
        previewMaxWidth: 100,
        previewMaxHeight: 80,
        previewCrop: true
      }).on('fileuploadadd', function (e, data) {

        $(this).fileupload('option', 'url', me.uploadUrl + me.model._id);

        data.context = me.$preview;

        $.each(data.files, function (index, file) {
          var node = $('<p/>').text(file.name);
          data.context.html(node);
          me.$submit.data(data);
        });

      }).on('fileuploadprocessalways', function (e, data) {
        var index = data.index,
            file = data.files[index],
            node = data.context;
        if (file.preview) {
          node.prepend(file.preview);

          var $progress = $('<div class="progress"><div class="progress-bar progress-bar-success"></div></div>');
          node.append($progress);
          
        }
        if (file.error) {
          bootbox.alert('Edit Failed!');
        }
        if (index + 1 === data.files.length) {
          me.$submit.text(me.submitText).prop('disabled', !!data.files.error);
        }

      }).on('fileuploadprogressall', function (e, data) {

        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('.progress-bar', data.context).css(
            'width',
            progress + '%'
        );

      }).on('fileuploaddone', function (e, data) {

        if(data.result._id) {

          me.$el.modal('hide');

          var json = data.result;

          $(Common).triggerHandler('update', [me.targetEl, json, true]);

          var node = data.context;

          $(node).empty();
          me.$submit.removeData();
        } else {
          bootbox.alert('Edit failed!');
        }

      }).on('fileuploadfail', function (e, data) {

        bootbox.alert('Edit failed!');

      }).prop('disabled', !$.support.fileInput)
        .parent().addClass($.support.fileInput ? undefined : 'disabled');
    },
  };

  return EditDialog;
});

