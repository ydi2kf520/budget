!(function(g, i) {
    var e, a, c, h, f, b;
    var d = g.navigator.userAgent; //判断是否为小米黄页
    if(/MiuiYellowPage/i.test(d)) return ;
    var qstring = g.location.search.substr(1);
    var start = qstring.indexOf('sf_source');
    if(start > -1 && (qstring.indexOf('qqbrowser') || qstring.indexOf('bd_3g'))) {
        return;
    }
    var abnormal = g.browser_abnormal||g.seajs && g.seajs.data.vars.browser_abnormal;
    if(!!abnormal){
        return;
    }
    c = new Date(), h = g.lib && g.lib.city || g.seajs && seajs.data.vars.city || g.city;
    f = "" + c.getFullYear() + c.getMonth() + c.getDate();
    b = '03';
    if(h == 'bj' || h == 'sh' || h =='gz'|| h == 'sz' ){
        b = '01';
    } else if (['tj','suzhou','cd','hz','wuhan','nanjing','cq'].indexOf(h)>-1){
        b = '02';
    }
    e = i.createElement("script");
    e.async = true;
    e.src = "http://js."+(g.location.href.indexOf('m.test') > -1 ? 'test.' : '')+"soufunimg.com/common_m/m_public/js/wa201503" + b + ".js?t=" + f;
    a = i.getElementsByTagName("head")[0];
    a.appendChild(e);
})(window, document);
/*
 QQ浏览器：http://m.fang.com/?sf_source=qqbrowser_mz
 腾讯房产频道：http://m.fang.com/?sf_source=bd_3g.qq_dh
 http://m.fang.com/?sf_source=bd_3g.qq_dj


 */