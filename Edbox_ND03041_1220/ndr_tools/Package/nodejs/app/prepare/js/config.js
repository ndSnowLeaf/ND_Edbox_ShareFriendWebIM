var _COMMON_CONFIG = {
    get_main_xml_api: "http://localhost:3001/v1.3/questions/${question_id}/qtiplayer?main_type=interaction&question_base="
};

/**
 * 直接打开Presenter窗口 （主要针对学科工具）
 *
 * @param question_id
 * @param question_base
 * @param urlParams
 */
function openPresenter(question_id, question_base, urlParams) {
    $.ajax({
        type: 'GET',
        url: _COMMON_CONFIG.get_main_xml_api.replace("${question_id}", question_id) + "&" + question_base,
        success: function (data) {
            var urlParamsString = ('&rnd=' + new Date().getTime());
            if(!!urlParams) {
                for(var key in urlParams) {
                    urlParamsString += "&" + key + "=" + urlParams[key];
                }
            }

            window.location.href = data.url + urlParamsString;
        },
        error: function (error) {
            console.log(arguments);
        }
    });
}
