!function(win, lib) {
    "use strict";
    var $ = win.$,config=lib.channelsConfig,channelIndex=0,cIndex=0,channels = config.channels||["xf","esf","zf","jiaju","pinggu","news","bbs","ask","zhishi"],channel = config.currentChannel||"",
        active=!1,i=0,len = channels.length;
    var specialChannel=channel;
    0<=$.inArray(channel,["kanfangtuan","tuangou"]) && (channel = "xf");
    for(;i<len;i++){
        if(channels[i] == channel){
            cIndex = channelIndex = i,active=!0;
            break;
        }
    }
    lib.mainSite = "/",lib.askSite = "/ask/",lib.zhishiSite = "/zhishi/",lib.bbsSite = "/bbs/",lib.newsSite = "/news/",lib.pingguSite = "/fangjia/",lib.zfSite = "/zf/",lib.esfSite = "/esf/",lib.jiajuSite = "/jiaju/";
    /**
     * active==!1时，说明当前频道不在channels之中，
     * 这时下面的搜索框要显示下拉，显示搜索频道。
     * */
    !active && 0<=$.inArray("pinggu",channels) && (cIndex = channelIndex = 4);
    if(channelIndex>4){//调整为正确顺序
        channels.splice(channelIndex,1),channels.splice(4,0,channel);
        cIndex = 4;
    }
    lib.smartbanner = {channel:channel,cIndex:cIndex,specialChannel:specialChannel,channelIndex:channelIndex,channels:channels,active:active,cityNS:{}};
}(window, window.lib || (window.lib = {})),function(win, lib) {
    "use strict";
    var $ = win.$,ba = lib.smartbanner,channel=ba.channel,cIndex=ba.cIndex,channelIndex=ba.channelIndex,channels=ba.channels,
        nav = $("div.tabNav"),navChild = nav.children("div"),nav1 = navChild.eq(0),nav2 = navChild.eq(1),
        navList1 = nav1.children("a"),navList2 = nav2.find("a"),mapBtn,
        bar = $(".search0620"),
        q = bar.find("input#S_searchtext"),
        channelList = {"xf":["新房",'楼盘名/地名/开发商'],"esf":["二手房",'楼盘名/地段名'],"zf":["租房",'楼盘名/地段名'],"jiaju":["家居",'楼盘/功能间/居室/风格'],"pinggu":["查房价",'请输入小区名称'],"news":["资讯",'请输入关键字'],"bbs":["论坛",'楼盘名/小区名/论坛名'],"ask":["问答",'请输入您的问题'],"zhishi":["知识",'请输入您的问题']},
        channelName = [],
        channelUrl=[],
        channelNote = [];
    $.each(channels,function(index,element){
        if(channelList.hasOwnProperty(element)){
            channelName.push(channelList[element][0]);
            channelNote.push(channelList[element][1]);
        }
    });
    function setLink(){
        var obj={},a=[];
        navList1.add(navList2).each(function(index,element){
            var ele = $(element),key = ele.text().replace(/(^\s+)|(\s+$)/g, "");
            key && (obj[key] = ele.attr("href"));
        })
        $.each(channelName,function(index,element){
            a.push(obj[element]);
        })
        return a;
    }
    if(channelIndex>4 ||channels.length<8){
        channelUrl =setLink();
        navList1.eq(4).attr("href", channelUrl[4]).text(channelName[4]);
        channels.length<8 && (nav2.find("li").eq(2).remove(),navList2 = nav2.find("a"));
        navList2.each(function(index,element){
            var ele = $(element),idx = index+5;
            ele.attr("href", channelUrl[idx]).text(channelName[idx]);
        });
    }
    channel == "jiaju" && (lib.action == "buildList" ? (channelName[cIndex] = "建材",channelNote[cIndex] = "品牌名/产品名"):(channelName[cIndex] = "装修"));
    if(channel == "xf" && lib.action) {
        var titArr = {"searchHuXingList":'户型',"getPrivilegeHouseList":'房源'};
       (titArr[lib.action]) && (channelName[cIndex] = titArr[lib.action]);
    }
    ba.active && navList1.eq(cIndex).removeClass();
    q.attr("placeholder",channelNote[cIndex]);
    if(0<=$.inArray(channel,["xf","esf"])){
        if(!(channel =='xf' && lib.action))
        mapBtn = $('<a  id="wap'+channel+'sy_D01_07" href="'+lib.mainSite+'map/?city='+lib.city+'&a='+channel+'Map" class="mapbtn">地图</a>').appendTo(bar);
    }
    !ba.active && channelIndex===0 && !lib.searchTipUrl && (lib.searchTipUrl ="/xf.d?m=getMapByKeyWordNew&qubie=新房");
    $.each({nav:nav,bar:bar,q:q,channelName:channelName,channelNote:channelNote,moreBtn:navList1.eq(5),nav1:nav1,nav2:nav2,mapBtn:mapBtn},function(key,value){
        lib.smartbanner[key] = value;
    });
}(window, window.lib || (window.lib = {}));
!function(win, lib) {
    var c = win.localStorage;
    try {
        c && c.setItem("testPrivateModel", !1)
    } catch (d) {
        c = null
    }
    lib.localStorage = c;
}(window, window.lib || (window.lib = {})),function(win, lib) {
    "use strict";
    var $ = win.$,ba = lib.smartbanner,specialChannel=ba.specialChannel,nav=ba.nav,bar=ba.bar,q=ba.q,channel=ba.channel,cIndex=ba.cIndex,channels=ba.channels,channelName=ba.channelName,channelNote=ba.channelNote,
        channelType,body,t,text = channelName[cIndex],ajaxReq,
        offBtn = bar.find("a.off"),submitBtn = bar.find("a.btn"),sPop = !1,specialLimit=["xf","esf","zf"];
    q.val()!="" && offBtn.show();
    var libXfaction= ['getPrivilegeHouseList','searchHuXingList'];
    var actionchannel = (lib.action && lib.action =='searchHuXingList')?'huxinglist':'';
    //弹出搜索浮层处理
    var searchEl=$('<form class="search0620 flexbox" action="" onsubmit="return false;" method="get" autocomplete="off">' +
        '<div class="searbox">' +
        '<div class="ipt" id="wap'+((actionchannel !='')?actionchannel:(specialChannel+'sy'))+'_D01_09"><input id="S_searchtext" type="search" name="q" value="" placeholder="'+((specialChannel=="ask"  || specialChannel == 'zhishi')?"请输入您的问题":"楼盘名/地名/开发商等")+'" autocomplete="off">' +
        '<a href="javascript:;" class="off" style="display: none;"></a></div><a href="javascript:;" id="wap'+((actionchannel !='')?actionchannel:(specialChannel+'sy'))+'_D01_18" class="btn" rel="nofollow"><i></i></a></form>');
    if (specialChannel == 'esf') {
        searchEl=$('<form class="search0620 flexbox" action="" onsubmit="return false;" method="get" autocomplete="off">' +
            '<div class="searbox">' +
            '<div class="ipt" id="wap'+specialChannel+'sy_D01_09"><input id="S_searchtext" type="search" name="q" value="" placeholder="输入关键词（小区名/地段名）" autocomplete="off">' +
            '<a href="javascript:;" class="off" style="display: none;"></a></div><a href="javascript:;" id="wap'+specialChannel+'sy_D01_18" class="btn" rel="nofollow"><i></i></a></form>');
    }
    //知识无搜索结果提示
    var emptyTip = $("<div class='center pdY10'><p class='f999 f12'>暂时没有相关知识，换个关键词试试吧~</p></div>");
    //热词列表容器
    var hotCon=$('<div class="searLast" id="wap'+((actionchannel !='')?actionchannel:(specialChannel+'sy'))+'_D01_19"><h3>最近热搜</h3><div class="cont clearfix" id="hotList"></div></div>');
    //热词列表
    var hotList=hotCon.find("#hotList");
    //热门标签容器
    var hotFlagCon=$('<section class="hot-box"><div class="hot-title"><a href="javascript:void(0);" class="flor f14">换一批</a>最近热搜</div><div class="hot-list" id="wap'+specialChannel+'bq_D01_09"><div class="askTag"></div></section>');
    //<a href="#" class="c1"><h2>公积金</h2></a><a href="#" class="c2"><h2>买房贷款</h2></a><a href="#" class="c3"><h2>首付</h2></a><a href="#" class="c4"><h2>交易过户</h2></a><a href="#" class="c5"><h2>房产证</h2></a><a href="#" class="c1"><h2>公积金</h2></a><a href="#" class="c2"><h2>买房贷款</h2></a><a href="#" class="c3"><h2>首付</h2></a><a href="#" class="c4"><h2>交易过户</h2></a><a href="#" class="c5"><h2>房产证</h2></a>
    //热门标签容器
    var hotFlagList=hotFlagCon.find(".askTag");
    //弹出搜索浮层处理
    var sel = $('<div class="sel"><span></span></div>'),clearHisText = "清除历史记录",ssText = "搜索",closeText = "关闭";
      //添加小米黄页操作
    var miuid = win.navigator.userAgent;
    var snav_template = '<header style="display:'+((/MiuiYellowPage/i.test(miuid))?'none':'block')+'"><div class="left" id="wap'+((actionchannel !='')?actionchannel:(specialChannel+'sy'))+'_D01_08"><a href="javascript:;" class="back" id="wap'+((actionchannel !='')?actionchannel:(channel+'sy'))+'_D01_08"><i></i></a></div>'
            +    '<div class="cent"><span>'+text+ssText+'</span></div>'
            +    '<div class="head-icon"></div><div class="clear"></div></header>',
        snav = $(snav_template);
        var searList = $('<div class="searList" id="wap'+((actionchannel !='')?actionchannel:(channel+'sy'))+'_D01_10"><ul></ul></div>');
        var searListUl = searList.find("ul"),
        clearBtn = $('<div class="clearBtn"><a href="javascript:;">'+clearHisText+'</a></div>'),
        header = ($("header#newheader").length>0)?$("header#newheader"):$("header#topshow"),showItem = sel.find("span").attr("id","showSelection"),
        selection_template = '<ul class="drop"></ul>',
        selection,selectItem,isFirst=!0,hisList,hisLocalStorage=lib.city+specialChannel+"hisLocal",history=!0,mainBody,sectionBody ;
    ba.header = header;
     function getStorage() {
          return eval(null!=lib.localStorage&&win.localStorage.getItem(hisLocalStorage) || []);
     }
    if($.inArray(specialChannel,specialLimit)!=-1){
        submitBtn = searchEl.find("a.btn");
        q=searchEl.find("#S_searchtext");
        q.attr("autocomplete", "off").on("input", initInput);
        q.on("blur",function(){
            setTimeout(createHotSearch,200);
        });
        q.on("focus",function(){
            if ($.trim($(this).val())!="") return;
            if(getStorage().length>0){
                hotCon.detach();
                getHistory();
           } else {
                createHotSearch();
           }
        });
        $("#new_searchtext,.icon-sea").on("click",function(e){
            var keywordEl=$(this).find(".ipt div");
            if(keywordEl.html()!="楼盘名/地名/开发商等" && keywordEl.html()!="输入关键词（小区名/地段名）" ){
                q.val(keywordEl.html());
            }
            $(".mapbtn").hide(); //隐藏租房地图图标
            $(this).hide();
            hideBody();
            nav.hide(),header.hide().after(snav),sPop = !sPop;
            if ( !(/src=client/.test(window.location.href))) {
                body.children().eq(0).before(snav).before(searchEl).end();
            } else {//sfAPP 搜索时隐藏头部
                body.children().eq(0).before(searchEl).end();
            }

            q.focus();
        });
    }else if(specialChannel=="ask" || specialChannel == "zhishi"){/*问答搜索页特殊处理*/
        bar=searchEl;
        submitBtn = searchEl.find("a.btn");
        q=searchEl.find("#S_searchtext");
        q.attr("autocomplete", "off").on("input", initInput);

        q.on("blur",function(){
            if (specialChannel == 'ask')
                setTimeout(createHotFlag,200);
        });
        q.on("focus",function(){
            if (specialChannel != 'zhishi') {
                hotFlagCon.detach();
            }
            if (emptyTip) {
                emptyTip.detach();
            }
            var b = $(this).val()||"";
            if(""!=b)b = b.replace(/(^\s+)|(\s+$)/g, "");
            (0 == b.length)?getHistory():getList(b);
        });
        $("#new_searchtext, #new_searchtext2").on("click",function(e){
            $("body").addClass("main");
            $("body").addClass("main-s");
            /*产品要求去掉搜索浮层从右侧出来的效果*/
            /*$("body").addClass("fadeInRight");*/
            var keywordEl=$(this).find(".ipt div");
            if(keywordEl.html()!="请输入您的问题"){
                q.val(keywordEl.html());
            }
            $(this).hide();
            hideBody();
            nav.hide(),header.hide().after(snav),sPop = !sPop;
            body.children().eq(0).before(snav).before(searchEl);
            q.focus();
           if(getStorage().length>0){
           		getHistory();
           } else {
               (specialChannel == 'ask') && createHotFlag();
           }
        });
    }else{
        var itemHtml = createTypeDnHtml();
        !ba.active && (showItem.text(text),bar.find("div.ipt").before(sel));
        q.attr("autocomplete", "off").on("input", initInput).on("focus",function(){
            if(sPop == !1){
                hideBody();
                nav.hide();
                if(specialChannel!="pinggu"){
                    ba.active && (showItem.text(text),bar.find("div.ipt").before(sel));
                    if(specialChannel=="jiaju" && lib.action =="index"){
                        $("div.ipt").css("overflow","");
                    }
                }
                header.hide().after(snav),sPop = !sPop;
                var b = $(this).val()||"";
                if(""!=b)b = b.replace(/(^\s+)|(\s+$)/g, "");
                (0 == b.length)?getHistory():getList(b);
                //如果是bbs需要获取南北方
                channel == "bbs" && undefined === ba.cityNS[lib.city] && getNS();
            }
        });
    }
    //弹出css样式隐藏及修改显示
    function hideBody(){
        if(!mainBody){
            body = $(document.body);
            if(channel =='xf' || channel =='bbs') {
            	body = body.find('div.main');
            }
            mainBody = body.children("div").filter(function(index){
                return t=$(this),t.is(":visible") && (!(t.hasClass("tabNav")||t.hasClass("search0620")));
            }),channel == "tools" && (mainBody = mainBody.add(body.children("article")));
        }
        if(!sectionBody){
            sectionBody= body.children("section");
        }
        searListUl.empty();
        if(isFirst){
            addListener(),isFirst = !isFirst;
        }
        ba.mapBtn && ba.mapBtn.hide();
        mainBody&&mainBody.hide();
        sectionBody&&sectionBody.hide();
        $("footer").hide();
    }
    q.on("keyup",function(e){
        if(e.keyCode==13){
            search ();
        }
    });
    offBtn.on("click",function(){
        q.val(""),offBtn.hide();
        sPop == !0 && getHistory();
    });
    submitBtn.on("click",function(){
        search ();
    });
    function createHotFlag(){
        if ($.trim(q.val())!="") return;
            //调取后台
            if($(hotFlagList).children().length>0){
                searchEl.after(hotFlagCon);
                closeList();
                return;
            }
            if(ajaxReq)ajaxReq.abort();
            ajaxReq=$.get(lib.askSite +'?c=ask&a=ajaxGetHotkeywordList',{city:lib.city},function(data){
                var arr=eval("("+data+")");
                var b=[];
                for(var i=0;i<arr.length;i++){
                    b.push('<a href="'+arr[i].url+'"><h2>'+arr[i].Keyword+'</h2></a>');
                }
                var el= b.join("");
                hotFlagList.html(el);
                searchEl.after(hotFlagCon);
                closeList();
            })
    }  
    $("body").delegate(".f14","click",function(){
        hotFlagList.html("");
        createHotFlag();
    });
        function getHotVarsType(cn){
            var ci = cn,cArr ={'zf':1,'esf':2,'xf':3,'xfhcount':4,'xfhxcount':5},cres;
            !cArr[ci] && (ci ='zf');
            return cArr[ci];
        }
        //创建最近热搜
        function createHotSearch(){
            //if ($.trim(q.val())!="") return;//统计搜索uv注释掉 2015.4.3
            ajaxReq=$.get(lib.esfSite +'?c=esf&a=ajaxGetHotWords',{city:lib.city,type:getHotVarsType(channel)},function(){});
            //调取后台
            if($(hotList).children().length>0){
                searchEl.after(hotCon);
                closeList();
                return;
            }
            if(ajaxReq)ajaxReq.abort();
            ajaxReq=$.get(lib.esfSite +'?c=esf&a=ajaxGetHotWords',{city:lib.city,type:getHotVarsType(channel)},function(data){
                var arr=data;
                if(arr.length>0){
                    var b=[];
                    for(var i=0;i<arr.length;i++){
                        if(channel =='xf' && arr[i] && arr[i]['ad']){
                            b.push('<a href="javascript:;" id="wapxfsy_D01_32"><span class="searchListName" data-ywtype="'+arr[i]["Keyword"]+','+arr[i]["Purpose"]+',,,,,,'+arr[i]['linkUrl']+'">'+arr[i]["Keyword"]+'</span><img class="hotimg" src="http://js.soufunimg.com/common_m/m_public/img/hotsearches.png" width="15"></a>');
                        } else {
                             b.push('<a href="javascript:;"><span class="searchListName" data-ywtype="'+arr[i]["Keyword"]+','+arr[i]["Purpose"]+',,,,,,">'+arr[i]["Keyword"]+'</span></a>');
                        }

                    }
                    var el= b.join("");
                    hotList.html(el);
                    searchEl.after(hotCon);
                    closeList();
                }
            })
        }

        //创建历史搜索
        function createHistory(){
            if ($.trim($(this).val())!="") return;
            hotCon.detach();
            getHistory();
        }
    function getNS() {
        $.get(lib.bbsSite+"/?c=bbs&a=ajaxGetCityNSByName&r="+Math.random(),function(o){ba.cityNS[lib.city]=o;ba.changeNS==!0 && q.val().length>0 && getList(q.val());});
        return !0;
    }
    function initInput(a) {
        var b, a = a || window.event;
        if (b = $(this).val().replace(/(^\s+)|(\s+$)/g, ""), !b.length) {
            if (channel == 'zhishi') {
                return getHistory(),offBtn.is(":visible") && offBtn.hide(), void 0;
            } else {
                return (channel =='ask')?hotFlagCon.detach():hotCon.detach(),getHistory(),offBtn.is(":visible") && offBtn.hide(), void 0;
            }
        }
        if (13 != a.keyCode && 32 != a.keyCode) {
            !offBtn.is(":visible") && offBtn.show();
            if($.inArray(specialChannel,specialLimit)!=-1){
                return hotCon.detach(),getNewList(b), void 0;
            }
            return (channel =='ask') && hotFlagCon.detach(), getList(b), void 0;
        }
    }
        function getNewList(a){
            var purpose="";
            if($("input[type=hidden]").length>0){
                purpose=$("input[type=hidden]").eq(0).val();
            }
            if(ajaxReq)ajaxReq.abort();
            ajaxReq=$.get(lib.esfSite+"?c=esf&a=ajaxGetAllSearchTip",{q:a,city:lib.city,type:getHotVarsType(channel),purpose:purpose},function(data) {
                    if(!data)data = "[]";
                    var l = eval("("+data+")"),s;
                    searListUl.empty();
                    if($.isArray(l) && l.length>0 && (s = packNew1(l)).length>1){
                        searListUl.append(s),history = !1,clearBtn.find("a").html(closeText),searchEl.after(searList),$(searList).after(clearBtn);
                    }else{
                        closeList();
                    }
            })
        }
        //提示词
        function getHotType(type){
            var htype =parseInt(type),hotTypeArr=["","出租","出售","新房","出售户型","房源数目"],hres;
             (htype<1 || htype >5) && (htype =0);
            return hotTypeArr[htype];
          // return "新房";
        }
        function getType(w,y){
            if(w=="新房"||w=="二手房"||w=="租房"){
                return w;
            }else{
                if(y=="新房"){
                    return "新房";
                }
            }
            return w+y;
        }
        //获取楼盘标识并统一新房和租房、二手房的标识
        function getCategoryId(id){
            if(channel=="xf"){
                switch (parseInt(id)){
                    case 5:
                        return 7;
                    case 7:
                        return 8;

                }
            }
            return parseInt(id);
        }
        //获取居数信息
        function getCount(obj){
            var arr=[],key="";
            //新房房源数目
            if(obj.hasOwnProperty("xfhcount")){
                var o = {};
                o['num'] = obj['xfhcount'];
                o['type'] = 'xfhcount';
                arr.push(o);
            }
           //新房户型数目
            if(obj.hasOwnProperty('xfhxcount')){
                 var o = {};
                o['num'] = obj['xfhxcount'];
                o['type'] = 'xfhxcount';
                arr.push(o);
            }
            if(obj.hasOwnProperty("esfcount1")){
                key="esfcount";
            }else if(obj.hasOwnProperty("rentcount1")){
                key="rentcount";
            }else{
                return arr;
            }
            for(var i=1;i<=4;i++){
                if(obj.hasOwnProperty(key+i)&&parseInt(obj[key+i])>0){
                    var o={};
                    o["type"]=i-1;
                    o["num"]=obj[key+i];
                    arr.push(o);
                }
            }
            return arr;
        }
        //获取居数的字典函数
        function getRoom(num){
            var res ="获取数据失败";
                var roomArr =['一居','二居','三居','四居','五居','五居以上'], rnum = parseInt(num);
                if (rnum<=4) {
                    res = roomArr[rnum];
                }else {
                    res = roomArr[5];
                }
            return res;
        }
        //新的拼音匹配机制显示类别列表函数
        function packNew(a){
            //_t='<li><a href="javascript:;"><span class="flor f999">约num条</span><span class="searchListName" data-ywtype="zz">xx</span></a></li>',约数备份
            var len= a.length,categoryId= 0,b=[],t='<li><a href="javascript:;"><span class="flor f999">约num条</span><span class="searchListName" data-ywtype="zz">xx</span><span class="f999">yy</span></a></li>';
            for(var i=0;i< len;i++){
                categoryId=getCategoryId(a[i]["category"]);
                var str= t,showWord="",yySet="",num="",searchKey="",purpose="",district="",comerce="",tags="",room ="",enterprise="";
                var num=a[i].hasOwnProperty("countinfo")?a[i]["countinfo"]:0;
                if(categoryId<3){
                    showWord=a[i]["projname"]+getHotType(getHotVarsType(channel));
                    searchKey=a[i]["projname"];
                    str=str.replace("xx",showWord);
                    str=str.replace("num",num);
                    str=str.replace("yy",yySet);
                    str=str.replace("zz",searchKey+","+purpose+","+district+","+comerce+","+room+","+tags+","+enterprise);
                    b.push(str);
                    var countArr=getCount(a[i]);
                    for(var idx in countArr){
                        str= t,yySet="",num="",purpose="",district="",comerce="",tags="",room ="",enterprise="";
                        var ob=countArr[idx];
                        num=ob["num"];
                        yySet="-"+getRoom(ob["type"]);
                        room=ob["type"];
                        str=str.replace("xx",showWord);
                        str=str.replace("num",num);
                        str=str.replace("yy",yySet);
                        str=str.replace("zz",searchKey+","+purpose+","+district+","+comerce+","+room+","+tags+","+enterprise);
                        b.push(str);
                    }
                }else{
                    switch (categoryId){
                        case 3:
                            showWord=a[i]["projname"]+getHotType(getHotVarsType(channel));
                            searchKey=enterprise=a[i]["projname"];
                            yySet="-房企";
                            break;
                        case 5:
                            showWord=a[i]["projname"]+getHotType(getHotVarsType(channel));
                            searchKey=purpose=a[i]["projname"];
                            break;
                        case 6:
                            showWord=a[i]["projname"]+getHotType(getHotVarsType(channel));
                            searchKey=district=a[i]["projname"];
                            break;
                        case 7:
                            showWord=a[i]["projname"]+getHotType(getHotVarsType(channel));
                            searchKey=comerce=a[i]["projname"];
                            break;
                        case 8://标签
                            showWord=a[i]["projname"];
                            searchKey=tags=a[i]["projname"];
                            yySet="";
                            break;
                        case 9://租房小产权房
                            showWord=a[i]["projname"];
                            searchKey=a[i]["projname"];
                            yySet="";
                            break;
                    }
                    str=str.replace("xx",showWord);
                    if(num==null||num==0){
                        str=str.replace("约num条","");
                    }else if(channel =='xf' && num <10) {
                    	str =str.replace("约num条",num+"条");
                    }else{
                        str=str.replace("num",num);
                    }
                    str=str.replace("yy",yySet);
                    str=str.replace("zz",searchKey+","+purpose+","+district+","+comerce+","+room+","+tags+","+enterprise);
                    b.push(str);
                }
            }
            return b.join("");
        }
        //搜索提示信息类别，以及其他信息
        function getCon(obj){
              var cId=getCategoryId(obj["category"]),tArr ={3:'enterprise',5:'purpose',6:'district',7:'comerce',8:'tags',4:'brand'},
                yysetWords = {3:"-房企",4:"-品牌"},
              params={},showCon = obj['projname'];
              params['cId'] = cId;
              params['showWord'] = showCon+((cId<8)?getHotType(getHotVarsType(channel)):'');
              params['yySet'] =(yysetWords[cId])?yysetWords[cId]:'';
              typeof tArr[cId] !='undefined' && (params[tArr[cId]] = showCon,params['cKey'] = tArr[cId]);
              params.num = obj.hasOwnProperty("countinfo")?obj["countinfo"]:0;
              params['searchKey'] = showCon;
              return params;
        }
        /**
         * [显示提示信息]
         * @param  {[Object]}
         * @return {[String]}
         */
        function packNew1(a) {
            var len= a.length,categoryId= 0,b=[],t='<li><a href="javascript:;" data-id="wapxfsy" ><span class="flor f999">约num条</span><span class="searchListName" data-ywtype="zz">xx</span><span class="f999">yy</span></a></li>';
            var tyArrs = {"xfhxcount":{name:"可售户型",clickId:'wapxfsy_D01_34'},'xfhcount':{name:"可售房源",clickId:'wapxfsy_D01_33'}};
            for(var i=0;i< len;i++){
                var str= t,con=[],showWord="",yySet="",num="",sArr = getCon(a[i]);
                con['searchKey']="",con['purpose']="",con['district']="",con['comerce']="",con['tags']="",con['room'] ="",con['enterprise']="";
                //判断是否携带参数
                con['searchKey'] = sArr['searchKey'];
                sArr['cKey'] && (con[sArr['cKey']] = sArr[sArr['cKey']]);
                str=str.replace("xx", sArr['showWord']);
                if(sArr['num']==null||sArr['num']==0){
                    str=str.replace("约num条","");
                }else if(channel =='xf' && sArr['num'] <10) {
                    str =str.replace("约num条",sArr['num']+"条");
                }else{
                    str=str.replace("num",sArr['num']);
                }
                str=str.replace("yy",sArr['yySet']);
                str=str.replace("zz", con['searchKey']+","+con['purpose']+","+con['district']+","+con['comerce']+","+con['room']+","+con['tags']+","+con['enterprise']);
                b.push(str);
                var countArr=getCount(a[i]);
                if((sArr['cId'] <3 && channel !='xf') || (channel =='xf' && i ==0)) {
                    for(var idx in countArr){
                        str= t,yySet="",num="";
                        con['searchKey']="",con['purpose']="",con['district']="",con['comerce']="",con['tags']="",con['room'] ="",con['enterprise']="";
                        con['searchKey'] = sArr['searchKey'];
                        var ob=countArr[idx];
                        num=ob["num"];
                        if(channel !='xf') {
                            yySet="-"+getRoom(ob["type"]);
                             con['room']=ob["type"];
                        } else if(tyArrs[ob['type']]) {
                            str=str.replace('data-id','id');
                            str=str.replace('wapxfsy',tyArrs[ob['type']]['clickId']);
                            sArr['showWord'] =a[i]['projname']+tyArrs[ob['type']]['name'];
                            sArr['cKey'] && (con[sArr['cKey']] = sArr[sArr['cKey']]);
                        }
                        str=str.replace("xx",sArr['showWord']);
                        if(num <10 && channel =='xf') {
                             str=str.replace("约num",num);
                        } else {
                             str=str.replace("num",num);
                        }
                        str=str.replace("yy",yySet);
                        str=str.replace("zz",con['searchKey']+","+con['purpose']+","+con['district']+","+con['comerce']+","+con['room']+","+con['tags']+","+con['enterprise']+','+ob['type']);
                        b.push(str);
                    }
                }
            }
            return b.join("");
        }
    function getList(a) {
        var type = channelType!=undefined?channelType:cIndex, site = channels[type];
        undefined === ba.keyWordTipUrls && (ba.keyWordTipUrls = {});
        if(undefined === ba.keyWordTipUrls[type]){
            if(0<=$.inArray(site,["zf"]))  site = "esf";
            else if(site == "news")  return;
            if(site == "bbs"){
                ba.keyWordTipUrls[type] = lib[site+"Site"]+"?c="+site+"&a=ajaxGetKeySearch&ns="+ba.cityNS[lib.city];
            }
            else if(site == "xf"){
                ba.keyWordTipUrls[type] = lib["mainSite"]+"xf.d?m=getMapByKeyWordNew";
            } else {
                ba.keyWordTipUrls[type] = lib[site+"Site"]+"?c="+site+"&a=ajaxGetSearchTip";
                if(site == "esf"){
                    ba.keyWordTipUrls[type] = lib[site+"Site"]+"?c="+site+"&a=ajaxGetSearchTipOld&orderby=esfcount";
                }
            }
        }
        //新房，二手房，须二次 encodeURIComponent 编码
        (site == "xf") && (a = encodeURIComponent(a));
        $.get(ba.keyWordTipUrls[type],{city:lib.city,q:a},function(data) {
            if(!data)data = "[]"
            var l = specialChannel == 'zhishi' ? data : eval("("+data+")");
            var s;
            searListUl.empty();
            if (specialChannel == 'ask') {
                s = packAsk(l);
            } else if (specialChannel == 'zhishi') {
                s = packZhishi(l);
            } else {
                s = pack(l);
            }
            if($.isArray(l) && l.length>0 && s.length>1){
                if(specialChannel=="ask" || specialChannel=='zhishi'){
                    if(typeof emptyTip !='undefined'){
                        emptyTip.detach();
                    };
                    searListUl.removeClass();
                    searListUl.addClass("s-lx");
                }
                searListUl.append(s),history = !1,clearBtn.find("a").html(closeText),bar.after(clearBtn),bar.after(searList);
            }else{
                closeList();
            }
        })
    }
    function packAsk(a){
        var b=[],_t='<li><a href="javascript:;" data-url="yy">xx</a></li>';
        for(var i in a){
            var str=_t.replace("xx",a[i].name);
            str=str.replace("yy",a[i].url);
            b.push(str);
        }
        return b.join("");
    }
    function packZhishi(a){
        var b=[],_t='<li><a href="javascript:;">xx</a></li>';
        for(var i in a){
            var str=_t.replace("xx",a[i].title);
            b.push(str);
        }
        return b.join("");
    }
    function getHistory() {
        hisList = eval(null!=lib.localStorage&&win.localStorage.getItem(hisLocalStorage) || []);
        searListUl.empty();
        if (emptyTip) {
            emptyTip.detach();
        }
        var s;
       // hisList = ["国美第一城","我爱我家"]
        if($.isArray(hisList) && hisList.length>0 && (s = pack(hisList)).length>1){
            if(specialChannel=="ask" || specialChannel =='zhishi'){
                searListUl.removeClass();
                searListUl.addClass("s-jl");
            }
            searListUl.append(s),history = !0,clearBtn.find("a").html(clearHisText),bar.after(clearBtn),bar.after(searList);
        }else{
            closeList();
        }
    }
    function clearHistory() {
        null!=lib.localStorage && win.localStorage.removeItem(hisLocalStorage);
        hisList = [],closeList();
    }
    function closeList() {
        searListUl.empty(),searList.add(clearBtn).detach();
    }
    function pack(a) {
        var i=0, j=0,len= a.length,b=[],_t="";
        if($.inArray(specialChannel,specialLimit)!=-1){
            _t='<li><a href="javascript:;"><span class="searchListName" data-ywtype="zz">xx</span><span class="f999">yy</span></a></li>';
            for(;i< len;i++){
                if(String(a[i]).length>0){
                    var data=a[i].split(":");
                    var yySet="",
                        searchKey=data[0].replace(/([^,]*)-([^,]*)$/g, '$1:$2'),
                        purpose=data[1],
                        district=data[2],
                        comerce=data[3],
                        room=data[4],
                        tags=data[5],
                        enterprise=data[6],
                        contype = data[7] ||''; //新房可售户型以及可售房源类型标识
                    if(room){
                        yySet="-"+getRoom(room);
                    }
                    if(tags){
                        yySet="";
                    }
                    if(enterprise){
                        yySet="-房企";
                    }
                    var str=_t.replace("yy",yySet);
                    str=str.replace("zz",searchKey+","+purpose+","+district+","+comerce+","+room+","+tags+","+enterprise+","+contype);
                    if (contype !='' && channel =='xf') {
                        var tyArrs = {"xfhxcount":"可售户型",'xfhcount':"可售房源"};
                        searchKey = searchKey+((typeof tyArrs[contype] !='undefined')?tyArrs[contype]:'');
                    }
                    str=str.replace("xx",searchKey);
                    b.push(str);
                    j++;
                }
                if(j>9)break;
            }
            return b.join("");
        }
        if(specialChannel=="ask"){
            _t='<li><a href="javascript:;" data-url="yy">xx</a></li>';
            for(;i< len;i++){
                var data=a[i].split("-");
                var str=_t.replace("xx",data[0]);
                str=str.replace("yy",data[1]);
                b.push(str);
                j++;
                if(j>4){
                break;
                }
            }
            return b.join("");
        }
        if(specialChannel =='zhishi'){
            _t='<li><a href="javascript:;">xx</a></li>';
            for(;i< len;i++){
                var str=_t.replace("xx",a[i]);
                b.push(str);
                j++;
                if(j>4){
                    break;
                }
            }
            return b.join("");
        }
        _t='<li><a href="javascript:;">xx</a></li>';
        for(;i< len;i++){
            String(a[i]).length>0 && (j++,b.push(_t.replace("xx",a[i])));
            if(j>9)break;
        }
        return b.join("");
    }
    function createTypeDnHtml() {
        var i,len, b=[],_t='<li><input id="{id}" name="channelType" class="se" type="radio" value="{index}">{text}</li>',
            idP = new RegExp("{id}","g"),indexP = new RegExp("{index}","g"),textP = new RegExp("{text}","g");
        if((len = channels.length)>0){
            for(i=0;i< len;i++){
                b.push(_t.replace(idP,channels[i]).replace(indexP,i).replace(textP,channelName[i]));
            }
        }
        return b.join("");
    }
    //绑定事件
    snav.find("a.back").on("click",function(){
        if(sPop == !0){
            nav.show(),snav.detach(),ba.active && (sel.detach()),header.show(),sPop = !sPop;
            searList.detach(),clearBtn.detach();
            ba.mapBtn && ba.mapBtn.show();
            mainBody && mainBody.show();
            sectionBody&&sectionBody.show();
            $("footer").show();
            if($.inArray(specialChannel,specialLimit)!=-1){
                searchEl.detach(),hotCon.detach();
                $("#new_searchtext,.mapbtn").show();
            }
            if (specialChannel == 'ask' || specialChannel == 'zhishi') {
                searchEl.detach(),hotFlagCon.detach();
                $(".main").show();
                $(".main .search0620").show();
                $("#new_searchtext").show();
                $("#new_searchtext2").show();
                $("body").removeClass("main");
                $("body").removeClass("main-s");
                /*产品要求去掉搜索浮层从右侧出来的效果*/
                /*$("body").removeClass("fadeInRight");*/
            }
            if(lib.action && lib.action =='getPrivilegeHouseList') {
                $(".icon-sea").show();
            }
        }
    });
    showItem.on("click",function(){
        if(!selection){
            selection = $(selection_template),selectItem = $(itemHtml).prependTo(selection),selectItem.find("input").eq(channelType!=undefined?channelType:cIndex).prop("checked",true);
            sel.append(selection),ba.selection = selection;
            selectItem.on("click",function(){
                var self = $(this).children("input");
                if( self.val() != channelType){
                    selectItem.find("input").prop("checked",false),
                        channelType = self.prop("checked",true).val(),q.attr("placeholder",channelNote[channelType]);
                    showItem.text(channelName[channelType]),snav.find("div.cent>span").text(channelName[channelType]+ssText),selection.hide();
                    ba.changeNS=!1;
                    channelName[channelType] == "bbs" && undefined === ba.cityNS[lib.city] && (ba.changeNS=!0,getNS());
                    ba.changeNS!=!0 && q.val().length>0 && getList(q.val());
                }
            })
        }
        selection.show();
    });
    function addListener(){
        searListUl.add(hotCon).on("click","a",function(){
            var th=$(this)
            var el=th.find(".searchListName");
            if(el.length>0 && specialChannel != 'zhishi'){
                setTimeout(function(){searchNew(el.data("ywtype"));},500);
            } else{
                q.val($(this).text());
                if(th.attr("data-url")){
                    setTimeout(function(){search (th.attr("data-url"));},500);
                } else {
                    setTimeout(function(){search ();},500);
                }
            }
        });
        clearBtn.on("click","a",function(){
            history?clearHistory():closeList();
        });
    }
    function stripscript(s) {
        return s.replace(/[\<\>\(\)\;\{\}\"\'\[\]\/\@\!\,]/g,'');
    }
    function search (url){
        var type = channelType!=undefined?channelType:cIndex;
        var keyword = stripscript(q.val());
        var b = keyword.replace(/(^\s+)|(\s+$)/g, "");
        b = b.replace(/([^,]*):([^,]*)$/g, '$1-$2');
        if (b.length>0 && null!=lib.localStorage){
            if($.inArray(specialChannel,specialLimit)!=-1){
                b+=":::::::";
            }
            if(specialChannel=="ask"){
                b+="-"+(url==undefined?"":url);
            }
            hisList = eval(win.localStorage.getItem(hisLocalStorage) || []);
            var sIndex=$.inArray(b,hisList);
            if(sIndex>=0){
                hisList.splice(sIndex,1);
            }
            var tmpLength = specialChannel == 'zhishi' ? 5 : 10;
            hisList.unshift(b),hisList.length>tmpLength && hisList.splice(tmpLength,1),win.localStorage.setItem(hisLocalStorage,"['"+hisList.join("','")+"']");
        }
        if(specialChannel=="ask"&&b==""){
            window.location=lib.askSite+lib.city+".html";
            return;
        }
        if(url){
            window.location=url;
            return;
        }
        var url = "",typeIndex = channels[type];
        switch (typeIndex)
        {
            case "xf":
                 url = lib.mainSite+((lib.action && ($.inArray(lib.action, libXfaction)>-1))?"xf.d?m="+lib.action:'search.d?m=search')+"&type=0&keyword=";
                break;
            case "esf":
                var purpose="";
                if($("input[type=hidden]").length>0){
                    purpose="&purpose="+$("input[type=hidden]").eq(0).val();
                }
                url = lib.esfSite+'?c=esf&a=index'+purpose+'&keyword=';
                break;
            case "zf":
                var purpose="";
                if($("input[type=hidden]").length>0){
                    purpose="&purpose="+$("input[type=hidden]").eq(0).val();
                }
                url = lib.zfSite+'?c=zf&a=index'+purpose+'&keyword=';
                break;
            case "jiaju":
                url = lib.jiajuSite+"?c=jiaju&a="+(channel == "jiaju" && lib.action == "buildList"?lib.action:"zxbj")+"&q=";
                break;
            case "news":
                url = lib.newsSite+"?c=news&a=search&q=";
                break;
            case "bbs":
                url = lib.bbsSite+"?c=bbs&a=search&q=";
                break;
            case "ask":
                url = lib.askSite+"?c=ask&a=search&keyword=";
                break;
            case "zhishi":
                url = lib.zhishiSite+"?c=zhishi&a=search&q=";
                break;
            case "pinggu":
                url = lib.pingguSite+"?c=pinggu&a=list&keyword=";
                break;
            default :
                break;
        }
        if($.inArray(specialChannel,specialLimit)!=-1){
            url += "&city="+lib.city;
        }
        var str=window.location.href;
        if($.inArray(specialChannel,specialLimit)!=-1 && (str.indexOf('zttype=pt'))==-1 && (str.indexOf('zttype=DS'))==-1 ){
            var exp="?";
            var hasKey=/keyword=(.+?)&/i.test(str);
            if(hasKey){
                str=str.replace(/keyword=(.+?)&/i,"keyword="+(type==0?keyword:encodeURIComponent(keyword))+"&");
                window.location=str;
            }else{
                var idx=str.indexOf("keyword=");
                if(idx!=-1){
                    var cr=str.charAt(idx-1);
                    if(cr=="&")exp="&";
                    str=str.substring(0,idx-1);
                }else{
                    (str.indexOf("?")!=-1)&&(exp="&");
                }
                window.location=str+exp+"keyword="+(type==0?keyword:encodeURIComponent(keyword))+"&r="+Math.random();
            }

        }else{
            window.location = url+(type==0?keyword:encodeURIComponent(keyword))+"&city="+lib.city+"&r="+Math.random();
        }
        writeSearchLeaveTimeLog();
    }
        //新的点击自动提示选项规则
        function searchNew(y){
            if(!y)return;
            var data= y.split(",");
            var searchKey=data[0],
            purpose=data[1],
            district=data[2],
            comerce=data[3],
            room=data[4],
            tags=data[5],
            enterprise=data[6].replace(/([^,]*):([^,]*)$/g, '$1-$2'),
            contype = data[7]||'';
            q.val(searchKey);
            var b = searchKey.replace(/(^\s+)|(\s+$)/g, "");
            b = b.replace(/([^,]*):([^,]*)$/g, '$1-$2');
            if (b.length>0 && null!=lib.localStorage){
                hisList = eval(win.localStorage.getItem(hisLocalStorage) || []);
                var s=b+":"+purpose+":"+district+":"+comerce+":"+room+":"+tags+":"+enterprise+':'+contype;
                var sIndex=$.inArray(s,hisList);
                if(sIndex>=0){
                    hisList.splice(sIndex,1);
                }
                hisList.unshift(s),hisList.length>10 && hisList.splice(10,1),win.localStorage.setItem(hisLocalStorage,"['"+hisList.join("','")+"']");
            }
            var url = "";
            var type = 1;
            var str=window.location.href;
            switch (getHotType(getHotVarsType(channel)))
            {
                case "新房":
                    type = 0;
                    if (contype =='xfhxcount') {
                            url = lib.mainSite+"xf.d?m=searchHuXingList&keyword=";
                    } else if(contype =='xfhcount'){
                            url = lib.mainSite+"xf.d?m=getPrivilegeHouseList&keyword=";
                    } else {
                        if(lib.action) {
                            url = lib.mainSite+"xf.d?m="+lib.action+"&type=0&keyword=";
                        } else {
                            url = lib.mainSite+"search.d?m=search&keyword=";
                        }
                    }
                    break;
                case "出售":
                    if (str.indexOf('cstype=ds') !=-1) {
                        url = lib.esfSite+"?cstype=ds&keyword=";
                    } else {
                        url = lib.esfSite+"?keyword=";
                    }
                    break;
                case "出租":
                    url = lib.zfSite+"?keyword=";
                    break;
                default :
                    break;
            }
            if(type!=0){
                searchKey=encodeURIComponent(searchKey);
            }
            url+=searchKey+"&city="+lib.city;
            if(type!=0){
                purpose=purpose?purpose:$("input[type=hidden]").eq(0).val();
                purpose=encodeURIComponent(purpose);
                url+="&purpose="+purpose;
            }
            if(district){
                if(type!=0){
                    district=encodeURIComponent(district);
                }
                url+="&district="+district;
            }
            if(comerce){
                if(type!=0){
                    comerce=encodeURIComponent(comerce);
                }
                url+="&comarea="+comerce;
            }
            if(room){
                if(type!=0){
                    room=encodeURIComponent(room);
                }
                url+="&room="+room;
            }
            if(tags){
                if(type!=0){
                    tags=encodeURIComponent(tags);
                }
                url+="&tags="+tags;
            }
            //房企预留
            if(enterprise){
                if(type!=0){
                    enterprise=encodeURIComponent(enterprise);
                }
                url+="&enterprise="+enterprise;
            }
            if (/^http:\/\/.*[htm|html]$/.test(contype)){
                $.ajax({type:"GET",url:contype,dataType:"jsonp"});
            }
            if ($("input[data-id='sf_source']").val() == '360zsclient') {
			    window.location = url+ "&sf_source=360zsclient"+"&r="+Math.random();
			} else {
				window.location = url+"&r="+Math.random();
			}
            writeSearchLeaveTimeLog();
        }

        
    /**
     * 记录用户离开搜索页面的时间
     * 离开动作包括，①直接点击搜索按钮到列表页，②点击历史记录到列表页，③点击自动
     * 提示到列表页，④点击最近热搜到列表页
     * @param string type 租房1 二手房2 新房3 大搜索4
     */
    function writeSearchLeaveTimeLog() {
        switch (channel) {
            case 'zf':
               var logtype = '1';
               break;
            case 'esf':
                var logtype ='2';
                break;
            case 'xf':
                var logtype ='3';
                break;

        }
        $.get(lib.esfSite+"?c=esf&a=ajaxWriteSearchLeaveTimeLog",{type:logtype},function(){ });
    }

}(window, window.lib || (window.lib = {})),function(win, lib) {
    "use strict";
    var $ = win.$,ba = lib.smartbanner,bar=ba.bar,moreBtn=ba.moreBtn,
        header=ba.header,nav1=ba.nav1,nav2=ba.nav2;
    //显示/隐藏nav2
    moreBtn.on("click",function(){
        nav2.toggle();
    });
    function hnav2 (e){
        var target = $(e.target);
        nav2.is(":visible") && (!(nav1.find(target).length>0||nav2.find(target).length>0)) && nav2.hide();
    }
    function hideSelection(e){
        ba.selection && ba.selection.is(":visible") && e.target.id != "showSelection" && ba.selection.hide();
    }
    $(document).on({"click touchmove touchend":hnav2}).on("click",hideSelection);
    //end 显示/隐藏nav2

    var navFlayer,navFlayer1,navFlayer2,smsNum,userName,iconavBtn;
    !lib.navflayer && (iconavBtn = header.find("a.ico-nav").on("click",function(){
        navFlayer || (navFlayer = $("div#navShadow,div#nav"),navFlayer1= navFlayer.eq(0).on("click",function(){navFlayer.hide(),iconavBtn.append(smsNum)}),navFlayer2= navFlayer.eq(1),smsNum = $(this).children(".sms-num"));
        navFlayer2.is(":visible")?(navFlayer.hide(),iconavBtn.append(smsNum)):(navFlayer.show(),undefined===userName&&$.get(lib.mainSite+"public/?c=public&a=ajaxUserInfo",function(o){userName="",o!= !1 && undefined!=o.username && $("div#nav div.mt10 div.nav-tit a").text(userName=o.username)}),smsNum.detach());
    }));
	var url = "/esf/?c=esf&a=getBSCity&city="+lib.city;
	var citybs = '';
	$.get(url,function(data){
		
		header.find("a.icon-fb").on("click",function(){
        if(ba.channel == 'esf' && data == 's')
			window.location = "/my/?c=myesf&a=delegateAndResale&city="+lib.city;
		else if(ba.channel == 'esf')
            window.location = "/rental.d?m=saleStaup&tranflag=2&city="+lib.city;
        else
            window.location = "/fabuType.jsp?city="+lib.city+"&type="+ba.channel;
    });
		
	});
	
    
}(window, window.lib || (window.lib = {}));