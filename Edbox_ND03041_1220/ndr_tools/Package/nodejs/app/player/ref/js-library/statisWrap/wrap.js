(function(window, wrap) {
  window.statisticWrap__ = wrap();
})(window, function() {
  function Wrap() {}
  var wrap = new Wrap();
  wrap._setController = function(controller) {
    this.controller = controller;
  };
  wrap.getPresenterController = function() {
    return wrap.controller;
  };
  wrap.__interface = (function() {
    return {
      wrap: function(target) {
        var deferred = $.Deferred();
        wrap.controller.require({
          addonId: "Layout",
          id: "Layout",
          layout: {
            left: 0,
            top: 0,
            width: "100%",
            height: "100%"
          },
          renderTo: target,
          properties: []
        }).done(function(layoutPresenter) {
          deferred.resolve(layoutPresenter.getMain());
        });
        return deferred.promise();
      }
    };
  })();

  return wrap;
});
