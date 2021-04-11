!function(g, h) {
    function b(j) {
        var i, k = new RegExp("(^| )" + j + "=([^;]*)(;|$)");
        if (i = g[c[11]].cookie.match(k)) {
            return decodeURIComponent(i[2])
        } else {
            return null
        }
    }
    function d(i, j, l) {
        var k = new Date();
        isNaN(l) && (l = 3);
        k.setTime(k.getTime() + l * 24 * 60 * 60 * 1000);
        g[c[11]].cookie = i + "=" + encodeURIComponent(j) + "; path=/; expires=" + k.toGMTString()
    }
    var c = ["clientdownshow", "iClose", "smartDom", "openApp", "preventDefault", "stopPropagation", "mainBody", "floatApp", "style", "createElement", "append", "document", "class", "push"], f = g[c[11]], e = g.jQuery, a = function() {
        this.calClose() || this.createHtml()
    };
    a.prototype = {constructor: a,calClose: function() {
        var i = b(c[0] + "_index");
        if (i) {
            this[c[1]] = !0;
            return this[c[1]]
        }
    },template: function() {
        var i = [],appImgUrl,title,downtitle='';
        title = '\u79df\u623f\u0030\u4e2d\u4ecb\u8d39<br>\u4e8c\u624b\u623f\u4f63\u91d1\u53ea\u6536\u0030\u002e\u0035\u0025';
        appImgUrl ="http://js.soufunimg.com/common_m/m_public/img/sf-72.png";
		if(window.hasOwnProperty('seajs')){
			downtitle = seajs && seajs.data.vars.downtitle;
		}
        if(downtitle){
        	title = downtitle;
        }
        i[c[13]]('<div class="floatApp">');
        i[c[13]]('<a href="#box" class="linkbox" id="wapdsy_D05_04">');
        i[c[13]]('<span class="btn">\u7acb\u5373\u4e0b\u8f7d</span>');
        i[c[13]]('<img src="'+appImgUrl+'" width="36">');
        i[c[13]]('<div class="text">');
        i[c[13]]('<p class="f14" style="line-height: 18px;">'+title+'</p>');
        i[c[13]]('</div>');
        i[c[13]]('</a>');
        i[c[13]]('<a href="#off" class="off"><span>x</span></a>');
        i[c[13]]('</div>');
        return i.join("")
    },createHtml: function() {
        if (!this[c[1]]) {
            var l = this.template(), k = f[c[9]](c[8]), o = f[c[9]]("div"), n = [""];
            o.innerHTML = l, this[c[2]] = o.querySelector("div." + c[7]);
            var j = e(f.body);
            j[c[10]](this[c[2]]), this.listen();
        }
    },show: function() {
        this[c[1]] || this[c[2]] && (this[c[2]][c[8]].display = "block")
    },hide: function() {
        this[c[1]] || this[c[2]] && (this[c[2]][c[8]].display = "none")
    },listen: function() {
        if (!this[c[1]]) {
            var i = this, j = e(i[c[2]]);
            j.find("a.off").bind("click", function(k) {
                k[c[4]](), k[c[5]]();
                i.foo(), i.log(3);
                $('.remove_bottom').css('padding-bottom','0px');
            });
            j.find("a.linkbox").bind("click", function(o) {
                var n, k, m = "http://js.soufunimg.com/common_m/m_public/jslib/app/1.0.1/appopen.js", p = function(q) {
                    typeof g[c[3]] === "function" && (q = g[c[3]]);
                    var appUrl = "http://m.soufun.com/clientindex.jsp?company=1109";
                    var appstoreUrl ='https://itunes.apple.com/cn/app/soufun/id413993350?mt=8&ls=1';
                    var l = q({url: appUrl, appstoreUrl:appstoreUrl, log: i.log});
                    l[c[3]]()
                };
                if(g.location.href.indexOf('m.test') > -1){
                    m = "http://js.test.soufunimg.com/common_m/m_public/jslib/app/1.0.1/appopen.js";
                }
                o[c[4]](), o[c[5]]();
                if (typeof g.seajs === "object") {
                    g.seajs.use(m, p)
                } else {
                    n = f[c[9]]("script"), k = f.getElementsByTagName("head")[0], n.async = true, n.src = m, n.onload = p, k[c[10] + "Child"](n)
                }
            })
        }
    },log: function(i) {
        e && e.get("/public/?c=public&a=ajaxOpenAppData", {type: i,rfurl: f.referrer})
    },foo: function() {
        this.hide();
        try {
            d(c[0] + "_index", 1, 2), d(c[0], 1, 2), this.calClose()
        } catch (i) {
        }
    }};
    new a()
}(self, self.lib || (self.lib = {}));