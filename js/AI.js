/*! 一叶孤舟 | qq:28701884 | 欢迎交流 */

//人工智能初始化
(function() {
	
	var AI = function (map, depth, my, x, y ,arg){
		return init(map, depth, my, x, y ,arg);
	}
	var count=0, depth , arg;
	
	var init = function(map, _depth, my, x, y, _arg){
		//test(getValue)
		//return 
		depth = _depth;
		arg = _arg;
		//人工智能开始运作
		var initTime = new Date().getTime();
		var results = getAlphaBeta(-999999 ,999999, depth, map, my, x, y);
		var runTime= new Date().getTime() - initTime;
		console.log('等级：'+arg.rank
					+'\r搜索分支：'+ count +'个'
					+'\r最佳着法：X'+results.x+' Y'+results.y
					+'\r最佳着法评估：'+results.value+'分'
					+'\r搜索用时：'+runTime+'毫秒'
		);
		return { x : results.x, y : results.y }
	}
	
	//A:当前棋手value/B:对手value/depth：层级
	var getAlphaBeta = function (A, B, _depth, map , my, x , y) {
		if (_depth == 0) {
			//到最底层的时候评估这个走法
			count ++;
			return {"value":evaluate(map, my, x, y)}; //局面评价函数; 
	　	}
	　	var moves = getMoves(map, x, y); //生成全部走法; 
	　	//这里排序以后会增加效率,暂时没排序，后面实现
		for (var i=0; i < moves.length; i++) {
			var move= moves[i];
			var y=move.y;
			var x=move.x;
			//走这个走法;
			map [y] [x] = my;
		　　var val = - getAlphaBeta(-B, -A, _depth - 1, map , -my, x , y).value; 
		　　//撤消这个走法;　 
			map [y] [x] = 0;
			//剪裁分支
		　　if (val >= B) { 
				return { "x":x, "y":y, "value":B }; 
			}
			//设置最佳走法
			if (val > A) {
		　　　　A = val;
				if ( depth == _depth ) var rootKey={ "x":x, "y":y, "value":A };
			}
	　	} 
		if ( depth == _depth ) {//已经递归回根了
			if (!rootKey){
				//AI没有最佳走法，说明已经无处可走，返回false
				return false;
			}else{
				//这个就是最佳走法;
				return rootKey;
			}
		}
		return { "x":x, "y":y, "value":val }; 
	}
	//取得棋盘上所有棋子
	var getMoves = function (map, x, y){
		var pur = arg.pur; //搜索范围
		var moves = [];
		var minX = x - pur;
		if (minX < 0) minX = 0;
		
		var maxX = x + pur;
		if ( maxX > 14 ) maxX = 14;
		
		var minY = y - pur;
		if (minY < 0) minY = 0;
		
		var maxY = y + pur;
		if ( maxY > 14 ) maxY = 14;
		var val,x,y
		for (var i=minY; i<=maxY; i++){
			for (var n=minX; n<=maxX; n++){
				var m = map[i][n];
				if (m===0) {
					moves.push({ x:n, y:i })
				}
			}
		}
		return moves;
	}
	var evaluate = function ( map, my, x, y ){
		var val = getValue( map, my, x, y );
		val += getValue( map, -my, x, y );
		return  val * -my;
	}

	var getValue = function ( map, my, x, y ){
		var val = Math.floor(Math.random() * arg.random);  //让AI走棋增加随机元素
		var pur = arg.pur;
		var len = 15;
		//评估棋局 根据棋子形态得到value
		var value ={
			11:1 ,//一边被拦截的单子
			12:2 ,//两边均不被拦截的单子
			
			21:10 ,//一边被拦截的二子连珠
			22:20 ,//两边均不被拦截的二子连珠
			
			31:30 ,//一边被拦截的三字连珠
			32:50 ,//两边均不被拦截的三字连珠
			
			41:60 ,//一边被拦截的四子连珠
			42:100,//即构成两边均不被拦截的四子连珠。
			
			50:88888,// 成5：即构成五子连珠
			51:88888,// 成5：即构成五子连珠
			52:88888// 成5：即构成五子连珠
		}
		//左方向
		var A = {};
		A.n = 1;
		A.v = 0;
		//len = (x - pur > 0) ? pur : x;
		for (var i = 1; i <= len; i++){
			var _x = x - i;
			if (!dis( _x , y, my)) break;
		}
		//右方向
		//len = (x + pur < 14) ? pur : 14 - x;
		for (var i = 1; i < len; i++){
			var _x = x + i;
			if (!dis( _x, y, my) ) break;
		}
		if ( A.n > 5 ) A.n = 5 ;
		val += value [A.n * 10 + A.v] || 0;
		
		//上
		A.n = 1;
		A.v = 0;
		//len = (y + 1 - pur >= 0) ? pur : y;
		for (var i = 1; i < len; i++){
			var _y = y - i;
			//l(x, _y)
			if (!dis(x, _y ,my)) break;
		}
		//下
		//len = (y - 1 + pur <= 14) ? pur : 14 - y;
		for (var i = 1; i < len; i++){
			var _y = y + i;
			if (!dis(x, _y ,my)) break;
		}
		if ( A.n > 5 ) A.n = 5 ;
		val += value [A.n * 10 + A.v] || 0;
		//左上
		A.n = 1;
		A.v = 0;
		//len = (x + 1 - pur > 0) ? pur : x;
		//len = (y + 1 - len > 0) ? len : y;
		for (var i = 1; i < len; i++){
			var _x = x - i;
			var _y = y - i;
			if (!dis(_x, _y ,my)) break;
		}
		//右下
		//len = (x + pur < 14) ? pur : 14 - x;
		//len = (y + len < 14) ? len : 14 - y;
		for (var i = 1; i < len; i++){
			var _x = x + i;
			var _y = y + i;
			if (!dis(_x, _y ,my)) break;
		}
		if ( A.n > 5 ) A.n = 5 ;
		val += value [A.n * 10 + A.v] || 0;
		
		//右上
		A.n = 1;
		A.v = 0;
		//len = (x + pur < 14) ? pur : 14 - x;
		//len = (y  + 1 - len >= 0) ? len : y +1;
		for (var i = 1; i < len; i++){
			var _x = x + i;
			var _y = y - i;
			if (!dis(_x, _y ,my)) break;
		}
		
		//左下
		//len = (x + 1 - pur >= 0) ? pur : x;
		//len = (y + len < 14) ? len : 14 - y +1;
		for (var i = 1; i < len; i++){
			var _x = x - i;
			var _y = y + i;
			if (!dis(_x, _y ,my)) break;
		}
		if ( A.n > 5 ) A.n = 5 ;
		val += value [A.n * 10 + A.v] || 0;
		return  val;
		
		function dis(x, y, my){
			if (x < 0 || x >14 || y < 0 || y >14){
				return false;
			}
			m = map[ y ][ x ];
			if ( m == my){
				A.n ++;
				//p(x, y)
				return true	
			}else {
				if( m === 0) A.v++;
				return false;
			}
		}
	}
	window.AI = AI;
})();