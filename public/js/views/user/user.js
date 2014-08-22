define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/user.html',
  'bootbox',
  'common'
], 
function($, _, Backbone, userTemplate, bootbox, Common){

  var UserView = Backbone.View.extend({

    tagName: 'tr',

    template: _.template( userTemplate ),

    events: {
      'click input[type=checkbox]': 'toggle',
      'click .edit-btn': 'edit',
      'click .destroy-btn': 'confirmDelete'
    },

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {

      console.log('render');
      this.$el.html( this.template( this.model.toJSON() ) );

      this.$checkbox = $('input[type=checkbox]', this.$el);

      return this;
    },

    toggle: function(){
      var cfg = {
        creatable: false,
        editable: false,
        deletable: false
      }

      $('input:checked',this.$el).each(function(){
        var label = $(this).data('label');
        if(cfg[label]===false){
          cfg[label] = true;
        }
      });

      this.model.save(cfg, Common.syncOption);
      
    },

    edit: function() {

      var me = this;

      bootbox.prompt("请输入新密码：", function(result, a, b) {        

        //result === null when click Cancel Button
        if (result !== null) {                                             

          if(result === ''){
            Backbone.trigger('msg', "密码不能为空");
          }else{
            
            $.ajax({
              url: '/api/password/'+ me.model.id,
              type: 'put',
              data: $.param({
                password: result
              }),
              dataType: 'json'
            }).done(function(data){
              
            });
            
          }
        }
      });
    },

    close: function() {
      var value = $.trim(this.$input.val());
      if ( value ) {
        this.model.save({ title: value }, {
          error: function(){
            alert('失败');
          }
        });
      }
      this.$el.removeClass('editing');
    },

    confirmDelete: function(e){

      e.preventDefault();
      var me = this;

      bootbox.confirm("确定要删除该账号吗？", function(state){
        if(!state){
          return;
        }
        
        me.model.destroy(Common.syncOption);
      });
    }

  });

  return UserView;

});