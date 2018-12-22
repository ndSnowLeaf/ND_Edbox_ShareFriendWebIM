var isApp = (typeof (Bridge) != 'undefined' && !!Bridge.getRuntime());
icCreatePlayer.setDefaultPlayerConfig({
    'playerCode': "configuration",
    'refPath': {
        'ref-path': icCreatePlayer.request('ref-path') || '_ref',
        'ref-path-addon': icCreatePlayer.request('ref-path-addon') || 'ref',
        'ref-path-online': icCreatePlayer.request('ref-path')
    },
    'url': icCreatePlayer.request('main') || icCreatePlayer.request('main-url') || 'main.xml',
    'beforeSwitchToPage': ((isApp) ? Bridge.goPage : null),
    'listeners': {
        'render': function () {
            if (typeof MathJax !== "undefined")
                MathJax.Hub.Configured();
        },
        'PageLoaded': function () {
            console.log('change');
            if (isApp && Bridge.onPageLoaded) {
                Bridge.onPageLoaded();
            }
        }
    }
});
