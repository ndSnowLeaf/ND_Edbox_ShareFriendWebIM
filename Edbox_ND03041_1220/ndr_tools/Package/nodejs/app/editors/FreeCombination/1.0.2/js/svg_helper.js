define(['./utils.js'],function(util){
	var setBorderWidth = function(shape,width){
		shape.attr({
			strokeWidth:util.parseSize(width)		
		});
	};
	var setBorderStyle = function(shape,style,width){	
		width = util.parseSize(width);
		if(style == 'dashed'){
			shape.attr({
				strokeDasharray: (width*5)+","+(width*5)
			});
		}
		else if(style == 'solid'){
			
		}
		else if(style=='dotted'){
			shape.attr({
				strokeDasharray: width+","+width
			});
		}
	};
	var setBorderColor = function(shape,borderColor){
		shape.attr({
			stroke:borderColor			
		});
	};
	//解析css box-shadow字符串到json对象。（css中获取的box-shadow可能有多条记录组成。）
	var parseBoxShadow=function(boxshadow){
		if(!boxshadow||true) return [];
		var s = boxshadow.split(",");
		var index = 0;
		var oneline = '';
		var items = [];		
		for(var i=0;i<s.length;i++){
			if(s[i].indexOf('(')!=-1){
				index = -1;
				oneline = s[i];
			}
			else if(index == -1){
				oneline = oneline +","+s[i];
				if(s[i].indexOf(')')!=-1){
					index = 0;
					
				}
			} 
			if(index == 0){
				var item = parseOneLineBoxShadow(oneline);
				if(item){
					items.push(item);	
				}
			}
		}
		return items;
	};
	//解析一条box-shadow字符串。
	var parseOneLineBoxShadow = function(oneline){
		var array = oneline.match(/(-?[\d|\.]+px)|(rgba?\(.+\))/g);
		if(array&&array.length>=4){
			var item = {
				color:array[0],
				hshadow: array[1],
				vshadow: array[2],
				blur: array[3]
			};
			if(array.length>4){
				item.spread = array[4];
			}
			if(oneline.indexOf('inset')!=-1){
				item.inset = true;
			}
			return item;
		}
		return null;
	}
	var setBoxShadow = function(shape,boxshadow){
		if(!boxshadow) return;		
		var items = parseBoxShadow(boxshadow);
		if(items&&items.length>0){
			for(var i=0;i<items.length;i++){
				addBoxShadowFilter(shape,items[i]);
			}
		}
		
	};
	var addBoxShadowFilter = function(shape,item){
		
	}
	var setBackground = function(shape,backgroundColor,backgroundImage){
		if(backgroundImage&&backgroundImage.indexOf("linear-gradient")!=-1){		
			var colors = backgroundImage.match(/rgb\(([0-9]+), ([0-9]+), ([0-9]+)\)/gi);
			if(colors.length==2){
				shape.attr({
					fill:"l(0%,0%,0%,100%)"+" "+colors[0]+"-"+colors[1],
					'fill-opacity':'1'
				});
			}		
		}
		else{
			shape.attr({
				fill:backgroundColor,
			});
		}
	};
	return {
		setBorderWidth:setBorderWidth,
		setBorderStyle:setBorderStyle,
		setBorderColor:setBorderColor,
		setBoxShadow:setBoxShadow,
		setBackground:setBackground
	};
	//border: 2px solid rgb(79, 129, 189); color: rgb(0, 0, 0); box-shadow: none; background: rgb(255, 255, 255);
});