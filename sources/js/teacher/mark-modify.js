$(function(){
	/********** 单选题 **********/
	// 单选题答案
	var $answer = $('.answer-sc');
	var $current = null;
	var length = $answer.length;
	var seq = 0;
	for(; seq < length; seq++){
		$current = $($answer[seq]);
		$current.next().find('.answer-item input[value='+ $current.val() +']').trigger('click');
	}
	// 单选题评分
	$answer = $('.answer-sc-origin');
	length = $answer.length;
	seq = 0;
	for(; seq < length; seq++){
		$current = $($answer[seq]);
		var answerValue = charToValue($current.val());
		$current.next().next().find('.answer-item input[value='+ answerValue +']~span').addClass('checked');
		$current.val(answerValue);
	}
	var scCount = 0; // 正确的单选个数
	var $scAnswer = $('.sc-wrap');
	var scLength = $scAnswer.length;
	for(var count = 0; count < scLength; count++){
		var $scCurrent = $($scAnswer[count]);
		if($scCurrent.find('.answer-sc').val() == $scCurrent.find('.answer-sc-origin').val()){
			scCount++;
		}
	}
	/********** 多选题 **********/
	// 多选题答案
	$answer = $('.answer-mc');
	length = $answer.length;
	seq = 0;
	for(; seq < length; seq++){
		$current = $($answer[seq]);
		var mcValue = $current.val();
		var mcValues = mcValue.split(',');
		for(var sort in mcValues){
			$current.next().find('.answer-item input[value='+ mcValues[sort] +']').trigger('click');
		}
	}
	// 多选题评分
	$answer = $('.answer-mc-origin');
	length = $answer.length;
	seq = 0;
	for(; seq < length; seq++){
		$current = $($answer[seq]);
		var mcValue = $current.val();
		var mcValues = mcValue.split(',');
		var mcArray = [];
		for(var sort in mcValues){
			var answerValue = charToValue(mcValues[sort]);
			mcArray.push(answerValue);
			$current.next().next().find('.answer-item input[value='+ answerValue +']~span').addClass('checked');
		}
		$current.val(mcArray);
	}
	var mcCount = 0; // 正确的多选个数
	var $mcAnswer = $('.mc-wrap');
	var mcLength = $mcAnswer.length;
	for(var count = 0; count < mcLength; count++){
		var $mcCurrent = $($mcAnswer[count]);
		if($mcCurrent.find('.answer-mc-origin').val() == $mcCurrent.find('.answer-mc').val()){
			mcCount++;
		}
	}

	/********** 填空题 **********/
	// 填空题答案
	$answer = $('.answer-blank');
	length = $answer.length;
	seq = 0;
	for(; seq < length; seq++){
		$current = $($answer[seq]);
		$current.next().find('.blank-answer').val($current.val());
	}

	/********** 判断题 **********/
	// 判断题答案
	$answer = $('.answer-judgement');
	length = $answer.length;
	seq = 0;
	for(; seq < length; seq++){
		$current = $($answer[seq]);
		$current.parent().find('input[value='+ $current.val() +']').trigger('click');
	}
	// 判断题评分
	$answer = $('.answer-judgement-origin');
	length = $answer.length;
	seq = 0;
	for(; seq < length; seq++){
		$current = $($answer[seq]);
		var answerValue = booleanToValue($current.val());
		$current.val(answerValue);
		$current.parent().find('input[value='+ answerValue +']').addClass('checked');
	}
	var judgementCount = 0;
	var $judgementAnswer = $('.judgement-wrap');
	var judgementLength = $judgementAnswer.length;
	for(var count = 0; count < judgementLength; count++){
		var $judgementCurrent = $($judgementAnswer[count]);
		var judgementValue = booleanToValue($judgementCurrent.val());
		if($judgementCurrent.find('.answer-judgement-origin').val() == $judgementCurrent.find('.answer-judgement').val()){
			judgementCount++;
		}
	}

	/********** 名词解释题 **********/
	// 名词解释题答案
	$answer = $('.answer-definition');
	length = $answer.length;
	seq = 0;
	for(; seq < length; seq++){
		$current = $($answer[seq]);
		$current.next().val($current.val());
	}

	/********** 简答题 **********/
	// 简答题答案
	$answer = $('.answer-saq');
	length = $answer.length;
	seq = 0;
	for(; seq < length; seq++){
		$current = $($answer[seq]);
		$current.next().val($current.val());
	}

	/********** 应用题 **********/
	// 应用题答案
	$answer = $('.answer-application');
	length = $answer.length;
	seq = 0;
	for(; seq < length; seq++){
		$current = $($answer[seq]);
		$current.next().val($current.val());
	}

	// 成绩批改提交
	$('.mark-commit').on('click', function(){
		var markStatus = true;
		var scMark = scCount * $('.sc-point').val() || 0;
		var mcMark = mcCount * $('.mc-point').val() || 0;
		var judgementMark = judgementCount * $('.judgement-point').val() || 0;
		var totalMark = scMark + mcMark + judgementMark;
		var $otherMark = $('.answer-mark');
		var otherLength = $otherMark.length;
		for(var s = 0; s < otherLength; s++){
			var $markCurrent = $($otherMark[s]);
			if($markCurrent.val() == ''){
				alert('有题目未打分!');
				markStatus = false;
				break;
			}else{
				totalMark = totalMark + parseInt($markCurrent.val(), 10);
			}
		}
		if(markStatus){
			var markId = $('.mark-id').val();
			var data = {};
			data.markId = markId;
			data.marks = totalMark;
			$.ajax({
				url: '/teacher/mark-save',
				type: 'POST',
				data: data,
				dataType: 'text',
				success: function(resData, status){
					window.location.href = window.document.referrer;
				}
			});
		}
	}) ;
	
	/********** 工具函数 **********/
	// 选择题字母转数字
	function charToValue(char){
		switch(char){
			case 'a':
				return 0;
			case 'b':
				return 1;
			case 'c':
				return 2;
			case 'd':
				return 3;
			default:
				break;
		}
	}
	// 判断题布尔转数字
	function booleanToValue(boolen){
		switch(boolen){
			case 'false':
				return 1;
			case 'true':
				return 0;
			default:
				break;
		}
	}
});