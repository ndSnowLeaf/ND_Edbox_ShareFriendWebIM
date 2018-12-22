/**
 * Created by Administrator on 2016/12/14.
 */
import ChineseWordTracing from "./trace/chinesewordtracing"

(function (global, factory) {

    factory(global);

})(typeof window === 'undefined' ? this : window, function (window) {

    window.ChineseWordTracing = ChineseWordTracing;
});