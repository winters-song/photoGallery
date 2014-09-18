define([
  'jquery',
  'underscore',
  'text!templates/footer.html',
  'common'
], 
function($, _, tpl, Common){
  'use strict';

  var FooterView = function(){
    var me = this;

    me.render();
  };

  FooterView.prototype = {

    render: function(){
      var me = this;
      me.$el = $('#main-footer');

      var $tpl = $(tpl);

      me.$el.append($tpl);
      
      $('#weixin-btn', me.$el).popover({
        content: '<img src="/img/weixin.png" class="code" width="120" height="120">',
        html: true,
        placement: 'top',
        trigger: 'hover'
      });

    }

  };

  return FooterView;
});

