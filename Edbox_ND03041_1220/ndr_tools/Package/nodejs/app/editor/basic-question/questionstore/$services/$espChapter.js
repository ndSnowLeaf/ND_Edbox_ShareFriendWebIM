define(['question-module'],function(module){
	module.factory('$espChapter',['$http','$url',function($http,$espUrl){
		var $espChapter={};

		$espChapter.get=function(identifier){
			return $http.get($espUrl.slidesRemote('/v1.3/chapters/{0}',identifier));
		};
		$espChapter.getCategories=function(identifier){
			return $http.get($espUrl.slidesRemote('/v1.3/chapters/{0}/categories',identifier));
		}
		$espChapter.formatCategory=function(data){

			var edition = data.edition.length>0 ? data.edition[0].taxoncode : '';
			var grade= data.grade.length>0 ? data.grade[0].taxoncode : '';
			var phase= data.phase.length>0 ? data.phase[0].taxoncode : '';
			var sub_edition= data.sub_edition.length>0 ? data.sub_edition[0].taxoncode : '';
			var subject = data.subject.length>0 ? data.subject[0].taxoncode : '';
			return "K12/"+phase+"/"+grade+"/"+subject+"/"+edition+"/"+sub_edition;
		}
		$espChapter.list=function(params,tree){
			var promise = $http.get($espUrl.slidesRemote('/v1.3/chapters',params));
			if(tree===true){
				promise.then(function(response){
					var data=response.data;
					var mapping={};
					for(var i=0;i<data.length;i++){
						mapping[data[i].identifier]=data[i];
					}
					var root=[];
					for(var i=0;i<data.length;i++){
						var chapter=data[i];
						if(chapter.parent==chapter.teaching_material){
							root.push(chapter);
						}else{
							var parent=mapping[chapter.parent];
							if(parent){
								if(!parent.children) parent.children=[];
								parent.children.push(chapter);
							}
						}
					}
					response.data=root;
					return response;
				});
			}
			return promise;
		};

		$espChapter.pluckIdentifierFromMetadataRelation=function(metadata){
			if(!metadata || !metadata.relations){
				return null;
			}
			for(var i=0;i<metadata.relations.length;i++){
				var r=metadata.relations[i];
				if(r.source_type=='chapters'){
					return r.source;
				}
			}
			return null;
		};

		return $espChapter;
	}]);
});