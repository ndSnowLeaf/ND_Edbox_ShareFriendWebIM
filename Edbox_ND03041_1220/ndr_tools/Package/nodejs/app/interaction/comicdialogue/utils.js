define(function () {
	//扩展String
	if(!String.prototype.trim){ 
		String.prototype.trim = function(){ 
		return this.replace(/^\s+|\s+$/g, ''); 
		} 
	}
	
	//十六进制颜色值的正则表达式
	var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
	/*RGB颜色转换为16进制*/
	String.prototype.colorHex = function () {
	  var that = this;
	  if (/^(rgb|RGB)/.test(that)) {
	      var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
	      var strHex = "#";
	      for (var i = 0; i < aColor.length; i++) {
	          var hex = Number(aColor[i]).toString(16);
	          if (hex === "0") {
	              hex += hex;
	          }
	          strHex += hex;
	      }
	      if (strHex.length !== 7) {
	          strHex = that;
	      }
	      return strHex;
	  } else if (reg.test(that)) {
	      var aNum = that.replace(/#/, "").split("");
	      if (aNum.length === 6) {
	          return that;
	      } else if (aNum.length === 3) {
	          var numHex = "#";
	          for (var i = 0; i < aNum.length; i += 1) {
	              numHex += (aNum[i] + aNum[i]);
	          }
	          return numHex;
	      }
	  } else {
	      return that;
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