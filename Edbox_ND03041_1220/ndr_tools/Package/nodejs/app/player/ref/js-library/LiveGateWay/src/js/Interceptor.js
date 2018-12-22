/**
 * Created by Administrator on 2017/3/31.
 */
import EventListenerWrap from './EventListenerWrap';
import {GetQueryString, EVENTS} from './utils';


class Interceptor {
    constructor(){
    }

    static generateEventListenerWrap(eventName,callBack){
        let eventListenerWrap = new EventListenerWrap(this,{eventName:eventName,callBack:callBack});
        return eventListenerWrap;
    }


    static overrideWindowMethod() {
        Interceptor.allowEventList = [].concat(EVENTS.MouseEvent,EVENTS.KeyboardEvent,EVENTS.InputEvent,EVENTS.CustomEvent);
        Interceptor.dragOptions = [];
        Interceptor.lastEvent = null;
        Interceptor.lastMouseMoveEvent = null;

        /*覆盖EventTarget方法不能在实例方法中操作，因此改为在静态方法中*/
        Interceptor.targetAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = Interceptor.execAddEventListener;
        Interceptor.targetRemoveEventListener = EventTarget.prototype.removeEventListener;
        EventTarget.prototype.removeEventListener = Interceptor.execRemoveEventListener;
    }

    /**
     * 重写EventTarget.addEventListener方法
     */
    static execAddEventListener() {
        var _eventName = arguments[0], _callback = arguments[1];
        /* 解决诸如progWrapper.on('mousemove touchmove', '', handler);这样的连续事件绑定的情况下，
         原来如果只是_callback.icrcb = myEventListener这样写法，那icrcb永远都只会是最后一个，
         所以移除的只是最后一个，修改为_callback[_eventName + '_icrcb']之后，这样就会add和remove对应上 */
        //_callback.icrcb = myEventListener;
        let eventListenerWrap = Interceptor.generateEventListenerWrap(_eventName,_callback);
        _callback[_eventName + '_icrcb'] = eventListenerWrap;
        arguments[1] = eventListenerWrap;
        Interceptor.targetAddEventListener.apply(this, arguments);
    }

    /**
     * 重写EventTarget.removeEventListener
     */
    static execRemoveEventListener() {
        var _eventName = arguments[0], _callback = arguments[1];
        if(_callback){
            if(_callback[_eventName + '_icrcb']){
                Interceptor.targetRemoveEventListener.apply(this, [_eventName,_callback[_eventName + '_icrcb']]);
            }else{
                Interceptor.targetRemoveEventListener.apply(this, [_eventName,_callback]);
            }
        }
    }

    run() {
        jQuery.each({
            mouseleave: "mouseleave"
        }, function( orig, fix ) {
            jQuery.event.special[ orig ] = {
                delegateType: fix,
                bindType: fix,

                handle: function( event ) {
                    var ret,
                        target = this,
                        related = event.relatedTarget,
                        handleObj = event.handleObj;

                    // For mousenter/leave call the handler if related is outside the target.
                    // NB: No relatedTarget if the mouse left/entered the browser window
                    if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
                        event.type = handleObj.origType;
                        ret = handleObj.handler.apply( this, arguments );
                        event.type = fix;
                    }
                    return ret;
                }
            };
        });

        let live_terminal = GetQueryString('live_terminal');
        if(live_terminal === 'teacher'){
            Interceptor.overrideWindowMethod();

            EventListenerWrap.addScrollEvent();
        }
    }
}

let interceptor = new Interceptor();
interceptor.run();