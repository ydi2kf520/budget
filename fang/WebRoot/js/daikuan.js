$(function() {
	$("#sfRate").on("click", showRate);
});

function showRate() {

	$("#navMenu").css("display", "none");// 贷款选项隐藏
	$("#mainPage").css("display", "none");// 贷款详细隐藏
	$("#sfDaiPage").css("display", "block");// 贷款页显示
	$("#ratePage").css("display", "none");// 利率隐藏

	var dlVal = $("#sfDaiPage").find("dl[data-val]");
	dlVal.removeClass("arr-choice");
	var sfRateAttr = $(this).attr("data-value");
	alert(sfRateAttr);
	var arr = [];
	sfRateAttr = sfRateAttr.split("_");
	if (sfRateAttr && sfRateAttr.length > 0) {
		if (sfRateAttr[0] == "0") {// 可以分成
			alert(dlVal.eq(sfRateAttr[1]-1).val("data-val"));
			dlVal.eq(sfRateAttr[1] - 1).addClass("arr-choice");
		} else {// 自定义
			("#inputDai").val(sfRateAttr[1]);
		}
	}
	// pushStatefn(self.getPageName());

}