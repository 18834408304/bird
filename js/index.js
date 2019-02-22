let screen =document.querySelector(".screen")       //场景
let screenWidth = screen.offsetWidth;               //场景的宽度
let screenHeight = screen.offsetHeight;               //场景的高度
let bird = document.querySelector(".bird");         //鸟
let birdSize = bird.offsetWidth;                    //鸟的大小
let birdLeft = 150;                          //鸟离场景左边的距离
let birdTop = 200;                           //鸟离场景顶部的初始距离
let footer = document.querySelector(".footer");     //底部墙
let footerTop = footer.offsetTop;                   //墙距离顶部的距离
let footerHeight = footer.offsetHeight;               //墙自身的高度
let birdDropSpeed = 1;                              //鸟掉落的速度
let birdJumpSpeed = -1;                              //鸟上升的速度
let conduitSpeed = -1;                              //管道移动的速度
let conduitWidth = 30;                              //管道的宽度
let conduitProSpe = screenWidth/(Math.abs(conduitSpeed)/10);     //管道生成的速度
let conduitGap = 3;
let birdJumpMaxSize = 1;                            //鸟上升最大高度（倍数）
let time1;      //用来保存鸟掉落的定时器
let time2;      //用来保存鸟上升的定时器
let time4;      //用来保存生成管道的定时器
let time5arr = [];     //保存所有管道的数组
let totalScore = 0;      //游戏总分
let scorebox = document.querySelector(".score")
let startBox = document.querySelector(".start")             //获取开始游戏界面的文字提示
let status = 0;            //游戏的状态
let djsBox = document.querySelector(".djs");
 //开始游戏
function start(){
	bird.classList.remove("init");
	bird.style.left = birdLeft+"px";
	bird.style.top = birdTop+"px";
	startBox.style.display = "none";
	scorebox.style.display = "block";
	djsBox.style.display = "block";
	let time6 = setInterval(function(){
		djsBox.innerHTML = parseInt(djsBox.innerHTML)-1;
		if(djsBox.innerHTML==0){
			clearInterval(time6);
			djsBox.style.display = "none";
		}
		birdDrop();
		produceConduit();
		setBirdJump();
		status = 1;
	},1000)
}
start();

//鸟掉落
function birdDrop(){
	time1 = setInterval(function(){
		isCheckfail()
		bird.style.top = (bird.offsetTop+birdDropSpeed)+"px";
	},10)
}

//鸟上升
function birdJump(){
	clearInterval(time1);	//停止鸟下降
	clearInterval(time2);   //停止上一次鸟的上升
	let oldTop = bird.offsetTop;
	time2 = setInterval(function(){
		let newTop = bird.offsetTop;
		if(birdJumpMaxSize*birdSize<=oldTop-newTop||newTop<=0){
			clearInterval(time2);                    //停止上升
			birdDrop();                              //开始下降
		}
		bird.style.top = (bird.offsetTop+birdJumpSpeed)+"px";
	},5)
}

//结束游戏
function stop(){
	status = 2;
	clearInterval(time1)     //清楚鸟掉落的定时器
	clearInterval(time4)     //停止生成管道
	clearInterval(time2)     //停止鸟上升
	time5arr.forEach(function (val) {
			clearInterval(val);
	});                         //停止所有管道移动
	window.onkeydown = null;    //停止鸟上升
	PostbirdAlertBox.alert({
    'title': '提示',
    'content': '游戏得分'+totalScore,
    'okBtn': '好的',
    'contentColor': 'red',
    'onConfirm': function () {
       initGame();
    }
	});
}
//检查游戏是否失败
function isCheckfail(){
	if(bird.offsetTop+birdDropSpeed>footerTop - birdSize){
		stop();
	}else{
		let arr = document.querySelectorAll("[class*=conduit]");
		arr = Array.from(arr);
		arr.some((val)=>{
			if(checkCrash(val)){
				stop();
				return true;
			}
		})
	}
}

//设置鸟上升
function setBirdJump(){
	window.onkeydown = function (e) {
		if(e.keyCode === 32){
			birdJump();
		}
	}
}


//创建管道
function createConduit(){
	let conduit1 = document.createElement("div")
	let conduit2 = document.createElement("div")
	conduit1.classList.add("conduit1");
	conduit2.classList.add("conduit2");
	conduitGap = getRandom(2.5,4);
	let height1= getRandom(birdSize*2,screenHeight-birdSize*(1+conduitGap)-footerHeight)
	let height2= screenHeight-height1-conduitGap*birdSize;
	conduit1.style.height = height1+"px";
	conduit2.style.height = height2+"px";
	screen.appendChild(conduit1)
	screen.appendChild(conduit2)
	//管道移动
	let time3 = setInterval(function(){
		if(conduit1.offsetLeft+conduitSpeed <= -conduitWidth){
			clearInterval(time3);
			time5arr.shift();
			screen.removeChild(conduit1);
			screen.removeChild(conduit2);
		}
		isCheckfail();
		if(conduit1.offsetLeft + conduitWidth < birdLeft){
			if(!conduit1.classList.contains("isSetScore")){
				setScore(1);
			}
			conduit1.classList.add("isSetScore")
		}
		if(checkCrash(conduit1)||checkCrash(conduit2)){
			stop();
		}
		conduit1.style.left = (conduit1.offsetLeft+conduitSpeed)+"px";
		conduit2.style.left = (conduit1.offsetLeft+conduitSpeed)+"px";
	},10)     
	time5arr.push(time3);
}

//生成管道
function produceConduit(){
	createConduit();
	time4 = setInterval(createConduit,conduitProSpe/1.5)
}

//生成随机数
function getRandom(start,end){
	return Math.random()*(end-start)+start
}


//判断是否碰撞
function checkCrash(conduitEle){
	let conduitLeft = conduitEle.offsetLeft;                                         //管道距离场景左边的距离
	let conduitTop = conduitEle.offsetTop;                                           //管道距离场景上边的距离
	let birdTop = bird.offsetTop;                                                    //鸟距离场景上边的距离
	let conduitWidth = conduitEle.offsetWidth;                                       //管道的宽度
	let conduitHeight = conduitEle.offsetHeight;                                     //管道的高度
	let size1 = Math.abs(conduitLeft-birdLeft);                                      //水平方向的距离
	let size2 = Math.abs(conduitTop-birdTop);                                        //垂直方向的距离
	let flag1 = birdLeft < conduitLeft && size1 < birdSize;                          //如果鸟在管道的左边
	let flag2 = birdLeft >= conduitLeft && size1 < conduitWidth;                     //如果鸟在管道的右边
	let flag3 = birdTop < conduitTop && size2 < birdSize;                            //如果鸟在管道的上面
	let flag4 = birdTop >= conduitTop && size2 < conduitHeight;                      //如果鸟在管道的下面
	return (flag1||flag2)&&(flag3||flag4);
}

//设置分数
function setScore(num){
	totalScore+=num;
	scorebox.innerHTML = totalScore;
}
window.onblur = function(){
	if(status = 1){
		stop();
	}
}

//初始化游戏
function initGame(){
	status = 3;
	bird.classList.add("init");
	startBox.style.display = "block";
	scorebox.style.display = "none";
	document.querySelectorAll("[class*='conduit']").forEach((val)=>{
		screen.removeChild(val);
	})
	totalScore = 0;
	djsBox.style.display = "none";
	scorebox.innerHTML = totalScore;
	window.onkeydown = function(){
		start();
	}
}
initGame()

//倒计时
