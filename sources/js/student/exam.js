$(function(){
	// 导航栏
	var $questionNav = $('.question-nav');
	// 单选题,选中事件改变对应元素样式
	$('.answer-item').on('click', "input[type='radio']", function(){
		$(this).parents('table').find('.answer-content').removeClass('checked');
		$(this).next().addClass('checked');
		var sort = $(this).parents('[data-sort]').data('sort') - 1;
		var $currentLi = $questionNav.find('li:eq(' +  sort + ')');
		$currentLi.removeClass('btn-success').addClass('btn-danger');
	});
	// 多选题,选中事件改变对应元素样式
	$('.answer-item').on('click', "input[type='checkbox']", function(){
		$(this).parent().toggleClass('checked');
		var sort = $(this).parents('[data-sort]').data('sort') - 1;
		var $currentLi = $questionNav.find('li:eq(' +  sort + ')');
		if($(this).parents('[data-sort]').find('input:checked')[0] != null){
			$currentLi.removeClass('btn-success').addClass('btn-danger');
		}else{
			$currentLi.removeClass('btn-danger').addClass('btn-success');
		}
	});
	// 判断题
	$('.judgement-question').on('click', "input[type='radio']", function(){
		var sort = $(this).parents('[data-sort]').data('sort') - 1;
		var $currentLi = $questionNav.find('li:eq(' +  sort + ')');
		$currentLi.removeClass('btn-success').addClass('btn-danger');
	});
	// 非选择判断题答完后导航栏做相应变化
	$('[data-sort]').change(function(){
		var sort = $(this).data('sort') - 1;
		var $currentLi = $questionNav.find('li:eq(' +  sort + ')');
		if($(this).val() !== ''){
			$currentLi.removeClass('btn-success').addClass('btn-danger');
		}else{
			$currentLi.removeClass('btn-danger').addClass('btn-success');
		}
	});
	// 倒计时
	var duration = $('.duration').data('duration') * 60;
	var $minute = $('.spare-minute');
	var $second = $('.spare-second');
	setInterval(function(){
		duration = duration - 1;
		$minute.text(Math.floor(duration / 60) + '分');
		$second.text(duration % 60 + '秒');
	}, 1000);
});