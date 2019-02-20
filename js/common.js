/*! 一叶孤舟 | qq:28701884 | 欢迎交流 */

var com = com||{};

com.init = function (){

	com.nowStype= "stype";
	var stype = com.stype[com.nowStype];
	com.width			=	stype.width;		//画布宽度
	com.height			=	stype.height; 		//画布高度
	com.spaceX			=	stype.spaceX;		//着点X跨度
	com.spaceY			=	stype.spaceY;		//着点Y跨度
	com.pointStartX		=	stype.pointStartX;	//第一个着点X坐标;
	com.pointStartY		=	stype.pointStartY;	//第一个着点Y坐标;
	com.page			=	stype.page;			//图片目录

	com.canvas			=	document.getElementById("wuzi"); //画布
	com.ct				=	com.canvas.getContext("2d") ;
	com.canvas.width	=	com.width;
	com.canvas.height	=	com.height;

	com.childList		=	com.childList||[];

	com.loadImages(com.page);					//载入图片/图片目录
}

//样式
com.stype = {
	stype1:{
		width:537,			//画布宽度
		height:539, 		//画布高度
		spaceX:35,			//着点X跨度
		spaceY:35,			//着点Y跨度
		pointStartX:-2,		//第一个着点X坐标;
		pointStartY:0,		//第一个着点Y坐标;
		page:"stype"		//图片目录
	},
	stype:{
		width:620,			//画布宽度
		height:570, 		//画布高度
		spaceX:36,			//着点X跨度
		spaceY:36,			//着点Y跨度
		pointStartX:26,		//第一个着点X坐标;
		pointStartY:2,		//第一个着点Y坐标;
		page:"stype"		//图片目录
	}
}

//获取ID
com.get = function (id){
	return document.getElementById(id)
}

window.onload = function(){
	com.bg=new com.class.Bg();
	com.pane=new com.class.Pane();
	com.pane.isShow=false;

	com.childList = [ com.bg,com.pane ];
	com.bg.show();
	com.get("wuziBox").style.display = "none";
	com.get("playBtn").addEventListener("click", function(e) {
			var val = parseInt(getRadioValue("depth"), 10) || 0;
			play.depth = 1;

			play.arg = [
				{ random:-60, timer:100 ,pur:5 ,rank:"菜鸟水平"},
				{ random:3,  timer:300 ,pur:5,rank:"中级水平"},
				{ random:2,  timer:1000 ,pur:14,rank:"高手水平"},
			][val]


			com.get("menuInit").style.display = "none";
			com.get("wuziBox").style.display = "block";
			play.init();

			var offens = parseInt(getRadioValue("offens"), 10) || 0;
			if (offens){
				play.isOffense = false;
				play.AIPlay(0,0,{x:Math.floor(Math.random() * 3)+6,y:Math.floor(Math.random() * 3)+6})
			}

	})
	//重新开始棋局
	com.get("restartBtn").addEventListener("click", function(e) {
		if (confirm("是否确定要重新开始？")){
			com.get("menuInit").style.display = "block";
			com.get("wuziBox").style.display = "none";
		}
	})
		// 悔棋
	com.get("regretBtn").addEventListener("click", function(e) {
		play.regret();
	})
	//获取单选框选择的值
	function getRadioValue (name){
		var obj = document.getElementsByName(name);
		for(var i=0; i<obj.length; i ++){
			if(obj[i].checked){
				return obj[i].value;
			}
		}
	}
}

//载入图片
com.loadImages = function(stype){

	//绘制棋盘
	com.bgImg = new Image();
	com.bgImg.src  = "img/"+stype+"/bg.png";

	//棋子
	com.AImg = new Image();
	com.AImg.src = "img/"+stype+"/A.png";

	com.BImg = new Image();
	com.BImg.src = "img/"+stype+"/B.png";

	//棋子外框
	com.paneImg = new Image();
	com.paneImg.src  = "img/"+stype+"/pane.png";

}

//显示列表
com.show = function (){
	com.ct.clearRect(0, 0, com.width, com.height);
	for (var i=0; i<com.childList.length ; i++){
		com.childList[i].show();
	}
}

//显示移动的棋子外框
com.showPane  = function (x,y){
	com.pane.isShow=true;
	com.pane.x= x ;
	com.pane.y= y ;
}

//debug alert
com.alert = function (obj,f,n){
	if (typeof obj !== "object") {
		try{console.log(obj)} catch (e){}
		if (!f) return alert(obj);
	}
	var arr = [];
	for (var i in obj) arr.push(i+" = "+obj[i]);
	try{console.log(arr.join(n||"\n"))} catch (e){}
	if (!f) return alert(arr.join(n||"\n\r"));
}

//com.alert的简写，考虑z变量名最不常用
var z = com.alert;
var l = console.log;



com.class = com.class || {} //类
com.class.Man = function ( x, y ,my ,isOffense){
	this.x = x||0;
    this.y = y||0;
	this.mans=[];
	this.my = my || 1;

	this.show = function (){
			com.ct.save();
			var img= (isOffense) ? com.AImg :com.BImg;
			com.ct.drawImage(img, com.spaceX * this.x + com.pointStartX+10 , com.spaceY *  this.y +com.pointStartY+10);
			com.ct.restore();
	}

	this.value = function (map){
		var map = map || play.map
		return com.value(this.x,this.y,map,this.my)
	}
}

com.class.Bg = function (img, x, y){
	this.x = x||0;
    this.y = y||0;
	this.isShow = true;
	this.show = function (){
		if (this.isShow) com.ct.drawImage(com.bgImg, com.spaceX * this.x,com.spaceY *  this.y);
	}
}
com.class.Pane = function (img, x, y){
	this.x = x||0;
    this.y = y||0;
	this.isShow = true;

	this.show = function (){
		if (this.isShow) {
			com.ct.drawImage(com.paneImg, com.spaceX * this.x + com.pointStartX+9, com.spaceY *  this.y + com.pointStartY+9)
		}
	}
}
com.init();
