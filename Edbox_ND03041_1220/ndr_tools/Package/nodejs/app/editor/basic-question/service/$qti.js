define(['require','question-module','./convert'],function(require,module,convert){	
	module.factory('$qti', ['$http','$url','$i18n','$stateParams',function($http,$url,$i18n,$stateParams){	
		var itemCategories=[{
			name:'subjective',
			label:'主观题'
		},{
			name:'objective',
			label:'客观题'
		},{
			name:'compound',
			label:'复合题'
		}];
		var formatLanguage = function(la){
			if(!la) return "";
			var items = la.split(/[-_]/);
			if(items.length!=2){
				return "";				
			}
			return items[0]+"_"+items[1].toUpperCase();
		}
			
		var itemTypes=[
			{code:'$RE0201',category:'objective',name:'choice',label:$i18n('qti.type.choice'),P:true,S:true,fchar:$i18n('question.data.char.choice')},
			{code:'$RE0202',category:'objective',name:'multiplechoice',label:$i18n('qti.type.multiplechoice'),P:true,S:true,fchar:$i18n('question.data.char.multiplechoice')},
			{code:'$RE0204',category:'objective',name:'order',label:$i18n('qti.type.order'),P:true,S:true,fchar:$i18n('question.data.char.order')},
			{code:'$RE0203',category:'objective',name:'judge',label:$i18n('qti.type.judge'),P:true,S:true,fchar:$i18n('question.data.char.judge')},
			{code:'$RE0209',category:'objective',name:'textentry',label:$i18n('qti.type.textentry'),P:true,S:false},
			{code:'$RE0216',category:'objective',name:'textentrymultiple',label:$i18n('qti.type.textentrymultiple'),P:false,S:true,fchar:$i18n('question.data.char.textentrymultiple')},
			{code:'$RE0205',category:'objective',name:'match',label:$i18n('qti.type.match'),P:true,S:true,fchar:$i18n('question.data.char.match')},
			{code:'$RE0206',category:'subjective',name:'extendedtext',label:$i18n('qti.type.extendedtext'),P:true,S:false},
			{code:'$RE0207',category:'objective',name:'graphicgapmatch',label:$i18n('qti.type.graphicgapmatch'),P:true,S:true,fchar:$i18n('question.data.char.graphicgapmatch')},
			{code:'$RE0211',category:'subjective',name:'drawing',label:$i18n('qti.type.drawing'),P:true,S:false},
			{code:'$RE0215',category:'objective',name:'gapmatch',label:$i18n('qti.type.gapmatch'),P:true,S:false},
			{code:'$RE0217',category:'objective',name:'inlinechoice',label:$i18n('qti.type.inlinechoice'),P:true,S:false},
			{code:'$RE0210',category:'subjective',name:'handwrite',label:$i18n('qti.type.handwrite'),P:true,S:true,fchar:$i18n('question.data.char.handwrite')},
			{code:'$RE0212',category:'subjective',name:'specialcomplextext',label:$i18n('qti.type.specialcomplextext'),P:true,S:false},
			{code:'$RE0225',category:'objective',name:'vote',label:$i18n('qti.type.vote'),P:true,S:true,fchar:$i18n('question.data.char.vote')},
			{code:'$RE0208',category:'compound',name:'data',label:$i18n('qti.type.data'),P:true,S:false},
			{code:'$RE0213',category:'compound',name:'reading',label:$i18n('qti.type.reading'),P:true,S:false},
			{code:'$RE0218',category:'compound',name:'comprehensivelearning',label:$i18n('qti.type.comprehensivelearning'),P:true,S:false},
			{code:'$RE0219',category:'compound',name:'application',label:$i18n('qti.type.application'),P:true,S:false},
			{code:'$RE0220',category:'compound',name:'calculation',label:$i18n('qti.type.calculation'),P:true,S:false},
			{code:'$RE0223',category:'compound',name:'proof',label:$i18n('qti.type.proof'),P:true,S:false},
			{code:'$RE0221',category:'compound',name:'explain',label:$i18n('qti.type.explain'),P:true,S:false},
			{code:'$RE0222',category:'compound',name:'readingcomprehension',label:$i18n('qti.type.readingcomprehension'),P:true,S:false},
			{code:'$RE0214',category:'compound',name:'experimentandinquiry',label:$i18n('qti.type.experimentandinquiry'),P:true,S:false},
			{code:'$RE0224',category:'compound',name:'inference',label:$i18n('qti.type.inference'),P:true,S:false},
			{code:'$RE0226',category:'subjective',name:'applicationbase',label:$i18n('qti.type.applicationbase'),P:true,S:false},
			{code:'$RE0227',category:'subjective',name:'proofbase',label:$i18n('qti.type.proofbase'),P:true,S:false},
			{code:'$RE0228',category:'subjective',name:'calculationbase',label:$i18n('qti.type.calculationbase'),P:true,S:false},
			{code:'$RE0229',category:'subjective',name:'explainbase',label:$i18n('qti.type.explainbase'),P:true,S:false},
			{code:'$RE0230',category:'subjective',name:'readingbase',label:$i18n('qti.type.readingbase'),P:true,S:false},
			{code:'$RE0231',category:'subjective',name:'readingcomprehensionbase',label:$i18n('qti.type.readingcomprehensionbase'),P:true,S:false},
			{code:'$RE0232',category:'subjective',name:'subjectivebase',label:$i18n('qti.type.subjectivebase'),P:true,S:false,fchar:$i18n('question.data.char.subjectivebase')},
			{code:'$RE0234',category:'compound',name:'data',label:$i18n('qti.type.data'),P:true,S:false}

		];
		return {
			mergeQuestion:function(params){
				params.lifecycleServer = $config.lifecycleServer;
				return $http.post($url.slides('/v0.1/tools/merge_questions'),params);
			},
			loadAssessmentItems:function(chapterId,categories,questionType,status,page,size,keyword){
				return $http.get($url.slides('/v1.3/questions',{
					page:page,
					size:size,
					words:keyword||'',
					chapter_id:chapterId,
					categories:categories,
					status:status,
					question_type:questionType
				}));
			}, 
			formatItem:function(item){				
				var restypes = item.categories.res_type; 
				for(var i=0;i<restypes.length;i++){ 
					if(restypes[i].taxoncode&&restypes[i].taxoncode.lastIndexOf('00')!=restypes[i].taxoncode.length-2){
						item.question_type = restypes[i];
					}
				} 
				if(!item.categories.source){
					item.categories.source=[];
				}
				item.chapter_ids = [];
				if(!item.relations){
					item.relations = [];
				}
				for(var i=0;i<item.relations.length;i++){
					var relation = item.relations[i];
					if(relation.source_type=='chapters'){
						item.chapter_ids.push(relation.source);
					}
				}
				item.source = [];
				for(var i=0;i<item.categories.source.length;i++){
					item.source[i]=item.categories.source[i].taxoncode;
				}
				if(!item.categories.subject){
					item.categories.subject=[];
				}
				item.subject=[];
				for(var i=0;i<item.categories.subject.length;i++){
					if(!item.categories.subject[i].taxonpath){
						item.subject.push(item.categories.subject[i].taxoncode);	
					}					
				}
				if(!item.education_info){
					item.education_info={};
				}				
				return item;
			},
			loadAssessmentItem:function(identifier){
				return $http.get($url.slides('/v1.3/questions/{0}'+$url.getExtraInfo(),identifier));
			},
			createAssessmentItem:function(metadata){
				return $http.post($url.slides('/v1.3/questions'+$url.getExtraInfo()),metadata);
			},
			updateAssessmentItem:function(metadata){
				return $http.put($url.slides('/v1.3/questions/{0}'+$url.getExtraInfo(),metadata.identifier),metadata);
			},
			deleteAssessmentItem:function(metadata){
				return $http['delete']($url.slides('/v1.3/questions/{0}'+$url.getExtraInfo(),metadata.identifier));
			},
			loadAssessmentItemContent:function(identifier){
				return $http.get($url.slides('/v1.3/questions/{0}/item'+$url.getExtraInfo(),identifier));
			},
			saveAssessmentItemContent:function(identifier,data){
				return $http.put($url.slides('/v1.3/questions/{0}/item'+$url.getExtraInfo(),identifier),data);
			},
			getAllItemTypes:function(){
				return itemTypes;
			},
			getIndependentItemTypes:function(){
				var result=[];
				for(var i=0;i<itemTypes.length;i++){
					if(itemTypes[i].P){
						result.push(itemTypes[i]);
					}
				}
				return result;
			},
			getSubItemTypes:function(){
				var result=[];
				for(var i=0;i<itemTypes.length;i++){
					if(itemTypes[i].S){
						result.push(itemTypes[i]);
					}
				}
				return result;
			},
			getItemType:function(typeName){
				for(var i=0;i<itemTypes.length;i++){
					if(itemTypes[i].code==typeName){
						return itemTypes[i];
					}
				}
			},
			getItemTypeByName:function(name){
				for(var i=0;i<itemTypes.length;i++){
					if(itemTypes[i].name==name){
						return itemTypes[i];
					}
				}
			},
			convert:function(item){
				return convert.convert(item);
			},
			loadHandwriteContent:function(identifier){
				return $http.get($url.slides('/v1.3/questions/{0}/handwrite'+$url.getExtraInfo(),identifier));
			},
			saveHandwriteContent:function(identifier,content){ 
				return $http.put($url.slides('/v1.3/questions/{0}/handwrite'+$url.getExtraInfo(),identifier),content);
			},
			getQtiPlayerUri:function(id,type){
				return $http.get($url.slides('/v1.3/questions/{0}/qtiplayer'+$url.getExtraInfo(),id));
			},
			loadUser:function(id){
				var realm = "portal.services.sdp.nd";
				if(id&&id.indexOf("@")!=-1){
					id = id.substring(0,id.indexOf("@"));
				}
				return $http.get($url.slidesRemote('/v1.3/user/'+id+"?realm="+encodeURIComponent(realm)));
			}
			
			
		};
	}]);	
});