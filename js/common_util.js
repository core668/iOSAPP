function WWqqSearch(arg){
	this.arg = arg;
	this.init(arg)
}

WWqqSearch.prototype = {
	// 
	init : function(arg){
		// 节点准备
		this.elBody = $('.hot-search');
		this.elUlBox = $('<ul></ul>');
		this.elLiBox = (function(arg){
			var length = arg.length;
			var li = '';
			for(var i = 0; i < length; i++){
				li += '<li>' + arg[i] + '</li>'
			}
			return $(li);
		})(arg);
		this.showHotList();
	},
	showHotList : function(){
		var elUlBox = this.elUlBox;
		var elLiBox = this.elLiBox;
		elUlBox.append(elLiBox);
		this.elBody.append(elUlBox);
	},
}

function WWqqSearchList(arg){
	this.arg = arg;
	this.init(arg)
}
WWqqSearchList.prototype = {
	init : function(arg){
		
	}
}