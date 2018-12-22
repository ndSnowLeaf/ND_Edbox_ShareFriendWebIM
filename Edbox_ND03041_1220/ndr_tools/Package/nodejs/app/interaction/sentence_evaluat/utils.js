
define(function () {
	//扩展String
	if(!String.prototype.trim){ 
		String.prototype.trim = function(){ 
		return this.replace(/^\s+|\s+$/g, ''); 
		} 
	} 
	
	return {
		//根据值移除集合相对的元素
		removeItemByValue:function(arr,value){
		        if( arr.length>0 ){
		                  var tempIndex = arr.indexOf(value) ;
		                  if( tempIndex>-1){
		                   arr.splice( tempIndex , 1 ) // 如果设置项存在则移除
		                  }
		        }
	    } 
	}
});