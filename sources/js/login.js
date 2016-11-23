$(function(){
	// 背景样式控制
	var $cartoon = $(".login-cartoon-front");
	$cartoon.next().next().focus(changeCartoon).blur(changeCartoon);
	function changeCartoon(){
		$cartoon.toggleClass("login-cartoon-front");
		$cartoon.toggleClass("login-cartoon-behind");
	}
	// 表单简单验证
	$('.login-box').submit(function() {
		var $account = $('.login-input:eq(0)');
		var $password = $('.login-input:eq(1)');
		if(!$account.val()){
			alert('请输入账号!');
			return false;
		}else if($account.val().length < 8){
			alert('账号长度太短!');
			return false;
		}
		if(!$password.val()){
			alert('请输入密码!');
			return false;
		}else if($password.val().length < 8){
			alert('密码长度太短!');
			return false;
		}
	});
});