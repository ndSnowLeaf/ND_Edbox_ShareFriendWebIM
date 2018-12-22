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
            {id: 'FillColor', version: '1.0.0'}
        ],
        tools:['skin',{
            name: 'description',
            title: i18n.translate('tool.description.title'),
            content: i18n.translate('tool.description.content'),
            imagePrefix: 'tsyx',
            imageSuffix: '.jpg',
            imageAmount: 2,
            interval: '',
            autoSwitch: '',
            mode: 'guide'
        },'time','preview', espEnvironment.location.params.noinsert ? 'save' : '',espEnvironment.location.params.noinsert ? '' : 'insert'],
        playerCode: 'teacher_test'
    };
});