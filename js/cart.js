var str = ""
$.post("http://h6.duchengjiu.top/shop/api_user.php",
	{"status":"login","username":"13007513628","password":"jiaheng"},
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
				var obj2 = respones.data
				console.log(obj2)
				for(var i = 0;i<obj2.length;i++){
					h += `<div class="row newGoods">
						<div class="checkAll col-lg-1 col-md-1 col-sm-1 col-xs-6">
							<input type="checkbox" name="" class="checkbox"  />
							<input type="hidden" class="goods_id" value=" ${obj2[i].goods_id} "/>
						</div>
						<div class="message col-lg-4  col-md-4 col-sm-4 col-xs-6">
							<img src="${obj2[i].goods_thumb}" alt="${obj2[i].goods_name}"/>
							<span title="${obj2[i].goods_name}">${obj2[i].goods_name}</span>
						</div>
						<div class="price col-lg-2  col-md-2 col-sm-2 col-xs-2">${obj2[i].goods_price}</div>
						<div class="numb col-lg-2  col-md-2 col-sm-2 col-xs-2">
							<button class="right-button">+</button>
							<input class="center-text" type="text" value="${obj2[i].goods_number}"/>
							<button class="left-button">-</button>
						</div>
						<div class="sumb col-lg-2  col-md-2 col-sm-2 col-xs-2">${obj2[i].goods_price*obj2[i].goods_number}</div>
						<div class="delate col-lg-1  col-md-1 col-sm-1 col-xs-1">删除</div>							
					</div>`
					
				}
				$("#shopBox").append(h)
				
				$(".delate").click(function(){
					var now = this
					$("#tip").fadeIn()
					$("#yes").click(function(){
						var goods = now.parentNode;
						//删除dom节点
						$(goods).remove();
					
						//通过数据库删除
						updataCartAjax(now,0);
						
						$("#tip").fadeOut()
						showSum()
					})
					$("#no").click(function(){
						$("#tip").fadeOut()
					})
				
				})
				
				//减号按钮事件监听
				$(".left-button").click(function(){
					
					upDataCart(this,'-1');
					
				})
				//加号按钮事件监听
				$(".right-button").click(function(){
					
					upDataCart(this,'+1');
					
				})
				$('.center-text').keyup(function(){
					setGoods(this);
				})
			}
		});
	})


function updataCartAjax(obj,num){
	
	var goods = obj.parentNode;
	
	var goods_id = goods.getElementsByClassName("goods_id")[0].value;
	
//	console.log(goods_id);
	
	$.ajax({
		"url": "http://h6.duchengjiu.top/shop/api_cart.php?token="+str,
		"type": "POST",
		"dataType": "json",
		"data": {
			"goods_id": goods_id,
			"number" : num
		},
		"success": function(response){
			console.log(response);
		}
	})
}

var state = true

$("#choseAll").click(function(){
	if (state) {
		for (var i=0;i<$(".checkbox").length;i++) {
			$(".checkbox").get(i).checked = state
		}
		state = !state
		showSum()
	}else if(!state){
		for (var i=0;i<$(".checkbox").length;i++) {
			$(".checkbox").get(i).checked = state
		}
		state = !state
		showSum()
	}
})



	
$("#shopBox").click(function(event){
	//全局委托
	//全选  selectAll
	if(event.target.id === "choseAll"){
		
		//得到 全选按钮的当前选中状态存入变量
		var selected = event.target.checked;
//		console.log(selected);
//		console.log(event.target);

		//通过类名得到商品复选框的类数组
		var checkboxs = document.getElementsByClassName("chkbox");
		console.log(checkboxs);
		
		for(var i=0;i<checkboxs.length;i++){
			//把复选框的选中状态 通过赋值 和全选按钮一致
			checkboxs[i].checked = selected;
		}
		showSum();
		return;
	}
	
	//除了全选复选框的事件
	if(event.target.type === "checkbox"){
		showSum();
	}
})
//改变购物车商品数量的业务函数
function upDataCart(obj,num){  //obj当前触发事件的元素，num： -1 +1
	
	//找对象
	var Good = obj.parentNode.parentNode;
	
	//找到商品数量
	var goods_id = Good.getElementsByClassName("goods_id")[0].value;
	var goods_number = Good.getElementsByClassName("center-text")[0];
	var goods_number_value = parseInt(goods_number.value);
	//找到商品单价
	var goods_price = Good.getElementsByClassName("price")[0];
	var goods_price_value = parseInt(goods_price.innerText);
	//找到商品合计金额元素
	var goods_subtotal = Good.getElementsByClassName("sumb")[0];

	//判断范围 1-10
	if( num == "-1" && goods_number_value <=1){
		return;
	}
	if( num == "+1" && goods_number_value >= 10){
		return
	}

	if( num == "-1"){
		goods_number_value--;
	}else if( num == "+1"){
		goods_number_value++;
	}else if( num > 0 ){
		goods_number_value = num;
	}else{
		goods_number_value = 0;
	}
	
	
	//当前商品的值                         信号量改变后的值
	goods_number.value = goods_number_value;
	
	//算出合计金额
	var subtotal = goods_number_value * goods_price_value;
	
	//把合计金额写入页面
//	console.log(subtotal);
	
	goods_subtotal.innerText = subtotal;
	
	showSum();

}

//显示总价和数量
function showSum(){
	
	//动态得到数据类数组
	var goods = document.getElementsByClassName("newGoods");
	
	//累加器
	var sum = 0;
	var num = 0;
	
	for(var i=0;i<goods.length;i++){
		
		
		//判断
		if( $(goods[i]).children("div:first").children("input").is(":checked") ){
			//累加
			sum += parseInt($(goods[i]).children("div:eq(4)").text());
			num += parseInt($(goods[i]).children("div:eq(3)").children("input").val());
			
		}
		
		
	}
	$("#sumber").text("￥" + sum);
	$("#number").text(num);
}

//设置某件商品的数量
function setGoods(obj){
	
	//获取商品数量
	var num =parseInt($(obj).val());
	
	//判断商品数量的值，大于或者小于范围
	if(num < 1 || isNaN(num)){
		$(obj).val(1);
	}
	

	//让金额合计变化
	upDataCart(obj,$(obj).val());
	
}

$(".choseDelate").click(function(){
	$("#tip").fadeIn(500)
	$("#yes").click(function(){
		//找到商品信息goods里面的复选框（选中状态的）
			var inputs = $(".newGoods input:checked");
		//	console.log(inputs);
			
			for(var i=0;i<inputs.length;i++){
				
		//		var goods_id = document.getElementsByClassName("goods_id")[0].value;
				var goodsL = inputs[i].parentNode.parentNode;
				var objPa = inputs[i].parentNode;
		//		console.log(goods_id);
		//		console.log(goodsL);
		
				//删除数据库中相应内容
				updataCartAjax(objPa,0);
				
				goodsL.parentNode.removeChild(goodsL);
				
			}
		$("#tip").fadeOut(500)
		showSum()
	})
	$("#no").click(function(){
		$("#tip").fadeOut(500)
	})
})

$(".finish").click(function(){
	var sum = $("#sumber").text().substr(1);
	location.href = "order.html?sum="+sum;
})