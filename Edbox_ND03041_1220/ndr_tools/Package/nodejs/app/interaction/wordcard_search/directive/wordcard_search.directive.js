
//test
config.lifecycle_host = "http://esp-lifecycle.web.sdp.101.com";
config.ref_path="http://cs.101.com/v0.1/static";

define(['angularAMD', 'lifecycle.service'], function (angularAMD) {

    var wordMessenger = new Messenger('china_words_card', 'words_card');
    wordMessenger.addTarget(window.parent, 'parent');

    angularAMD.service('wordService', ['$q', 'LifecycleService',
        function ($q, LifecycleService) {
            return {
                /*
                 * 根据对象{
                 *		chapter_id :''  ,
                 *		search_word:''
                 *	}从LC 获取资源
                 */


                getWordsFromLC: function (options) {
                    var deferred = $q.defer();
                     var randomStart = parseInt( Math.random()*1000 ) ;
                    if( options.search_word.length === 1 ){
                        randomStart = 0 ;
                    }
                    LifecycleService.getChineseVocabularyCards(options.chapter_id, options.search_word,randomStart, 8).then(function (result) {
                        var arr = [];
                        if ( result.total === 0) {
                        } else {
                            if( result.total  === undefined ) {
                                result.items = [] ;
                                var i = 0  ;
                                var start = parseInt( Math.random()*10+1 ) ;
                                for(var temp in result){
                                    if( start<i && i < start+9 ){
                                        if(result[temp]){
                                            result.items.push(result[temp]);
                                        }
                                    }
                                    i++  ;
                                }
                            }
                            for (var i = 0, l = result.items.length; i < l; i++) {

                                var item = result.items[i];

                                var opts = {
                                    id: item.identifier,
                                    json_url: item.tech_info.href.location,
                                    image_url: '',
                                    title: item.title,
                                    pinyin: ''
                                }
                                //搜索生字展示的图片和发音需要从json文件解析获取 ， 之后再改进。
                                // 目前在LifecycleService.getChineseVocabularyCards这个异步请求里面会发送8个同步请求获取json
                                var index  = opts.json_url.indexOf('.pkg/main.xml') ;
                                if(opts.json_url && index>-1 ){

                                    var url = opts.json_url.substr(0,index).replace('${ref-path}', config.ref_path)+'.pkg/resources/relations.json' ;
                                    $.ajax({
                                        url:url,
                                        dataType: 'json',
                                        async:false
                                    }).done(function(data){
                                       // console.log(data);
                                        var tempUrl = '';
                                        var tempPinyin = '' ;
                                        if( data.spellAssets && data.spellAssets.length>0 　){
                                            if( data.spellAssets[0].spellImgAssets &&　data.spellAssets[0].spellImgAssets.length>0 ){
                                                if( data.spellAssets[0].spellImgAssets[0].target && data.spellAssets[0].spellImgAssets[0].target.location ){
                                                    tempUrl =  data.spellAssets[0].spellImgAssets[0].target.location ;
                                                }
                                            }
                                            if( data.spellAssets[0].target && data.spellAssets[0].target.title){
                                                tempPinyin = data.spellAssets[0].target.title ;
                                            }
                                        }

                                        arr.push({
                                            id: opts.id,
                                            key: opts.id,
                                            image_url: tempUrl,
                                            json_url: opts.json_url,
                                            pinyin:tempPinyin , //拼音
                                            sound: '',//发音
                                            strokes: '', //笔顺
                                            radical: '',//部首
                                            structure: '',//结构
                                            sequencer: '',//音序
                                            media: {

                                            },//多媒体
                                            title: opts.title
                                        });
                                    }).fail(function(){
                                        console.log("请求生字'"+opts.title+"'json文件失败！");
                                    })

                                }else {
                                    console.log("error","词卡"+item.identifier+"资源获取的json文件路径格式不正确") ;
                                }
                            }
                        }
                        arr.total = result.total ;
                        deferred.resolve(arr);
                    }, function (error) {
                        deferred.reject(error);
                    });
                    return deferred.promise;
                },
                getWordVeiwByJson: function (json_url) {
                    var result = ''// LifecycleService.getChineseVocabularyCards(options.chapter_id ,options.search_word,0,8);
                    var strokesUrl ;
                    var deferred = $q.defer();
                    var index  = json_url.indexOf('.pkg/main.xml') ;
                    var url = '';
                    if(json_url && index>-1 ){
                        var url =json_url.substr(0,index).replace('${ref-path}', config.ref_path)+'.pkg/resources/relations.json' ;
                    }
                    $.ajax({
                        url: url,
                        dataType: 'json',
                        async:true
                    }).done(function(data){
                        console.log(data);
                        strokesUrl = data.wordStrokeAsset.target.location ;
                        var tempImage = '',tempSound ='';
                        try{
                            tempImage = data.spellAssets[0].spellImgAssets[0].target.location+"?size=240";
                        }catch(e){
                            console.log("获取多音字图片资源失败" , e) ;
                        }
                        try{
                            tempSound = data.spellAssets[0].dubbingAsset.target.location;
                        }catch(e){
                            console.log("获取发音资源失败" , e) ;
                        }
                        result = {
                            word: data.word,
                            strokeNum: data.strokeNum,
                            radical: data.radical,
                            structure: data.wordStructure,
                            pinyin: data.spellAssets[0].target.title,
                            sound: tempSound,
                            image: tempImage,
                            sequencer: {
                                spellSeq: data.spellAssets[0].spellSeq,
                                spellSyl: data.spellAssets[0].spellSyl,
                                spellSzl: data.spellAssets[0].spellSzl
                            },
                            media: {
                                images: [],
                                audio: [],
                                video: []
                            },
                            strokesUrl:strokesUrl

                        }
                        try{
                            var spellEntrywordAssets = data.spellAssets[0].spellEntrywordAssets
                            for( var i = 0,l = spellEntrywordAssets.length ; i<l ; i++ ){
                                //for( var j = 0 ; j<spellEntrywordAssets[i].ImgAsset.length ;j++){
                                //    var obj = spellEntrywordAssets[i].ImgAsset[j] ;
                                //    var tempImg = {
                                //        title:obj.title ,
                                //        url :obj.target.location+"?size=240"
                                //    }
                                //    result.media.images.push(tempImg) ;
                                //}
                                //for( var k = 0 ; k<spellEntrywordAssets[i].audioAsset.length ; k++ ){
                                //        var obj = spellEntrywordAssets[i].audioAsset[k] ;
                                //        var tempAudio = {
                                //            title:obj.title ,
                                //            url :obj.target.location
                                //        }
                                //        result.media.audio.push(tempAudio) ;
                                //}
                                //for( var j = 0 ; j<spellEntrywordAssets[i].videoAsset.length ; j++ ){
                                //        var obj = spellEntrywordAssets[i].videoAsset[j] ;
                                //        var tempVedio = {
                                //            title:obj.title ,
                                //            url :obj.target.location
                                //    }
                                //    result.media.video.push(tempVedio) ;
                                //}
                            }
                            var spellMultimediaPictureAssets = data.spellAssets[0].spellMultimediaPictureAssets ;
                            for( var j = 0 ; j<spellMultimediaPictureAssets.length ;j++){
                                var obj = spellMultimediaPictureAssets[j] ;
                                var tempImg = {
                                    title:obj.title ,
                                    url :obj.target.location+"?size=240"
                                }
                                result.media.images.push(tempImg) ;
                            }
                            var spellMultimediaAudioAssets = data.spellAssets[0].spellMultimediaAudioAssets ;
                            for( var k = 0 ; k<spellMultimediaAudioAssets.length ; k++ ){
                                var obj = spellMultimediaAudioAssets[k] ;
                                var tempAudio = {
                                    title:obj.title ,
                                    url :obj.target.location
                                }
                                result.media.audio.push(tempAudio) ;
                            }
                            var spellMultimediaVideoAssets = data.spellAssets[0].spellMultimediaVideoAssets ;
                            for( var j = 0 ; j<spellMultimediaVideoAssets.length ; j++ ){
                                var obj = spellMultimediaVideoAssets[j] ;
                                var tempVedio = {
                                    title:obj.title ,
                                    url :obj.target.location
                                }
                                result.media.video.push(tempVedio) ;
                            }
                        } catch(err){
                            console.log("获取多媒体资源解析异常",err) ;
                        }
                        deferred.resolve(result);
                    }).fail(function(error){
                        deferred.reject(error);
                        console.log("请求生字json文件失败！");
                    })

                    return deferred.promise;


                },
                createWord: function (opts) {
                    return {
                        id: opts.id,
                        key: opts.id,
                        image: opts.image_url || 'wordcard_search/assets/images/word_wa.png',
                        json_url: opts.json_url,
                        pinyin: '', //拼音
                        sound: '',//发音
                        strokes: '', //笔顺
                        radical: '',//部首
                        structure: '',//结构
                        media: {}//多媒体
                    }
                },
                wordMessenger: wordMessenger

            }
        }
    ])

    var testJson = {
        "word": "中",
        "radical": "|",
        "strokeNum": 4,
        "strokeMsg": "竖折横竖",
        "wordStructure": "单一结构",
        "wordCategory": "象形字",
        "wordStrokeAsset": {
            "label": "Characters2Flash",
            "orderNumber": 1,
            "relationType": "ASSOCIATE",
            "tags": [
                "字卡到字形动画的关系"
            ],
            "target": {
                "title": "字形汉字中演示动画",
                "format": "video/swf",
                "location": "${ref-path}/dev_content_edu_product/esp/assets/24cfc5eb-b4bd-4c52-8a07-b3c7d766911d.pkg/中.swf"
            }
        },
        "wordCategoryAsset": {
            "label": "Characters2Flash",
            "orderNumber": 1,
            "relationType": "ASSOCIATE",
            "tags": [
                "字卡到字形动画的关系"
            ],
            "target": {
                "title": "字形汉字中演示动画",
                "format": "video/swf",
                "location": "${ref-path}/dev_content_edu_product/esp/assets/24cfc5eb-b4bd-4c52-8a07-b3c7d766911d.pkg/中.swf"
            }
        },
        "spellAssets": [
            {
                "spellSeq": "Z",
                "spellSyl": "zh",
                "spellSzl": "ong",
                "spellTone": "阴平",
                "label": "Characters2Spellwords",
                "orderNumber": 1,
                "relationType": "ASSOCIATE",
                "tags": [
                    "字卡到拼音的关系"
                ],
                "target": {
                    "title": "zhōng",
                    "format": "text/content",
                    "location": ""
                },
                "dubbingAsset": {
                    "label": "Spell2Audio",
                    "orderNumber": 1,
                    "relationType": "ASSOCIATE",
                    "tags": [
                        "拼音到拼音读音的关系"
                    ],
                    "target": {
                        "title": "zhōng.mp3",
                        "format": "mp3",
                        "location": "${ref-path}/dev_content_edu_product/esp/assets/24cfc5eb-b4bd-4c52-8a07-b3c7d766911d.pkg/zhōng.mp3"
                    }
                },
                "spellImgAssets": [
                    {
                        "label": "Characters2Image",
                        "orderNumber": 1,
                        "relationType": "ASSOCIATE",
                        "tags": [
                            "字卡到拼音图片的关系"
                        ],
                        "target": {
                            "title": "中_zhōng_200*200.jpg",
                            "format": "image/jpg",
                            "location": "${ref-path}/dev_content_edu_product/esp/assets/24cfc5eb-b4bd-4c52-8a07-b3c7d766911d.pkg/中_zhōng_200*200.jpg"
                        }
                    },
                    {
                        "label": "Characters2Image",
                        "orderNumber": 2,
                        "relationType": "ASSOCIATE",
                        "tags": [
                            "字卡到拼音图片的关系"
                        ],
                        "target": {
                            "title": "中_zhōng_500*500.jpg",
                            "format": "image/jpg",
                            "location": "${ref-path}/dev_content_edu_product/esp/assets/24cfc5eb-b4bd-4c52-8a07-b3c7d766911d.pkg/中_zhōng_500*500.jpg"
                        }
                    }
                ],
                "spellChapterAssets": [
                    {
                        "label": "Characters2Chapter",
                        "orderNumber": 1,
                        "relationType": "ASSOCIATE",
                        "tags": [
                            "字卡到章节的关系"
                        ],
                        "target": {
                            "title": "章节1",
                            "format": "text/content",
                            "location": ""
                        }
                    },
                    {
                        "label": "Characters2Chapter",
                        "orderNumber": 2,
                        "relationType": "ASSOCIATE",
                        "tags": [
                            "字卡到章节的关系"
                        ],
                        "target": {
                            "title": "章节2",
                            "format": "text/content",
                            "location": ""
                        }
                    }
                ],
                "spellAphorismAssets": [
                    {
                        "label": "Characters2Aphorisms",
                        "orderNumber": 1,
                        "relationType": "ASSOCIATE",
                        "tags": [
                            "字卡到警句素材的关系"
                        ],
                        "target": {
                            "title": "警句1",
                            "format": "text/content",
                            "location": ""
                        }
                    },
                    {
                        "label": "Characters2Aphorisms",
                        "orderNumber": 2,
                        "relationType": "ASSOCIATE",
                        "tags": [
                            "字卡到警句素材的关系"
                        ],
                        "target": {
                            "title": "警句2",
                            "format": "text/content",
                            "location": ""
                        }
                    }
                ],
                "spellIdiomAssets": [
                    {
                        "label": "Characters2Idioms",
                        "orderNumber": 1,
                        "relationType": "ASSOCIATE",
                        "tags": [
                            "字卡到成语的关系"
                        ],
                        "target": {
                            "title": "成语1",
                            "format": "text/content",
                            "location": ""
                        },
                        "wordEntrywordAsset": [
                            {
                                "label": "Idioms2Entrywords",
                                "orderNumber": 1,
                                "relationType": "ASSOCIATE",
                                "tags": [
                                    "成语到例句的关系"
                                ],
                                "target": {
                                    "title": "成语例句1",
                                    "format": "text/content",
                                    "location": ""
                                }
                            },
                            {
                                "label": "Idioms2Entrywords",
                                "orderNumber": 2,
                                "relationType": "ASSOCIATE",
                                "tags": [
                                    "成语到例句的关系"
                                ],
                                "target": {
                                    "title": "成语例句2",
                                    "format": "text/content",
                                    "location": ""
                                }
                            }
                        ]
                    }
                ],
                "spellEntrywordAssets": [
                    {
                        "label": "Characters2Entrywords",
                        "orderNumber": 1,
                        "relationType": "ASSOCIATE",
                        "tags": [
                            "字卡到字义的关系"
                        ],
                        "target": {
                            "title": "字义1",
                            "format": "text/content",
                            "location": ""
                        }
                    },
                    {
                        "label": "Characters2Entrywords",
                        "orderNumber": 2,
                        "relationType": "ASSOCIATE",
                        "tags": [
                            "字卡到字义的关系"
                        ],
                        "target": {
                            "title": "字义2",
                            "format": "text/content",
                            "location": ""
                        }
                    }
                ],
                "spellWordStoneAssets": [
                    {
                        "label": "文中义",
                        "orderNumber": 1,
                        "relationType": "ASSOCIATE",
                        "wordClass": "名词",
                        "tags": [
                            "字卡到组词的关系"
                        ],
                        "target": {
                            "title": "中国",
                            "format": "text/content",
                            "location": ""
                        },
                        "wordSynonymAsset": [
                            {
                                "label": "WordSynonym",
                                "orderNumber": 1,
                                "relationType": "ASSOCIATE",
                                "tags": [
                                    "组词到近义词的关系"
                                ],
                                "target": {
                                    "title": "俄罗斯",
                                    "format": "text/content",
                                    "location": ""
                                }
                            },
                            {
                                "label": "WordSynonym",
                                "orderNumber": 2,
                                "relationType": "ASSOCIATE",
                                "tags": [
                                    "组词到近义词的关系"
                                ],
                                "target": {
                                    "title": "巴铁",
                                    "format": "text/content",
                                    "location": ""
                                }
                            }
                        ],
                        "wordAntonymyAsset": [
                            {
                                "label": "WordAntonymy",
                                "orderNumber": 1,
                                "relationType": "ASSOCIATE",
                                "tags": [
                                    "组词到反义词的关系"
                                ],
                                "target": {
                                    "title": "美国",
                                    "format": "text/content",
                                    "location": ""
                                }
                            },
                            {
                                "label": "WordAntonymy",
                                "orderNumber": 2,
                                "relationType": "ASSOCIATE",
                                "tags": [
                                    "组词到反义词的关系"
                                ],
                                "target": {
                                    "title": "日本",
                                    "format": "text/content",
                                    "location": ""
                                }
                            }
                        ],
                        "wordEntrywordAsset": [
                            {
                                "label": "Word2Entryword",
                                "orderNumber": 1,
                                "relationType": "ASSOCIATE",
                                "tags": [
                                    "组词到例句的关系"
                                ],
                                "target": {
                                    "title": "组词例句1",
                                    "format": "text/content",
                                    "location": ""
                                }
                            },
                            {
                                "label": "Word2Entryword",
                                "orderNumber": 2,
                                "relationType": "ASSOCIATE",
                                "tags": [
                                    "组词到例句的关系"
                                ],
                                "target": {
                                    "title": "组词例句2",
                                    "format": "text/content",
                                    "location": ""
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
});