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
            {id: 'FreeCombination', version: '1.0.0'}
        ],
        tools:['skin',{
            name: 'description',
            title: i18n.translate('tool.description.title'),
            content: i18n.translate('tool.description.content'),
            imagePrefix: 'picsex',
            imageSuffix: '.jpg',
            imageAmount: 6,
            contents: [
                i18n.translate('tool.description.content.1'),
                i18n.translate('tool.description.content.2'),
                i18n.translate('tool.description.content.3'),
                i18n.translate('tool.description.content.4'),
                i18n.translate('tool.description.content.5'),
                i18n.translate('tool.description.content.6')
            ],
            interval: '',
            autoSwitch: '',
            mode: 'example'
        },'preview', espEnvironment.location.params.noinsert ? 'save' : '',espEnvironment.location.params.noinsert ? '' : 'insert'],
        playerCode: 'teacher_test'
    };
});