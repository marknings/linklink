(function() {
	$('#success').hide();
	$('#error').hide();
    var userName=$.cookie.getCookieValue('userName');
    var password=$.cookie.getCookieValue('password');
    $('#userName').val(userName);
    $('#password').val(password);

	loginData={};
	loginData.login=function(){
		userName=$('#userName').val();
		password=$('#password').val();
		var isChecked=$('#isRecord')[0].checked;
		if(!!isChecked){
				$.cookie.setCookie("userName",userName,24,"/");  
                $.cookie.setCookie("password",password,24,"/"); 
		}
        if($('input:radio:checked').val()=="fund"){
            /*$.post('loginData.json',{userName:userName,password:password,isChecked:isChecked},function(data){
                if(data.status==1){
                    $('#success').text('登录成功！').show();             
                    window.location.href=data.data;
                }else{
                    $('#error').text('用户名或密码不正确！').show();
                }
            },'JSON');*/
            window.location.href="fund.html";
        }else{
            /*$.post('loginData.json',{userName:userName,password:password,isChecked:isChecked},function(data){
                if(data.status==1){
                    $('#success').text('登录成功！').show();             
                    window.location.href=data.data;
                }else{
                    $('#error').text('用户名或密码不正确！').show();
                }
            },'JSON');*/
            window.location.href="bank.html";
        }
	}
	$.bindData.compileAll($('#login'),loginData);

})()