define(["jquery","espEnvironment","espEnvironment/../UrlHelper","espService","i18n!"],function($,espEnvironment,UrlHelper,espService,i18n){function adjustData(metadata,type){var item={title:metadata.title,type:type};if(item.format=metadata.tech_info&&metadata.tech_info.href&&metadata.tech_info.href.format,item.href=urlResolver.parse(metadata.tech_info&&metadata.tech_info.href&&metadata.tech_info.href.location||""),metadata.preview)for(var key in metadata.preview)if(item.thumbHref=urlResolver.parse(metadata.preview[key]),"120"===key||"240"===key)break;if(item.thumbHref||"$RA0101"==type&&(item.thumbHref=item.href+"?size=240"),metadata.tech_info&&metadata.tech_info.href&&metadata.tech_info.href.requirements&&metadata.tech_info.href.requirements.length)for(var i=0;i<metadata.tech_info.href.requirements.length;i++){var x=metadata.tech_info.href.requirements[i];if("resolution"==x.name){item.resolution=x.value;var parts=item.resolution&&item.resolution.split("*");parts&&2==parts.length&&(item.width=parseInt(parts[0]),item.height=parseInt(parts[1]))}else"duration"==x.name?item.duration=x.value:"code"==x.name&&(item.code=x.value)}return item.size=metadata.tech_info&&metadata.tech_info.href&&metadata.tech_info.href.size,item}var urlResolver=espEnvironment.createReferenceUrlResolver();return function(){return{name:"baidu",title:i18n.translate("resource.baidu.title"),order:2,paging:15,uploadEnabled:!1,supports:["$RA0101"],getDataList:function(params){if(!params.words)return $.when(!1);var urlRoot=UrlHelper.root(UrlHelper.build(espEnvironment.serviceConfig.server));return $.get(urlRoot("/v2.0/assets",$.extend({page:1,size:20,coverage:"Baidu/bd/",slideServer:"http://esp-slides.edu.web.sdp.101.com",csserver:"http://cs.101.com/v0.1/static",file_path:espEnvironment.location.params.file_path},params))).then(function(result){for(var items=[],i=0;i<result.items.length;i++)items.push(adjustData(result.items[i],params.type));return{total_count:result.total_count,items:items}})}}}});