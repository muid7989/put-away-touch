let time;
let frameCountBuffer = 0;
let fps = 0;

const CANVAS_W = 960;
const CANVAS_H = 1280;

const GRID_SIZE = 64;
const GRID_W = 64;
const GRID_BASE_X = GRID_SIZE*1;
const GRID_BASE_Y = GRID_SIZE*1;
const BALL_NUM = 10;
const BALL_MIN_X = GRID_SIZE*2;
const BALL_MIN_Y = GRID_SIZE*2;
const BALL_MAX_X = GRID_SIZE*12;
const BALL_MAX_Y = GRID_SIZE*11;
const BALL_SIZE = GRID_SIZE;
const BALL_COLOR = 'pink';
const CATCH_RANGE = 48;
const TARGET_X = GRID_SIZE*13
const TARGET_Y = GRID_SIZE*2
const TARGET_COLOR = 'red';
const TARGET_SIZE = GRID_SIZE*2;

const BUTTON_F = 8;
const BUTTON_M = GRID_SIZE;
const BUTTON_W = GRID_SIZE*4;
const BUTTON_H = GRID_SIZE*2;
const BUTTON_Y = GRID_SIZE*10;

let startButton;
let startFlag = false;
let startTime;
let endTime = 0;
let balls = [];

let timeCount;
const TEXT_VIEW_SIZE = 32;
let countValue = 0;

let tp = [];

const DEBUG = true;
const DEBUG_VIEW_X = 40;
const DEBUG_VIEW_Y = 20;
const DEBUG_VIEW_H = 20;

function preload() {
}
function startFn() {
	startFlag = true;
	startTime = millis();
	startButton.hide();
	resetFn();
}
function setup() {
	createCanvas(CANVAS_W, CANVAS_H);
	time = millis();
	rectMode(CENTER);

	startButton = buttonInit('START', BUTTON_W, BUTTON_H, (CANVAS_W-BUTTON_W)/2, BUTTON_Y+BUTTON_H+BUTTON_M);
	startButton.mousePressed(startFn);
	textAlign(CENTER,CENTER);

//	resetFn();
}
function resetFn() {
	countValue = 0;
	balls = [];
	for (let i=0; i<BALL_NUM; i++){
		const tx = random(BALL_MIN_X, BALL_MAX_X);
		const ty = random(BALL_MIN_Y, BALL_MAX_Y);
		let ball = ballInit(tx, ty);
		balls.push(ball);
	}
}
function ballInit(x, y) {
	let ball = {};
	ball.pos = {};
	ball.pos.x = x;
	ball.pos.y = y;
	ball.caught = false;
	ball.offset = {};
	ball.visible = true;
	return ball;
}
function buttonInit(text, w, h, x, y) {
	let button = createButton(text);
	button.size(w,h);
	button.position(x,y);
	button.style('font-size', '32px');
	return button;
}
function draw() {
	background(48);
	let current = millis();
	if ( (current-time)>=1000 ){
		time += 1000;
		fps = frameCount - frameCountBuffer;
		frameCountBuffer = frameCount;
	}
	if (DEBUG){
		stroke(128);
		strokeWeight(1);
		for (let i=0; i<CANVAS_H/GRID_SIZE; i++){
			line(0, i*GRID_SIZE, CANVAS_W, i*GRID_SIZE);
		}
		for (let i=0; i<CANVAS_W/GRID_SIZE; i++){
			line(i*GRID_SIZE, 0, i*GRID_SIZE, CANVAS_H);
		}
	}
	strokeWeight(0);
	fill(TARGET_COLOR);
	circle(TARGET_X, TARGET_Y, TARGET_SIZE);
	fill(BALL_COLOR);
	for (let i=0; i<balls.length; i++){
		if (balls[i].visible){
			if (balls[i].caught){
				balls[i].pos.x = mouseX+balls[i].offset.x;
				balls[i].pos.y = mouseY+balls[i].offset.y;
				const d = dist(TARGET_X, TARGET_Y, balls[i].pos.x, balls[i].pos.y);
				if (d<TARGET_SIZE/2){
					balls[i].visible = false;
					countValue++;
					if (countValue>=BALL_NUM){
						startButton.show();
						endTime = (millis() - startTime)/1000;
						startFlag = false;
					}
				}
			}
			circle(balls[i].pos.x, balls[i].pos.y, BALL_SIZE);
		}
	}
	if (startFlag==false){
		fill(255);
		stroke(255);
		textSize(64);
		textAlign(CENTER);
		text(endTime.toFixed(1)+' sec', CANVAS_W/2, GRID_SIZE*2);
	}
	fill(255);
	stroke(255);
	textSize(16);
	strokeWeight(1);
	let debugY = DEBUG_VIEW_Y;
	text('fps:'+fps, DEBUG_VIEW_X, debugY);
	debugY += DEBUG_VIEW_H;
	text('ball:'+balls.length, DEBUG_VIEW_X,debugY);
	debugY += DEBUG_VIEW_H;
}
/*
function mousePressed() {
	for (let i=balls.length-1; i>=0; i--){
		if (balls[i].visible){
			const d = dist(mouseX, mouseY, balls[i].pos.x, balls[i].pos.y);
			if (d<CATCH_RANGE){
				balls[i].caught = true;
				balls[i].offset.x = balls[i].pos.x - mouseX;
				balls[i].offset.y = balls[i].pos.y - mouseY;
				break;
			}
		}
	}
}
function mouseReleased() {
	for (let i=0; i<balls.length; i++){
		balls[i].caught = false;
	}
}
*/
function touchStarted() {
	for (let i=0; i<touches.length;i++) {
		if (tp[i]==null){
			tp[i] = [];
		}
		tp[i].x = touches[i].x;
		tp[i].y = touches[i].y;
	}	
	for (let i=balls.length-1; i>=0; i--){
		if (balls[i].visible){
			const d = dist(tp[0].x, tp[0].y, balls[i].pos.x, balls[i].pos.y);
			if (d<CATCH_RANGE){
				balls[i].caught = true;
				balls[i].offset.x = balls[i].pos.x - tp[0].x;
				balls[i].offset.y = balls[i].pos.y - tp[0].y;
				break;
			}
		}
	}
}
function touchEnded() {
	for (let i=0; i<balls.length; i++){
		balls[i].caught = false;
	}
}
function touchMoved() {
	for (let i=0; i<touches.length;i++) {
		if (tp[i]==null){
			tp[i] = [];
		}
		tp[i].x = touches[i].x;
		tp[i].y = touches[i].y;
	}	
	for (let i=0; i<balls.length; i++){
		if (balls[i].caught){
			balls[i].pos.x = tp[0].x+balls[i].offset.x;
			balls[i].pos.y = tp[0].y+balls[i].offset.y;
		}
	}
	return false;
}