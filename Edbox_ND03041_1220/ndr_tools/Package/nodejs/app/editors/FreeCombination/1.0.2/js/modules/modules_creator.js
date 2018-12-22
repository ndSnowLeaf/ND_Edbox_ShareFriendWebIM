define(['./module_creator.js','../utils.js'],function(moduleCreator,utils){
    function calculateCenter(box){
        var width = box.width;
        var height = box.height;
        var top = box.top;
        var left = box.left;
        return {
            x: left+width/2,
            y: top+height/2
        }
    }
    function getRawSize(group){
        var size = {
            top: 10000,
            left: 10000,
            bottom: 0,
            right: 0
        }
        for(var j=0;j<group.children.length;j++){
            var child = group.children[j];
            var box = child.getBoxValue();
            size.left = Math.min(size.left,box.left);
            size.right = Math.max(size.right,box.left+child.width);
            size.top = Math.min(size.top,box.top);
            size.bottom = Math.max(size.bottom,box.top+child.height);
        }
        size.width =size.right-size.top;
        size.height = size.bottom-size.top;
        return size;
    }
    //将组元素的样式应用到子元素
    function calculateRotateMove (groupBox,startBox,startRotate,endRotate){
        var center = calculateCenter(groupBox);
        var point = calculateCenter(startBox,groupBox);
        var changeDegree = endRotate-startRotate ;
        var x = point.x-center.x;
        var y = point.y-center.y;
        var r = Math.sqrt(x*x+y*y);
        var degree = Math.atan(x/y)-changeDegree/180*Math.PI+(y<0 ? Math.PI : 0);
        var x0 = r* Math.sin(degree);
        var y0 = r*Math.cos(degree);
        var top = y0-y;
        var left = x0-x;
        return {
            top: top,
            left: left,
            rotate: changeDegree
        }
    }
    return {
        create:function(){
            var items = [];
            var all = [];
            var groups = {};
            return {
                items:items,
                all:all,
                contains:function(item){
                    return all.indexOf(item)!=-1;
                },
                //加载数据后，重新设置顺序
                afterLoadData:function(){
                    all.length = 0;
                    for(var i=0;i<items.length;i++){
                        all.push(items[i]);
                        if(items[i].type == 'group'){
                            for(var j=0;j<items[i].children.length;j++){
                                all.push(items[i].children[j]);
                            }
                        }
                    }
                },
                removeOne:function(item){
                    var index = items.indexOf(item);
                    if(index!=-1){
                        items.splice(index,1);
                    }
                    index = all.indexOf(item);
                    if(index!=-1){
                        all.splice(index,1);
                    }
                    if(item.type == 'group'){
                        delete groups[item.id];
                    }
                },
                removeItem:function(item){
                    this.removeOne(item);
                    if(item.group&&groups[item.group.id]) {
                        var group = groups[item.group.id];
                        var index = group.children ? group.children.indexOf(item) : -1;
                        if(index!=-1){
                            group.children.splice(index,1);
                            if(group.children.length == 1){
                                var child = group.children[0];
                                this.removeOne(group);
                                delete child.group;
                                this.removeItem(child);
                                this.addItem(child);
                            }
                            else if(group.children.length == 0){
                                this.removeOne(group);
                            }
                            else{
                                this.resizeGroupSize(group);
                            }
                        }
                    }
                    else{
                        if(item.type == 'group'){
                            //remove all children
                            for(var i=0;item.children&&i<item.children.length;i++){
                                this.removeOne(item.children[i]);
                            }
                        }
                    }

                },
                addItem:function(item){
                    items.push(item);
                    all.push(item);
                    if(item.type == 'group'){
                        groups[item.id] = item;
                    }
                },
                addGroupChild:function(group,child){
                    child.group = group;
                    group.children.push(child);
                    all.push(child);
                },
                addAll:function(items,group){
                    for(var i=0;i<items.length;i++){
                        var item = items[i];
                        if(group){
                            this.addGroupChild(group,item);
                        }
                        else{
                            this.addItem(item);
                        }
                    }
                },
                each:function(callback){
                    var localAll = angular.extend([],all);
                    for(var i=0;i<localAll.length;i++){
                        callback(localAll[i]);
                    }
                },
                getLevel:function(item){
                    if(item.group){
                        var group = groups[item.group.id];
                        return group.children.indexOf(item);
                    }
                    else{
                        var index = items.indexOf(item);
                        return index;
                    }
                },
                getMaxLevel:function(item){
                    if(item.group){
                        var group = groups[item.group.id];
                        return group.children.length;
                    }
                    else{
                        return items.length;
                    }
                },
                moveTo:function(from,to){
                    if(item.group){
                        var group = groups[item.group.id];
                        var item = group.children.splice(from,1);
                        if(to == -1){
                            group.children.push(item);
                        }
                        else{
                            group.children.splice(to,0,item);
                        }

                    }
                    else{
                        var item = items.splice(from,1);
                        if(to == -1){
                            items.push(item);
                        }
                        else{
                            items.splice(to,0,item);
                        }
                    }
                },
                selectChildren:function(group,selected){
                    for(var i=0;i<group.children.length;i++){
                        group.children[i].selected = selected;
                    }
                },
                resizeGroupSize:function(group){
                    group.startBox = group.getBoxValue();
                    var firstChild = group.children[0];
                    var rawSize = getRawSize(group);
                    var center = calculateCenter(rawSize);
                    var size = {
                        top: center.y,
                        left: center.x,
                        width: 0,
                        height: 0,
                        rotate: group.startBox.rotate
                    };
                    var step = 1;
                    var cover = false;
                    //扩充
                    while(!cover){
                        cover = true;
                        for(var i=0;i<group.children.length;i++){
                            var module = group.children[i];
                            var box = angular.extend({},module.getBoxValue());
                            this.fixPosition(size,box);
                            if(box.left<0 &&size.left>=-1.0*utils.stageSize.width){
                                size.left = size.left-step;
                                cover = false;
                            }
                            if(box.top<0&&size.top>=-1.0*utils.stageSize.height){
                                size.top = size.top-step;
                                cover = false;
                            }
                            if(box.left+box.width>size.width&&size.left+size.width<utils.stageSize.width*2){
                                size.width = size.width+step;
                                cover = false;
                            }

                            if(box.top+box.height>size.height&&size.top+size.height<utils.stageSize.height*2){
                                size.height = size.height+step;
                                cover = false;
                            }
                        }
                    }
                    group.left = size.left;
                    group.top = size.top;
                    group.width = size.width;
                    group.height = size.height;
                },
                calculateGroupSize:function(group){
                    var size = getRawSize(group);
                    group.top = size.top;
                    group.left = size.left;
                    group.width = size.right-size.left;
                    group.height = size.bottom-size.top;
                },
                createGroup:function(name){
                    var _this = this;
                    var locked = false;
                    this.each(function(module){
                        if(module.selected){
                            if(module.type == 'group'){
                                _this.selectChildren(module,true);
                                _this.removeGroup(module);
                            }
                            else if(module.group){
                                _this.selectChildren(module.group,true);
                                _this.removeGroup(module.group);
                            }
                        }
                    });
                    //create new group
                    var group = moduleCreator.createGroup({id:name,lazy:true,left:10000,right:0,top:10000,bottom:0,rotate:0,children:[],type:'group'});
                    this.addItem(group);
                    this.each(function(module) {
                        if (module.selected) {
                            _this.removeItem(module);
                            _this.addGroupChild(group,module);
                            locked = locked || module.locked;
                        }
                    });
                    this.calculateGroupSize(group);
                    this.selectChildren(group,false);
                    group.selected = true;
                    group.locked = locked;

                },
                removeSelectGroup:function(){
                    var _this = this;
                    this.each(function(module){
                        if(module.selected){
                            if(module.type == 'group'){
                                _this.removeGroup(module);
                            }
                            else if(module.group){
                                _this.removeGroup(module.group);
                            }
                        }
                    });
                },
                removeGroup:function(group){
                    var index = items.indexOf(group);
                    if(index == -1) return;
                    var children = group.children;
                    group.children = [];
                    this.removeItem(group);
                    for(var i=0;i<children.length;i++){
                        delete children[i].group;
                        children[i].locked = group.locked;
                    }
                },
                //相对组属性 = 》 全局属性
                applyGroupStyle:function(group,child){
                    var groupBox = {left:group.left,top:group.top,width: group.width,height:group.height,rotate:group.rotate};
                    var itemBox = {left:child.left+groupBox.left,top:child.top+groupBox.top,width: child.width,height:child.height,rotate:child.rotate};
                    var changeBox = calculateRotateMove(groupBox,itemBox,0,group.rotate);
                    child.top = child.top+changeBox.top+groupBox.top;
                    child.left = child.left+changeBox.left+groupBox.left;
                    child.rotate = child.rotate+group.rotate;
                },
                fixPosition:function(group,child){
                    var groupBox = {left:group.left,top:group.top,width: group.width,height:group.height,rotate:group.rotate};
                    var itemBox = {left:child.left,top:child.top,width: child.width,height:child.height,rotate:child.rotate};
                    var changeBox = calculateRotateMove(groupBox,itemBox,group.rotate,0);
                    child.top = child.top+changeBox.top-groupBox.top;
                    child.left = child.left+changeBox.left-groupBox.left;
                    child.rotate = child.rotate-group.rotate;
                },
                rotateChild:function(group,child,rotate){
                    var groupBox = {left:group.left,top:group.top,width: group.width,height:group.height,rotate:rotate};
                    var itemBox = {left:child.startBox.left,top:child.startBox.top,width: child.startBox.width,height:child.startBox.height,rotate:child.startBox.rotate};
                    var changeBox = calculateRotateMove(groupBox,itemBox,group.startBox.rotate,group.rotate);
                    child.top = child.startBox.top+changeBox.top;
                    child.left = child.startBox.left+changeBox.left;
                    child.rotate = child.startBox.rotate+group.rotate-group.startBox.rotate;
                },
                //组元素缩放，子元素也缩放
                shrinkChild:function(module,rate){
                    var group = module.group;
                    var widthRate = rate.width;
                    var heightRate = rate.height;
                    if(module.template&&(module.template.keep_rate||module.template.line)){
                        widthRate = heightRate = Math.min(widthRate,heightRate);
                    }
                    var box = angular.extend({},module.startBox);
                    this.fixPosition(group.startBox,box);

                    box.left = box.left*widthRate;
                    box.width = box.width*widthRate;
                    box.height = box.height*heightRate;
                    box.top = box.top*heightRate;
                    if(module.type == 'shape'&&module.template.line){
                        var point = module.data.points[1];
                        point[0] = box.width;
                        point[1] = box.height;
                    }
                    this.applyGroupStyle(group.getBoxValue(),box);
                    module.left = box.left;
                    module.width = box.width;
                    module.top = box.top;
                    module.height = box.height;


                },
                handleSelectEvent:function($event,module,cancelOther){
                    var left = $event.button === 0;
                    if(!left&&!module.selected){
                        this.unselectAllModule();
                    }
                    var keep = $event.ctrlKey || $event.shiftKey;
                    if(!keep){
                        this.each(function(m){
                            if(m.group){
                                m.selected = false;
                            }
                        })
                    }
                    var isSelected = module.group ? module.group.selected : module.selected;

                    if(keep&&isSelected){
                        this.selectModule(module,false);
                    }
                    else{
                        if(!keep&&left&&!module.selected){
                            this.unselectAllModule(module);
                        }
                        this.selectModule(module,true,!keep);
                    }
                },
                unselectAllModule:function(source){
                    this.each(function(module){
                        if(source&&source.group == module){
                            return;
                        }
                        module.selected=false;
                    });
                },
                selectModule:function(module,select,selectOne){
                    if(!selectOne){
                        var target = module.group ? module.group : module;
                        target.selected = select;
                        if(target.type=='group'&&!select){
                            for(var i=0;i<target.children.length;i++){
                                target.children[i].selected = select;
                            }
                        }
                    }
                    else if(select){
                        if(module.group&&!module.group.selected){
                            module.group.selected = select;
                        }
                        else{
                            module.selected = select;
                        }
                    }
                    else{
                        module.selected = select;
                        if(module.type == 'group'){
                            for(var i=0;i<module.children.length;i++){
                                module.children[i].selected = select;
                            }
                        }
                    }
                },
                canMoveDown:function(module){
                    var index = all.indexOf(module);
                    return index>1 ||(index==1&&all[0].type != 'group');
                },
                canMoveUp:function(module){
                    var index = all.indexOf(module);
                    if(module.type=='group'){
                        return  index != all.length-1-module.children.length;
                    }
                    else{
                        return index != all.length-1;
                    }
                },
                moveDown:function(module,toTop){
                    var target = module;
                    if(module.group&&module.group.children[0]==module){
                        target = module.group;
                    }
                    if(toTop&&module.group){
                        target = module.group;
                    }
                    var index = all.indexOf(target);
                    var length = target.type == 'group' ? target.children.length+1 : 1;
                    var items = all.splice(index,length);

                    if(toTop){
                        all.splice.apply(all, [0,0].concat(items));
                        if(module.group){
                            var index = all.indexOf(module);
                            all.splice(index,1);
                            all.splice(0,0,module);

                            var children = module.group.children;
                            index = children.indexOf(module);
                            children.splice(index,1);
                            children.splice(0,0,module);

                        }
                    }
                    else{
                        var replace = all[index-1];
                        var toIndex = replace.group&&(!replace.group||replace.group!=target.group) ? index-replace.group.children.length-1: index-1;
                        all.splice.apply(all, [toIndex,0].concat(items));
                        if(replace.group&&replace.group==target.group ){
                            var children = target.group.children;
                            var cindex = children.indexOf(target);
                            children.splice(cindex,1);
                            children.splice(cindex-1,0,target);
                        }
                    }
                },
                moveUp:function(module,toBottom){
                    var target = module;
                    if(module.group&&module.group.children[module.group.children.length-1]==module){
                        target = module.group;
                    }
                    if(toBottom&&module.group){
                        target = module.group;
                    }
                    var index = all.indexOf(target);
                    var length = target.type == 'group' ? target.children.length+1 : 1;
                    var items = all.splice(index,length);

                    if(toBottom){
                        all.splice.apply(all, [all.length,0].concat(items));
                        if(module.group){
                            var index = all.indexOf(module);
                            all.splice(index,1);
                            all.splice(all.length,0,module);

                            var children = module.group.children;
                            index = children.indexOf(module);
                            children.splice(index,1);
                            children.splice(children.length,0,module);

                        }
                    }
                    else{
                        var replace = all[index];
                        var toIndex = replace.type == 'group'&&(!replace.group||replace.group!=target.group) ? index+replace.children.length+1: index+1;
                        all.splice.apply(all, [toIndex,0].concat(items));
                        if(replace.group&&replace.group==target.group ){
                            var children = target.group.children;
                            var cindex = children.indexOf(target);
                            children.splice(cindex,1);
                            children.splice(cindex+1,0,target);
                        }
                    }
                }
            };
        }
    };
});
