console.log("in scripts");

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

//declaring variables for game
let ballX = [];
let ballY = [];
let dx = [];
let dy = [];
let numLemons = 1 + (Math.random() * (10)); //amount of lemons
let paddleX = canvas.width / 2;
let paddleWidth = 300;
let paddleHeight = 10;
let pX = 40;
let score = 0;
let level = 1;
let gameOn = false;
let pressed = false;
let playGameMessage = "Press any key to Play";
let playGameMessage2 = "";
let playGameMessage3 = "";
let song = 0;
let firstRun = true;
let pause = false;
let dark = false;
let light = true;

//array for lemon images
let multipleLemons = []; //array to store images
let imgFiles = ["lemon.png","lime.png","red.png",
				"orange.png","purple.png","blue.png",
				"teal.png","beige.png","green.png","pink.png"];

//audio
var b = document.getElementById("myAudio"); //bottom sound
var p = document.getElementById("myAudio2"); //paddle sound
var r = document.getElementById("myAudio3"); //right sound
var t = document.getElementById("myAudio4"); //top sound

var s1 = document.getElementById("myAudio5"); // lemon tree song
var s2 = document.getElementById("myAudio6"); // the lemon song
var s3 = document.getElementById("myAudio7"); // lemon crush song

// Variables for splashScreen
let splashScreenOn = true;
let srcX = 0;
let srcY = 0;
let x = 0;
let y = 0;
let row = 0;
let spriteWidth = 500;
let spriteHeight = 500;
let splashScreenImg = new Image();  
splashScreenImg.src = 'splash2.png';

document.addEventListener("keydown", keyDownHandler, false);

document.getElementById("myCanvas").addEventListener("touchstart", touchFunc);

//buttons
document.getElementById("previousButton").addEventListener("click", Previous, false);
document.getElementById('nextButton').addEventListener('click', Next, false);
document.getElementById("pauseButton").addEventListener("click", Pause, false);
document.getElementById("playButton").addEventListener("click", Play, false);
document.getElementById("darkButton").addEventListener("click", Dark, false);
document.getElementById("lightButton").addEventListener("click", Light, false);
document.getElementById('speedButton').addEventListener('click', Speed, false);

//hides the next and previous buttons at the start of the game
document.getElementById("previousButton").style.display ='none';
document.getElementById('nextButton').style.display ='none';
document.getElementById("pauseButton").style.display ='none';
document.getElementById('darkButton').style.display ='none';
document.getElementById('lightButton').style.display ='none';
document.getElementById("playButton").style.display ='none';
document.getElementById('speedButton').style.display ='none';

 // load all the lemon images
for (let index = 0; index < 10; index++){
  multipleLemons[index] = new Image();
  multipleLemons[index].src = imgFiles[index];
}

//creates the lemon ball 
let img = new Image(); // Create new img element
img.src = 'lemon.png'; // Set source path
img.addEventListener('load', startGame);

//creates the lime ball 
let img2 = new Image(); // Create new img element
img2.src = 'lime.png'; // Set source path
img2.addEventListener('load', startGame);

//song player NEXT
function Next() {
	if (song == 0) {
		song++;
		s1.pause();
		s2.play();
		document.getElementById("song").innerHTML = "You're Listening to :" + "<br/>" + "The Lemon Song".bold() + "<br/>" + " by Led Zeppelin";
		
	} else if (song == 1) {
		song++;
		s2.pause();
		s3.play();
		document.getElementById("song").innerHTML = "You're Listening to : " +  "<br/>" + "Lemon Crush".bold() +  "<br/>" + " by Prince";
		
	} else if (song == 2) {
		song = 0;
		s3.pause();
		s1.play();
		document.getElementById("song").innerHTML = "You're Listening to : " + "<br/>" + "Lemon Tree".bold() + "<br/>" + " by Peter, Paul & Mary";
	}
}

//song player PREVIOUS
function Previous() {
	if (song == 0) {
		song = 2;
		s1.pause();
		s3.play();
		document.getElementById("song").innerHTML = "You're Listening to : " +  "<br/>" + "Lemon Crush".bold() +  "<br/>" + " by Prince";
		
	} else if (song == 1) {
		song--;
		s2.pause();
		s1.play();
		document.getElementById("song").innerHTML = "You're Listening to : " + "<br/>" + "Lemon Tree".bold() + "<br/>" + " by Peter, Paul & Mary";
		
	} else if (song == 2) {
		song--;
		s3.pause();
		s2.play();
		document.getElementById("song").innerHTML = "You're Listening to :" + "<br/>" + "The Lemon Song".bold() + "<br/>" + " by Led Zeppelin";
		
	}
}


function touchFunc(event) {
  let x = event.touches[0].clientX;
  let y = event.touches[0].clientY;
  document.getElementById("demo").innerHTML = x + ", " + y;
  if (x>150) {
        paddleX = paddleX + pX;
    } else {
        paddleX = paddleX - pX;
  }   
}

//starts the game
function startGame() {
	console.log("in startgame");
    myTimer = setInterval(gameLoop, 16);
}

//runs the game on a loop until the game is lost
function gameLoop() {
	if(splashScreenOn) {
		displaySplashScreen();
	} 
    	if (gameOn == true) {
        		gameUpdate();
        		gameDraw();
			if (firstRun){
				s1.play();
				document.getElementById("song").innerHTML = "You're Listening to : " + "<br/>" + "Lemon Tree".bold() + "<br/>" + " by Peter, Paul & Mary";
				firstRun = false;
			}
	}
		if(splashScreenOn==false && gameOn==false){
        	gameDraw();	
   }
}

//draws the game
function gameDraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	for (let index = 0; index < numLemons; index++){
    	ctx.drawImage(multipleLemons[index], ballX[index], ballY[index]);
	}
	
	//allow light mode colour changes
	if (light == true) {
		//score and level text & style
		ctx.fillStyle = "#A790E8"; //purple
		ctx.font = "20px Comic Sans MS";
		ctx.fillText("Score: " + score, 10, 50);
		ctx.font = "20px Comic Sans MS";
		ctx.fillText("Level: " + level, 10, 80);

		//paddle style
		ctx.fillStyle = "#FFABCF"; //pink
		ctx.fillRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);

		//end of game style
		ctx.fillStyle = "#FFABCF"; //pink
		ctx.font = "30px Comic Sans MS";
		ctx.textAlign="center";
		ctx.fillText(playGameMessage, canvas.width/2, 200);
		ctx.font = "20px Comic Sans MS";
		ctx.fillText(playGameMessage2, canvas.width/2, 240);
		ctx.fillText(playGameMessage3, canvas.width/2, 270);
		ctx.textAlign="left";
	}
	
	//allow dark mode colour changes	
	if (dark == true) {
		//score and level text & style
		ctx.fillStyle = "silver"; //purple
		ctx.font = "20px Comic Sans MS";
		ctx.fillText("Score: " + score, 10, 50);
		ctx.font = "20px Comic Sans MS";
		ctx.fillText("Level: " + level, 10, 80);

		//paddle style
		ctx.fillStyle = "black"; //pink
		ctx.fillRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);

		//end of game style
		ctx.fillStyle = "grey"; //pink
		ctx.font = "30px Comic Sans MS";
		ctx.textAlign="center";
		ctx.fillText(playGameMessage, canvas.width/2, 200);
		ctx.font = "20px Comic Sans MS";
		ctx.fillText(playGameMessage2, canvas.width/2, 240);
		ctx.fillText(playGameMessage3, canvas.width/2, 270);
		ctx.textAlign="left";
	}
	
	//hides the next and previous buttons at the start of the game
	document.getElementById("previousButton").style.display ='inline';
	document.getElementById('nextButton').style.display ='inline';
	document.getElementById("pauseButton").style.display ='inline';
	document.getElementById('darkButton').style.display ='inline';
	document.getElementById('lightButton').style.display ='inline';
	document.getElementById("playButton").style.display ='inline';
	document.getElementById('speedButton').style.display ='inline';
	
	//dark/light mode button styling
	document.getElementById('darkButton').style.background ='black';
	document.getElementById('lightButton').style.background = '#FFEF83';
	document.getElementById('lightButton').style.color = 'black';
}

//dark mode colour changes
function Dark() {
	dark = true;
	light = false;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//changes background colour
	document.body.style.backgroundImage = "url('backd.png')";
	//changes button colours
	document.getElementById("myCanvas").style.background = "white";
	document.getElementById("myCanvas").style.borderColor = "black";
	document.getElementById("myCanvas").style.fillStyle = 'black';
	document.getElementById("previousButton").style.background ='black';
	document.getElementById('nextButton').style.background ='black';
	document.getElementById("pauseButton").style.background ='black';
	document.getElementById('darkButton').style.background ='black';
	document.getElementById('lightButton').style.background ='#A790E8';
	document.getElementById('lightButton').style.color = 'black';
	document.getElementById("playButton").style.background ='black';
	document.getElementById('speedButton').style.background ='black';
	document.getElementById('song').style.color ='black';
	document.getElementById('song').style.background ='white';
	
	//paddle colour
	
	ctx.fillstyle = "black"; //purple
	ctx.fillRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
	ctx.fillstyle = "black";
	
	//text on screen
	document.getElementById('myCanvas').style.color ='black';
	ctx.fillStyle = "black"; //purple
    ctx.font = "20px Comic Sans MS";
    ctx.fillText("Score: " + score, 10, 50);
	ctx.font = "20px Comic Sans MS";
	ctx.fillText("Level: " + level, 10, 80);
	
	//dark mode lemon images
	let imgFiles = ["lemond.png","limed.png","redd.png",
				"oranged.png","purpled.png","blued.png",
				"teald.png","beiged.png","greend.png","pinkd.png"];
	for (let index = 0; index < 10; index++){
		multipleLemons[index] = new Image();
		multipleLemons[index].src = imgFiles[index];
	}
}

//light mode colour changes
function Light() {
	dark = false;
	light = true;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	document.body.style.backgroundImage = "url('back.png')";
	document.getElementById("myCanvas").style.background = "#9EE7FF";
	document.getElementById("myCanvas").style.borderColor = "#FFEF83";
	document.getElementById("previousButton").style.background ='#A790E8';
	document.getElementById('nextButton').style.background ='#A790E8';
	document.getElementById("pauseButton").style.background ='#A790E8';
	document.getElementById('darkButton').style.background ='black';
	document.getElementById('lightButton').style.background ='#A790E8';
	document.getElementById("playButton").style.background ='#A790E8';
	document.getElementById('speedButton').style.background ='#A790E8';
	document.getElementById('song').style.color ='#A790E8';
	document.getElementById('song').style.background ='#FFEF83';
	
	ctx.fillstyle = "black"; //purple
	ctx.fillRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
	
	ctx.fillStyle = "royalblue"; //purple
    ctx.font = "20px Comic Sans MS";
    ctx.fillText("Score: " + score, 10, 50);
	ctx.font = "20px Comic Sans MS";
	ctx.fillText("Level: " + level, 10, 80);
    
	
	//dark mode lemon images
	let imgFiles = ["lemon.png","lime.png","red.png",
				"orange.png","purple.png","blue.png",
				"teal.png","beige.png","green.png","pink.png"];
	for (let index = 0; index < 10; index++){
		multipleLemons[index] = new Image();
		multipleLemons[index].src = imgFiles[index];
	}
}

//allows the game to change based on actions performed by the user
//and in response to where the ball hits
function gameUpdate() {
for (let index = 0; index < numLemons; index++){
    ballX[index] = ballX[index] + dx[index];
    ballY[index] = ballY[index] + dy[index];
			   
	//right side and leftside hittest
    if (ballX[index] + 40 > canvas.width || ballX[index] < 0) {
        dx[index] = -dx[index];
		r.play();
    }
	
	//top hittest
    if (ballY[index] < 0) {
        dy[index] = -dy[index];
		t.play();
    }

	//bottom hit tests
    if (ballY[index]+40 > canvas.height-10) {
		//if the ball hits the paddle
        if (ballX[index]+20 > paddleX && ballX[index]+20 < paddleX + paddleWidth) { 
            dy[index] = -dy[index];
            score++;
			
		if ((score+1) % 2) {
			level++;
			paddleWidth = paddleWidth - 10;
			dx[index]++;
			dy[index]--;
		}
			
			//play the paddle sound
			p.play(); 
			
		//if the ball goes off the bottom
        } else {
			playGameMessage = "Press Any Key To Play";
			playGameMessage2 = "Final Score: " + score;
			playGameMessage3 = "Final Level: " + level;
            gameOn = false;
			//play the bottom sound
			b.play();
        	}
    	}
	}
}

//random speed button
function Speed() {
		for (let index = 0; index < numLemons; index++){
		dx[index]++;
		dy[index]--;
		}
}

//pause game button
function Pause() {
		for (let index = 0; index < numLemons; index++){
		dx[index] = 0;
		dy[index] = 0;
		}
}

//play game button
function Play() {
		for (let index = 0; index < numLemons; index++){
		dx[index]++;
		dy[index]--;
		}
}

// allows the paddle to move 
function keyDownHandler(e) {
	for (let index = 0; index < numLemons; index++){
		splashScreenOn = false; //turns off splash screen
    	if (e.keyCode == 39) { //rightarrow
        	paddleX = paddleX + pX;
    	} else if (e.keyCode == 37) { //leftarrow
        	paddleX = paddleX - pX;
    	} else { //tells the ball to move 
			dx[index] = 1;
			dy[index] = -1;
			ballX[index] = Math.random() * (canvas.width-40);
			ballY[index] = Math.random() * (canvas.height-40);
			numLemons = 1 + (Math.random() * (10)); 
			score = 0;
			level = 1;
			paddleWidth = 300;
			playGameMessage = "";
			playGameMessage2 = "";
			playGameMessage3 = "";
			gameOn = true;
    	}
	}
}

// move the paddle based on drag or touch.
document.getElementById("myCanvas").addEventListener("touchstart", mousedown, false);
document.getElementById("myCanvas").addEventListener("touchend", mouseup, false);
document.getElementById("myCanvas").addEventListener("mousedown", mousedown, false);
document.getElementById("myCanvas").addEventListener("mouseup", mouseup, false);
document.getElementById("myCanvas").addEventListener("mousemove", mousemove, false);
document.getElementById("myCanvas").addEventListener("touchmove", mousemove, false);

//controls where on the screen you can touch to control the paddle
function mousedown(event){
	localClientX = event.clientX - document.getElementById("myCanvas").offsetLeft
	
	localClientY = event.clientY - document.getElementById("myCanvas").offsetTop
	
	if(localClientY > 480 && localClientY < 510 && localClientX > paddleX && localClientX < (paddleX + paddleWidth) ) {
        pressed = true;
    }
}

function mouseup(event){
	pressed = false;
}

function mousemove(event) {
  event.preventDefault();
  let x = event.clientX || event.touches[0].clientX;
  if(gameOn && pressed){
        paddleX = x-document.getElementById("myCanvas").offsetLeft-0.5*paddleWidth; 
  }
}

//splash screen display
function displaySplashScreen(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
    	x = (canvas.width / 2) - (spriteWidth / 2);
    	y = (canvas.height / 2) - (spriteHeight / 2);

	ctx.drawImage(splashScreenImg, srcX, srcY, spriteWidth, spriteHeight,
        x, y, spriteWidth, spriteHeight);
}

//allows the game to start by touching the screen
document.getElementById("myCanvas").addEventListener("touchstart", touchStart, false);
document.getElementById("myCanvas").addEventListener("mousedown", touchStart, false);

function touchStart(){
	if(splashScreenOn==true || gameOn==false){
		for (let index = 0; index < numLemons; index++){
			splashScreenOn = false;
			dx[index] = 1;
			dy[index] = -1;
			ballX[index] = Math.random() * (canvas.width-40);
			ballY[index] = Math.random() * (canvas.height-40);
			numLemons = 1 + (Math.random() * (10)); 
			score = 0;
			level = 1;
			paddleWidth = 300;
			playGameMessage = "";
			playGameMessage2 = "";
			playGameMessage3 = "";
			gameOn = true;
		}
	}
}