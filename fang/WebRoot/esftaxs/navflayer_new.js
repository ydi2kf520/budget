/**
 * Created by Sunny on 14-7-30.
 */
(function(window, factory) {
    if ( typeof define === 'function') {
        // AMD
        define("navflayer/navflayer_new",[],function() {
            return factory(window);
        });
    } else if ( typeof exports === 'object') {
        // CommonJS
        module.exports = factory(window);
    } else {
        // browser global
        factory(window);
    }
})(window,function(window){
    "use strict";
    var $ = window.$,
        header = $("header"),
        hIcon = header.children("div.head-icon"),
        hCenter = header.children("div.cent"),
        icoNav = hIcon.find("a.icon-nav"),userName,
        nav = $("#nav").css({position:"absolute", width:"100%", top:"44px","z-index":"9999"}),headerPosition,
        navShadow = $("div#navShadow").css({position:"absolute","z-index":"9998"}),smsNum,smsNumContainer,callback=window.navFlayer||(window.navFlayer={});
    // 在这里定义函数
    var showNav = function(){
        nav.show();
        navShadow.show();
        icoNav.addClass('active');
        smsNum == undefined && (smsNum = $(".sms-num").first(),smsNumContainer= smsNum.parent()),smsNum.detach();
        headerPosition = header.css("position"), headerPosition !== "absolute" && header.css({"position":"absolute","width":"100%","top":"0px","z-index":"9999"});
        undefined===userName&&$.get("/public/?c=public&a=ajaxUserInfo",function(o){userName="",o!= !1 && undefined!=o.username && $("div#nav div.mt10 div.nav-tit a").text(userName=o.username)});
        $.isFunction(callback.show) && callback.show();
    };
    var hideNav = function(){
        nav.hide();
        navShadow.hide();
        icoNav.removeClass('active');
        headerPosition !== "absolute" && header.css({"position":headerPosition});
        !!smsNumContainer && smsNumContainer.append(smsNum);
        $.isFunction(callback.hide) && callback.hide();
    };
    icoNav.on("click",function(){
        if (nav.is(":hidden")) {
            showNav();
			$('#headSear').hide();
        }else {
            hideNav();
        }
    });
    navShadow.on("click",function(){
        hideNav();
		$('#headSear').hide();
    });
    callback.hideNav = hideNav;
    return callback;
});