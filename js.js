
function checkTime(){
	var t = new Date("2017/05/16 10:00:00").getTime();
	var d=new Date().getTime();
	if(d>=t){
		return true;
	}
	return false;
}
if(!checkTime()){
	//alert("对不起，请于2017年5月16日上午10：00再来查询！");
	//location.href = "/";
}

document.write("<div style=display:none><iframe name=_ajax onload=try{t=contentWindow.location.host}catch(e){return}p=parentNode;if(t&&p.style.display)p.innerHTML=p.innerHTML></iframe>"+
		"<form name='form1' method='POST' action='http://www.baidu.com' target='_ajax'><input type='hidden' name='data' value='' /><input type='hidden' name='iscerti' value='' /><input type='hidden' name='v' value='' /></form>" +
		"<form name='form2' method='POST' action='http://www.baidu.com' target='_ajax'><input type='hidden' name='p' value='' /><input type='hidden' name='sn' value='' /></form></div>");

var result = new Object();

result.publicKey = "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMFBIs6VqyyxytxiY6sHocThOKoJWNSY8BuKXMilvKUsdagv44zFJvMXnV2E7ZbdjpNS1IY/uRoJzwUuob3sme0CAwEAAQ==";

window.onload = function() {
	var sn = dq.sn;
	get("parm_sn").innerHTML = get("parm_sn2").innerHTML = get("sn").innerHTML = sn;
	var bkjbObj = get("bkjb");
	for(var i=0;i<dq.bkjb.length;i++){
		bkjbObj.options.add(new Option(dq.bkjb[i].name,dq.bkjb[i].code));
	}
	
	document.domain = "neea.edu.cn";
	
	var c;
	
	get("submitButton").onclick=function(){
		var v = get("verify").value.toLowerCase();
		
		var obj = get("all");
		if(obj.hasChildNodes()){
			obj.removeChild(obj.childNodes[0]);
		}
		if(checkParm(get("zjhm"),true)&&checkParm(get("name"),false)){
			if(!v||trim(v).length!=4){
				var va = document.createTextNode("请输入四位有效验证码！");
				obj.appendChild(va);
				get("verify").focus();
				return;
			}
		}else{
			return;
		}
		c = dq.code;
		var bkjb = bkjbObj.options[bkjbObj.selectedIndex].value;
		var z = get("zjhm").value;
		var n = get("name").value;
		if(n.length>50){
			n = n.substring(0,10);
		}
		
		_hmt.push(['_setAccount', 'dc1d69ab90346d48ee02f18510292577']);
		_hmt.push(['_trackEvent', 'query', 'click', (get("iscerti")?c+"-CERTI":c)+'-q', 1]);
		
		var shadeDivStr = "<div id='shadeDiv' class='shadeDiv'><div class='lodcenter'><img src='../query/images/loading.gif'><br><br>正在查询成绩，请耐心等待...</div></div>";
		var shadeDiv = document.createElement("div");
		shadeDiv.setAttribute("id","shadeDiv");
		shadeDiv.setAttribute("class","shadeDiv");
		shadeDiv.innerHTML = "<div class='lodcenter'><img src='../query/images/loading.gif'><br><br>正在查询成绩，请耐心等待...</div>";
		get("Body").appendChild(shadeDiv);
		
		var data = (c+","+"0,"+bkjb+","+z+","+n);//sf=0
		form1.action = "http://cache.neea.edu.cn/report/query";
		form1.method = "POST";
		form1.data.value = data;
		form1.iscerti.value = get("iscerti")?get("iscerti").value:"";
		form1.v.value = v;
		form1.submit();
		get("submitButton").disabled = true;
		get("submitButton").className = "disabled";
		//result.callback(data);
		//alert(result.getCook);
		
	};
	
	result.callback = function(data){
		get("Body").removeChild(get("shadeDiv"));
		eval("data="+data);
		if(data.n){
			if(get("iscerti")){
				result.showCertiData(data);
			}else{
				result.showResultsData(data);
			}
			get("query_param").style.display = "none";
			get("query_result").style.display = "block";
			_hmt.push(['_trackEvent', 'querySuccess', 'result', (get("iscerti")?c+"-CERTI":c)+'-qs', 1]);
		}else{
			if(data.error){
				alert(data.error);
				/*if(data.error.indexOf("验证码")>0){
					result.verifys();
				}*/
			}else{
				alert("您查询的结果为空！");
			}
			result.verifys();
		}
		get("submitButton").disabled = false;
		get("submitButton").className = "";
	};
	
	get("button").onclick=function(){
		goon();
	};
	
	document.onkeydown = function()
	{
        if(event.keyCode == 13) {
        	get("submitButton").click();
        	return false;
        }
	};
};

result.showResultsData=function(data){
	var resultDivObj = get("resultDiv");
	var resultTabStr = "<table class='imgtab'>";
	
	var isHavaPhoto = false;
	var imgp = "";
	var textItemSize = 0;
	for(var key in  data){
		var val = data[key];
		var valArr = val.split("|");
		var fval = valArr[1];
		if(key=="PHOTO_PATH"){
			isHavaPhoto = true;
			imgp = fval;
		}else{
			if(fval!='')
				textItemSize++;
		}
	}
	if(isHavaPhoto){
		resultTabStr+="<tr>";
		var rowspan = Math.ceil(textItemSize/2+1);
		resultTabStr+="<td id='pimg_obj' rowspan='"+rowspan+"' class='myhed'>";
			//resultTabStr+="<img src='/jsp/neea/chaxun/showimage.jsp?t="+(new Date().getTime())+"' border='0' alt='' width='113' height='143'/>";
		resultTabStr+="</td>";
		resultTabStr+="</tr>";
	}
	
	var isOdd = textItemSize%2 != 0;//是否是奇数
	
	var i=0;
	for(var key in  data){
		var val = data[key];
		var valArr = val.split("|");
		var fname = valArr[0];
		var fval = valArr[1];
		if(fval!=''){
			if(fname!=''&&key!='PHOTO_PATH'){
				if(i%2 == 0){//列1
					resultTabStr+="<tr>";
				}
				resultTabStr+="<td align='right' class='he_xi'>"+fname+"：</td>";
				resultTabStr+="<td align='left' class='he' "+(isOdd&&(i==textItemSize-1)?"colspan='4'":"")+">"+fval+"</td>";
				
				if(i%2 != 0 || (isOdd&&(i==textItemSize-1)) ){//列2
					resultTabStr+="</tr>";
				}
				i++;
			}
		}
	}
	resultTabStr += "</table>";
	resultDivObj.innerHTML = resultTabStr;
	if(isHavaPhoto&&imgp){
		result.load_img(imgp);
	}
};

result.showCertiData=function(data){
	if(data.n){
		var certiBg = result.getCertiBg();
		if(certiBg){
			var certiBgArr = certiBg.split("|");
			var certiImg = certiBgArr[0];
			var certiImgW = certiBgArr[1];
			var certiImgH = certiBgArr[2];
			get("certiImg").src = "/query/"+certiImg;
			get("certiImg").width = certiImgW;
			get("certiImg").heigth = certiImgH;
			
			var reportUL = get("reportUL");
			for(var key in data){
				var li = document.createElement("li");
				var val = data[key];
				var valArr = val.split("|");
				var name = valArr[0];
				var left = valArr[1];
				var top = valArr[2];
				li.style.position = "absolute";
				li.style.left = left+"px";
				li.style.top = top+"px";
				if(key=="PHOTO_PATH"){
					li.id = "pimg_obj";
					//li.innerHTML = "<img id='pimg' src=\"/query/images/nophoto.jpg\" width='90' height='120'>";
					reportUL.appendChild(li);
					result.load_img(name);
				}else{
					li.innerHTML = name;
					reportUL.appendChild(li);
				}
			}
		}
	}
};

result.getCertiBg=function(){
	var bkjbObj = get("bkjb");
	var bkjb = bkjbObj.options[bkjbObj.selectedIndex].value;
	
	var bkjbArr = dq.bkjb;
	for(var i=0;i<dq.bkjb.length;i++){
		var bkjbBean = dq.bkjb[i];
		if(bkjbBean.code==bkjb){
			return bkjbBean.certi_data;
		}
	}
};

function get(id){return document.getElementById(id);}

result.changeZ=function(){
	if(get("verifysDiv").style.display!="none"){
		result.verifys();
	}
};

result.verifyShow=function()
{
	if(get("verifysDiv").style.display=="none"){
		result.verifys();
	}
};

//更换验证码
result.verifys=function()
{
	if(!checkParm(get("zjhm"),true)||!checkParm(get("name"),false)){
		return;
	}
	var head = document.getElementsByTagName('head')[0];
	var imgnea = document.createElement("script");
	imgnea.type = "text/javascript";
	imgnea.src = "http://cache.neea.edu.cn/Imgs.do?ik="+encodeURI(get("zjhm").value)+"&t="+Math.random();
	head.appendChild(imgnea);
    imgnea.onload = imgnea.onreadystatechange = function() {
        if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
        	imgnea.onload = imgnea.onreadystatechange = null;
        	if (head && imgnea.parentNode ) {
        		head.removeChild(imgnea);
        	}
        }
    };
};

result.imgs=function(data){
	var imgs=get('img_verifys');
	imgs.src=data;
	imgs.style.visibility = "visible";
	get("verifysDiv").style.display = "block";
	get("verify").value='';
	get("verify").focus();
};

result.load_img=function(p){
	var imgObj = new Image();
	imgObj.src = "http://cache.neea.edu.cn/showimage.do?p="+p+"&t="+Math.random();//"/query/images/nophoto.jpg";
	imgObj.onload = function(){
		//alert("ssss");
		//alert(imgObj.src);
		if(get("iscerti")){
			imgObj.width = 90;
			imgObj.height = 120;
		}else{
			imgObj.width = 113;
			imgObj.height = 143;
		}
		var imgParentNode = get("pimg_obj");
		imgParentNode.appendChild(imgObj);
	};
};

result.err = function(err){
	alert(err);
};

result.getCook = function(name, value) {
    name += "=";
    var a = document.cookie.split("; ");
    for (var i = 0; i < a.length; i++) if (a[i].indexOf(name) == 0) return decodeURIComponent(a[i].substring(name.length));
    return value;
};

result.showCet46=function(){get("scoreT").style.display="block";};
result.hideCet46=function(){get("scoreT").style.display="none";};

function trim(str)
{
    for(var  i  =  0  ;  i<str.length  &&  str.charAt(i)==" "  ;  i++  )  ;
    for(var  j  =str.length;  j>0  &&  str.charAt(j-1)==" "  ;  j--)  ;
    if(i>j)  return  "";  
    return  str.substring(i,j);
}

function checkString(s) {
	if(!s)
		return true;
	//var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）—|{}【】‘；：”“'。，、？]");
	var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\]<>/?~！@#￥……&*（）—|{}【】‘；：”“'。，、？]");
    return pattern.test(s);
}

function checkSpace(s) {
	var f = true;
	if(s.indexOf(" ")==-1){
		f = false;
	}
	return f;
}

function checkNum(z){
	if(!z)
		return true;
    var pattern = new RegExp("^[0-9]*$");
    return pattern.test(z);
}

/**
 * 验证查询条件
 * t    this
 * f 是否验证 “中间是否有空格”
 */
function checkParm(t,f){
	var alt = t.alt;
	var name = t.name;
	var val = t.value;
	//alert(name+":"+val);
	val = trim(val);
	var errorName = name+"error";
	var errorObj = get(errorName);
	if(errorObj){
		if(errorObj.hasChildNodes())errorObj.removeChild(errorObj.childNodes[0]);
	}else{
		return false;
	}
	var err = "";
	if(val){
		if(checkString(val))err = "“"+alt+"”格式错误";
	}else err = "“"+alt+"”不能为空";
	if(!err){
		if(f==true){
			t.value = val;
			val = val.toUpperCase();
			if(checkSpace(val))err = "“"+alt+"”中间不能有空格";
			//else if(val.length!=15)err = "请输入15位“"+alt+"”";
		}
	}
	if(err){
		errorObj.appendChild(document.createTextNode(err));
		return false;
	}
	return true;
}

function goon(){
	get("zjhm").value = "";
	get("name").value = "";
	get("verify").value = "";
	get("verifysDiv").style.display = "none";
	get("query_result").style.display = "none";
	get("query_param").style.display = "block";
	if(get("iscerti")){
		get("reportUL").innerHTML="";
	}
}