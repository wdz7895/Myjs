/*
 * 底层使用promise和ajax封装
 * 接受的参数 哦欸之对象
 * 配置对象的属性
 * {
 * 	url:"请求路径",
 *  method:"请求方式"， //默认get
 *  data:"请求数据"，
 * 	hearder："请求头" //application/x-www-form-urlencoded
 * 
 * }
 * 
 * 
 * 	
 * 
 */

function ajax(obj){
	//设定相关的默认值
	//默认为get请求
	obj.method = obj.method || "get";
	//默认请求头
	obj.header = obj.header || {"content-type":"application/x-www-form-urlencoded"};
	//处理数据格式
	if(obj.data){
		//如果有数据
		var str = "";
		let arr = []
		for(var k in obj.data){
			arr.push(k+"="+obj.data[k])
		}
		str = arr.join("&")
	}else{
		//如果没有数据
		str = "";
	}
	return new Promise((resolve,reject)=>{
		let xhr = new XMLHttpRequest();
		if(obj.method.toLowerCase()=="get"){
			xhr.open("get",obj.url+"?"+str,true);
			xhr.send();
		}else{
			xhr.open(obj.method,obj.url,true);
			for(var k in obj.header){
				xhr.setRequestHeader(k,obj.header[k]);
			}
			xhr.send(str);
		}
	})
	//监听状态
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			if(xhr.status >=200&&xhr.status<300 ||xhr.status==304){
				resolve(xhr.responseText)
			}else{
				reject(xhr.status)
			}
		}
	}
}
/*
 * api(功能介绍及使用)
 * 
 */
ajax.get = function(url,data){
	//处理数据格式
	var str = "";
	let arr = []
	for(var k in data){
		arr.push(k+"="+data[k])
	}
	str = arr.join("&")
	return new Promise((resolve,reject)=>{
		var xhr = new XMLHttpRequest();
		xhr.open("GET",url+"?"+str,true);
		xhr.send()
		//监听状态
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if(xhr.status >=200&&xhr.status<300 ||xhr.status==304){
					resolve(xhr.responseText)
				}else{
					reject(xhr.status)
				}
			}
		}		
	})
}

ajax.post = function(url,data){
	//处理数据格式
	var str = "";
	let arr = [];
	for(var k in data){
		arr.push(k+"="+data+[k])
	}
	str = arr.join("&");
	return new Promise((resolve,reject)=>{
		var xhr = new XMLHttpRequest();
		xhr.open("POST",url+"?"+str,true);
		xhr.setRequestHeader("content-type","application/x-www-form-urlencoded")
		xhr.send()
		//监听状态
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if(xhr.status >=200&&xhr.status<300 ||xhr.status==304){
					resolve(xhr.responseText)
				}else{
					reject(xhr.status)
				}
			}
		}		
	})
}
/*
 * 
 * api
 * url:路径
 * data:数据
 * 返回promise\
 * ajax.jsonp("xxx",{xxx})
 * .then(res=>{
 * 		console.log(res)
 * })
 */
ajax.jsonp = function(url,data){
	var str = "";
	let arr = []
	for(var k in data){
		arr.push(k+"="+data[k])
	}
	str = arr.join("&")
	return new Promise((resolve,reject)=>{
		window.callback = function(res){
			resolve(res)
		}
		let sc = document.createElement("script");
		if(str){
			str += "&callback=callback"
		}else{
			str = "&callback=callback"
		}
		sc.src = url+"?"+str;
		document.body.appendChild(sc)
		sc.remove()
	})
}
