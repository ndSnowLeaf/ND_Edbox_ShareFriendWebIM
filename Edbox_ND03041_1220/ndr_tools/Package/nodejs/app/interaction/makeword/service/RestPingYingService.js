/**
 * Created by px on 2015/6/16.
 */
define(['angularAMD'], function(angularAMD) {
    'use strict';
    angularAMD
        .service('PinYingService', ['RestPinYingEditor', '$stateParams','$filter', 
                                 function(RestPinYingEditor,$stateParams,$filter) {

        return {
            getPinYing: function(character){                
                return RestPinYingEditor().one("pinyins").getList('',{character:character});
            }
        };
    }]);
});
