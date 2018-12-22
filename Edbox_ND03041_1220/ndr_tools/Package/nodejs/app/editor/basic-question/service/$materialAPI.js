define(['require','question-module'],function(require,module){	
	module.factory('$materialAPI', ['$http','$url','$category','$context',function($http,$url,$category,$context){
		 /** 格式化输入字符串**/
	     //用法: "hello{0}".format('world')；返回'hello world'
	     String.prototype.format= function(){
	       var args = arguments;
	       return this.replace(/\{(\d+)\}/g,function(s,i){
	         return args[i];
	       });
	      };
	      var recompose = function(rootid,items,root) {
              for(var i = items.length-1;i>=0;i--) { 
              	var it = items[i];
                 if(rootid == it.parent) {
                 	it.items = [];
                 	it.old = it.title;
                    root.push(it);
                   // items.splice();
                    recompose(it.identifier,items,it.items);
                 }
              }
              //排序 root
              if(root && root.length) {
              	root.sort(function(a,b){
                  return a.order_num>b.order_num?1:-1;
              	});
              	//console.log(root);
              }

	      };
		return {
			loadMaterials:function(phase,grade,subject,edition,subedition,words,page,size){
			   var _url = "/v1.5/teaching_materials?category={p}/{g}/{s}/{e}/{sube}&words={w}&page={page}&size={size}";
	           return $http({
	            	url:$url(_url,{p:phase,g:grade,s:subject,e:edition,sube:subedition,w:words,page:page,size:size}),
	            	method:'GET'
	            });
			},
			loadMaterial:function(identifier){
	            return $http.get($url.portal('/v1.5/teaching_materials/{0}',identifier));
			},
			loadMaterialx:function(phase,grade,subject,edition,subedition,words,page,size){
	            var _url = "/v1.5/teaching_materials/single?category={p}/{g}/{s}/{e}/{sube}";
	           return $http({
	            	url:$url(_url,{p:phase,g:grade,s:subject,e:edition,sube:subedition}),
	            	method:'GET'
	            });
			},
			loadChapter:function(identifier){
	            return $http.get($url.portal('/v0.9/teaching_materials/none/chapters/{0}',identifier)); 
			},
			loadChapters:function(identifier,callback) {
				var _url = "/v0.9/teaching_materials/{identifier}/tree?level=0";
	            $http({
	            	url:$url(_url,{identifier:identifier}),
	            	method:'GET'
	            }).success(function(data){
                     var _items = data.items; 
                     var root = [];
                     recompose(identifier,_items,root);
                     callback(root);
	            }).error(function(data){
                  callback(null,data);
               }); 
			},
			load2Chapters:function(identifier,callback) {
				var _url = "/v0.9/teaching_materials/{identifier}/tree?level=0";
	            $http({
	            	url:$url(_url,{identifier:identifier}),
	            	method:'GET'
	            }).success(function(data){
                     var _items = data.items;  
                     callback(_items);
	            }).error(function(data){
                  callback(null,data);
               }); 
			},
			createMaterial:function(material) {
			   material.creator = $context.currentCreator();
               var _url = "/v1.5/teaching_materials";
	           return $http({
	            	url:_url,
	            	method:'POST',
	            	data:material
	            });
			},  
			updateMaterial:function(material){
               var _url = "/v1.5/teaching_materials/{identifier}";
	           return $http({
	            	url:$url(_url,{identifier:material.identifier}),
	            	method:'PUT',
	            	data:material
	            });
			},
			deleteMaterial:function(identifier,callback){
                var _url = "/v1.5/teaching_materials/{identifier}";
	            $http({
	            	url:$url(_url,{identifier:identifier}),
	            	method:'DELETE'
	            }).success(function(data){
                   callback(data);
	            }).error(function(data){
                  callback(null,data);
               });
			},
			createChapter:function(materialid,pcid,chapter,callback) {
                var _url = "/v0.9/teaching_materials/{identifier}/chapters";
                chapter.parent = chapter.parent || pcid;
	            $http({
	            	url:$url(_url,{identifier:materialid}),
	            	method:'POST',
	            	data:chapter
	            }).success(function(data){
                   callback(chapter,data);
	            }).error(function(data){
                  callback(null,data);
               });
			},
			createBatchChapters:function(material) {
               var _url = "/v0.9/teaching_materials/{identifier}/chapters/actions/batchAdd";               
               var chapters = material.chapters;
               if(!chapters) {
               	 chapters = [];
               }
               return  $http({
	            	url:$url(_url,{identifier:material.identifier}),
	            	method:'POST',
	            	data:chapters
	            });
			},
			updateChapter:function(materialid,chapter,callback) {
                var _url = "/v0.9/teaching_materials/{materialid}/chapters/{identifier}";
	            $http({
	            	url:$url(_url,{materialid:materialid,identifier:chapter.identifier}),
	            	method:'PUT',
	            	data:chapter
	            }).success(function(data){
                   callback(chapter,data);
	            }).error(function(data){
                  callback(null,data);
               });
			},
			deleteChapter:function(materialid,chapter,callback) {
                var _url = "/v0.9/teaching_materials/{materialid}/chapters/{identifier}";
	            $http({
	            	url:$url(_url,{materialid:materialid,identifier:chapter.identifier}),
	            	method:'DELETE'
	            }).success(function(data){
                   callback(chapter,data);
	            }).error(function(data){
                  callback(null,data);
               });
			}, 
            load3Chapters:function(materialid,callback) { //包含课时章节树
             var _url = "/v0.9/teaching_materials/{materialid}/include_lesson_chapters";    
             return $http({
                  url:$url(_url,{materialid:materialid}),
                  method:'GET'
               }).success(function(data){
                 var _items = data.items;  
                 for(var k=0;k<data.items.length;k++) {
                     var it= data.items[k];
                     var less = it.lessons;
                     if(less && less.length)  {
                     	for(var m=0;m<it.lessons.length;m++) {
                            var lesson = it.lessons[m];
                            lesson.parent = it.identifier;
                            lesson.order_num = lesson.order_num || m;
                            lesson.islesson = true;
                            _items.push(lesson);
                     	}
                     }
                 }
                 callback(_items);
               }).error(function(data){
                  callback(null,data);
               });
           	},
           	toCategoryPath:function(material){
           		console.log(material);
           		return $category.toPath(material.phase,material.grade,material.subject,material.edition,material.sub_edition);
           	},
           	loadChapterChain:function(chapterId){
           		return $http.get($url.portal('/v0.9/teaching_materials/none/chapters/{0}',chapterId));
           	},
           	getMaterialUploadAddr:function() {
           		return $http.get($url.portal('/v0.9/resources/assets/upload_info'));
           	}
		}
	}]);
});