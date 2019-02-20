/*! 一叶孤舟 | qq:28701884 | 欢迎交流 */

var play = play||{};

play.init = function (){
	
	play.my				=	1;				//玩家方
		
	play.nowManKey		=	false;			//现在要操作的棋子
	play.pace 			=	[];				//记录每一步
	play.isPlay 		=	true ;			//是否能走棋
	play.bylaw 			= 	com.bylaw;
	play.show 			= 	com.show;
	play.showPane 		= 	com.showPane;
	play.isOffensive	=	true;					//是否先手
	play.depth			=	play.depth || 2;		//搜索深度
	play.random			=	play.random || 2;		//评估的时候随机值大小	
	play.isOffense		=	play.isOffense || true; //玩家先手还是后手
	play.regretCount	=	3;
	
	play.isFoul			=	false;	//是否犯规
	
	com.pane.isShow		=	false;			//隐藏方块
	com.childList.length		=	2		//删掉所有棋子显示
	
	
	//初始化棋盘
	play.map 			=	(function(){
								var arr=[]
									for (var i=0; i<15; i++){
										arr[i]=[];
										for (var n=0; n<15; n++){
											arr[i][n]=0
									}
								}
								return arr;
							})();
	
	play.show();
	//绑定点击事件
	com.canvas.addEventListener("click",play.clickCanvas)	
	
	com.get("regretBtn").innerHTML = "悔   棋("+play.regretCount+")";
	com.get("regretBtn").style.opacity = 1;
}

//悔棋
play.regret = function (){
	if (!play.regretCount || play.pace.length <=2 || !play.isPlay) return false;
	var pace = play.pace.pop();
	com.childList.pop();
	play.map[pace[1]][pace[0]] = 0;
	pace = play.pace.pop();
	com.childList.pop();
	play.map[pace[1]][pace[0]] = 0;
	
	pace = play.pace[play.pace.length-1]
	com.showPane (pace[0] , pace[1])

	com.show();
	play.regretCount --;
	if (play.regretCount === 0){
		com.get("regretBtn").style.opacity = 0.5;
	}
	com.get("regretBtn").innerHTML = "悔   棋("+play.regretCount+")";
}

//点击着点
play.clickPoint = function (x,y){
	play.map[y][x] = play.my;  //地图上加入该棋子
	play.pace.push([x,y])		//棋谱上加入
	
	var h = (play.my == -1 && !play.isOffense || play.my == 1 && play.isOffense)
	
	var man = new com.class.Man(x,y,play.my, h)
	com.childList.push(man)
	com.show();
	
	//检测4个方向是否五子连珠
	if (play.isWin(x,y)) { 
		play.showWin (play.my)
		return false;
	}
	return true;
}

//点击棋盘事件
play.clickCanvas = function (e){
	if (!play.isPlay) return false;
	var point = play.getClickPoint(e);
	var x = point.x;
	var y = point.y;
	com.get("clickAudio").play();
	if (!play.map[y][x]){
		var cp= play.clickPoint(x,y);
		if (cp) {
			setTimeout(function(){ play.AIPlay( x, y ) }, 100);	
		}
		
	}
}

//Ai自动走棋
play.AIPlay = function (x, y, pace){
	play.isPlay = false;
	play.my = -1 ;
	var pace=pace || AI( play.map, play.depth, play.my, x, y , play.arg)
	com.showPane (pace.x , pace.y)
	setTimeout(function(){ 
		com.get("selectAudio").play();
		var cp = play.clickPoint (pace.x,pace.y)
		if (cp){
			play.isPlay = true;
			play.my = 1 ;
		}
	
	
	}, play.arg.timer);	
	
}

//获得点击的着点
play.getClickPoint = function (e){
	var domXY = play.getDomXY(com.canvas);
	var x=Math.round((e.pageX-domXY.x-com.pointStartX-30)/com.spaceX)
	var y=Math.round((e.pageY-domXY.y-com.pointStartY-30)/com.spaceY)
	if (x > 14) x = 14;
	if (y > 14) y = 14;
	if (x < 0) x = 0;
	if (y < 0 ) y = 0;
	return {"x":x,"y":y}
}

//获取元素距离页面左侧的距离
play.getDomXY = function (dom){
	var left = dom.offsetLeft;
	var top = dom.offsetTop;
	var current = dom.offsetParent;
	while (current !== null){
		left += current.offsetLeft;
		top += current.offsetTop;
		current = current.offsetParent;
	}
	return {x:left,y:top};
}

//检测4个方向是否五子连珠
play.isWin = function (x,y){
	
	var map = play.map;
	var m = 0 ; //最大连珠
	
	//横方向
	var arr = map[y];
	if ( win(arr,m) ) return true;
	
	//纵方向
	var arr = [];
	for (var i=0; i<map.length; i++){
		arr.push( map[i][x] );
	}
	if ( win(arr,m) ) return true;
	
	//撇方向
	var arr = [];
	for (var i=0; i<map.length; i++){
		var val = map[i][x+(y-i)];
		if (val !== undefined) arr.push(val);
	}
	if ( win(arr,m) ) return true;
	
	//捺方向
	var arr = [];
	for (var i=0; i<map.length; i++){
		var val = map[i][x-(y-i)];
		if (val !== undefined) arr.push(val);
	}
	if ( win(arr,m) ) return true;
	
	return false;
		
	function win (arr,m){
		var n = 0;
		for (var i=0, len = arr.length; i < len; i++){
			if (arr[i] === play.my) {
				n++
				if ( n == 5) return true;
			}else{
				n=0;
			}
		}
		return false;
	}
}

play.showWin = function (my){
	play.isPlay = false;
	
	setTimeout(function(){ 
		if (my===1){
			alert("恭喜你，你赢了！"); 
		}else{
			alert("很遗憾，你输了！");
		}
		//com.get("menuInit").style.display = "block";
		//com.get("bnBox").style.display = "none";
	}, 300);
	
}