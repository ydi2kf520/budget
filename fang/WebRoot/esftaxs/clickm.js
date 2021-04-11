var Clickstat = {
    address: 'http://probe.light.fang.com/Prick.do?',
	addressOld: 'http://' + function () {
	if (document.location.host.indexOf('fang.com') >= 0) {
		return 'clickm.fang.com';
		} 
		else {
		return 'clickm.soufun.com';
		} 
	} () + '/click/clickstat.php?',
    prefix: '',
    blocks: null,
    inArray: function (a, b) {
        if (a && 'undefined' != typeof b) {
            for (var i = 0; i < a.length; i++) {
                if (b == a[i]) {
                    return true
                }
            }
            return false
        }
        return false
    },
    eventAdd: function (a, b, c) {
        if (document.addEventListener) {
            a.addEventListener(b, c, false)
        } else if (document.attachEvent) {
            a.attachEvent("on" + b, c)
        }
    },
    prepareUrl: function (a, b) {
        var c = a + 'aip=1&aa=1&at=1&fst=3&fet=0&fn=fileclickmap&dn=clickmap&cst=`&data=';
        for (var i in b) {

            if ( 'prefix' == i ) {

                c += b[i];
            }
            else {
                c += '`' + b[i];
            }
            
        }
        c += '&random=' + Math.random();

        return c
    },
    prepareUrlOld: function (a, b) {
        var c = a + '&random=' + Math.random();
        for (var i in b) {
            c += '&' + i + '=' + b[i]
        }
        return c 
    },
    clickHandler: function (e) {
        e = e || window.event;
        var a = e.target || e.srcElement;
        var b = a;
        var c;
        if (('A' == b.tagName) || ('INPUT' == b.tagName) 
            || ('OBJECT' == b.tagName) || ('SELECT' == b.tagName)) {
            c = b
        } else {
            while (b = b.parentNode) {
                if (('A' == b.tagName) || ('INPUT' == b.tagName)
                || ('OBJECT' == b.tagName) || ('SELECT' == b.tagName)) {
                    c = b;
                    break
                }
            }
        }
        if (c) {
            var d = a.getBoundingClientRect();
            if (d && (d.left < e.clientX) && (e.clientX < d.right) && (d.top < e.clientY) && (e.clientY < d.bottom)) {
                var f = '';
                var b = c;
                if (('' != b.id) && ((b.id.indexOf(this.prefix) > -1) || this.inArray(this.blocks, b.id))) {
                    f = b.id
                } else {
                    while (b = b.parentNode) {
                        if ((b.id) && ((b.id.indexOf(this.prefix) > -1) || this.inArray(this.blocks, b.id))) {
                            f = b.id;
                            break
                        }
                    }
                }
                if ('' != f) {
                    var g = ('A' == c.tagName) ? c.href : '';
                    var h = document.compatMode == 'CSS1Compat' ? document.documentElement : document.body;
                    var i = this.prefix;
                    if (i.length > 0 && '_' == i.charAt(i.length - 1)) {
                        i = i.substring(0, i.length - 1)
                    }
                    var j = Clickstat.getUVInfo();
                    var k = {
                        'prefix': i,
                        'hostname': location.hostname,
                        'url': escape(location.href),
                        'div': f,
                        'href': escape(g),
                        'width': screen.width,
                        'x': e.clientX + h.scrollLeft,
                        'y': e.clientY + h.scrollTop,
                        'g': j.g || 'g',
                        'u': j.u || 'u',
                        'i': j.i || 'i'
                    };
                    if ('undefined' != typeof this.secDomain && this.secDomain) k.folder = this.secDomain + i;
                    var l = this.prepareUrl(this.address, k);
                    var m = document.createElement('img');
                    m.height = 0;
                    m.width = 0;
                    m.src = l;
                    document.body.appendChild(m);

                    var urlOld = this.prepareUrlOld(this.addressOld, k);
                    var m1 = document.createElement('img');
                    m1.height = 0;
                    m1.width = 0;
                    m1.src = urlOld;
                    document.body.appendChild(m1);
                    return true
                }
            }
        }
    },
    batchEvent: function () {
        if (arguments.length < 1) return;
        this.prefix = arguments[0];
        if ('undefined' != typeof arguments[1]) this.secDomain = arguments[1];
        this.eventAdd(document, 'mousedown',
        function (e) {
            Clickstat.clickHandler(e)
        })
    },
    blocksEvent: function () {
        if (arguments.length < 2) return;
        var a = arguments[0];
        this.prefix = arguments[1];
        if ('undefined' != typeof arguments[2]) this.secDomain = arguments[2];
        this.blocks = [];
        for (var b = 0; b < a.length; b++) {
            var c = a[b];
            var d = document.getElementById(c);
            if (d) {
                this.blocks.push(c);
                var f = d.getElementsByTagName('a');
                var g = d.tagName.toLowerCase();
                if ('a' == g || 'input' == g || 'li' == g || 'object' == g || 'select' == g) {
                    Clickstat.eventAdd(d, 'mousedown',
                    function (e) {
                        Clickstat.clickHandler(e);
                        return false
                    })
                }
                for (var i = 0; i < f.length; i++) {
                    Clickstat.eventAdd(f[i], 'mousedown',
                    function (e) {
                        Clickstat.clickHandler(e);
                        return false
                    })
                }
            }
        }
    },
    mixedEvent: function () {
        if (arguments.length < 2) return;
        var a = arguments[0];
        this.prefix = arguments[1];
        if ('undefined' != typeof arguments[2]) this.secDomain = arguments[2];
        this.blocks = [];
        for (var b = 0; b < a.length; b++) {
            var c = a[b];
            var d = document.getElementById(c);
            if (d) {
                this.blocks.push(c)
            }
        }
        this.eventAdd(document, 'mousedown',
        function (e) {
            Clickstat.clickHandler(e)
        })
    },
    getUVInfo: function () {
        var a = {
            tag: "false",
            g: "g",
            u: "u",
            i: "i"
        };

        var flag = 0;
        if (typeof SFUV == "undefined" && typeof SFUVForWapAndM == "undefined") {
            return a;
        }
        if (typeof SFUV == "undefined") {
            flag = 1;
            SFUV = SFUVForWapAndM;
        }
        if (typeof SFUV == 'undefined') {
            return a
        }
        if (typeof SFUV.getcookie == 'undefined') {
            return a
        }
        try {
            if (flag == 0) {
                a.g = SFUV.getcookie(SFUV.G_GlobalCname);
                a.u = SFUV.getcookie(SFUV.G_UniqueCname).split('*')[0];
            }
            else {
                a.g = SFUV.getcookie("global_cookie");
                a.u = SFUV.getcookie("unique_cookie").split('*')[0];
            }
            var b = [];
            b['isso_login'] = SFUV.getcookie('isso_login');
            b['isso_uuid'] = SFUV.getcookie('isso_uuid');
            if (b['isso_uuid']) {
                a.i = '100~' + b['isso_uuid'] + '~' + b['isso_login']
            }
            a.tag = 'true'
        }
        catch (e) {
            a.tag = 'error'
        }
        a.g = a.g == '' ? 'g' : a.g;
        a.u = a.u == '' ? 'u' : a.u;
        a.i = a.i == '' ? 'i' : a.i;
        return a
    }
};