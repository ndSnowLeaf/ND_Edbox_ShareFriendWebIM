(function() {
    if (window.Vuex && window.Vuex.Store) {
        Vuex._Store = Vuex.Store;
        Vuex.Store = function(options) {
            var helpers = Array.prototype.slice.call(arguments, 1);
            var store = typeof options === 'function' ? options.apply(null, helpers) : options;
            if (store.modules) {
                for(var key in store.modules) {

                    if (typeof store.modules[key] === 'function') {
                        store.modules[key] = store.modules[key].apply(null, helpers);
                    }
                }
            }
            var $store = new Vuex._Store(store);
            if ('registerModule' in $store && !$store.hasOwnProperty('registerModule')) {
                $store.registerModule = function(name, options) {
                    return $store.__proto__.registerModule.call($store, name, typeof options === 'function' ? options.apply(null, helpers) : options);
                }
            }
            return $store;
        };
    }
})();
