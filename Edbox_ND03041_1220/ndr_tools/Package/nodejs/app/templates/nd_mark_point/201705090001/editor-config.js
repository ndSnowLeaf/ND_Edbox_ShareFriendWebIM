/**
 * Created by chenyoudong on 2015/12/30.
 */
define([
    'jquery',
    'i18n!./$/i18n',
    'espEnvironment'
], function (
    $,
    i18n,
    espEnvironment
) {
    return {
        editorType: 'interactionQ',
        editorVersions: [
            {id: 'Background', version: '1.0.0'},
            {id: 'GameQuestionTimer', version: '1.0.0'},
            {id: 'GameQuestionSubmit', version: '1.0.0'},
            {id: 'MarkPoint', version: '1.0.0'},
        ],
        tools:['skin',{
            name: 'description',
            title: i18n.translate('tool.description.title'),
            content: i18n.translate('tool.description.content'),
            imagePrefix: 'wbxz',
            imageSuffix: '.jpg',
            imageAmount: 4,
            interval: '',
            autoSwitch: ''
        },'time','preview','save',espEnvironment.location.params.noinsert ? '' : 'insert'],
        playerCode: 'teacher_test'
    };
});
