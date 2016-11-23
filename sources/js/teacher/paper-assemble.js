$(function(){

	var $filterBar = $("#pa-filter");
	var $navBar = $("#pa-nav");
	$(window).scroll(function(){
		// 筛选栏的top变化
		var st = document.body.scrollTop;
		if(st === 0){
			$filterBar.css("top", 60);
		}else if(st !== 0 && st < 60){
			$filterBar.css("top", 60 - st);
			$filterBar.removeClass("filter-shadow");
		}else if(st > 60){
			$filterBar.css("top", 0);
			$filterBar.addClass("filter-shadow");
		}

		// 导航栏的margin-top变化
		$navBar.css("marginTop", 80 + st);
	});

	// 筛选栏按钮状态变化
	$(".form-group").on("click", ":checkbox", function(){
		if($(this).is(":checked")){
			$(this).next().attr("disabled", false);
		}else{
			$(this).next().attr("disabled", true);
		}
	});

	// 计算总分
	$('[name=sc-point],[name=mc-point],[name=bl-point],[name=ju-point],[name=de-point],[name=sa-point],[name=ap-point]').change(function(event) {
		var scPoint = ($('.sc-count').val() || 0)*($('[name=sc-point]').val() || 0);
		var mcPoint = ($('.mc-count').val() || 0)*($('[name=mc-point]').val() || 0);
		var blankPoint = ($('.blank-count').val() || 0)*($('[name=bl-point]').val() || 0);
		var judgementPoint = ($('.judgement-count').val() || 0)*($('[name=ju-point]').val() || 0);
		var definitionPoint = ($('.definition-count').val() || 0)*($('[name=de-point]') .val()|| 0);
		var saqPoint = ($('.saq-count').val() || 0)*($('[name=sa-point]').val() || 0);
		var applicationPoint = ($('.application-count').val() || 0)*($('[name=ap-point]').val() || 0);
		var $marks = $('[name=totalMark]').val(scPoint+mcPoint+blankPoint+judgementPoint+definitionPoint+saqPoint+applicationPoint);
	});
});