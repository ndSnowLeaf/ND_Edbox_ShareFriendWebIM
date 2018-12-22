/**
 * Created by Administrator on 2017/3/31.
 */
export function GetQueryString(name) {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}

export const EVENTS = {
    "MouseEvent":["click", "dbclick", "mousedown", "mouseup", "mousemove", "mouseleave"],
    "KeyboardEvent":["keydown", "keyup", "keypress"],
    "InputEvent":["change", "input", "focus", "blur"],
    "CustomEvent":["loadstart"]
};