define(function(require) {
	var _version = 'v1.3';
	return [
			'$http',
			'$url',
			'$q',
			'$window',
			function($http, $url, $q, $window) {
				getMockModel = function(level, root, pchapter, items) {
					var chapters = root;
					var _level = level;
					for (var i = 0; i < chapters.length; i++) {
						var chapter = chapters[i];
						var nnchapter = angular.copy(chapter);
						nnchapter.level = _level;
						if (nnchapter.level == 1) {
							nnchapter.chapter1 = nnchapter.title;
							nnchapter.chapter1_process_status = nnchapter.process_status;
						} else if (nnchapter.level == 2) {
							nnchapter.chapter2 = nnchapter.title;
							nnchapter.chapter2_process_status = nnchapter.process_status;
							nnchapter.chapter1 = pchapter.chapter1;
							nnchapter.chapter1_process_status = pchapter.chapter1_process_status;
						} else if (nnchapter.level == 3) {
							nnchapter.chapter3 = nnchapter.title;
							nnchapter.chapter3_process_status = nnchapter.process_status;
							nnchapter.chapter2 = pchapter.chapter2;
							nnchapter.chapter2_process_status = pchapter.chapter2_process_status;
							nnchapter.chapter1 = pchapter.chapter1;
							nnchapter.chapter1_process_status = pchapter.chapter1_process_status;
						} else if (nnchapter.level == 4) {
							nnchapter.chapter4 = nnchapter.title;
							nnchapter.chapter4_process_status = nnchapter.process_status;
							nnchapter.chapter3 = pchapter.chapter3;
							nnchapter.chapter3_process_status = nnchapter.chapter3_process_status;
							nnchapter.chapter2 = pchapter.chapter2;
							nnchapter.chapter2_process_status = pchapter.chapter2_process_status;
							nnchapter.chapter1 = pchapter.chapter1;
							nnchapter.chapter1_process_status = pchapter.chapter1_process_status;
						}
						var sub_chapters = nnchapter.sub_chapters;
						if (sub_chapters && sub_chapters.length > 0) {
							getMockModel(_level + 1, sub_chapters, nnchapter,
									items);
						} else {
							var assets = nnchapter.assets;
							for (var j = 0; j < assets.length; j++) {
								var nchapter = angular.copy(nnchapter);
								delete nchapter.sub_chapters;
								delete nchapter.assets;
								var asset = assets[j];
								nchapter.asset = asset;
								items.push(nchapter);
							}
						}
					}
					;
				};
				function processSecondTime(second) {
					return [ parseInt(second / 60 / 60),
							parseInt(second / 60) % 60, parseInt(second) % 60 ]
							.join(":").replace(/\b(\d)\b/g, "0$1");
				}
				;
				return {
					loadAssets : function(params) {
						return $http({
							url : $url.portal('/{0}/assets', [ _version ],
									params),
							method : 'GET'
						});
					},
					loadAssetById : function(identifier) {
						return $http({
							url : $url.portal('/{0}/assets/{1}', [ _version,
									identifier ]),
							method : 'GET'
						});
					},
					mockDataModel : function(source) {
						var root = source.teaching_material.chapters;
						source.items = source.items || [];
						getMockModel(1, root, {}, source.items);
						return source;
					},
					batchImport : function(key) {
						return $http({
							url : $url.portal(
									'/{0}/assets/actions/batch_import?key='
											+ key, _version),
							method : 'POST'
						});
					},
					createAsset : function(model) {
						return $http({
							url : $url.portal('/{0}/assets', _version),
							method : 'POST',
							data : model
						});
					},
					updateAsset : function(model) {
						return $http({
							url : $url.portal('/{0}/assets/{1}', [ _version,
									model.identifier ]),
							method : 'PUT',
							data : model
						});
					},
					processSecondTime : function(second) {
						return [ parseInt(second / 60 / 60),
								parseInt(second / 60) % 60,
								parseInt(second) % 60 ];
					},
					formatSecondFromIso : function(isoSecond) {
						var tmp = isoSecond.replace("P", "").replace("T", "")
								.replace("S", "");
						var index = tmp.indexOf("M");
						var s = "00";
						var m = "00";
						var h = "00";
						if (-1 != index) {
							var ts = tmp.split("M");
							tmp = ts[0];
							s = ts[1];
							index = tmp.indexOf("H");
							if (-1 != index) {
								ts = tmp.split("H");
								m = ts[1];
								h = ts[0];
							} else {
								m = tmp;
							}
						} else {
							s = tmp;
						}

						if (h.length == 1) {
							h = "0" + h;
						}

						if (m.length == 1) {
							m = "0" + m;
						}

						if (s.length == 1) {
							s = "0" + s;
						}

						return h + ":" + m + ":" + s;

					},
					processItem : function(item, category) {
						item.href = item.tech_info.href.location;
						var thumbHref;
						if (item.preview) {
							for ( var key in item.preview) {
								thumbHref = $url.ref(item.preview[key]);
							}
						}
						if (!thumbHref) {
							if ('image' == category) {
								thumbHref = $url.ref(item.href);
							} else if ('video' == category) {
							} else if ('audio' == category) {
							} else {
							}
						}
						item.thumbHref = thumbHref;
						item.actualHref = $url.ref(item.href);
						if (category == 'image') {
							item.previewHref = item.actualHref;
						} else {
							item.previewHref = $url.slides('/editor/basic-question/player.html',
									{
										mediaUrl : item.actualHref
												+ (category == 'video' ? '?.mp4'
														: '?.mp3')
									});
						}

						if (item.tech_info.href.requirements
								&& item.tech_info.href.requirements.length) {
							for (var i = 0; i < item.tech_info.href.requirements.length; i++) {
								var x = item.tech_info.href.requirements[i];
								if (x.name == 'resolution') {
									item.resolution = x.value;
								} else if (x.name == 'duration') {
									item.duration = x.value;
								}
							}
						}

						return item;
					},
					processFile : function(file, item, category) {
						var defererd = $q.defer();
						if (category == 'image') {
							var image = document.createElement('img');
							image.onload = function(e) {
								($window.URL || $window.webkitURL)
										.revokeObjectURL(this.src);
								item.resolution = this.width + '*'
										+ this.height;
								defererd.resolve(item);
							};
							image.onerror = function(e) {
								($window.URL || $window.webkitURL)
										.revokeObjectURL(this.src);
								defererd.resolve(item);
							};
							image.src = ($window.URL || $window.webkitURL)
									.createObjectURL(file.getNative());
						} else if (category == 'video') {
							var video = document.createElement('video');
							video.preload = 'metadata';
							video.onloadedmetadata = function(e) {
								($window.URL || $window.webkitURL)
										.revokeObjectURL(this.src);
								var duration = parseInt(this.duration);
								if (isNaN(duration))
									duration = -1;
								item.duration = duration;
								if (!(this.videoWidth == 0 || this.videoHeight == 0)) {
									item.resolution = this.videoWidth + '*'
											+ this.videoHeight;
								}
								defererd.resolve(item);
							};
							video.onerror = function(e) {
								($window.URL || $window.webkitURL)
										.revokeObjectURL(this.src);
								item.duration = 0;
								defererd.resolve(item);
							};
							video.src = ($window.URL || $window.webkitURL)
									.createObjectURL(file.getNative());
						} else if (category == 'audio') {
							var audio = document.createElement('audio');
							audio.preload = 'metadata';
							audio.oncanplaythrough = function(e) {
								($window.URL || $window.webkitURL)
										.revokeObjectURL(this.src);
								var duration = parseInt(this.duration);
								if (isNaN(duration))
									duration = -1;
								item.duration = duration;
								defererd.resolve(item);
							};
							audio.onerror = function(e) {
								($window.URL || $window.webkitURL)
										.revokeObjectURL(this.src);
								item.duration = 0;
								defererd.resolve(item);
							};
							audio.src = ($window.URL || $window.webkitURL)
									.createObjectURL(file.getNative());
						}
						console.log(item);
						return defererd.promise;
					},
					deletAsset : function(item) {
						return $http({
							url : $url.portal('/{0}/assets/{1}', [ _version,
									item.identifier ]),
							method : 'DELETE'
						});
					},
					batchDelete : function(res) {
						return $http({
							url : $url.portal(
									'/{0}/assets/actions/batch_delete',
									_version),
							method : 'POST',
							data : res
						});
					},
					batchDone : function(res,_status) {
						var assets = [];
						for (var i = res.length - 1; i >= 0; i--) {
							var r = res[i];
							var tmp = {
								"asset_id" : r,
								"status" :_status
							};
							assets.push(tmp);
						}
						;
						return $http({
							url : $url.portal(
									'/{0}/assets/actions/batch_update_status',
									_version),
							method : 'PUT',
							data : assets
						});
					},
					queryUploadAddr:function() {
						return $http({
							url:$url.portal('/{0}/assets/actions/request_upload_addr',_version),
							method:'GET'
						});
					},
					parseTemplate:function(session) {
						return $http({
							url:$url.portal('/{0}/assets/actions/template_parse?session={1}',[_version,session]),
							method:'GET'
						});
					},
					refreshAll:function(type,sign,items) {
						var _items = [];
						if(items.length) {
							for(var j=0;j<items.length;j++) {
								var it = items[j];
								_items.push(it.identifier);
							}
						}
						return $http({
							url:$url.portal('/{0}/assets/actions/refresh?type={1}&sign={2}&assets={3}',[_version,type,sign,_items.join(',')]),
							method:'GET'
						});
					},
					getBaseModel : function() {
						return {
							"identifier" : "",
							"title" : "",
							"description" : "",
							"language" : "zh_CN",
							"keywords" : [],
							"tags" : [],
							"preview" : {
								"240" : ""
							},
							"life_cycle" : {
								"creator" : "",
								"publisher" : "NetDragon",
								"provider" : "NetDragon",
								"provider_source" : "",
								"status" : ""
							},
							"copyright" : {
								"author" : ""
							},
							"tech_info" : {
								"href" : {
									"location" : "",
									"format" : "",
									"size" : 0,
									"md5" : "",
									"requirements" : []
								}
							},
							"coverages" : [ {
								"target_type" : "Org",
								"target" : "nd",
								"target_title" : "",
								"strategy" : "OWNER"
							} ],
							"categories" : {
								"phase" : [],
								"grade" : [],
								"subject" : [],
								"edition" : [],
								"sub_edition" : [],
								"assets_type" : [ {
									"taxoncode" : "$RA0101"
								} ],
								"theme_style" : []
							},
							"relations" : [ {
								"source" : "",
								"source_type" : "chapters",
								"relation_type" : "ASSOCIATE",
								"tags" : [],
								"enable" : "true"
							} ]
						};
					}
				};
			} ];
})