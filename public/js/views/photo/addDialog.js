define([
  'jquery',
  'underscore',
  'backbone',
  'collections/photos',
  'text!templates/photo/addDialog.html',
  'common',
  "fileupload",
  'load-image',
  'tmpl',
  'iframe-transport',
  'fileupload-image',
  'fileupload-validate'
], 
function($, _, Backbone, photos, photoAddTemplate, Common){

  var photoAddDialog = Backbone.View.extend({

    template:  _.template( photoAddTemplate ),

    events: {
      'click .submit-btn': 'submit'
    },

    submitText: '确定',

    uploadUrl: '/api/photo',

    initialize: function() {
      this.render();
    },

    submit: function(){
      var me = this;

      var $this = me.$submit,
        data = $this.data();

      if(me.validate(data)){
        $this
          .off('click')
          .text('中断')
          .on('click', function () {
            data.abort();
          });
        data.submit().always(function () {
          $this.text(me.submitText);
        });
      }
      
    },

    validate: function(data){

      var me = this;
      var res = false;
      var err = '';
      var cfg = {};

      var values = me.$form.serializeArray();

      _.each(values, function(obj, key){
        cfg[obj.name] = obj.value;
      });

      if(!(data.files && data.files.length)){
        err = '请选择图片！';
      }else{
        res = true;
      }

      me.$err.html(err);

      return res;

    },

    setAid: function(aid){
      this.aid = aid;
      this.$aid.val(aid);
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
      me.$aid = $('[name=aid]', me.$el);

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

      me.aid = null;
      me.$form[0].reset();
      me.$preview.empty();
      me.$err.html('');

    },

    initFileUpload: function(){
      var me = this;

      me.$file.fileupload({
        url: me.uploadUrl,
        dataType: 'json',
        autoUpload: false,
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        maxFileSize: 5000000, // 5 MB
        maxNumberOfFiles: 1,
        previewMaxWidth: 100,
        previewMaxHeight: 80,
        previewCrop: true
      }).on('fileuploadadd', function (e, data) {

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

            var id = data.result._id;
            data.result.id = id;
            data.result._id = null;
            photos.add(data.result, {
              silent : true
            });
            photos.trigger('prepend', id);

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

  return photoAddDialog;
});

