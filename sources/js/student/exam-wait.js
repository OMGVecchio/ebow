$(function(){
	var $timing = $('.timing').data('time');
	var $day = $('.day');
	var $hour = $('.hour');
	var $minute = $('.minute');
	var $second = $('.second');
	var day = Math.floor($timing / (1000*60*60*24));
	var hour = Math.floor($timing % (1000*60*60*24) / (1000*60*60));
	var minute = Math.floor($timing % (1000*60*60*24) % (1000*60*60) / (1000*60));
	var second = Math.floor($timing % (1000*60*60*24) % (1000*60*60) % (1000*60) / 1000);
	updateTime();
	setInterval(function(){
		if(second != 0){
			second--;
		}else{
			second = 59;
			if(minute != 0){
				minute--;
			}else{
				minute = 59;
				if(hour != 0){
					hour--;
				}else{
					hour = 24;
					if(day != 0){
						day--;
					}else{
						window.history.go(0);
					}
				}
			}
		}
		updateTime();
	}, 1000);
	function updateTime(){
		$day.text(day+'天');
		$hour.text(hour+'时');
		$minute.text(minute+'分');
		$second.text(second+'秒');
	}
});