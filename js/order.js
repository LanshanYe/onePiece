$.post("http://h6.duchengjiu.top/shop/api_user.php",
	{"status":"login","username":"13007513628","password":"jiaheng"},
	function(obj){
		
		str=obj.data.token
		
		var url = "http://h6.duchengjiu.top/shop/api_cart.php?token="+str;
		console.log(url)
		$.ajax({
			type:"get",
			url:url,
//			//true为异步，false为同步
//			async:true,
			success:function(respones){
				
				var html = ""
				var obj2 = respones.data
					console.log(respones)
					//外层for循环，循环的是订单的长度
					for(var i=0;i<obj2.length;i++){
						var obj = obj2[i]; //每条的订单信息
						
						html += '<div class="order-item">';
						html += '<div class="order-item-header">订单号：' + obj.cart_id +'</div>';
						html += '<div data-id="' +obj.goods_id
							 + '"><img src="'+ obj.goods_thumb 
							 +'">商品名称：' + obj.goods_name 
							 + '商品数量：' + obj.goods_number 
							 + '商品单价：' + obj.goods_price 
							 + '商品金额：' + parseInt(obj.price)*parseInt(obj.goods_number) 
							 + '</div>';
						
//						
						html += '</div>'
						}
						console.log(html)
						$("#order-list").html(html);			
			}
				
				
				
			
		});
	})