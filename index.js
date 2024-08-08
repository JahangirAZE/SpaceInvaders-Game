let tileSize = 32;
let rows = 16;
let columns = 16;
let board;
let boardWidth =tileSize * columns;
let boardHeight = tileSize * rows;
let context;
let shipWidth = tileSize * 2;
let shipHeight = tileSize;
let shipX = tileSize * columns / 2 - tileSize;
let shipY = tileSize * rows - tileSize * 2;
let ship = {
  x: shipX,
  y: shipY,
  width: shipWidth,
  height: shipHeight
}
let shipImg;
let shipVelocityX = tileSize;
let alienArray = [];
let alienWidth = tileSize * 2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;
let alienRows = 2;
let alienColumns = 3;
let alienCount = 0;
let alienVelocityX = 1;
let bulletArray = [];
let bulletVelocityY = -10;
let score = 0;
let gameOver = false;
window.onload = function(){
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");
  shipImg = new Image();
  shipImg.src = "./images/ship.png";
  shipImg.onload = function(){
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
  }
  createAliens(); 
  requestAnimationFrame(update);
  document.addEventListener("keydown", moveShip);
  document.addEventListener("keyup", shoot);
}
function update(){
  requestAnimationFrame(update);
  if(gameOver) return;
  context.clearRect(0, 0, boardWidth, boardHeight);
  context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
  for(var i=0; i<alienArray.length; i++){
    let alien = alienArray[i];
    if(alien.alive){
      alien.x += alienVelocityX;
      if(alien.x + alien.width >= boardWidth || alien.x <= 0){
        alienVelocityX *= -1;
        alien.x += alienVelocityX * 2;
        for(let j = 0; j < alienArray.length; j++){
          alienArray[j].y += alienHeight;
        }
      }
      context.drawImage(alien.img, alien.x, alien.y, alien.width, alien.height);
      if(alien.y >= ship.y) gameOver = true;
    }
  }
  for(var i=0; i<bulletArray.length; i++){
    let bullet = bulletArray[i];
    bullet.y += bulletVelocityY;
    context.fillStyle = "white";
    context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    for(let j = 0; j < alienArray.length; j++){
      let alien = alienArray[j];
      if(!bullet.used && alien.alive && detectCollision(alien, bullet)){
        bullet.used = true;
        alien.alive = false;
        alienCount--;
        score+=100;
      }
    }
  }
  while(bulletArray.length > 0 && bulletArray[0].used || bulletArray[0].y < 0){
    bulletArray.shift();
  }
  if(alienCount === 0){
    alienColumns = Math.min(alienColumns + 1, columns/2 - 2);
    alienRows = Math.min(alienRows + 1, rows - 4);
    alienVelocityX += 0.4;
    alienArray = [];
    bulletArray = [];
    createAliens();
  }
  context.fillStyle = "white";
  context.font = "16px courier";
  context.fillText(score, 10, 20);
}
function moveShip(e){
  if(gameOver) return;
  if(e.code === "ArrowLeft" && ship.x - shipVelocityX >= 0) ship.x -= shipVelocityX;
  else if(e.code === "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width) ship.x += shipVelocityX;
}
function createAliens(){
  const alienColors = [
    "./images/alien.png",
    "./images/alien-magenta.png",
    "./images/alien-cyan.png",
    "./images/alien-yellow.png"
  ];
  alienArray = [];
  alienCount = 0;
  for(let c = 0; c < alienColumns; c++){
    for(let r = 0; r < alienRows; r++){
      let alien = {
        img: new Image(),
        x: alienX + c * alienWidth,
        y: alienY + r * alienHeight,
        width: alienWidth,
        height: alienHeight,
        alive: true
      }
      alien.img.src = alienColors[Math.floor(Math.random() * alienColors.length)];
      alienArray.push(alien);
    }
    alienCount = alienArray.length;
  }
}
function shoot(e){
  if(gameOver) return;
  if(e.code === "Space"){
    let bullet = {
      x: ship.x + ship.width * 15/32,
      y: ship.y,
      width: tileSize / 8,
      height: tileSize / 2,
      used: false
    }
    bulletArray.push(bullet);
  }
}
function detectCollision(a, b){
  return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}