$(function(){
	$("#exam-start").on("click", function(){
		$.ajax({
			type: "POST",
			url: "/loadExam",
			dataType: "json",
			success: function(data, status){
				isLoaded = true;
			}
		});
		var isLoaded = false; // 判断是否加载完成(后期可改成懒加载)
		$(this).parent().fadeOut(function(){
			if(!isLoaded){
				// 显示一个加载图标
			}	
		});
	});
});