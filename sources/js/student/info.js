$(function(){
	$('.btn-submit').on('click', function(){
		if($('.pw-new').val() === $('.pw-confirm').val()){
			var data = {};
			data.pwOrigin = $('.pw-origin').val();
			data.pwNew = $('.pw-new').val();
			$.ajax({
				url: '/student/password-update',
				type: 'POST',
				data: data,
				dataType: 'text',
				success: function(resData, status){
					if(resData == 'ok'){
						alert('操作成功!');
					}else{
						alert('操作失败!');
					}
				}
			});
		}
	});
});