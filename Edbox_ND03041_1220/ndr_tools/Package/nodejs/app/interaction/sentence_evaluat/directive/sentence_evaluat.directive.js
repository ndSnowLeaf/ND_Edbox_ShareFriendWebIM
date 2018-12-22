define([
    'angularAMD',
    'lifecycle.service',
    'components/site-directive/assets-select/assets-select',
    'components/site-directive/error-tip/error-tip',
    'components/site-directive/edit-box/new-edit-box',
    'components/site-directive/foot-tool/time-box/new-time-box',
    'components/site-directive/foot-tool/foot-tool',
    'sentence_evaluat/directive/select',
    'sentence_evaluat/contenteditable'
], function (angularAMD) {
    var sentences1 = [
        {
            "id": '1',
            "isUserAdd": false,
            "parentId": '001001',
            "sentence": "Man's nature at birth is good.",

            "audio_name": "1.mp3",//
            "audio_url": "interaction/sentence_evaluat/resouce/test/audio/1.mp3"//正确的读音
        },
        {
            "id": '2',
            "isUserAdd": false,
            "parentId": '001004',
            "sentence": "Done is better than perfect.",//单词

            "audio_name": "2.mp3",//
            "audio_url": "interaction/sentence_evaluat/resouce/test/audio/2.mp3"//正确的读音
        }

    ];
    angularAMD.service('sentenceService', ['LifecycleService', '$http',
        function (LifecycleService, $http) {

            var sentences2 = [
                {
                    "id": '3',
                    "isUserAdd": false,
                    "parentId": '002001',
                    "sentence": "In every triumph, there's a lot of try.",//单词
                    "audio_name": "3.mp3",//
                    "audio_url": "interaction/sentence_evaluat/resouce/test/audio/3.mp3"//正确的读音
                }
            ];
            return {
                getSentencesByUnit: function (id) {
                    var sentences = sentences1;
                    if (id === '002') {
                        sentences = sentences2;
                    }

                    return sentences;
                },
                getUnitsByChapter: function (id) {
                    return [
                        {
                            id: '001',
                            title: 'My name is Cool',
                            name: '小学英语五年级上Unit1',
                            count: 2,
                            parts: [
                                {
                                    id: '001001',
                                    title: '',
                                    name: 'part 1',
                                    count: 2
                                }
                            ]

                        },
                        {
                            id: '002',
                            title: 'Unit 2:My name is Cool',
                            name: '小学英语五年级上Unit2',
                            count: 1,
                            parts: [
                                {
                                    id: '002001',
                                    title: '',
                                    name: 'part 1',
                                    count: 1
                                }
                            ]

                        }


                    ]
                },
                createSentence: function (id, value, audio_url) {
                    return {

                        "id": id,
                        "isUserAdd": true,
                        "sentence": value,//单词

                        "audio_url": audio_url //正确的读音
                    }

                }
            }
        }
    ])


});