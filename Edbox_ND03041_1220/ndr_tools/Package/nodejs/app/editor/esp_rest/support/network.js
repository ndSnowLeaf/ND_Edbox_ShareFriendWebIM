var Q=require("q");exports.isOnline=function(){var e=Q.defer();return require("dns").resolve("cs.101.com",function(r){r?e.resolve(!1):e.resolve(!0)}),e.promise};