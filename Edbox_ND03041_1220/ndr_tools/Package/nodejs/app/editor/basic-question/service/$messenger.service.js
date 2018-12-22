define(['require','question-module','messenger'],function(require,module,messenger){	
	module.factory('$messenger',[function(){
		var senders={},listeners={},defaultKey='__';
		return {
			send:function(data,projectName){
				try{
					var sender=senders[projectName||defaultKey];
					if(!sender){
						sender=new Messenger('portal',projectName);
						sender.addTarget(window.parent, 'parent');
						senders[projectName||defaultKey]=sender;
					}
					sender.targets['parent'].send(data);
					try{
						console.log('send message to parent : ');
						console.log(data);
					}catch(e){}
				}catch(e){console.error('通知消息失败');}
			},
			listen:function(fn,projectName){
				var listener=listeners[projectName||defaultKey];
				if(!listener){
					listener=new Messenger('parent',projectName);
					listeners[projectName||defaultKey]=listener;
				}
				listener.listen(fn);
			}
		};
	}]);
});