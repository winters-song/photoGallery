define([
  'jquery',
  'underscore',
  'backbone',
  'collections/photos',
  'text!templates/photo/editDialog.html',
  'common',
  "fileupload",
  'load-image',
  'tmpl',
  'iframe-transport',
  'fileupload-image',
  'fileupload-validate'
], 
function($, _, Backbone, photos, photoEditTemplate, Common){

  var photoEditDialog = Backbone.View.extend({

    template:  _.template( photoEditTemplate ),

    events: {
      'click .submit-btn': 'submit'
    },

    submitText: '确定',

    initialize: function() {

      this.render();

    },

    submit: function(){
      var me = this;

      var $this = me.$submit,
        data = $this.data();

      if(me.validate()){
        if(data.files && data.files.length){

          $this
          .off('click')
          .text('中断')
          .on('click', function () {
            data.abort();
          });
          data.submit().always(function () {
            $this.text(me.submitText);
          });

        }else{

          var data = me.$form.serializeArray();

          var cfg = {};

          _.each(data, function(obj, key){
            cfg[obj.name] = obj.value;
          });

          delete cfg.file;

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
          
        }
      }
      
    },

    set: function(model){

      this.model = model;
      this.$form[0].reset();

      var json = model.toJSON();

      _.each(json, function(value, key){
        $('[name='+key+']', this.$el).val(value);
      });

      this.$preview.html('<img src='+json.thumb+' style="width:100px;" >');

      return this;
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

      var me = this;
      var res = false;
      var err = '';
      var cfg = {};

      var data = me.$form.serializeArray();

      _.each(data, function(obj, key){
        cfg[obj.name] = obj.value;
      });

      if(!cfg.title){
        err = '请填写标题！';
      }else if(!cfg.author){
        err = '请填写作者！';
      }else{
        res = true;
      }

      me.$err.html(err);

      return res;

    },

    render: function(){

      var me = this;

      me.$el = $(this.template());

      $("body").append(me.$el);

      me.$form = $('form', me.$el);

      me.$err = $('.error-info', me.$el);

      me.$submit = $('.submit-btn', me.$el);
      me.$preview = $('.preview', me.$el);
      me.$file = $('.fileupload', me.$el);

      me.initDialog();

      me.initFileUpload();

      return this;
    },

    initDialog: function(){
      var me = this;

      
      me.$el.on('hidden.bs.modal', function (e) {
        Common.enableNiceScroll();
        me.reset();
      });

      me.$el.on('shown.bs.modal', function (e) {
        Common.disableNiceScroll();
      });
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

        $(this).fileupload('option', 'url', '/api/photos/'+ me.model.get('id'));

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
            alert('上传失败');
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
            console.log('上传成功');

            me.$el.modal('hide');

            var json = data.result;

            var id = json._id;
            json.id = id;
            json._id = null;
            me.model.set(json);

            var node = data.context;

            $(node).empty();
            me.$submit.removeData();
          };

      }).on('fileuploadfail', function (e, data) {

          alert('上传失败 failed');

      }).prop('disabled', !$.support.fileInput)
          .parent().addClass($.support.fileInput ? undefined : 'disabled');
    },

    destroy: function(){

      this.stopListening();
      this.$el.empty();
    }
  });

  return photoEditDialog;
});

