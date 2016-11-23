$(function(){
	// 添加更改操作
	var operation = null; // 添加(0)、修改(1)标识符
	var idOrigin = null; // 更新时所操作的ID
	var $infoArea = $('.info-area');
	var $formReset = $('.reset-form');
	$('.btn-add').on('click', function(){
		operation = 0;
		$formReset.trigger('click');
	});
	$('.btn-update').on('click', function(){
		operation = 1;
		var $parent = $(this).parent().parent();
		$infoArea.find('.id').val($parent.find('.id-origin').text());
		$infoArea.find('.name').val($parent.find('.name-origin').text());
		$infoArea.find('.class').val($parent.find('.class-origin').text());
		$infoArea.find('.college').val($parent.find('.college-origin').text());
		$infoArea.find('.gender').val($parent.find('.gender-origin').text());
		idOrigin = $(this).data('id');
	});
	$('.btn-commit').on('click', function(){
		var data = {};
		data._id = $infoArea.find('.id').val();
		data.name = $infoArea.find('.name').val();
		data.class = $infoArea.find('.class').val();
		data.college = $infoArea.find('.college').val();
		data.gender = $infoArea.find('.gender').val();
		if(operation === 0){
			$.ajax({
				url: '/admin/student-add',
				type: 'POST',
				data: data,
				dataType: 'text',
				success: function(resData, status){
					console.log(resData);
					$formReset.trigger('click');
				}
			});
		}else if(operation === 1){
			data.idOrigin = idOrigin;
			$.ajax({
				url: '/admin/student-update',
				type: 'POST',
				data: data,
				dataType: 'text',
				success: function(resData, status){
					console.log(resData);
				}
			});
		}
	});
	// 密码重置操作
	$('.btn-reset').on('click', function(){
		var data = {};
		var id = $(this).data('id');
		data.id = id;
		$.ajax({
			url: '/admin/student-reset',
			type: 'POST',
			data: data,
			dataType: 'text',
			success: function(resData, status){
				console.log(resData);
			}
		});
	});
	// 删除操作
	$('.btn-del').on('click', function(){
		var data = {};
		var id = $(this).data('id');
		data.id = id;
		$(this).parent().parent().remove();
		$.ajax({
			url: '/admin/student-del',
			type: 'POST',
			data: data,
			dataType: 'text',
			success: function(resData, status){
				console.log(resData);
			}
		});
	});
});