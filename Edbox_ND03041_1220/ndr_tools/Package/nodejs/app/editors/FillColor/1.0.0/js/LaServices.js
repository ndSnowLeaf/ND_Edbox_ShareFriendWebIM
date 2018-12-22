define([
    'angular',
    './LaModule.js',
    './utils.js'
], function (angular, LaModule, Utils) {
    LaModule.service('LaService', Service);
    Service.$inject = ['$http', '$q', '$stage'];

    function Service($http, $q, $stage) {
        var filePath = Utils.GetCoursewareObjectPath();
        var id = Utils.GetCurrentId();
        var NDR_HOST = 'http://esp-lifecycle.web.sdp.101.com/v0.6',                                          //资源平台服务地址
            CS_HOST = 'http://cs.101.com/v0.1/static',                                                        //内容服务地址
            LOCAL_HOST = window.location.origin || (window.location.protocol + '//' + window.location.host),  //本地服务地址
          API_CONFIG = {

            //获取批量矢量图地址
            getPictureList: NDR_HOST + '/assets/actions/query?include=TI&words={key}&limit=(0,500)&coverage=Org/nd/&category=$RA0101%20and%20$F050009&category=$SB000'

          },

          MOCK_CONFIG = {

            //获取批量矢量图地址
            getPictureList: LOCAL_HOST + '/v2.0/courseware_objects/' + id + '/resource_files?file_path=' + filePath + '&type=$RA0101&words=&coursewareobjectId=' + id

          };

        return {
          /**
           * 通过关键字查询图片列表
           * @param key 关键字
           */
          getPictureList: function (key, pageIndex, pageSize) {
            var deferred = $q.defer(), self = this,
              url = MOCK_CONFIG.getPictureList.replace('{key}', key);
            this._$httpGet(url).success(function (data) {
              var items = [];
                //mock data
                angular.forEach(data, function (item,index) {
                  var mockLocation = $stage.getStage().repository.getResourceUrl(item.tech_info.href.location.replace('png','svg'));
                  var mockPreviewLocation = $stage.getStage().repository.getResourceUrl(item.tech_info.href.location);
                  var title = '';
                  var description = '';
                  if(mockLocation.indexOf('fc_1')>-1&&mockLocation.indexOf('fc_10')==-1&&mockLocation.indexOf('fc_11')==-1&&mockLocation.indexOf('fc_12')==-1&&mockLocation.indexOf('fc_13')==-1){
                    title = '树叶';
                    description = '满满的树叶满满的树叶满满的树叶满满的树叶满满的树叶满满的树叶满满的树叶满满的树叶满满的树叶';
                  }else if(mockLocation.indexOf('fc_2')>-1){
                    title = '几何图形';
                    description = '几何图形多边形星形几何图形多边形星形几何图形多边形星形几何图形多边形星形几何图形多边形星形';
                  }else if(mockLocation.indexOf('fc_3')>-1){
                    title = '吹泡泡';
                    description = '美女吹泡泡美女吹泡泡美女吹泡泡';
                  }else if(mockLocation.indexOf('fc_4')>-1){
                    title = '风火轮';
                    description = '风火轮风火轮';
                  }else if(mockLocation.indexOf('fc_5')>-1){
                    title = '雨夜';
                    description = '雨夜雨夜';
                  }else if(mockLocation.indexOf('fc_6')>-1){
                    title = '少女与兔子';
                    description = '少女与兔子少女与兔子少女与兔子少女与兔子';
                  }else if(mockLocation.indexOf('fc_7')>-1){
                    title = '花花';
                    description = '花花花花花花';
                  }else if(mockLocation.indexOf('fc_8')>-1){
                    title = '树叶';
                    description = '树叶';
                  }else if(mockLocation.indexOf('fc_9')>-1){
                    title = '疯狂部落女战';
                    description = '疯狂部落女战';
                  }else if(mockLocation.indexOf('fc_10')>-1){
                    title = '花与少女';
                    description = '花与少女';
                  }else if(mockLocation.indexOf('fc_11')>-1){
                    title = '昆虫';
                    description = '昆虫';
                  }else if(mockLocation.indexOf('fc_12')>-1){
                    title = '气球';
                    description = '气球';
                  }else if(mockLocation.indexOf('fc_13')>-1){
                    title = '叶子';
                    description = '叶子';
                  }
                  if((pageIndex==1&&index<12)||(pageIndex>1&&index==12)){
                    items.push({
                      "title": title,
                      "description": description,
                      "copyright": "ND",
                      "preview": {
                        "demonstration": mockPreviewLocation,//带有颜色的示例图
                      },
                      "custom_properties": {
                        "recommended_color":["#EF3447","#F26736","#FED05C","#A4D56E","#50D1B1","#57C2E8","#3485ED","#9A8EDD","#EC8CC1","#A97548","#FEFEFE","#444446"] //推荐色盘
                      },
                      "categories": {
                        "phase": [
                          {
                            "identifier": "473e6282-528e-4c0d-8cb1-7ffe86d0f344",
                            "taxonpath": null,
                            "taxonname": "图片",
                            "taxoncode": "$RA0101"
                          }
                        ],
                        "mediatype": [
                          {
                            "identifier": "cb167d76-0c71-4f1d-8fb0-2684a79ec867",
                            "taxonpath": null,
                            "taxonname": "矢量图",
                            "taxoncode": "$F050009"
                          }
                        ]
                      },
                      "tech_info": {
                        "href": {
                          "format": "image/jpeg",
                          "size": 6730593,
                          "location": mockLocation, //矢量图
                          "requirements": [
                            {
                              "identifier": null,
                              "type": "QUOTA",
                              "name": "resolution",
                              "min_version": null,
                              "max_version": null,
                              "installation": null,
                              "installation_file": null,
                              "value": "7723*5792",
                              "resource_model": null
                            }
                          ],
                          "md5": "9be42f7e8163788dc85bea93cc22df7c",
                          "secure_key": null,
                          "entry": "入口地址",
                          "printable": false
                        },
                      },
                    });
                  }
                });
                data = {"limit":"(0,500)","total":0,"items":items};
              if (Utils.isNotEmptyArray(data.items)) {
                //todo
                var pictureList = [];
                angular.forEach(data.items, function (item) {
                  var pictureLocation = item.tech_info.href.location;
                  var previewLocation = item.preview.demonstration;
                  if (pictureLocation && pictureLocation.indexOf('${ref-path}') > -1) {
                    pictureLocation = pictureLocation.replace('${ref-path}', CS_HOST);
                  }
                  if (previewLocation && previewLocation.indexOf('${ref-path}') > -1) {
                    previewLocation = previewLocation.replace('${ref-path}', CS_HOST);
                  }
                  var pictureItem = {
                    title: item.title,
                    description: item.description,
                    copyright: item.copyright,
                    recommendedColor: item.custom_properties.recommended_color,
                    pictureLocation: pictureLocation,
                    previewLocation: previewLocation
                  };
                  pictureList.push(pictureItem);
                });
                deferred.resolve(pictureList);
              } else {
                deferred.reject();
              }
            }).error(function () {
              deferred.reject();
            });

            return deferred.promise;
          },
            /**
             * HTTP GET请求
             * @param url 请求url
             * @returns {*}
             * @private
             */
            _$httpGet: function (url) {
                return $http({url: url, method: 'GET'});
            }
        }
    }
});

