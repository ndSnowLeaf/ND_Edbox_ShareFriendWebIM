var PresenterFlowerTip = (function() {
  "use strict";
  var $body = $("body");
  var html = "<div class='stat_wood'><div class='com_pop_flower'><div class='pop_text_main'><span class='pop_flower'></span><span class='font_size'></span></div></div></div>";

  var lang_cn = {
    "notice.sendflower0": "成功向{0}这{1}位同学送出1朵鲜花",
    "notice.sendflower1": "成功向{0}...等这{1}位同学送出1朵鲜花"
  }

  var Tips = function(users) {
    if ($.inArray(users)) {
      var $body = $("body");
      var $html = $(html);
      var u = "";
      var i,
        index,
        len = users.length;
      for (i = 0; i < len; i++) {
        if (i >= 5) {
          break;
        }
        u += users[i] + "、";
      }
      if ((index = u.lastIndexOf("、")) >= 0) {
        u = u.substring(0, index);
      }

      var lang;
      if (window.Midware && window.Midware.i18nManager && window.Midware.i18nManager.CurrentLanguage) {
        Midware.i18nManager.loadLanguage("ObjectiveStatisticsRemake", Midware.i18nManager.CurrentLanguage).then(function (lang) {
          sendFlower(lang.lang);
        });
      } else if (window.player && window.player.getPlayerServices) {
        var ps = player.getPlayerServices();
        var m = ps.getModulesByType("ObjectiveStatisticsRemake");

        if (m.length > 0) {
          lang = m[0].langProperties;
        } else {
          m = ps.getModulesByType("AnswerClassStatis");
          if (m.length > 0) {
            lang = m[0].$translator._data;
          }
        }
        sendFlower(lang);
      } else { //默认
        sendFlower(lang_cn);
      }


      function sendFlower(langProperties) {
        var msg;
        if (langProperties) {
          if (len < 5) {
            if (!langProperties["notice.sendflower0"]) {
              msg = "成功向";
              msg = msg + "<em class='name'>" + u + "</em>" + "这" + "<em class='num'>" + len + "</em>" + "位同学送出1朵鲜花";
            }
            msg = langProperties["notice.sendflower0"].replace(/\{0\}/, "<em class='name'>" + u + "</em>")
              .replace(/\{1\}/, "<em class='num'>" + len + "</em>");
          } else {
            if (!langProperties["notice.sendflower1"]) {
              msg = "成功向";
              msg = msg + "<em class='name'>" + u + "</em>" + "...等" + "<em class='num'>" + len + "</em>" + "位同学送出1朵鲜花";
            }
            msg = langProperties["notice.sendflower1"].replace(/\{0\}/, "<em class='name'>" + u + "</em>")
              .replace(/\{1\}/, "<em class='num'>" + len + "</em>");
          }
        } else { //兼容1.0.1
          msg = "成功向";
          if (len <= 5) {
            msg = msg + "<em class='name'>" + u + "</em>" + "这" + "<em class='num'>" + len + "</em>" + "位同学送出1朵鲜花";
          } else {
            msg = msg + "<em class='name'>" + u + "</em>" + "...等" + "<em class='num'>" + len + "</em>" + "位同学送出1朵鲜花";
          }
        }

        $html.find("span.font_size").append(msg);
        $body.append($html);
        setTimeout(function() {
          $html.fadeOut(2000, function() {
            $html.remove();
          });
        }, 1000);
      }
    }
  }
  return Tips;
}());
