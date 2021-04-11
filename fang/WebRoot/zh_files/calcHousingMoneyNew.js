/**
 * Created by user on 2015/6/1.
 **/
define("modules/tools/calcHousingMoneyNew",[],function(require,exports,module) {
    "use strict"
    var $=require("jquery");
    function HousePay() {
        this.dkpage={/*款页面的id*/
            totalMoney:"#totalMoney",//房款总价
            sfRate:"#sfRate",//首付比例
            dkTotalMoney:"#dkTotalMoney",//贷款总价
            ajYear:"#ajYear",//按揭年数
            initrate:"#initrate",//贷款初始化利率
            sfDiv:"#sfDiv",//首付div的id
            btnCal:"#btnCal",//开始计算
            detailPage:"#detailPage",//详情页容器id
            ratePage:"#ratePage",//利率页容器id
            sfDaiPage:"#sfDaiPage",//首付贷页容器id
            monthPay:"#monthPay",//月供
            jsresults:".jsresults",
            payMethod:"#payMethod",
            mainBody:"#mainBody",
            detailLink:"#detailLink",
            mainPage:"#mainPage",
            btnRateOk:"#btnRateOk",
            btnDaiOk:"#btnDaiOk",
            inputDai:"#inputDai",
            inputRate:"#inputRate",
            sfLinkClick:"#sfLinkClick",
            initrateValue:0,
            dkHtml:"",
            gjjHtml:"",
            dkRate:"",
            gjjRate:"",
            fromPage:""
        }
        this.zhpage={//组合贷页面的id
            zhHtml:"",
            mainBody:"#mainBody",
            detailPage:"#detailPage",//详情页容器id
            ratePage:"#ratePage",//利率页容器id
            btnRateOk:"#btnRateOk",
            inputRate:"#inputRate",
            initrate1:"#initrate1",
            initrate2:"#initrate2",
            zhCalBtn:"#zhCalBtn",
            jsresults:".jsresults",
            payMethod:"#payMethod",
            ajyeardk:"#ajyeardk",
            dkMoney:"#dkMoney",
            ajyeargjj:"#ajyeargjj",
            gjjMoney:"#gjjMoney",
            monthPay:"#monthPay",
            detailLink:"#detailLink",
            mainPage:"#mainPage",
            dkRateDiscount:1,
            gjjRateDiscount:1,
            fromInitrate:1
        };
        this.taxspage={//税费新房页面的id
            taxsHtml:"",
            mainBody:"#mainBody",
            newHouseCal:"#newHouseCal",
            houseArea:"#houseArea",
            housePrice:"#housePrice",
            houseProp:"#houseProp",
            isUnique:"#isUnique",
            noUnique:"#noUnique",
            jsresults03:".jsresults03",
            jsresults:".jsresults",
            newHouseLink:"#newHouseLink",
            esfHouseLink:"#esfHouseLink"
        };
        this.esftaxspage={//税费二手房页面的id
            esfTaxsHtml:"",
            mainBody:"#mainBody",
            calEsfBtn:"#calEsfBtn",
            houseArea:"#houseArea",
            housePrice:"#housePrice",
            jzType:"#payType",
            dlOrigin:"#dlOrigin",
            jsresults03:".jsresults03",
            jsresults:".jsresults",
            houseProp:"#houseProp",
            newHouseLink:"#newHouseLink",
            esfHouseLink:"#esfHouseLink",
            houseOriginPrice:"#houseOriginPrice"
        };
        this.sfdaipage={//首付贷页面的id
            sfdaiHtml:"",
            mainBody:"#mainBody",
            mainPage:"#mainPage",
            sfDaiPage:"#sfDaiPage",
            dkType:"input[name=dkType]",
            isDy:"input[name=isDy]",
            totalMoney:"#totalMoney",
            sfRate:"#sfRate",
            sfCal:"#sfCal",
            jsresults:".jsresults",
            jsresults02:".jsresults02",
            selQx:"#selQx",
            payWay:"#payWay",
            monthRate:"#monthRate",
            dyType:"input[name=dyType]",
            dy:"#dy",
            dkEsf:"#dkEsf",
            dkNewhouse:"#dkNewhouse",
            noDy:"#noDy",
            hasDy:"#hasDy",
            dkTotalMoney:"#dkTotalMoney",
            detailLink:"#detailLink",
            detail:"#detail",
            btnDaiOk:"#btnDaiOk",
            inputDai:"#inputDai",
            detailPage:"#detailPage",
            repayType:1,
            limitMoney:100
        };
        this.pageName=this.getPageName();
        this.payType=0;
        this._vars=_vars;
        this.totalHousePrice=100;//需要同步的房款总价
        this.totalLoans=70;//需要同步的贷款总额
        this.sfRatio="\u4e09\u6210\uff08\u0033\u0030\u4e07\uff09";//需要同步的首付比例
        this.sfRatioAttr="0_3";
        this.navMenu=$("#sectionNav");
    }

    HousePay.prototype={
        init:function () {
            var self = this;
            initDoFunction();
            function initDoFunction(){//页面首次记载时要执行的函数
                convertToObj();
                pushTop();
                getLvByAjax();
                setPageTemplate();
                self.navMenu.on("click","a",aNavClickFn);
                initPageData();
                window.addEventListener("popstate", popstateFn);
            }
            function convertToObj(pageName){
                if(pageName){
                    self.pageName=pageName||self.pageName;
                }
                switch(self.pageName){
                    case "daikuan":
                    case "gjj":
                        loadAttr(self.dkpage);
                        break;
                    case "zh":
                        loadAttr(self.zhpage);
                        break;
                    case "taxs":
                        loadAttr(self.taxspage);
                        break;
                    case "esftaxs":
                        loadAttr(self.esftaxspage);
                        break;
                    case "sfdai":
                        loadAttr(self.sfdaipage);
                        break;
                }
                function loadAttr(obj){
                    for (var p in obj) {
                        if(obj[p]){
                            if(p=="mainBody"){
                                self[p]=$(obj[p]).get(0);
                            }else{
                                self[p] = $(obj[p]);
                            }
                        }
                    }
                }
            }
            /*给所有input type=text设置焦点移入整个body上移*/
            function pushTop(){
                $("#inputSection input[type=text]").on("focus",function(){
                    var $thisClosestDl=$(this).closest("dl");
                    setTimeout(function(){
                        $(document.body).animate({
                            scrollTop: $thisClosestDl.offset().top
                        },200);
                    },200);
                });
            }
            /*在离线时获取商业贷款和公积金贷的基本利率值*/
            function getLvByAjax(){
                var url=self._vars.siteUrl+"tools/?c=tools&a=ajaxGetLv";
                $.getJSON(url,null,function(data){
                    if(data){
                        var arr=data.split("|");
                        $(".head-icon").css("display","block");
                        if(arr!=null){
                            self.dkpage.dkRate=arr[0];
                            self.dkpage.gjjRate=arr[1];
                            if(self.getPageName()=="daikuan"){
                                self.initrate.html("\u57fa\u51c6\u5229\u7387（"+self.dkpage.dkRate+"％）");
                            }else if(self.getPageName()=="gjj"){
                                self.initrate.html("\u57fa\u51c6\u5229\u7387（"+self.dkpage.gjjRate+"％）");
                            }else if(self.getPageName()=="zh"){
                                self.initrate1.html("\u57fa\u51c6\u5229\u7387（"+self.dkpage.dkRate+"％）");
                                self.initrate2.html("\u57fa\u51c6\u5229\u7387（"+self.dkpage.gjjRate+"％）");
                            }
                        }
                    }
                }).fail(function(){
                    $(".head-icon").css("display","none");
                    self.dkpage.dkRate=$("#jzlv").val();
                    self.dkpage.gjjRate=$("#gjjlv").val();
                    if(self.getPageName()=="daikuan"){
                        self.initrate.html("\u57fa\u51c6\u5229\u7387（"+self.dkpage.dkRate+"％）");
                    }else if(self.getPageName()=="gjj"){
                        self.initrate.html("\u57fa\u51c6\u5229\u7387（"+self.dkpage.gjjRate+"％）");
                    }else if(self.getPageName()=="zh"){
                        self.initrate1.html("\u57fa\u51c6\u5229\u7387（"+self.dkpage.dkRate+"％）");
                        self.initrate2.html("\u57fa\u51c6\u5229\u7387（"+self.dkpage.gjjRate+"％）");
                    }
                });
            }
            /*初始化各页面对应的模板html*/
            function setPageTemplate(){
                var template=$("#daiKuanTemplate");
                self.dkpage.dkHtml=setPageHtml(self.dkpage.dkHtml,template);
                self.dkpage.gjjHtml=setPageHtml(self.dkpage.gjjHtml,template);
                template=$("#zhTemplate");
                self.zhpage.zhHtml=setPageHtml(self.zhpage.zhHtml,template);
                template=$("#taxsTemplate");
                self.taxspage.taxsHtml=setPageHtml(self.taxspage.taxsHtml,template);
                template=$("#esfTaxsTemplate");
                self.esftaxspage.esfTaxsHtml=setPageHtml(self.esftaxspage.esfTaxsHtml,template);
                template=$("#sfDaiTemplate");
                self.sfdaipage.sfDaiHtml=setPageHtml(self.sfdaipage.sfDaiHtml,template);
                function setPageHtml(pageObj,templateObj){
                    if(templateObj.length>0){
                        pageObj=templateObj.html();
                    }else {
                        if(self.mainBody){
                            pageObj=self.mainBody.innerHTML;
                        }
                    }
                    return pageObj;
                }
            }

            function initDaiKuanPage(){
                self.mainBody.innerHTML=self.dkpage.dkHtml;
                convertToObj("daikuan");
                self.sfDiv=$(self.dkpage.sfDiv);
                self.sfDiv.css("display","block");
                self.initrate.html("\u57fa\u51c6\u5229\u7387（"+self.dkpage.dkRate+"％）");
                self.totalMoney.val(self.totalHousePrice);
                self.dkTotalMoney.val(self.totalLoans);
                self.sfRate.html(self.sfRatio);
                self.sfRate.attr("data-value",self.sfRatioAttr);
                initBindEvent();
            }

            function initGjjPage(){
                self.mainBody.innerHTML=self.dkpage.gjjHtml;
                self.sfDiv=$(self.dkpage.sfDiv);
                self.sfDiv.css("display","none");
                convertToObj("gjj");
                self.initrate.html("\u57fa\u51c6\u5229\u7387（"+self.dkpage.gjjRate+"％）");
                self.totalMoney.val(self.totalHousePrice);
                self.dkTotalMoney.val(self.totalLoans);
                self.sfRate.html(self.sfRatio);
                self.sfRate.attr("data-value",self.sfRatioAttr);
                initBindEvent();
            }

            function AddCountPvFn(){
                var images = document.images;
                var img = images[0];
                var script=document.scripts;
                if(img && img.src.indexOf('http://countpvn.light.fang.com/')!==-1){
                    img.parentNode.removeChild(img);
                }
                if(script&&script.length>0){
                    for(var i= 0,l=script.length;i<l;i++){
                        if(script[i]&&script[i].src){
                            if(script[i].src.indexOf("uvforwapandm.min.js")>-1){
                                script[i].parentNode.removeChild(script[i]);
                            }
                            if(script[i].src.indexOf("loadforwapandm.min.js")>-1){
                                script[i].parentNode.removeChild(script[i]);
                            }
                            if(script[i].src.indexOf("ga.js")>-1){
                                script[i].parentNode.removeChild(script[i]);
                            }
                            if(script[i].src.indexOf("loadonlyga.min.js")>-1){
                                script[i].parentNode.removeChild(script[i]);
                            }
                        }
                    }
                }
                require.async(['count/loadforwapandm.min.js?t='+Math.random(),'count/loadonlyga.min.js?t='+Math.random()]);
            }

            /*给各个页面菜单添加切换点击事件*/
            function aNavClickFn(ev){
                var pageName=this.href.match(/(\w+)\.html/);
                //加流量统计代码
                AddCountPvFn();

                if(pageName){
                    self.payType=0;//修正 还款方式 在菜单切换的时候默认等额本息
                    pageName=pageName[1];
                    self.pageName=pageName;
                    $(this).siblings().removeClass("active");
                    $(this).addClass("active");
                    if(pageName=="daikuan"){
                        initDaiKuanPage();
                    }else if(pageName=="gjj"){
                        initGjjPage();
                    }else {
                        if(pageName=="zh"){
                            if(self.dkMoney){
                                /*当前加载的this对象是zh的对象时*/
                                var dkMoneyVal=self.dkMoney.val();
                                var gjjMoneyVal=self.gjjMoney.val();
                                var ajyeardkVal=self.ajyeardk.find("option:selected").val();
                                var ajyeargjjVal=self.ajyeargjj.find("option:selected").val();
                                var initrate1Html=self.initrate1.html();
                                var initrate2Html=self.initrate2.html();
                                /*取当前的变量*/
                                self.mainBody.innerHTML=self.zhpage.zhHtml;
                                convertToObj();
                                initZhBindEvent();
                                self.dkMoney.val(dkMoneyVal);
                                self.gjjMoney.val(gjjMoneyVal);
                                self.ajyeardk.val(ajyeardkVal);
                                self.ajyeargjj.val(ajyeargjjVal);
                                self.initrate1.html(initrate1Html);
                                self.initrate2.html(initrate2Html);
                                /*赋值当前的变量*/
                            }else{ /*首次加载的不是该页面 然后点击切换该页面就会出现当前的改self不是zh的self 即非当前的self对象时*/
                                self.mainBody.innerHTML=self.zhpage.zhHtml;
                                convertToObj();
                                initZhBindEvent();
                            }
                        }else if(pageName=="taxs"){
                            if(self.houseArea){
                                var houseArea=self.houseArea.val();
                                var housePrice=self.housePrice.val();
                                var houseProp=self.houseProp.find("option:selected").val();
                                var isUnique=self.isUnique.prop("checked");//此处获取的值是true或者false 设置的值也是true或者false
                                var noUnique=self.noUnique.prop("checked");
                                self.mainBody.innerHTML=self.taxspage.taxsHtml;
                                convertToObj();
                                initTaxsBindEvent();
                                self.houseArea.val(houseArea);
                                self.housePrice.val(housePrice);
                                self.houseProp.val(houseProp);
                                self.isUnique.prop("checked",isUnique);
                                self.noUnique.prop("checked",noUnique);
                            }else{
                                self.mainBody.innerHTML=self.taxspage.taxsHtml;
                                convertToObj();
                                self.isUnique.prop("checked",true);//修正魅族不选中bug
                                initTaxsBindEvent();
                            }
                        }else if(pageName=="esftaxs"){
                            if(self.houseArea){
                                var houseArea=self.houseArea.val();
                                var housePrice=self.housePrice.val();
                                var payType=self.payType.find("option:selected");
                                var houseProp=self.houseProp.find("option:selected");
                                var ipt_cb=$(".ipt-cb");
                                self.mainBody.innerHTML=self.esftaxspage.esfTaxsHtml;
                                convertToObj();
                                initEsfBindEvent();
                                self.houseArea.val(houseArea);
                                self.housePrice.val(housePrice);
                                self.payType.val(payType);
                                self.houseProp.val(houseProp);
                                $(".ipt-cb").each(function(index,elem){
                                    $(ipt_cb[index]).prop("checked",$(elem).prop("checked"));
                                });}else{
                                self.mainBody.innerHTML=self.esftaxspage.esfTaxsHtml;
                                convertToObj();
                                initEsfBindEvent();
                            }
                        }else if(pageName=="sfdai"){
                            if($("input[name=dkType]").length>0){
                                var dkType=$("input[name=dkType]");
                                var isDy=$("input[name=isDy]");
                                var dy=$("input[name=dy]");
                                var selQx=$("#selQx");
                                self.mainBody.innerHTML=self.sfdaipage.sfDaiHtml;
                                convertToObj("sfdai");
                                self.mainPage.css("display","block");
                                self.detailPage.css("display","none");
                                self.sfDaiPage.css("display","none");
                                initSfDaiBindEvent();
                                $("input[name=dkType]").each(function(index,elem){
                                    $(dkType[index]).prop("checked",$(elem).prop("checked"));
                                });
                                $("input[name=isDy]").each(function(index,elem){
                                    $(isDy[index]).prop("checked",$(elem).prop("checked"));
                                });
                                $("input[name=dy]").each(function(index,elem){
                                    $(dy[index]).prop("checked",$(elem).prop("checked"));
                                });
                                self.selQx.html(selQx.html());

                            }else{
                                self.mainBody.innerHTML=self.sfdaipage.sfDaiHtml;
                                convertToObj("sfdai");
                                self.mainPage.css("display","block");
                                self.detailPage.css("display","none");
                                self.sfDaiPage.css("display","none");
                                initSfDaiBindEvent();
                            }

                            /*做同步全局的变量*/

                            self.totalMoney.val(self.totalHousePrice);
                            self.sfRate.html(self.sfRatio);
                            self.sfRate.attr("data-value",self.sfRatioAttr);
                            var tempArr=self.sfRatioAttr.split("_");
                            var tempDkMoney=0;
                            if(tempArr&&tempArr.length>0){
                                if(tempArr[0]=="0"){
                                    tempDkMoney=parseInt(tempArr[1])*0.1*Number(self.totalHousePrice);
                                }else{
                                    tempDkMoney=parseInt(tempArr[1]);
                                }
                            }
                            self.dkTotalMoney.val(Math.floor(tempDkMoney/2));
                        }else{
                        }
                    }
                    pushStatefn(pageName);
                }
                ev.preventDefault();
            }
            //切换付款方式
            function tabFn(){
                var index=$(this).index();
                var pObj=$(".methodboxa p");
                $(this).addClass("active");
                $(this).siblings().removeClass("active");
                pObj.css("display","none");
                pObj.eq(index).css("display","block");
                self.payType=index;
                if(self.getPageName()=="zh"){
                    calZhFn();
                }else{
                    calFn();
                }
            }

            function calZhFn(){//计算组合贷
                var ajyeardk=self.ajyeardk.find("option:selected").val();
                var ajyeargjj=self.ajyeargjj.find("option:selected").val();
                var dkMoney=self.dkMoney.val();
                var gjjMoney=self.gjjMoney.val();
                if(dkMoney==""||dkMoney=="请输入贷款金额"){
                    if(gjjMoney==""||gjjMoney=="请输入贷款金额"){
                        alert("请输入贷款总额");
                        return;
                    }else{
                        dkMoney=0;
                    }
                }else{
                    if(gjjMoney==""||gjjMoney=="请输入贷款金额"){
                        gjjMoney=0;
                    }
                }
                if(isNaN(dkMoney)){
                    alert("请输入正确的贷款总额");
                    return;
                }
                if(isNaN(gjjMoney)){
                    alert("请输入正确的公积金总额");
                    return;
                }
                if(dkMoney==0&&gjjMoney==0){
                    alert("请输入贷款总额");
                    return;
                }
                var initrate1=self.initrate1.html().match((/\d+(.\d+){0,1}/));
                var initrate2=self.initrate2.html().match((/\d+(.\d+){0,1}/));
                if(initrate1){
                    initrate1=initrate1[0];
                    if(Number(initrate1)==0||initrate1=="0"){
                        alert("请填写正确的商业利率");
                        return;
                    }
                    initrate1=initrate1*0.01/12;
                }else {
                    alert("利率获取失败");
                    return ;
                }
                if(initrate2){
                    initrate2=initrate2[0];
                    if(Number(initrate2)==0||initrate2=="0"){
                        alert("请填写正确的公积金利率");
                        return;
                    }
                    initrate2=initrate2*0.01/12;
                }else {
                    alert("利率获取失败");
                    return ;
                }
                dkMoney=parseFloat(dkMoney);
                gjjMoney=parseFloat(gjjMoney);
                var payType=self.payType;
                showResultDiv();
                var calDk=self.calMethod(payType,dkMoney*10000,initrate1,ajyeardk*12);
                var calGjj=self.calMethod(payType,gjjMoney*10000,initrate2,ajyeargjj*12);
                var monthPayOrigin1=calDk.payMonth;
                var monthPayOrigin2=calGjj.payMonth;

                var monthPay1=parseFloat(monthPayOrigin1);
                var monthPay2=parseFloat(monthPayOrigin2);
                var totalMonthPay=monthPay1+monthPay2;
                self.monthPay.html("￥"+Math.ceil(totalMonthPay));
                var hktotaldaikuan=parseFloat(calDk.payLx+dkMoney*10000);
                var hktotalgjj=parseFloat(calGjj.payLx+gjjMoney*10000);
                var hktotal=Math.ceil(hktotaldaikuan+hktotalgjj);
                var dktotal=(dkMoney+gjjMoney)*10000;
                var payLx=parseFloat(calDk.payLx)+parseFloat(calGjj.payLx);
                var resultObj=self.jsresults.find("dd");
                resultObj.eq(0).html(formatNum(hktotal)+"\u5143");
                resultObj.eq(1).html(formatNum(dktotal)+"\u5143");
                resultObj.eq(2).html(payLx+"\u5143");
                resultObj.eq(3).html(Math.ceil(totalMonthPay)+"\u5143");

                self.payzhInfo={dkMonth:ajyeardk*12,gjjMonth:ajyeargjj*12,
                    hkdaikuanmoney:hktotaldaikuan,hkgjjmoney:hktotalgjj,
                    monthRate1:initrate1,monthRate2:initrate2,
                    dkmoney1:dkMoney,dkmoney2:gjjMoney,
                    monthPayOrigin1:monthPayOrigin1,monthPayOrigin2:monthPayOrigin2,
                    hkmoney:hktotal,dkmoney:dktotal/10000,monthAvgPay:totalMonthPay,payLx:payLx};
                var arrPrms=[{value:parseInt(dktotal),color:"#fffa59"},{value:payLx,color:"#fd6e9e"}];
                self.autoPie(arrPrms);

            }

            //商业贷款和公积金贷款页面的事件绑定
            function initBindEvent(){
                self.sfRate.on("click",showRate);
                self.sfDaiPage.on("click","dl[data-val]",setRateFn);//首付成数点击事件
                self.initrate.on("click",showLv);//利率
                self.btnCal.on("click",calFn);//计算按钮
                self.ratePage.on("click","dl[data-val]",setLvFn);//利率折扣点击
                self.btnRateOk.on("click",setLvInputFn);//利率点击按钮事件
                self.btnDaiOk.on("click",DaiOkFn);//自定义首付按钮点击成数
                self.detailLink.on("click",detailFn);//详情页点击
                self.payMethod.on("click","a",tabFn);//支付方式切换
                self.totalMoney.on("keydown",downFn).on("blur",blurFn);//房款总价文本框按键按下 失去焦点事件
                self.dkTotalMoney.on("keydown",downFn).on("blur",blurFn);//贷款总额文本框按键按下 失去焦点事件
                self.inputRate.on("keydown",downFnForRate);//利率输入框按下
                self.inputDai.on("keydown",downFn);//首付比例输入框事件
                self.sfLinkClick.on("click",sfLinkFn);//跳转到首付贷页面 点击事件
                pushTop();//绑定该页面的文本框 光标进入 body上移效果
            }

            function sfLinkFn(ev){

                /*统计流量的*/
                AddCountPvFn();

                self.mainBody.innerHTML=self.sfdaipage.sfDaiHtml;
                var meunObj=self.navMenu.find("a");
                meunObj.removeClass("active");
                convertToObj("sfdai");
                self.mainPage.css("display","block");
                self.navMenu.css("display","block");
                self.detailPage.css("display","none");
                self.ratePage.css("display","none");
                self.sfDaiPage.css("display","none");
                if(self.fromPage=="detail"){
                    self.jsresults.css("display","block");
                }else{
                    self.jsresults.css("display","none");
                }
                meunObj.eq(4).addClass("active");
                self.totalMoney.val(self.totalHousePrice);
                self.sfRate.html(self.sfRatio);
                self.sfRate.attr("data-value",self.sfRatioAttr);
                self.dkTotalMoney.val(self.totalLoans);

                initSfDaiBindEvent();
                pushStatefn("sfdai");
                ev.preventDefault();
            }

            function initZhBindEvent(){
                self.initrate1.on("click",showZhLv);
                self.initrate2.on("click",showZhLv);
                self.payMethod.on("click","a",tabFn);
                self.zhCalBtn.on("click",calZhFn);
                self.detailLink.on("click",detailFn);
                self.ratePage.on("click","dl[data-val]",setZhLvFn);
                self.btnRateOk.on("click",setZhLvInputFn);
                self.inputRate.on("keydown",downFnForRate);
                self.dkMoney.on("keydown",downFn).on("blur",blurFn).on("focus",focusFn);
                self.gjjMoney.on("keydown",downFn).on("blur",blurFn).on("focus",focusFn);
                pushTop();
            }

            function focusFn(){
                if(this.value=="请输入贷款金额"){
                    this.value="";
                }
            }

            function downFnForRate(){
                var ev=ev||window.event;
                var code=ev.keyCode;
                var currentVal=String.fromCharCode(code);
                var hasValue=this.value;
                //95-106:0-9 |47-58:0-9 |110|190:. 37:<- 39:-> 8:backspace
                if((code>95&&code<106)||(code>47&&code<58)||code==110||code==190||code==37||code==39||code==8){
                    if(!isNaN(currentVal)){
                        if(hasValue.indexOf('.')>-1){//包含小数点
                            if(Number(hasValue)>99.99||Number(hasValue)<0){
                                ev.preventDefault();
                                return false;
                            }else if(/\d+\.\d{2}/.test(hasValue)){
                                ev.preventDefault();
                                return false;
                                //return true;
                            }else{

                            }
                        }
                        else{
                            if(Number(hasValue)>99.99||Number(hasValue)<0){
                                ev.preventDefault();
                                return false;
                            }else if(hasValue.length>=2){
                                ev.preventDefault();
                                return false;
                            }else{}
                        }
                    }else{
                        if(code==8||code==37||code==39){
                            //return true;
                        }else if(code==190||code==110){
                            if(hasValue.indexOf('.')>-1){
                                ev.preventDefault();
                                return false;
                            }else if(hasValue.length>=3){
                                ev.preventDefault();
                                return false;
                            }else if(hasValue.length==0){
                                ev.preventDefault();
                                return false;
                            }
                            else{}
                        }else if(hasValue==""){

                        }
                    }
                }else {
                    ev.preventDefault();
                    return false;
                }
            }

            function blurFn(){
                if(self.getPageName()=="zh"){
                    if(this.value==""){
                        this.value="请输入贷款金额";
                    }
                }else{
                    if(this.value!=""&&!isNaN(this.value)){
                        if(this.id=="totalMoney"){
                            var dataVal=self.sfRate.attr("data-value");
                            if(dataVal){
                                var arr=dataVal.split("_");
                                var sfHtml="";
                                var sfMoney=0;
                                if(arr.length>0){
                                    if(arr[0]=="0"){//符合成数
                                        sfMoney=formatNum((this.value/10)*arr[1]);
                                        sfHtml=self.convertToZH(arr[1])+"\u6210"+"（"+sfMoney+"\u4e07）";
                                        self.inputDai.val("");
                                        self.sfDaiPage.find("dl[data-val]").removeClass("arr-choice");
                                        self.sfDaiPage.find("dl[data-val="+arr[1]+"]").addClass("arr-choice");
                                        self.sfRatioAttr="0_"+arr[1];
                                    }else if(arr[0]=="1"){//自定义
                                        sfMoney=arr[1];
                                        sfHtml=sfMoney+"\u4e07";
                                        self.inputDai.val(sfMoney);
                                        self.sfRatioAttr="1_"+arr[1];
                                    }
                                }
                                var tempVal=formatNum(self.totalMoney.val()-sfMoney);
                                if(tempVal<0){//默认恢复为三成
                                    sfMoney=0.3*(this.value);
                                    sfHtml="\u4e09\u6210"+"（"+sfMoney+"\u4e07）";
                                    tempVal=formatNum(this.value-sfMoney);
                                    self.sfRate.attr("data-value","0_3");
                                    self.sfRatioAttr="0_3";
                                }
                                self.sfRate.html(sfHtml);
                                self.sfRatio=sfHtml;
                                //同步两页面之间的数据
                                self.totalHousePrice=this.value;
                                self.totalLoans=tempVal;
                                if(self.getPageName()=="sfdai"){
                                    var tempArr=self.sfRatioAttr.split("_");
                                    var tempDkMoney=0;
                                    if(tempArr&&tempArr.length>0){
                                        if(tempArr[0]=="0"){
                                            tempDkMoney=parseInt(tempArr[1])*0.1*Number(self.totalHousePrice);
                                        }else{
                                            tempDkMoney=parseInt(tempArr[1]);
                                        }
                                    }
                                    self.dkTotalMoney.val(Math.floor(tempDkMoney/2));

                                }else{
                                    self.dkTotalMoney.val(tempVal);
                                }
                            }

                        }else if(this.id=="dkTotalMoney"){
                            if(this.value!=""&&!isNaN(this.value)){
                                if(parseFloat(this.value)>parseFloat(self.totalLoans)){
                                    return;
                                }
                                if(self.getPageName()!="sfdai"){
                                    self.totalLoans=this.value;
                                }
                                //self.totalHousePrice=self.dkTotalMoney.val();
                            }else{
                                this.value="";
                            }
                        }
                    }else{
                        this.value="";
                    }
                }
            }

            function initTaxsBindEvent(){
                self.newHouseCal.on("click",taxsCalFn);
                self.newHouseLink.on("click",houseLinkFn);
                self.esfHouseLink.on("click",houseLinkFn);
                self.houseArea.on("keydown",{"length":5},downFn);
                self.housePrice.on("keydown",{"length":6},downFn);
                pushTop();
            }

            function initEsfBindEvent(){
                self.calEsfBtn.on("click",esfTaxsCalFn);
                self.newHouseLink.on("click",houseLinkFn);
                self.esfHouseLink.on("click",houseLinkFn);
                self.houseArea.on("keydown",{"length":5},downFn);
                self.housePrice.on("keydown",downFn);
                pushTop();
            }

            function initSfDaiBindEvent(){
                self.sfRate.on("click",showSfRateFn);
                self.sfCal.on("click",sfCalFn);
                self.dkEsf.on("click",dkEsfFn);
                self.dkNewhouse.on("click",dkNewhouseFn);
                self.noDy.on("click",noDyFn);
                self.hasDy.on("click",hasDyFn);
                self.sfDaiPage.on("click","dl[data-val]",sfdaiRateFn);//首付成数点击事件
                self.detailLink.on("click",sfdetailFn);//加箭头点击事件
                self.detail.on("click",sfdetailFn);
                self.btnDaiOk.on("click",btnDaiOkFn);//首付确定按钮点击事件
                self.totalMoney.on("keydown",downFn).on("blur",blurFn);
                self.dkTotalMoney.on("keydown",downFn).on("blur",blurFn);
                self.inputDai.on("keydown",downFnForRate);
                self.isDy.on("click",showQxFn);
                self.dyType.on("click",showQxFn);
                self.dkType.on("click",showQxFn);
                self.dkNewhouse.prop("checked",true);//修正魅族选中bug
                self.noDy.prop("checked",true);
                self.dyType.eq(0).prop("checked",true);

                showQxFn();//初始化调取接口事件
                pushTop();
            }

            function formatNum(num){//格式化两位小数 如果23.00 则保留为23 如果是23.1就23.10
                var n=Number(num).toFixed(2);
                if(parseInt(n)==num){
                    n=parseInt(n);
                }
                return Number(n);
            }

            function btnDaiOkFn(){
                var daiValue=self.inputDai.val();
                if(daiValue==""){
                    alert("请输入首付比例");
                    return ;
                }
                daiValue=formatNum(daiValue);
                var tempvalue=formatNum(self.totalMoney.val());
                if(daiValue>tempvalue){
                    alert("超出贷款总额");
                    return;
                }
                if(isNaN(self.inputDai.val())){
                    alert("请输入正确的首付比例");
                    return;
                }
                daiValue=formatNum(daiValue);
                var tM=tempvalue/10;
                var sfTempVal="";
                var dataVal=0;//"0_num" 0:表示成数  1:自定义
                daiValue=formatNum(daiValue);
                if((daiValue*100)%(tM*100)==0){
                    var num=daiValue/tM;
                    if(num>0&&num<11){
                        sfTempVal=self.convertToZH(num)+"\u6210"+"（"+daiValue+"\u4e07）";
                        dataVal="0_"+num;
                    }else{
                        sfTempVal=daiValue+"\u4e07";
                        dataVal="1_"+daiValue;
                    }
                }else{
                    sfTempVal=daiValue+"\u4e07";
                    dataVal="1_"+daiValue;
                }
                self.sfRate.html(sfTempVal);
                self.sfRate.attr("data-value",dataVal);
                self.dkTotalMoney.val(Math.ceil(daiValue/2));
                self.sfDaiPage.find("dl[data-val]").removeClass("arr-choice");
                self.sfDaiPage.css("display","none");
                self.mainPage.css("display","block");
                self.navMenu.css("display","block");
                self.sfRatio=sfTempVal;
                pushStatefn("sfdai");
                self.totalHousePrice=formatNum(self.totalMoney.val());
                //self.totalLoans=formatNum(self.dkTotalMoney.val());
            }

            function sfdetailFn(){
                var site_url=jQuery("#tools_url").val();
                self.jsresults.css("display","block");
                var procode="";
                var diyatime=0;
                var selQx=3;
                if(self.dkNewhouse.prop("checked")){
                    if(self.noDy.prop("checked")){
                        procode="XFsfdxy";
                    }else{
                        procode="XFsfddy";
                    }
                }else if(self.dkEsf.prop("checked")){
                    procode="ESFsfd";
                }

                if(self.dy.css("display")=="block"){
                    self.dyType.each(function(index,elem){
                        if($(elem).prop("checked")){
                            diyatime=$(elem).val();
                        }
                    });
                }

                selQx = self.selQx.find("option:selected").val();
                var calurl=site_url+"?c=tools&a=shoufuDetail&ProCode="+procode+"&CityType=0&DiyaTime="+diyatime+"&QiXian="+selQx
                    +"&LoanMoney="+self.dkTotalMoney.val()*10000+"&RepayType="+(self.repayType||1);
                window.location.href=calurl;
            }

            function sfdaiRateFn(){
                $(this).siblings().removeClass("arr-choice");
                $(this).addClass("arr-choice");
                var cxVal=$(this).attr("data-val");
                var tempTotalMoney=formatNum(self.totalMoney.val());
                var tempMoney=formatNum(tempTotalMoney*cxVal*0.1);
                var sfTempVal=self.convertToZH(cxVal)+"\u6210"+"（"+tempMoney+"\u4e07）";
                var dkTotalMoney=0;
                var tmpMoney=Math.ceil(tempMoney/2);
                dkTotalMoney=tempTotalMoney-tempMoney;
                if(dkTotalMoney>tmpMoney){
                    self.dkTotalMoney.val(tmpMoney);
                }else{
                    self.dkTotalMoney.val(dkTotalMoney);
                }

                self.sfRate.html(sfTempVal);
                self.sfRate.attr("data-value","0_"+cxVal);
                self.mainPage.css("display","block");
                self.navMenu.css("display","block");
                self.sfDaiPage.css("display","none");
                self.sfRatio=sfTempVal;
                self.sfRatioAttr="0_"+cxVal;

                //因为首付贷和商业贷,公积金贷的贷款总额不做数据同步
                //self.totalLoans=self.dkTotalMoney.val();

                self.totalHousePrice=tempTotalMoney;
                pushStatefn("sfdai");
            }

            function showSfRateFn(){
                self.navMenu.css("display","none");
                self.mainPage.css("display","none");
                self.sfDaiPage.css("display","block");
                var dlVal=self.sfDaiPage.find("dl[data-val]");
                dlVal.removeClass("arr-choice");
                var sfRateAttr=$(this).attr("data-value");
                var arr=[];
                sfRateAttr=sfRateAttr.split("_");
                if(sfRateAttr&&sfRateAttr.length>0){
                    if(sfRateAttr[0]=="0"){//可以分成
                        dlVal.eq(sfRateAttr[1]-1).addClass("arr-choice");
                    }else{//自定义
                        self.inputDai.val(sfRateAttr[1]);
                    }
                }
                pushStatefn("sfdai");
            }

            function noDyFn(){
                self.dy.css("display","none");
            }

            function hasDyFn(){
                self.dy.css("display","block");
            }

            function dkNewhouseFn(){
                self.noDy.removeAttr("disabled");
                if(self.isDy.prop("checked")){
                    self.noDy.prop("checked",true);
                }
                self.noDy.removeClass("ipt-rda").addClass("ipt-rd");
            }

            function dkEsfFn(){
                self.noDy.attr("disabled","disabled");
                self.isDy.eq(1).prop("checked",true);
                self.noDy.removeClass("ipt-rd").addClass("ipt-rda");
                self.dy.css("display","block");
                self.dyType.eq(0).prop("checked",true);
            }

            function sfCalFn(){
                var site_url=jQuery("#tools_url").val();
                var procode="";
                var diYaTime=0;
                var selQx=3;
                var resultObj=self.jsresults02.find("dd");
                var payLx=0;
                var sfMoney=0;
                if(self.totalMoney.val()==""){
                    alert("房款总价不能为空");
                    return;
                }
                if(self.dkTotalMoney.val()==""){
                    alert("贷款总额不能为空");
                    return;
                }
               /* if(parseFloat(self.dkTotalMoney.val())>parseFloat(self.totalMoney.val())){
                    alert("超出贷款总额");
                    return;
                }*/
                if(isNaN(self.totalMoney.val())){
                    alert("请输入正确的房款总价");
                    return;
                }
                if(isNaN(self.dkTotalMoney.val())){
                    alert("请输入贷款总额");
                    return;
                }
                if(self.totalMoney.val()=="0"){
                    alert("请输入房款总额");
                    return;
                }
                if(self.totalMoney.val()!="0"&&self.dkTotalMoney.val()=="0"){
                    alert("请输入贷款总额");
                    return;
                }
                sfMoney=self.sfRate.html().match(/(\d+)/);

                if(sfMoney&&sfMoney.length>0){
                    sfMoney=sfMoney[0];
                    if(self.dkNewhouse.prop("checked")&&self.noDy.prop("checked")){
                        if(Math.ceil(self.dkTotalMoney.val())>Math.floor(sfMoney/2)){
                            alert("输入的贷款总额不能超过首付的一半");
                            return;
                        }
                    }else{
                        if(Math.ceil(self.dkTotalMoney.val())>Math.floor(sfMoney)){
                            alert("输入的贷款总额不能超过首付金额");
                            return;
                        }
                    }
                }

                if(self.dkNewhouse.prop("checked")){
                    if(self.noDy.prop("checked")){
                        procode="XFsfdxy";
                    }else{
                        procode="XFsfddy";
                        if(self.hasDy.prop("checked")){
                            self.dyType.each(function(index,elem){
                                if($(elem).prop("checked")){
                                    diYaTime=$(elem).val();
                                }
                            });
                        }
                    }
                }else if(self.dkEsf.prop("checked")){
                    procode="ESFsfd";
                    if(self.hasDy.prop("checked")){
                        self.dyType.each(function(index,elem){
                            if($(elem).prop("checked")){
                                diYaTime=$(elem).val();
                            }
                        });
                    }
                }

                resultObj.eq(0).html(formatNum(self.dkTotalMoney.val())+"\u4e07\u5143");
                selQx = self.selQx.find("option:selected").val();
                var theSelectedIndex=self.monthRate.find("option:selected").val();
                var payWay=self.payWay.find("option:selected").val();
                var payWayOptionCount=self.payWay.find("option").length;
                var repayType=1;
                if(self.RepayType&&self.RepayType.length>0){
                    if(payWayOptionCount>1){
                        repayType=self.RepayType[payWay];
                    }else{
                        repayType=self.RepayType[theSelectedIndex];
                    }
                }
                self.repayType=repayType;
                var calurl=site_url+"?c=tools&a=ajaxshoufuJisuan&ProCode="+procode+"&CityType=0&DiyaTime="+diYaTime+"&QiXian="+selQx
                    +"&LoanMoney="+self.dkTotalMoney.val()*10000+"&RepayType="+(repayType);
                $.getJSON(calurl,function(data){
                    if(data.result=="100"){
                        resultObj.eq(1).html(formatNum(data.lx/10000)+"\u4e07\u5143");
                        var arr=[{value:parseFloat(self.dkTotalMoney.val()),color:"#ffda7c"},
                            {value:parseFloat(formatNum(data.lx/10000)),color:"#6ebfff"}]
                        self.autoPie(arr);
                        showResultDiv();
                    }else{
                        alert("获取支付利息出错");
                        return;
                    }
                }).fail(function (){
                    alert("请检查网络");
                    return;
                });
            }

            //选择期限处理函数
            function showQxFn(){
                var site_url=jQuery("#tools_url").val();
                //var selVal=$(this).find("option:selected").val();
                var selVal="";
                var procode="";
                var diYaTime=0;
                if(self.dkNewhouse.prop("checked")){
                    if(self.noDy.prop("checked")){
                        procode="XFsfdxy";
                    }else{
                        procode="XFsfddy";
                        if(self.hasDy.prop("checked")){
                            self.dyType.each(function(index,elem){
                                if($(elem).prop("checked")){
                                    diYaTime=$(elem).val();
                                }
                            });
                        }
                    }
                }else if(self.dkEsf.prop("checked")){
                    procode="ESFsfd";
                    if(self.hasDy.prop("checked")){
                        self.dyType.each(function(index,elem){
                            if($(elem).prop("checked")){
                                diYaTime=$(elem).val();
                            }
                        });
                    }
                }
                //产品Code(XFsfddy新房首付贷抵押版/XFsfdxy新房首付贷信用版/ESFsfd二手房首付贷)
                var getSfPayWayUrl=site_url+"?c=tools&a=ajaxshoufu&ProCode="+procode+"&CityType=0&DiyaTime="+diYaTime;
                $.getJSON(getSfPayWayUrl,function(data){
                    if(data.result=="100"){//获取数据成功!
                        var arr=data.ListData.data;
                        var arrQx=new Array();
                        var arrText=[];
                        var arrLv=[];
                        var payWayTextOptions="";
                        var monthRateOptions="";
                        var count=0;
                        var qiXianOptions="";
                        self.RepayType=[];
                        //self.LimitMoneyArr=[];
                        for(var i= 0,len=arr.length;i<len;i++){
                            arrQx.push(arr[i].QiXian);
                            if(arrQx[0]==arr[i].QiXian){//首次加载时装载
                                arrText.push(arr[i].RepayTypeTxt);
                                arrLv.push(Number((arr[i].MonthRate*100).toFixed(6))+"%");
                                //self.LimitMoneyArr.push(arr[i].Limit);
                                self.RepayType.push(arr[i].RepayType);
                                payWayTextOptions+="<option value="+i+">"+arrText[i]+"</option>";
                                monthRateOptions+="<option value="+i+">"+arrLv[i]+"</option>";
                            }else{
                                self.RepayType.push(arr[i].RepayType);
                            }
                        }
                        if(arr&&typeof arr.length=="undefined"){//返回结果仅一条数据时是一个对象的处理
                            arrQx.push(arr.QiXian);
                            arrText.push(arr.RepayTypeTxt);
                            arrLv.push(Number((arr.MonthRate*100).toFixed(6))+"%");
                            self.RepayType.push(arr.RepayType);
                            //self.LimitMoney=arr.Limit;
                            payWayTextOptions+="<option value="+i+">"+arrText[0]+"</option>";
                            monthRateOptions+="<option value="+i+">"+arrLv[0]+"</option>";
                        }
                        arrQx=self.unique(arrQx);//过滤重复顺序 排序输出数组
                        arrQx.sort(function(a,b){return a-b;});
                        for(var i= 0,len=arrQx.length;i<len;i++){
                            qiXianOptions+="<option value="+arrQx[i]+">"+arrQx[i]+"\u4e2a\u6708\u000d\u000a</option>";
                        }
                        self.payWay.html(payWayTextOptions);
                        self.monthRate.html(monthRateOptions);
                        self.selQx.html(qiXianOptions);
                        self.selQx.on("change",function(){//此处存在多次绑定事件 待处理
                            payWayTextOptions="";
                            monthRateOptions="";
                            self.RepayType=[];
                            count=0;
                            for(var j= 0,l=arr.length;j<l;j++){
                                if(arr[j].QiXian==this.value){
                                    payWayTextOptions+="<option value="+count+">"+arr[j].RepayTypeTxt+"</option>";
                                    monthRateOptions+="<option value="+count+">"+Number((arr[j].MonthRate*100).toFixed(6))+"%</option>";
                                    self.RepayType.push(arr[j].RepayType);
                                    count++;
                                }
                            }
                            self.payWay.html(payWayTextOptions);
                            self.monthRate.html(monthRateOptions);
                        });
                        self.payWay.on("change",function(){
                            self.monthRate.val(this.value);
                        });
                        self.monthRate.on("change",function(){
                            self.payWay.val(this.value);
                        });
                    }else{
                        self.payWay.html("");
                        self.monthRate.val("");
                        alert("获取首付贷还款方式出错");
                        return;
                    }
                });
            }

            function houseLinkFn(ev){
                $(this).siblings().removeClass("active");
                $(this).addClass("active");
                if(this.id=="newHouseLink"){
                    self.mainBody.innerHTML=self.taxspage.taxsHtml;
                    pushStatefn("taxs");
                    self.pageName=self.getPageName();
                    convertToObj();
                    initTaxsBindEvent();
                }else if(this.id=="esfHouseLink"){
                    self.mainBody.innerHTML=self.esftaxspage.esfTaxsHtml;
                    pushStatefn("esftaxs");
                    self.pageName=self.getPageName();
                    convertToObj();
                    initEsfBindEvent();
                }
                ev.preventDefault();
            }

            function esfTaxsCalFn(){
                var area=self.houseArea.val();
                var price=self.housePrice.val();
                if(area==""){
                    alert("请输入面积");
                    return;
                }

                if(price==""){
                    alert("请输入总价");
                    return;
                }

                if(isNaN(area)){
                    alert("请输入正确的面积");
                    return;
                }

                if(isNaN(price)){
                    alert("请输入正确的总价");
                    return;
                }

                if(Number(area)==0||area=="0"){
                    alert("请输入正确的面积");
                    return;
                }

                if(Number(price)==0||price=="0"){
                    alert("请输入正确的总价");
                    return;
                }


                var houseProp=self.houseProp.find("option:selected").val();//房屋性质 1:普通住宅  2:非普通住宅 3:经济
                var jzType=self.jzType.find("option:selected").val();//房产证年限
                var chks=jQuery(".ipt-cb");
                var cityjp=jQuery("#cityjp");
                price=parseFloat(price);
                area=parseFloat(area);
                var total=price;//房款总价
                var urlPrms="";
                var resultObj=self.jsresults.find("dd");
                chks.each(function(index,elem){
                    if(index==0){
                        if(elem.checked){
                            urlPrms+="&forfiveyearsIf=1";
                        }else{
                            urlPrms+="&forfiveyearsIf=2";
                        }
                    }else if(index==1){
                        if(elem.checked){
                            urlPrms+="&firsthouseIf=1";
                        }else{
                            urlPrms+="&firsthouseIf=2";
                        }
                    }else if(index==2){
                        if(elem.checked){
                            urlPrms+="&onlyhouseIf=1";
                        }else{
                            urlPrms+="&onlyhouseIf=2";
                        }
                    }
                });

                var site_url=jQuery("#tools_url").val();
                var url=site_url+"?a=ajaxesfTaxs&city="+cityjp.val()+"&area="+area+"&price="+price+urlPrms+"&housenature="+houseProp;
                $.getJSON(url,function(data){
                    if(data){
                        showResultDiv();
                        resultObj.eq(0).html(formatNum(data.house_total)+"万"); //价格
                        resultObj.eq(1).html(parseInt(data.deed)+"元");
                        resultObj.eq(2).html(parseInt(data.saletax)+"元");
                        resultObj.eq(3).html(parseInt(data.stamptax)+"元");
                        resultObj.eq(4).html(parseInt(data.individualIncometax)+"元");
                        resultObj.eq(5).html(parseInt(data.costtax)+"元");
                        resultObj.eq(6).html(parseInt(data.Syntheticaltax)+"元");
                        resultObj.eq(7).html(parseInt(data.total)+"元");
                        var arr=[
                            {value:parseInt(data.deed),color:"#fd6e9e"},
                            {value:data.saletax,color:"#6dbffe"},
                            {value:parseInt(data.stamptax),color:"#c1ff8b"},
                            {value:parseInt(data.individualIncometax),color:"#fffa59"},
                            {value:parseInt(data.costtax),color:"#fda585"},
                            {value:parseInt(data.Syntheticaltax),color:"#ff7c7d"}
                        ];
                        self.autoPie(arr);
                    }
                }).fail(function (){
                    self.jsresults.hide();
                    jQuery("#cankao").css("display","none");
                    alert("请检查网络");
                    return;
                });
            }

            function taxsCalFn(){
                var area=self.houseArea.val();
                var price=self.housePrice.val();
                var houseProp=self.houseProp.find("option:selected").val();//房屋性质 1:普通住宅  0:非普通住宅
                var isUnique=$("input[name=unique]:checked").val();//是否唯一 1:是 0:否
                if(area==""){
                    alert("请填写房屋面积");
                    return;
                }
                if(price==""){
                    alert("请填写面积单价");
                    return;
                }
                if(isNaN(area)){
                    alert("请输入正确的房屋面积");
                    return;
                }
                if(isNaN(price)){
                    alert("请输入正确的面积单价");
                    return;
                }
                if(Number(area)==0||area=="0"){
                    alert("请输入正确的房屋面积");
                    return ;
                }
                if(Number(price)==0||price=="0"){
                    alert("请输入正确的面积单价");
                }
                jQuery("#cankao").css("display","block");
                self.jsresults.show();
                $(document.body).animate({
                    scrollTop: self.jsresults.offset().top
                },200);
                price=parseFloat(price);
                area=parseFloat(area);
                var totalPrice=parseFloat(area*price);
                var resultObj=self.jsresults03.find("dd");
                var qTaxs=0;//契税
                var gzMoney=totalPrice*0.003;
                var sxMoney=0;//手续费
                resultObj.eq(0).html(formatNum(totalPrice/10000)+"万元");
                resultObj.eq(1).html(parseInt(totalPrice*0.0005)+"元");//印花税
                resultObj.eq(2).html(parseInt(gzMoney)+"元");
                /*  1. 当用户选择普通住宅且唯一，需要判断房屋面积，面积在90平米（含90平米）以下的，契税税率为 1%；
                 2. 面积在90平米至144平米(含144平米)区间的，契税税率为1.5%;
                 3. 面积大于144平米的，契税税率为3%
                 1. 只要选择非普通住房或非唯一住房，，均按照3%的契税税率。*/
                if(houseProp==1&&isUnique==1){
                    if(area<=90){
                        qTaxs=0.01;
                    }else if(area<145&&area>90){
                        qTaxs=0.015;
                    }else{
                        qTaxs=0.03;
                    }
                }else if(houseProp==0||isUnique==0){
                    qTaxs=0.03;
                }
                resultObj.eq(3).html(parseInt(totalPrice*qTaxs)+"元");
                resultObj.eq(4).html(parseInt(gzMoney)+"元");
                if(area<=120){
                    sxMoney=500;
                }else if(area>120&&area<5000){
                    sxMoney=1500;
                }else {
                    sxMoney=5000;
                }
                resultObj.eq(5).html(parseInt(sxMoney)+"元");
                resultObj.eq(6).html(parseInt(totalPrice*0.0005+gzMoney+totalPrice*qTaxs+gzMoney+sxMoney)+"元");
                var arr=[
                    {value:totalPrice*0.0005,color:"#ff70a0"},
                    {value:gzMoney,color:"#6ec0ff"},
                    {value:totalPrice*qTaxs,color:"#b8e993"},
                    {value:gzMoney,color:"#feda7f"},
                    {value:sxMoney,color:"#fea484"}
                ];
                self.autoPie(arr);
            }

            function setZhLvInputFn(){
                var inputVal=self.inputRate.val();
                if(inputVal==""){
                    alert("请输入利率");
                    return;
                }
                if(isNaN(inputVal)){
                    alert("请输入正确的利率");
                    return;
                }
                if(Number(inputVal)==0||inputVal=="0"){
                    alert("请输入正确的利率");
                    return;
                }
                inputVal=formatNum(inputVal);
                self.ratePage.find("dl[data-val]").removeClass("arr-choice");
                if(self.fromInitrate==1){
                    self.initrate1.html(inputVal+"％");
                    self.zhpage.dkRateDiscount="";
                }else if(self.fromInitrate==2){
                    self.initrate2.html(inputVal+"％");
                    self.zhpage.gjjRateDiscount="";
                }
                self.ratePage.css("display","none");
                self.mainPage.css("display","block");
                self.navMenu.css("display","block");
                pushStatefn("zh");
            }

            function setZhLvFn(){
                var discount=$(this).attr("data-val");
                if(self.fromInitrate==1){
                    self.zhpage.dkRateDiscount=discount;
                    if(discount==1){
                        self.initrate1.html("\u57fa\u51c6\u5229\u7387（"+self.dkpage.dkRate+"％）");
                    }else{
                        self.initrate1.html((self.dkpage.dkRate*discount).toFixed(2)+"％");
                    }
                }else if(self.fromInitrate==2){
                    self.zhpage.gjjRateDiscount=discount;
                    if(discount==1){
                        self.initrate2.html("\u57fa\u51c6\u5229\u7387（"+self.dkpage.gjjRate+"％）");
                    }else{
                        self.initrate2.html((self.dkpage.gjjRate*discount).toFixed(2)+"％");
                    }
                }
                self.ratePage.css("display","none");
                self.mainPage.css("display","block");
                self.navMenu.css("display","block");
                self.fromPage="rate";
                pushStatefn("zh");
            }

            function showZhLv(){
                self.navMenu.css("display","none");
                self.mainPage.css("display","none");
                self.ratePage.css("display","block");
                if(this.id=="initrate1"){
                    self.fromInitrate=1;
                    var dlObjs=self.ratePage.find("dl[data-val]");
                    dlObjs.removeClass("arr-choice");
                    if(self.zhpage.dkRateDiscount!=""){//利率折扣选中设置
                        dlObjs.each(function(index,elem){
                            if($(elem).attr("data-val")==self.zhpage.dkRateDiscount){
                                $(elem).addClass("arr-choice");
                            }
                        });
                        self.inputRate.val("");
                    }else{//自定义利率
                        var currentVal=$(this).html().match(/\d+(.\d+){0,1}/);
                        if(currentVal){
                            currentVal=currentVal[0];
                        }
                        self.inputRate.val(currentVal);
                    }
                }else if(this.id=="initrate2"){
                    self.fromInitrate=2;
                    var dlObjs=self.ratePage.find("dl[data-val]");
                    dlObjs.removeClass("arr-choice");
                    if(self.zhpage.gjjRateDiscount!=""){//利率折扣选中设置
                        dlObjs.each(function(index,elem){
                            if($(elem).attr("data-val")==self.zhpage.gjjRateDiscount){
                                $(elem).addClass("arr-choice");
                            }
                        });
                        self.inputRate.val("");
                    }else{//自定义利率
                        var currentVal=$(this).html().match(/\d+(.\d+){0,1}/);
                        if(currentVal){
                            currentVal=currentVal[0];
                        }
                        self.inputRate.val(currentVal);
                    }
                }
                pushStatefn("zh");
            }

            //初始化页面首次加载的数据
            function initPageData(){
                var pageName=self.getPageName();
                if(pageName=="daikuan"||pageName=="gjj"){
                    convertToObj();
                    initBindEvent();
                }else if(pageName=="zh"){
                    convertToObj();
                    initZhBindEvent();
                }else if(pageName=="taxs"){
                    convertToObj();
                    initTaxsBindEvent();
                    self.isUnique.prop("checked",true);//修正魅族选中bug
                }else if(pageName=="esftaxs"){
                    convertToObj();
                    initEsfBindEvent();
                }else if(pageName=="sfdai"){
                    convertToObj();
                    initSfDaiBindEvent();
                }
            }

            function detailFn(){
                self.navMenu.css("display","none");
                self.mainPage.css("display","none");
                self.detailPage.css("display","block");
                detailCalFn();
                $(document.body).animate({
                    scrollTop: 0
                },200);
            }

            function detailCalFn(){
                var type=self.payType+1;
                self.fromPage="detail";
                switch(self.getPageName()){
                    case "daikuan":
                        if(self.payInfo){
                            render(type,self.payInfo,"daikuan");
                            pushStatefn("daikuan");
                        }
                        break;
                    case "gjj":
                        if(self.payInfo){
                            render(type,self.payInfo,"gjj");
                            pushStatefn("gjj");
                        }
                        break;
                    case "zh":
                        if(self.payzhInfo){
                            render(type,self.payzhInfo,"zh");
                            pushStatefn("zh");
                        }
                        break;
                }
            }

            function render(type,payInfo,pageType){
                var html="";
                var syTotal=payInfo.hkmoney;
                var dlObj=$("#listInfo").find("dd");
                var targetObj=document.getElementById("listHtml");
                $("#listHtml table:gt(0)").html("");//修正重复追加bug
                dlObj.eq(0).html((payInfo.hkmoney/10000).toFixed(2)+"万元");
                dlObj.eq(1).html((payInfo.dkmoney).toFixed(2)+"万元");
                dlObj.eq(2).html((payInfo.payLx/10000).toFixed(2)+"万元");
                if(pageType=="zh"){
                    dlObj.eq(3).html(payInfo.dkMonth+"月("+payInfo.dkMonth/12+"年)");
                    dlObj.eq(4).html(payInfo.gjjMonth+"月("+payInfo.gjjMonth/12+"年)");
                    dlObj.eq(5).html(Math.ceil(payInfo.monthAvgPay)+"元/月");
                }else{
                    dlObj.eq(3).html(payInfo.dkMonth+"月("+payInfo.dkMonth/12+"年)");
                    dlObj.eq(4).html(Math.ceil(payInfo.monthAvgPay)+"元/月");
                }

                var year=0;
                if(pageType=="zh"){
                    if(payInfo.dkMonth>=payInfo.gjjMonth){
                        year=payInfo.dkMonth;
                    }else{
                        year=payInfo.gjjMonth;
                    }
                }else{
                    year=payInfo.dkMonth;
                }

                for(var i=1;i<=year/12;i++){//年
                    html+='<table style="width:100% ;border:0 ;cellpadding:0;cellspacing:0"><tbody>';
                    html+='<tr><td colspan="4" align="left">第'+i+'年</td></tr>';
                    for(var j=1;j<=12;j++){//月
                        var cal= 0,calZh1= {},calZh2={};
                        if(pageType=="zh"){
                            if(payInfo.dkMonth>=j+(i-1)*12){
                                calZh1=everyMonthPay(type,payInfo.dkMonth,payInfo.hkdaikuanmoney,payInfo.monthRate1,j+(i-1)*12,payInfo.dkmoney1*10000,payInfo.monthPayOrigin1);
                            }else{
                                calZh1.bj=0;
                                calZh1.bx=0;
                                calZh1.sy=0;
                            }
                            if(payInfo.gjjMonth>=j+(i-1)*12){
                                calZh2=everyMonthPay(type,payInfo.gjjMonth,payInfo.hkgjjmoney,payInfo.monthRate2,j+(i-1)*12,payInfo.dkmoney2*10000,payInfo.monthPayOrigin2);
                            }else{
                                calZh2.bj=0;
                                calZh2.bx=0;
                                calZh2.sy=0;
                            }
                            if(type==1){
                                var tempSy=calZh1.sy+calZh2.sy;
                                if(tempSy<0){
                                    tempSy=0;
                                }
                                var calMonth=Math.floor(calZh1.bj+calZh2.bj)+Math.floor(calZh1.bx+calZh2.bx);
                                html+='<tr><td>'+j+'月</td><td>￥'+calMonth+'</td><td>￥'+Math.floor(calZh1.bj+calZh2.bj)+'</td><td>￥'+Math.floor(calZh1.bx+calZh2.bx)+'</td><td>￥'+Math.floor(tempSy)+'</td></tr>';
                            } else if(type==2){
                                syTotal=syTotal-(calZh1.bj+calZh1.bx+calZh2.bj+calZh2.bx);
                                if(syTotal<0){
                                    syTotal=0;
                                }
                                var calMonth=Math.floor(calZh1.bx+calZh2.bx)+Math.floor(calZh1.bj+calZh2.bj);
                                html+='<tr><td>'+j+'月</td><td>￥'+calMonth+'</td><td>￥'+Math.floor(calZh1.bj+calZh2.bj)+'</td><td>￥'+Math.floor(calZh1.bx+calZh2.bx)+'</td><td>￥'+Math.floor(syTotal)+'</td></tr>';
                            }
                        }else
                        {
                            cal=everyMonthPay(type,payInfo.dkMonth,payInfo.hkmoney,payInfo.monthRate,j+(i-1)*12,payInfo.dkmoney*10000,payInfo.monthPayOrigin);
                            if(type==1){
                                if(cal.sy<0){
                                    cal.sy=0;
                                }
                                var calMoney=cal.bj+cal.bx;
                                html+='<tr><td>'+j+'月</td><td>￥'+calMoney+'</td><td>￥'+cal.bj+'</td><td>￥'+cal.bx+'</td><td>￥'+cal.sy+'</td></tr>';
                            } else if(type==2){
                                syTotal=syTotal-cal.bj-cal.bx;
                                var calMoney=Math.floor(cal.bj)+Math.floor(cal.bx);
                                if(syTotal<0){
                                    syTotal=0;
                                }
                                html+='<tr><td>'+j+'月</td><td>￥'+calMoney+'</td><td>￥'+Math.floor(cal.bj)+'</td><td>￥'+Math.floor(cal.bx)+'</td><td>￥'+Math.floor(syTotal)+'</td></tr>';
                            }
                        }
                    }
                    html+='</tbody></table>';
                }
                targetObj.innerHTML=targetObj.innerHTML+html;
            }

            function everyMonthPay(type,dkMonth,hkmoney,monthRate,i,dkmoney,monthPayOrigin){
                var cal={};
                if(type==1){//等额本息
                    //每月应还本金=贷款本金×月利率×(1+月利率)^(还款月序号-1)÷〔(1+月利率)^款月数-1〕
                    cal.bj=Math.ceil(dkmoney*monthRate*Math.pow(1+monthRate,i-1)/(Math.pow(1+monthRate,dkMonth)-1));
                    //每月应还利息=贷款本金×月利率×〔(1+月利率)^还款月数-(1+月利率)^(款月序号-1)〕÷〔(1+月利率)^款月数-1〕
                    cal.bx=Math.ceil(dkmoney*monthRate*(Math.pow(1+monthRate,dkMonth)-Math.pow(1+monthRate,i-1))/(Math.pow(1+monthRate,dkMonth)-1));
                    cal.sy=hkmoney-Math.ceil(i*(monthPayOrigin));
                }
                else if(type==2){//等额本金
                    //每月应本金=贷款本金÷款月数
                    //每月应利息=剩余本金×月利率=(贷款本金-已归本金累计额)×月利率
                    cal.bj=dkmoney/dkMonth;
                    cal.bx=(dkmoney-(i-1)*cal.bj)*monthRate;
                }
                return cal;
            }

            function DaiOkFn(){
                var daiValue=self.inputDai.val();
                if(daiValue==""){
                    alert("请输入首付比例");
                    return;
                }
                if(self.totalMoney.val()==""){
                    alert("请输入贷款金额");
                    return;
                }
                if(isNaN(self.inputDai.val())){
                    alert("请输入正确的首付比例");
                    return;
                }
                daiValue=formatNum(daiValue);
                var tempvalue=formatNum(self.totalMoney.val());
                if(daiValue>tempvalue){
                    alert("超出贷款总额");
                    return;
                }
                var tM=tempvalue/10;
                var sfTempVal="";
                var dataVal="";
                if((daiValue*100)%(tM*100)==0){
                    var num=daiValue/tM;
                    daiValue=formatNum(daiValue);
                    if(num>0&&num<11){
                        sfTempVal=self.convertToZH(num)+"\u6210"+"（"+daiValue+"\u4e07）";
                        dataVal="0_"+num;
                    }else{
                        sfTempVal=daiValue+"\u4e07";
                        dataVal="1_"+daiValue;
                    }
                }else{
                    sfTempVal=daiValue+"\u4e07";
                    dataVal="1_"+daiValue;
                }
                self.sfRate.html(sfTempVal);
                self.sfRate.attr("data-value",dataVal);
                self.dkTotalMoney.val(formatNum(self.totalMoney.val()-daiValue));
                self.sfDaiPage.find("dl[data-val]").removeClass("arr-choice");
                self.sfDaiPage.css("display","none");
                self.mainPage.css("display","block");
                self.navMenu.css("display","block");
                self.sfRatio=sfTempVal;
                self.sfRatioAttr=dataVal;
                self.totalLoans=formatNum(self.dkTotalMoney.val());
                self.totalHousePrice=formatNum(self.totalMoney.val());
                pushStatefn("daikuan");
            }

            function setLvInputFn(){
                var inputVal=self.inputRate.val();
                if(inputVal==""){
                    alert("请输入利率");
                    return;
                }

                if(isNaN(inputVal)){
                    alert("请输入正确的利率");
                    return;
                }

                if(Number(inputVal)==0||inputVal=="0"){
                    alert("请输入正确的利率");
                    return;
                }

                inputVal=formatNum(inputVal);
                self.ratePage.find("dl[data-val]").removeClass("arr-choice");
                self.initrate.html(inputVal+"％");
                self.ratePage.css("display","none");
                self.mainPage.css("display","block");
                self.navMenu.css("display","block");
                self.fromPage="rate";
                pushStatefn("daikuan");
            }

            function showLv(){
                self.navMenu.css("display","none");
                self.mainPage.css("display","none");
                self.sfDaiPage.css("display","none");
                self.ratePage.css("display","block");
                pushStatefn(self.getPageName());
            }

            function setLvFn(){
                $(this).siblings().removeClass("arr-choice");
                $(this).addClass("arr-choice");
                var daiValue=parseFloat($(this).attr("data-val"));
                var calLv=0;
                if(self.getPageName()=="daikuan"){
                    calLv=(daiValue*(self.dkpage.dkRate)).toFixed(2);
                    pushStatefn("daikuan");
                }else if(self.getPageName()=="gjj"){
                    calLv=(daiValue*(self.dkpage.gjjRate)).toFixed(2);
                    pushStatefn("gjj");
                }
                if($(this).attr("data-val")==1){
                    self.initrate.html("\u57fa\u51c6\u5229\u7387（"+calLv+"％）");
                }else{
                    self.initrate.html(+calLv+"％");
                }

                self.initrate.attr("data-value",calLv);
                self.ratePage.css("display","none");
                self.mainPage.css("display","block");
                self.navMenu.css("display","block");
                self.inputRate.val("");
                self.jsresults.css("dsiplay","block");
            }

            function showRate(){
                self.navMenu.css("display","none");
                self.mainPage.css("display","none");
                self.sfDaiPage.css("display","block");
                self.ratePage.css("display","none");

                var dlVal=self.sfDaiPage.find("dl[data-val]");
                dlVal.removeClass("arr-choice");

                var sfRateAttr=$(this).attr("data-value");
                var arr=[];
                sfRateAttr=sfRateAttr.split("_");
                if(sfRateAttr&&sfRateAttr.length>0){
                    if(sfRateAttr[0]=="0"){//可以分成
                        dlVal.eq(sfRateAttr[1]-1).addClass("arr-choice");
                    }else{//自定义
                        self.inputDai.val(sfRateAttr[1]);
                    }
                }
                pushStatefn(self.getPageName());
            }

            function setRateFn(){
                $(this).siblings().removeClass("arr-choice");
                $(this).addClass("arr-choice");
                var daiValue=parseInt($(this).attr("data-val"));
                self.dkpage.sfLevel=daiValue;
                var tempTotalMoney=formatNum(self.totalMoney.val());
                var tempMoney=formatNum(tempTotalMoney*daiValue*0.1);
                var sfTempVal=self.convertToZH(daiValue)+"\u6210"+"（"+tempMoney+"\u4e07）";
                self.sfRate.html(sfTempVal);
                self.sfRatioAttr="0_"+daiValue;
                self.sfRate.attr("data-value","0_"+daiValue);
                var dkM=formatNum(tempTotalMoney-tempMoney);

                self.dkTotalMoney.val(dkM);
                self.sfDaiPage.css("display","none");
                self.mainPage.css("display","block");
                self.navMenu.css("display","block");
                self.jsresults.css("dsiplay","block");
                self.fromPage="sfrate";
                self.inputDai.val("");
                self.sfRatio=sfTempVal;
                self.totalHousePrice=tempTotalMoney;
                self.totalLoans=self.dkTotalMoney.val();

                pushStatefn(self.getPageName());
            }

            function pushStatefn(pageName){
                var title=document.title;
                var currentUrl=location.protocol+"//"+location.host;
                history.pushState({title:title}, title, currentUrl+"/tools/"+pageName+".html");
            }

            function popstateFn(){
                var pageName=window.location.href.match(/\/(\w+).html/);
                var templatePage="";
                var meunObj=self.navMenu.find("a");
                if(pageName){
                    pageName=pageName[1];
                }
                meunObj.removeClass("active");
                self.navMenu.css("display","block");
                if(pageName=="daikuan"||!pageName){
                    var ajYear=self.ajYear.find("option:selected").val();
                    var initrateHtml=self.initrate.html();
                    var initrateVal=self.initrate.attr("data-value");
                    initDaiKuanPage();
                    meunObj.eq(0).addClass("active");

                    if(self.fromPage=="detail"){
                        calFn();
                        self.jsresults.css("display","block");
                    }else{
                        self.jsresults.css("display","none");
                    }

                    self.ajYear.val(ajYear);
                    self.initrate.html(initrateHtml);
                    self.initrate.attr("data-value",initrateVal);

                }else if(pageName=="gjj"){
                    var ajYear=self.ajYear.find("option:selected").val();
                    var initrateHtml=self.initrate.html();
                    var initrateVal=self.initrate.attr("data-value");
                    initGjjPage();
                    meunObj.eq(1).addClass("active");

                    if(self.fromPage=="detail"){
                        calFn();
                        self.jsresults.css("display","block");
                    }else{
                        self.jsresults.css("display","none");
                    }
                    self.ajYear.val(ajYear);
                    self.initrate.html(initrateHtml);
                    self.initrate.attr("data-value",initrateVal);

                }else {
                    if(pageName=="zh"){
                        meunObj.eq(2).addClass("active");
                        var dkMoneyVal=self.dkMoney.val();
                        var gjjMoneyVal=self.gjjMoney.val();
                        var ajyeardkVal=self.ajyeardk.find("option:selected").val();
                        var ajyeargjjVal=self.ajyeargjj.find("option:selected").val();
                        var initrate1Html=self.initrate1.html();
                        var initrate2Html=self.initrate2.html();
                        self.mainBody.innerHTML=self.zhpage.zhHtml;
                        convertToObj("zh");
                        self.mainPage.css("display","block");

                        self.detailPage.css("display","none");
                        self.ratePage.css("display","none");
                        self.dkMoney.val(dkMoneyVal);
                        self.gjjMoney.val(gjjMoneyVal);
                        self.ajyeardk.val(ajyeardkVal);
                        self.ajyeargjj.val(ajyeargjjVal);
                        self.initrate1.html(initrate1Html);
                        self.initrate2.html(initrate2Html);

                        if(self.fromPage=="detail"){
                            self.jsresults.css("display","block");
                            calZhFn();
                        }else{
                            self.jsresults.css("display","none");
                        }
                        initZhBindEvent();
                    }else if(pageName=="taxs"){
                        var houseArea=self.houseArea.val();
                        var housePrice=self.housePrice.val();
                        var houseProp=self.houseProp.find("option:selected").val();
                        var isUnique=self.isUnique.prop("checked");
                        var noUnique=self.noUnique.prop("checked");

                        self.mainBody.innerHTML=self.taxspage.taxsHtml;
                        convertToObj("taxs");
                        meunObj.eq(3).addClass("active");
                        initTaxsBindEvent();

                        self.houseArea.val(houseArea);
                        self.housePrice.val(housePrice);
                        self.houseProp.val(houseProp);
                        self.isUnique.prop("checked",isUnique);
                        self.noUnique.prop("checked",noUnique);

                        if(self.fromPage=="detail"){
                            self.jsresults.css("display","block");
                            taxsCalFn();
                        }else{
                            self.jsresults.css("display","none");
                        }

                    }else if(pageName=="esftaxs"){
                        var houseArea=self.houseArea.val();
                        var housePrice=self.housePrice.val();
                        var payType=self.payType.find("option:selected");
                        var houseProp=self.houseProp.find("option:selected");
                        var ipt_cb=$(".ipt-cb");
                        self.mainBody.innerHTML=self.esftaxs.esfTaxsHtml;
                        convertToObj("esftaxs");
                        meunObj.eq(3).addClass("active");
                        initEsfBindEvent();

                        self.houseArea.val(houseArea);
                        self.housePrice.val(housePrice);
                        self.payType.val(payType);
                        self.houseProp.val(houseProp);
                        $(".ipt-cb").each(function(index,elem){
                            $(ipt_cb[index]).prop("checked",$(elem).prop("checked"));
                        });

                        if(self.fromPage=="detail"){
                            self.jsresults.css("display","block");
                            esfTaxsCalFn();
                        }else{
                            self.jsresults.css("display","none");
                        }

                    }else if(pageName=="sfdai"){
                        var dkType=$("input[name=dkType]");
                        var isDy=$("input[name=isDy]");
                        var dy=$("input[name=dy]");
                        var selQx=$("#selQx");

                        self.mainBody.innerHTML=self.sfdaipage.sfDaiHtml;
                        convertToObj("sfdai");
                        self.mainPage.css("display","block");
                        self.detailPage.css("display","none");
                        self.sfDaiPage.css("display","none");
                        if(self.fromPage=="detail"){
                            self.jsresults.css("display","block");
                            sfCalFn();
                        }else{
                            self.jsresults.css("display","none");
                        }
                        meunObj.eq(4).addClass("active");
                        initSfDaiBindEvent();
                        $("input[name=dkType]").each(function(index,elem){
                            $(dkType[index]).prop("checked",$(elem).prop("checked"));
                        });
                        $("input[name=isDy]").each(function(index,elem){
                            $(isDy[index]).prop("checked",$(elem).prop("checked"));
                        });
                        $("input[name=dy]").each(function(index,elem){
                            $(dy[index]).prop("checked",$(elem).prop("checked"));
                        });
                        self.selQx.html(selQx.html());

                        self.totalMoney.val(self.totalHousePrice);
                        self.sfRate.html(self.sfRatio);
                        self.sfRate.attr("data-value",self.sfRatioAttr);
                        var tempArr=self.sfRatioAttr.split("_");
                        var tempDkMoney=0;
                        if(tempArr&&tempArr.length>0){
                            if(tempArr[0]=="0"){
                                tempDkMoney=parseInt(tempArr[1])*0.1*Number(self.totalHousePrice);
                            }else{
                                tempDkMoney=parseInt(tempArr[1]);
                            }
                        }
                        self.dkTotalMoney.val(Math.floor(tempDkMoney/2));
                    }
                }
            }

            //切换付款方式
            function calFn(){
                //输入的变量
                var totalMoney=self.totalMoney.val();
                var sfMoney=self.sfRate.attr("data-value");
                var dkTotalMoney=self.dkTotalMoney.val();
                var ajYear=self.ajYear.find("option:selected").val();
                var initrate=self.initrate.html().match(/\d+(.\d+){0,1}/);
                if(totalMoney==""){
                    alert("请输入房价总额");
                    return;
                }
                if(dkTotalMoney==""){
                    alert("请输入贷款总额");
                    return;
                }
                if(isNaN(totalMoney)){
                    alert("请输入正确的房价总额");
                    return ;
                }
                if(isNaN(dkTotalMoney)){
                    alert("请输入正确的贷款总额");
                    return ;
                }
                if(totalMoney=="0"){
                    alert("请输入房款总价");
                    return ;
                }
                if(totalMoney!="0"&&dkTotalMoney=="0"){
                    alert("请输入贷款总额");
                    return ;
                }
                if(initrate){
                    initrate=initrate[0];
                    if(Number(initrate)==0||initrate=="0"){
                        alert("请填写正确的利率");
                        return;
                    }
                }else{
                    alert("利率获取失败");
                    return;
                }
                //展示结果变量
                var resultObj=self.jsresults.find("dd");
                var pieParamArr=[];
                //验证函数

                //统一做格式化
                totalMoney=parseFloat(totalMoney);
                var arr=sfMoney.split("_");
                if(arr.length>0){
                    if(arr[0]=="0"){
                        sfMoney=(totalMoney/10)*arr[1];
                    }else if(arr[0]=="1"){
                        sfMoney=arr[1];
                    }
                }
                sfMoney=parseFloat(sfMoney);
                dkTotalMoney=parseFloat(dkTotalMoney);
                ajYear=parseInt(ajYear);
                initrate=parseFloat(initrate);
                if(dkTotalMoney>totalMoney){
                    alert("超出贷款总额");
                    return;
                }
                showResultDiv();
                var result=self.calMethod(self.payType,dkTotalMoney*10000,(initrate*0.01)/12,ajYear*12);
                var monthPayOrigin=result.payMonth;
                var monthRate=(initrate*0.01)/12;

                result.payMonth=Math.ceil(monthPayOrigin);
                self.monthPay.html("￥"+result.payMonth);
                resultObj.eq(0).html(formatNum(totalMoney)+"\u4e07\u5143");
                resultObj.eq(1).html(formatNum(sfMoney)+"\u4e07\u5143");
                resultObj.eq(2).html(formatNum(dkTotalMoney)+"\u4e07\u5143");
                resultObj.eq(3).html(result.payLx+"\u5143");
                resultObj.eq(4).html(initrate+"%");
                resultObj.eq(5).html(result.payMonth+"\u5143\u002f\u6708");
                pieParamArr=[
                    {value:parseInt(sfMoney),color:"#6ebfff"},
                    {value:parseInt(dkTotalMoney),color:"#ffda7c"},
                    {value:parseInt(result.payLx/10000),color:"#ff70a0"}];
                self.autoPie(pieParamArr);
                self.payInfo={
                    hkmoney:(dkTotalMoney*10000+result.payLx).toFixed(2),
                    dkmoney:dkTotalMoney,
                    payLx:result.payLx,
                    dkMonth:ajYear*12,
                    monthAvgPay:result.payMonth,
                    monthPayOrigin:monthPayOrigin,
                    monthRate:monthRate
                }
            }

            function showResultDiv(page){
                $("#cankao").css("display","block");
                if(page){
                    $(".jsresults").css("display","block");
                    $(document.body).animate({
                        scrollTop: $(".jsresults").offset().top
                    },200);

                }else{
                    self.jsresults.css("display","block");
                    $(document.body).animate({
                        scrollTop: self.jsresults.offset().top
                    },200);
                }

            }

            function downFn(ev){
                var ev=ev||window.event;
                var code=ev.keyCode;
                if(code==0){
                    ev.preventDefault();
                    return false;
                }
                var currentVal=String.fromCharCode(code);
                var hasValue=this.value;

                var len=4;
                var maxNum=9999.99;
                if(ev.data){
                    if(ev.data.length==5){
                        maxNum=99999.99;
                        len=5;
                    }
                    else if(ev.data.length==6){
                        maxNum=999999;
                        len=6;
                    }

                }
                //95-106:0-9 |47-58:0-9 |110|190:. 37:<- 39:-> 8:backspace
                if((code>95&&code<106)||(code>47&&code<58)||code==110||code==190||code==37||code==39||code==8){
                    if(self.getPageName()=="zh"){
                        if(hasValue=="请输入贷款金额"){
                            hasValue=this.value="";
                        }
                    }
                    if(!isNaN(currentVal)){
                        if(hasValue.indexOf('.')>-1){//包含小数点
                            if(Number(hasValue)>maxNum||Number(hasValue)<0){
                                ev.preventDefault();
                                return false;
                            }else if(/\d+\.\d{2}/.test(hasValue)){
                                ev.preventDefault();
                                return false;
                                //return true;
                            }else{

                            }
                        }
                        else{
                            if(Number(hasValue)>maxNum||Number(hasValue)<0){
                                ev.preventDefault();
                                return false;
                            }else if(hasValue.length>=len){
                                ev.preventDefault();
                                return false;
                            }else{}
                        }
                    }else{
                        if(code==8||code==37||code==39){
                            //return true;
                        }else if((code==190||code==110)&&len!=6){
                            if(hasValue.indexOf('.')>-1){
                                ev.preventDefault();
                                return false;
                            }else if(hasValue.length==len+1){
                                ev.preventDefault();
                                return false;
                            }else if(hasValue.length==0){
                                ev.preventDefault();
                                return false;
                            }else{}
                        }else if(hasValue==""){

                        }else if((code==190||code==110)&&len==6){
                            if(hasValue.length==6){
                                ev.preventDefault();
                                return false;
                            }else{}
                        }
                    }

                }else {
                    ev.preventDefault();
                    return false;
                }
            }
        },
        getPageName:function(){
            var currentUrl=window.location.href;
            if(currentUrl.indexOf("/daikuan.html")>-1||/tools\/$/.test(currentUrl)){
                return "daikuan";
            }else if(currentUrl.indexOf("/gjj.html")>-1){
                return "gjj";
            }else if(currentUrl.indexOf("/zh.html")>-1){
                return "zh";
            }else if(currentUrl.indexOf("/taxs.html")>-1){
                return "taxs";
            }else if(currentUrl.indexOf("/esftaxs.html")>-1){
                return "esftaxs";
            }else if(currentUrl.indexOf("/sfdai.html")>-1){
                return "sfdai";
            }else {
                return "";
            }
        },
        convertToZH:function(num){
            var arr=["一", "二", "三", "四", "五", "六", "七", "八", "九","十"];
            return arr[num-1];
        },
        autoPie:function (arr) {
            $("#pieCon canvas").remove();
            require.async("modules/tools/requestanimationframe");
            require.async("chart/pie/1.0.0/pie",function(pie){
                var p = new pie({
                    id: "#pieCon",//容器id
                    animateType: "increaseTogether",//效果类型，暂时只有这一种需要其他类型再扩展
                    height: 140,//canvas的高
                    width: 140,//canvas的宽
                    radius: 140,//半径
                    part: 60,//分割份数，即增量的速度
                    space: 1,//空白间隔的大小
                    hollowedRadius: 70,//是否挖空，如果为0则不挖空，否则为挖空的半径
                    dataArr: (function (arr) {
                        var isAllZero = 0;
                        for (var i = 0, len = arr.length; i < len; i++) {
                            isAllZero += arr[i].value;
                        }
                        if (isAllZero == 0) {
                            for (var i = 0, len = arr.length; i < len; i++) {
                                if (arr[i].value == 0) {
                                    arr[i].value = 10;
                                }
                            }
                        }
                        return arr;
                    })(arr)
                });
                p.run();
            });
        },
        calMethod:function (type, dkMoney, monthRate, monthNum) {
            /*还款方式公式计算*/
            var cal = {};
            if (type == 0) {//等额本息
                //〔贷款本金×月利率×(1＋月利率)＾款月数〕÷〔(1＋月利率)＾款月数-1〕
                cal.payMonth = ((dkMoney * monthRate * Math.pow(1 + monthRate, monthNum)) / (Math.pow(1 + monthRate, monthNum) - 1)).toFixed(2);
                //总利息=还款月数×每月月供额-贷款本金
                cal.payLx = Math.ceil(monthNum * cal.payMonth - dkMoney);
            } else if (type == 1) {//等额本金
                //(贷款本金÷款月数)+(贷款本金-已归本金累计额)×月利率 默认第一个月
                cal.payMonth = (dkMoney / monthNum + (dkMoney) * monthRate).toFixed(2);
                //〔(总贷款额÷款月数+总贷款额×月利率)+总贷款额÷还款月数×(1+月利率)〕÷2×款月数-总贷款额
                cal.payLx = Math.ceil(((dkMoney / monthNum + dkMoney * monthRate + (dkMoney / monthNum) * (1 + monthRate)) / 2) * monthNum - dkMoney);
            }
            return cal;
        },
        unique:function (arr) {
            var temp = new Array();
            arr.sort(function(a,b){return a-b;});
            for(var i = 0,l=arr.length; i < l; i++) {
                if( arr[i] == arr[i+1]) {
                    continue;
                }
                temp[temp.length]=arr[i];
            }
            return temp;
        }
    };

    window.onload=function(){
        jQuery(".floatApp").css("zIndex",2);
    }
    var houstPay = new HousePay();
    houstPay.init();

});