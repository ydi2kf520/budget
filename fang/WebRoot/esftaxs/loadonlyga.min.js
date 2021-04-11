var _dctc_onlyga = _dctc_onlyga || {};
var _account = _dctc_onlyga._account || [];
var _gaq = _dctc_onlyga._gaq || [];

//{category, action, opt_label, opt_value, opt_noninteraction}
_dctc_onlyga.trackEvent = function (obj) {
    if (!obj) {
        return;
    }
    try {
        if (_account.length > 0) {
            for (var i in _account) {
                _gaq.push(['t' + i + '._setAccount', _account[i]]);

                var arrTrackEvent = [];
                arrTrackEvent.push('t' + i + '._trackEvent');

                var arrObjProperty = [obj.c, obj.a, obj.l, obj.v, obj.n];

                for (var j = 0; j < arrObjProperty.length; j++) {
                    if (arrObjProperty[j]) {
                        arrTrackEvent.push(arrObjProperty[j]);
                    }
                }
                _gaq.push(arrTrackEvent);
            }
        }
    } catch (err) { }
}

function __getDomain() {
    var dm = '';
    hn = location.hostname;
    str = hn.replace(/\.(com|net|org|cn$)\.?.*/, "");
    if (str.lastIndexOf(".") == -1)
        dm = "." + hn;
    else {
        str = str.substring(str.lastIndexOf("."));
        dm = hn.substring(hn.lastIndexOf(str));
    }
    return dm;
}
var __domain = __getDomain();

if (_account.length > 0) {
    for (var i in _account) {

        _gaq.push(['t' + i + '._setAccount', _account[i]]);
        _gaq.push(['t' + i + '._setDomainName', __domain]);
        _gaq.push(['t' + i + '._addOrganic', 'soso', 'w']);
        _gaq.push(['t' + i + '._addOrganic', 'soso', 'key']);
        _gaq.push(['t' + i + '._addOrganic', 'sogou', 'query']);
        _gaq.push(['t' + i + '._addOrganic', 'sogou', 'keyword']);
        _gaq.push(['t' + i + '._addOrganic', 'youdao', 'q']);
        _gaq.push(['t' + i + '._addOrganic', 'baidu', 'word']);
        _gaq.push(['t' + i + '._addOrganic', 'baidu', 'q1']);
        _gaq.push(['t' + i + '._addOrganic', 'baidu', 'w']);
        _gaq.push(['t' + i + '._addOrganic', 'baidu', 'kw']);
        _gaq.push(['t' + i + '._addOrganic', '360', 'q']); //360搜索 新闻
        _gaq.push(['t' + i + '._addOrganic', '360', 'kw']); //360视频
        _gaq.push(['t' + i + '._addOrganic', 'so.com', 'q']); //so.com域名下的360搜索

        _gaq.push(['t' + i + '._addOrganic', 'easou', 'q']);
        _gaq.push(['t' + i + '._addOrganic', 'yicha', 'key']);
        _gaq.push(['t' + i + '._addOrganic', 'roboo', 'q']);

        _gaq.push(['t' + i + '._trackPageview']);
    }
}

if (_dctc_onlyga._trackTrans) {
    for (var j in _dctc_onlyga._trackTrans) {
        _gaq.push(['t' + _dctc_onlyga._trackTrans[j] + '._trackTrans']);
    }
}
(function () {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

