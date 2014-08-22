/**
 * PagingBar

 	dependency: jquery, jquery.namespace, jquery.nano
 * 
 * @config
 * 
 * url
 * total
 * currentPage
 * prevText
 * nextText
 * 
 * Example:
 * var paging = new sy.widget.PagingBar({
		url: 'paging.html?page={page}',
		total: total,
		currentPage: currentPage,
		renderTo: 'paging'
	});

	var paging = new sy.widget.PagingBar({		
		total: total,
		currentPage: currentPage,
		renderTo: 'paging',
		onClick: function(){
	
		}
	});
 */
(function(){
	$.ns('sy.widget');
	
	sy.widget.PagingBar = function(obj){
		var me = this;
		$.extend(me, me.defaults, obj);
		
		me.render();

		me.initEvents();
		
	}
	
	sy.widget.PagingBar.prototype = {
			
		defaults:{
			prevText: '上一页',
			nextText: '下一页',
			currentPage: 1,
			url: '#'
		},

		repaint: function(current, total){
			var me = this;

			$("#" + me.renderTo).empty();
			me.currentPage = current;
			me.total = total;

			me.render();
			me.initEvents();

		},

		initEvents: function(){
			var me = this;
			if(me.onClick){
				var val;
				me.el.find('a').on('click', function(e){
					val = $(this).attr('data')*1;
					me.onClick(val);
					e.preventDefault();
				});
			}
		},
		
		render: function(){
			var me = this,
				start = '<ul class="sy-paging">',
				end = '</ul>',
				arr = [start],
				tmp;
			
			if(me.currentPage>1){
				tmp = me.getLi(me.prevText, me.currentPage-1);
				arr.push(tmp);
			}
			
			if(me.total<=7){
				for(var i = 1; i <= me.total; i++){
					if(i == me.currentPage){
						tmp = me.getLi(i, i, true);
					}else{
						tmp = me.getLi(i, i);
					}
					arr.push(tmp);
				}
			}else if(me.currentPage < 5){
				
				for(var i = 1; i <= 6; i++){
					if(i == me.currentPage){
						tmp = me.getLi(i, i, true);
					}else{
						tmp = me.getLi(i, i);
					}
					arr.push(tmp);
				}
				
				tmp = me.getLi();
				arr.push(tmp);
				
				tmp = me.getLi(me.total, me.total);
				arr.push(tmp);
				
			}else if(me.currentPage > me.total - 5){
				
				tmp = me.getLi(1, 1);
				arr.push(tmp);
				
				tmp = me.getLi();
				arr.push(tmp);
				
				for(var i = me.total - 5; i <= me.total; i++){
					if(i == me.currentPage){
						tmp = me.getLi(i, i, true);
					}else{
						tmp = me.getLi(i, i);
					}
					arr.push(tmp);
				}
			}else{
				
				tmp = me.getLi(1, 1);
				arr.push(tmp);
				
				tmp = me.getLi();
				arr.push(tmp);
				
				for(var i = me.currentPage - 2; i <= me.currentPage + 2; i++){
					if(i == me.currentPage){
						tmp = me.getLi(i, i, true);
					}else{
						tmp = me.getLi(i, i);
					}
					arr.push(tmp);
				}
				
				tmp = me.getLi();
				arr.push(tmp);
				
				tmp = me.getLi(me.total, me.total);
				arr.push(tmp);
			}
			
			if(me.currentPage < me.total){
				tmp = me.getLi(me.nextText, me.currentPage+1);
				arr.push(tmp);
			}
			
			arr.push(end);
			
			var html = arr.join('');
			
			me.el = $(html).appendTo($("#" + me.renderTo));
			
		},
		
		getLi: function(text, page, active){
			var me = this,
				url,
				result;
			
			if(page){
				if(!active){
					url = $.nano(me.url, {page: page});
					result = $.nano('<li><a href="{url}" data="{page}">{text}</a></li>',{
						url: url,
						text: text,
						page: page
					});
				}else{
					result = $.nano('<li class="cur"><a href="javascript:void(0);" data="{page}">{text}</a></li>',{
						text: text,
						page: page
					});
				}
			}else{
				result = "<li>...</li>";
			}
			return result;
		}
	}
				
})();