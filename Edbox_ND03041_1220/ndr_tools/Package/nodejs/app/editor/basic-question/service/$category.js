define(['require','question-module'],function(require,module){	
	module.factory('$category',['$http','$q','$url','$cacheFactory',function($http,$q,$url,$cacheFactory){
		var categoryRelationsCache = $cacheFactory('$category.relations');
		return { 
			loadCategoryPatterns:function(){
				var promise = $http({
					method:'GET',
					url:$url.portal('/v0.9/category_patterns',{
						page:1,
						size:10000,
					}),
					cache:true
				});
				promise.success(function(data){
					for(var i=0;i<data.items.length;i++){
						if(data.items[i].pattern_name=='K12'){
							data.items[i].pattern_path='$O$S$E';
						}
					}
				});
				return promise;
			},
			loadCategoryPattern:function(patternName){
				//固定返回 K12 数据，临时模拟以减少请求
				if(patternName=='K12'){
					return $http.success({
						description: "适用于K12基础教育，6年制",
						identifier: "9de92145-6dd0-43eb-96a4-9e0747d9759e",
						pattern_name: "K12",
						purpose: "对资源的分类检索",
						pattern_path: "$O$S$E",
						title: "学段年级学科版本模式"
					});
				}
				var promise = $http({
					method:'GET',
					url:$url.portal('/v0.9/category_patterns',{words:patternName,page:1,size:10000}),
					cache:true
				});
				promise.then(function(response){
					var data = response.data;
					if(data.items.length){
						response.data=data.items[0];
					}else{
						response.data=null;
					}
				});
				return promise;
			},
			createCategoryPattern:function(pattern){
				return $http.post($url.portal('/v0.9/category_patterns'),pattern);
			},
			updateCategoryPattern:function(pattern){
				return $http.put($url.portal('/v0.9/category_patterns/{0}',pattern.identifier),pattern);
			},
			deleteCategoryPattern:function(identifier){
				return $http['delete']($url.portal('/v0.9/category_patterns/{0}',identifier));
			},
			loadCategories:function(levelDefine){
				//固定返回 K12 数据，临时模拟以减少请求
				if(levelDefine=='$O$S$E'){
					return $http.success({
						items:[{
							gb_code: "GO",
							identifier: "3c72d912-c430-498b-aead-3873a91e4057",
							nd_code: "$O",
							purpose: "根据国家教育信息化分类标准，进行分类划分",
							short_name: "applicableobject",
							source: "国家分类标准",
							title: "适用对象"
						},{
							gb_code: "GS",
							identifier: "786a7f89-cd90-4207-90b3-9805ef740608",
							nd_code: "$S",
							purpose: "根据国家学科分类标准，进行分类",
							short_name: "subject",
							source: "国家分类标准",
							title: "学科"
						},{
							gb_code: null,
							identifier: "c66e6c26-67b7-44a8-ade1-08e4412d08fe",
							nd_code: "$E",
							purpose: "将资源根据版本进行分类",
							short_name: "edition",
							source: "自定义的分类",
							title: "版本"
						}]
					});
				}
				return $http({
					method:'GET',
					url:$url.portal('/v0.9/categories',{page:1,size:10000}),
					cache:true
				});
			},
			createCategory:function(category){
				return $http.post($url.portal('/v0.9/categories'),category);
			},
			updateCategory:function(category){
				return $http.put($url.portal('/v0.9/categories/{0}',category.identifier),category);
			},
			deleteCategory:function(identifier){
				return $http['delete']($url.portal('/v0.9/categories/{0}',identifier));
			},
			loadCategoryRelations:function(patternPath){
				var cachedRelations = categoryRelationsCache.get(patternPath);
				if(cachedRelations){
					return $http.success(cachedRelations);
				}else{
					var promise = $http.get($url.portal('/v0.9/category_relation_data',{path:patternPath}));
					promise.then(function(response){
						var data = response.data.items;
						var relations = data[0]?data[0].items:[];
						for(var i=1;i<data.length;i++){
							var firstItem=data[i].items[0];
							if(firstItem){
								categoryRelationsCache.put(firstItem.pattern_path,data[i].items);
							}
						}
						categoryRelationsCache.put(patternPath,relations);
						response.data=relations;
					});
					return promise;
				}
			},
			clearCategoryRelationCache:function(){
				categoryRelationsCache.removeAll();
			},
			createRelation:function(relation){
				return $http.post($url.portal('/v0.9/category_patterns/data_relations'),relation);
			},
			updateRelation:function(relation){
				return $http.put($url.portal('/v0.9/category_patterns/data_relations/{0}',relation.identifier),relation);
			},
			deleteRelation:function(identifier){
				return $http['delete']($url.portal('/v0.9/category_patterns/data_relations/{0}',identifier));
			},
			relationsToPath:function(relations,patterns){
				var result='';
				for(var i=0,l=0;i<patterns.length;i+=2,l++){
					var ndCode = patterns.substr(i,2);
					var rs=relations[ndCode];
					if(rs){
						if(!angular.isArray(rs)){
							rs=[rs];
						}
						for(var j=0;j<rs.length;j++){
							var r=rs[j];
							if(r){
								result+='/'+r.target.nd_code;
							}
						}
					}
				}
				return result;
			},
			toPath:function(){
				var codes=[];
				for(var i=0;i<arguments.length;i++){
					codes[i]=arguments[i]||'';
				}
				return codes.join('/');
			},
			codes:{
				subject:'$S',
				source:'RF'
			},
			loadCategoryDatas:function(categoryCode,excludeRoot,plane){
				var promise = $http.get($url.portal('/v0.9/categories/{0}/data',categoryCode));
				if(excludeRoot!==false){
					promise.success(function(data){
						for(var i=0;i<data.items.length;i++){
							if(data.items[i].parent=='ROOT'){
								data.items.splice(i,1);
							}
						}
					});
				}
				if(plane===false){
					promise.success(function(data){
						var items=data.items,result=[],mapping={};
						for(var i=0;i<items.length;i++){
							mapping[items[i].identifier]=items[i];
							items[i].children=[];
						}
						for(var i=0;i<items.length;i++){
							var item=items[i];
							var parent = item.parent ? mapping[item.parent] : null;
							if(parent){
								parent.children.push(item);
							}else{
								result.push(item);
							}
						}
						data.items=result;
					});
				}
				return promise;
			},
			createData:function(data){
				return $http.post($url.portal('/v0.9/categories/{0}/data',data.category),data);
			},
			updateData:function(data){
				return $http.put($url.portal('/v0.9/categories/data/{0}',data.identifier),data);
			},
			deleteData:function(identifier){
				return $http['delete']($url.portal('/v0.9/categories/data/{0}',identifier));
			},
			applyData:function(category,parentData){
				return $http.get($url.lifecycle('/v0.6/categories/datas/actions/apply',{nd_code:parentData?parentData.nd_code:category.nd_code}));
			}
		};
	}]);
});