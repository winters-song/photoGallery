define([
  'jquery',
  'underscore',
  'text!templates/photo/addDialog.html',
  'common',
  "fileupload",
  'load-image',
  'tmpl',
  'iframe-transport',
  'fileupload-image',
  'fileupload-validate'
], 
function($, _, tpl, Common){
  'use strict';

  var AddDialog = function(){
    this.render();
  };

  AddDialog.prototype = {

    submitText: 'OK',

    uploadUrl: '/api/photo',

    render: function(){
      var me = this;

      me.$el = $(tpl);

      $("body").append(me.$el);

      me.$form = $('form', me.$el);

      me.$err = $('.error-info', me.$el);

      me.$submit = $('.submit-btn', me.$el);
      me.$preview = $('.preview', me.$el);
      me.$file = $('.fileupload', me.$el);
      me.$aid = $('[name=aid]', me.$el);

      me.initEvents();

      me.initFileUpload();

      return this;
    },

    submit: function(e){
      e.preventDefault();

      var me = e.data;

      var $this = me.$submit,
        data = $this.data();

      if(me.validate(data)){
        $this
          .off('click')
          .text('Abort')
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
        err = 'You haven\'t select an image！';
      }else{
        res = true;
      }

      me.$err.html(err);

      return res;
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

    setAid: function(aid){
      var me = this;
      me.aid = aid;
      me.$aid.val(aid);
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
          alert('Upload Failed!');
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

          $(Common).triggerHandler('prepend', data.result);

          var node = data.context;

          $(node).empty();
          me.$submit.removeData();
          me.$submit.on('click', me, me.submit);
        }else{
          alert('Upload failed!');
        }

      }).on('fileuploadfail', function (e, data) {

        alert('Upload failed!');

      }).prop('disabled', !$.support.fileInput)
        .parent().addClass($.support.fileInput ? undefined : 'disabled');
    }
  };

  return AddDialog;
});

