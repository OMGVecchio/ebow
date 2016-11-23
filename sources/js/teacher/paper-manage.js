$(function(){
	$('.btn-publish').on('click', function(){
		var sendData = {};
		var id = $(this).data('id');
		var title = $(this).data('title');
		var time = $(this).prev('.publish-time').val();
		sendData.paper = id;
		sendData.time = time;
		sendData.title = title;
		sendData.students = [];
		$.ajax({
			url: '/teacher/paper-publish',
			type: 'POST',
			data: sendData,
			dataType: 'text',
			success: function(data, status){
				if(data == 'ok'){
					window.history.go(0);
				}
			}
		});
	});
});