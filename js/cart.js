var str = ""
$.post("http://h6.duchengjiu.top/shop/api_user.php",
	{"status":"login","username":"13007513629","password":"jiaheng"},
	function(obj){
		console.log(obj)
		str=obj.data.token
		console.log(str)
		var url = "http://h6.duchengjiu.top/shop/api_cart.php?token="+str;
		console.log(url)
		$.ajax({
			type:"get",
			url:url,
			async:true,
			success:function(obj){
				console.log(obj)
			}
		});
	})



