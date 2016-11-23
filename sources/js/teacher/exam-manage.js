$(function(){
	// 遮罩的显示与隐藏
	var $mask = $(".mask");
	$(".search-filter").on("click", ".mask-open", function(){
		$mask.show("slow");
	});
	$mask.on("click", ".mask-close", function(){
		$mask.hide("slow");
	});
	// 学生考试权限增加
	$('.btn-add').on('click', function(){
		var data = {};
		data.studentId = $('.add-id').val();
		data.examId = $('.exam-id').val();
		$.ajax({
			url: '/teacher/exam-permission-add',
			type: 'POST',
			data: data,
			dataType: 'text',
			success: function(resData, status){
				console.log(resData);
			}
		});
	});
	// 学生考试权限删除
	$('.btn-del').on('click', function(){
		$(this).parent().parent().remove();
		var delId = $(this).data('id');
		var data = {};
		data.studentId = delId;
		data.examId = $('.exam-id').val();
		$.ajax({
			url: '/teacher/exam-permission-del',
			type: 'POST',
			data: data,
			dataType: 'text',
			success: function(resData, status){
				console.log(resData);
			}
		});
	});
	// 考试完成
	$('.btn-over').on('click', function(){
		var examId = $(this).data('id');
		var data = {};
		data.examId = examId;
		$.ajax({
			url: '/teacher/exam-over',
			type: 'POST',
			data: data,
			dataType: 'text',
			success: function(resData, status){
				if(resData == 'ok'){
					window.location.href = '/teacher/exam-manage';
				}
			}
		});
	});
});