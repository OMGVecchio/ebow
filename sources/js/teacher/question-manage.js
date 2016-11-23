$(function(){
	// 遮罩的显示与隐藏
	var $mask = $('.mask');
	$('.search-filter').on('click', '.mask-open', function(){
		$mask.show("slow");
	});
	$mask.on('click', '.mask-close', function(){
		$mask.hide('slow');
	});
	// 试题增加模块
	var typeNum = '0';
	$('.add-type').change(function(){
		typeNum = $(this).val();
		if(typeNum ==  '0' || typeNum == '1'){
			$('.hasChoice').slideDown('fast');
		}else{
			$('.hasChoice').slideUp('fast');
		}
	});
	$('.btn-add').click(function(){
		var data = {};
		data.type = typeNum;
		data.title = $('.add-title').val();
		data.answer = $('.add-answer').val();
		if(typeNum == '0' || typeNum == '1'){
			data.a = $('.add-a').val();
			data.b = $('.add-b').val();
			data.c = $('.add-c').val();
			data.d = $('.add-d').val();
		}
		$.ajax({
			url: '/teacher/question-add',
			type: 'POST',
			data: data,
			dataType: 'text',
			success: function(data, status){
				$('.add-reset').trigger('click');
			}
		});
	});
	// 试题删除
	$('.btn-del').on('click', function(){
		$(this).parent().parent().remove();
		var data = {};
		data.id = $(this).data('id');
		data.type = $('.question-type').val();
		$.ajax({
			url: '/teacher/question-del',
			type: 'POST',
			data: data,
			dataType: 'text',
			success: function(resData, status){
				console.log(resData);
			}
		});
	});
	// 试题保存
	$('.btn-update').on('click', function(){
		$(this).parent().parent().next().show('fast');
	});
	$('.btn-close').on('click', function(){
		$(this).parent().parent().hide('fast');
	});
	$('.btn-update-save').on('click', function(){
		$(this).next().trigger('click');
		var $parent =  $(this).parent().parent();
		var $parentOrigin = $(this).parent().parent().prev();
		var data = {};
		data.id = $(this).data('id');
		data.type = $('.question-type').val();
		data.title = $parent.find('.update-title').val();
		console.log(data.type);
		console.log(data.title);
		data.answer = $parent.find('.update-answer').val();
		$parentOrigin.find('.title-origin').text(data.title);
		$parentOrigin.find('.answer-origin').text(data.answer);
		if(data.type == '0' || data.type == '1'){
			data.a = $parent.find('.update-a').val();
			data.b = $parent.find('.update-b').val();
			data.c = $parent.find('.update-c').val();
			data.d = $parent.find('.update-d').val();
			$parentOrigin.find('.a-origin').text(data.a);
			$parentOrigin.find('.b-origin').text(data.b);
			$parentOrigin.find('.c-origin').text(data.c);
			$parentOrigin.find('.d-origin').text(data.d);
		}
		$.ajax({
			url: '/teacher/question-update',
			type: 'POST',
			data: data,
			dataType: 'text',
			success: function(resData, status){
				console.log('ok');
			}
		});
	});
});