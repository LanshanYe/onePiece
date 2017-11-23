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
			success:function(respones){
				
				var h = ""
				var obj = respones.data[0]
				console.log(obj)
				h += '<ul class="shopBox"><li class="checkAll"><input type="checkbox" name="" id="choseALL"  /></li><li class="message"><img src="'+obj.goods_thumb+'" /><span>'+obj.goods_name+'</span></li><li class="price">'+obj.goods_price+'</li><li class="numb"><button>+</button><input type="text" value="'+obj.goods_number+'"/><button>-</button></li><li class="sumb">'+obj.goods_price*obj.goods_number+'</li><li class="delate">删除</li></ul>'
				$("#shopShow").append(h)
			}
		});
	})

	

