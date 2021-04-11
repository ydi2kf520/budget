define("modules/tools/main",['jquery',"modules/tools/calcHousingMoneyNew"], function(require,exports,module){
    "use strict";
    var $ = require("jquery"),vars = seajs.data.vars;
    var newMsgDom = $(".sms-num");
    var controlName = window.lib && window.lib.channelsConfig && window.lib.channelsConfig.currentChannel;

    require("modules/tools/calcHousingMoneyNew");
    if (controlName) {
        $.each(vars, function(index,element){
            window.lib[index] = element;
        });
        require.async(vars.public + "js/header_list_new.js");
    }

    require.async(["navflayer/navflayer_new"]);
        if (vars.action != "") {
            require.async('modules/tools/' + vars.action, function(run){
                run();
            });
        }

        // 获取和显示新消息数
        require.async(["newmsgnum/1.0.0/newmsgnum"], function(NewMsgNum){
            new NewMsgNum(vars.mainSite, vars.city).getMsg(newMsgDom);
        });
        // 稍作页面滚动，隐藏地址栏
        window.scrollTo(0, 1);
        // 判断是否加载显示回顶按钮
        var $window = $(window);
        $window.on('scroll.back', function(){
            if ($window.scrollTop() > $window.height() * 2 - 60) {
            require.async(["backtop/1.0.0/backtop"], function(backTop){
                backTop();
            });
            $window.off('scroll.back');
        }
    });

    require.async(vars.public + "js/20141106.js");
    // 统计功能
    require.async('http://clickm.soufun.com/click/new/clickm.js', function(){
        Clickstat.eventAdd(window, 'load', function(e){
            Clickstat.batchEvent('waptool_', '');
        });
    });
    require.async(['count/loadforwapandm.min.js','count/loadonlyga.min.js']);
});