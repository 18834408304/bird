let screen = document.querySelector(".screen"); //获取界面
let screenWidth = screen.offsetWidth; //界面的宽
let screenHeight = screen.offsetHeight; //界面的高
let bird = document.querySelector(".bird"); //获取鸟
let birdsize = bird.offsetHeight; //鸟的大小
let birdLeft = bird.offsetLeft; //鸟离屏幕左边的距离
let footer = document.querySelector(".footer"); //获取墙
let footerTop = footer.offsetTop; //墙距顶部对的高度
let footerHeight = footer.offsetHeight; //墙的高度
let birdDropSpeed = 1; //保存鸟掉落的速度
let birdJumpSpeed = -1; //保存鸟上升的速度
let birdJumpmax = 1; //鸟上升的最大高度（倍数）
let guandaoSpeed = -1; //保存管道移动的速度
let guandaoWidth = 30; //管道的宽度
let guandaoProSpe = screenWidth / (Math.abs(guandaoSpeed) / 10); //管道生成的速度
let guandaoGap = 3;

let time1; //保存鸟掉落的定时器
let time2; //保存鸟上升的定时器
let time4; //保存生成管道的定时器
let time5Arr = []; //保存所有管道移动的定时器

let fenshu = document.querySelector(".fenshu");
let totalscore = 0; //游戏总分


//开始游戏		
function start() {
	birdDrop();
	produceguandao();
	setBirdJump();
}
start();

//鸟掉落
function birdDrop() {
	time1 = setInterval(function() {
		isCheckfail();
		bird.style.top = (bird.offsetTop + birdDropSpeed) + "px";
	}, 7);
}

//鸟上升
function birdJump() {
	clearInterval(time1); //停止鸟下降
	clearInterval(time2); //停止上一次鸟的上升
	let oldtop = bird.offsetTop;
	time2 = setInterval(function() {
		let newtop = bird.offsetTop;
		if (birdJumpmax * birdsize <= oldtop - newtop || newtop <= 0) {
			clearInterval(time2); //停止上升
			birdDrop(); //开始下降
		}
		bird.style.top = (bird.offsetTop + birdJumpSpeed) + "px";
	}, 1);

}

//结束游戏
function stop() {
	clearInterval(time1); //清除鸟掉落的定时器
	clearInterval(time4); //停止生成管道
	clearInterval(time2); //停止鸟上升
	/*
	 * 停止所有管道移动
	 * */
	time5Arr.forEach(function(val) {
		clearInterval(val);
	});
	//停止鸟上升
	window.onkeydown = null;
}

//检查游戏是否失败
function isCheckfail() {
	if (bird.offsetTop + birdDropSpeed > footerTop - birdsize) {
		stop();
	} else {
		let arr = document.querySelectorAll("[class*=conduit]");
		arr = Array.from(arr);
		arr.some((val) => {
			if (checkCrash(val)) {
				stop();
				return true;
			}
		});
	}
}

//设置鸟上升
function setBirdJump() {
	//监听键盘按下事件
	window.onkeydown = function(e) {
		if (e.keyCode == 32) {
			birdJump();
		}
	}
}

//生成管道
function createguandao() {
	let guandao1 = document.createElement("div");
	let guandao2 = document.createElement("div");
	guandao1.classList.add("guandao1");
	guandao2.classList.add("guandao2");
	guandaoGap = Math.floor(getRandom(4,7));
	let height1 = getRandom(birdsize * 2, screenHeight - birdsize * (1 + guandaoGap) - footerHeight);
	let height2 = screenHeight - height1 - guandaoGap * birdsize;
	guandao1.style.height = height1 + "px";
	guandao2.style.height = height2 + "px";
	screen.appendChild(guandao1);
	screen.appendChild(guandao2);
	//管道移动
	let time3 = setInterval(function() {
		if (guandao1.offsetLeft + guandaoSpeed <= -guandaoWidth) {
			clearInterval(time3);
			time5Arr.shift();
			screen.removeChild(guandao1);
			screen.removeChild(guandao2);
		}
		isCheckfail();
		if (guandao1.offsetLeft + guandaoWidth < birdLeft) {
			if (!guandao1.classList.contains("isSetScore")) {
				setScore(1);
			}
			guandao1.classList.add("isSetScore")
		}
		if (cheskCrash(guandao1) || cheskCrash(guandao2)) {
			stop();
		}
		guandao1.style.left = (guandao1.offsetLeft + guandaoSpeed) + "px";
		guandao2.style.left = (guandao2.offsetLeft + guandaoSpeed) + "px";
	}, 10);
	time5Arr.push(time3);
}

//生成管道
function produceguandao() {
	createguandao();
	time4 = setInterval(createguandao, guandaoProSpe / 1.5);
}

//生成随机数
function getRandom(start, end) {
	return Math.random() * (end - start) + start;
}

window.onblur = function() {
	stop();
}

//判断是否碰撞
function cheskCrash(guandaoEle) {
	let guandaoTop = guandaoEle.offsetTop; //管道离屏幕顶部的距离
	let guandaoLeft = guandaoEle.offsetLeft; //管道距离界面左边的距离
	let birdTop = bird.offsetTop; //鸟离屏幕顶部的距离
	let guandaoWidth = guandaoEle.offsetWidth; //管道的宽
	let guandaoHeight = guandaoEle.offsetHeight; //管道的高
	let size1 = Math.abs(guandaoLeft - birdLeft); //水平方向的距离
	let size2 = Math.abs(birdTop - guandaoTop); //垂直方向的距离
	let flag1 = birdLeft < guandaoLeft && size1 < birdsize; //如果鸟在管道的左边
	let flag2 = birdLeft >= guandaoLeft && size1 < guandaoWidth; //如果鸟在管道的右边
	let flag3 = birdTop < guandaoTop && size2 < guandaoWidth; //如果鸟在管道的上边
	let flag4 = birdTop >= guandaoTop && size2 < guandaoHeight; //如果鸟在管道的下边
	return (flag1 || flag2) && (flag3 || flag4);
}

//设置分数
function setScore(num) {
	totalscore += num;
	fenshu.innerHTML = totalscore;

}
