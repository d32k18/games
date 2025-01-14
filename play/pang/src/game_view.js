import Splash from './splash';
import Player from './player';
import Pang from './pang';

export default class GameView{
  constructor(pang, ctx, canvas){
    this.ctx = ctx;
    this.canvas = canvas;
    this.pang = pang;
    this.lastTime = 0;
    this.player = this.pang.addPlayer();

    this.playGame = this.playGame.bind(this);
    this.resetGame = this.resetGame.bind(this);
  }

  bindKeyHandlers() {
    const player = this.player;

    document.addEventListener("keydown", (e) => {
      if (e.key === 'ArrowRight') {
        player.moveRight = true;
      } else if (e.key === 'ArrowLeft') {
        player.moveLeft = true;
      }
    })

    document.addEventListener("keyup", (e) => {
      if (e.key === 'ArrowRight') {
        player.moveRight = false;
      } else if (e.key === 'ArrowLeft') {
        player.moveLeft = false;
      }
    })
    
    // key("z", () => {this.pang.gameOver = true})
    key("space", () => {player.fireBullet()})

    document.addEventListener("keypress", this.playGame)
  };

  playGame(e) {
    if (e.keyCode === 13) {
      // console.log('play game');
      this.pang.addBubbles('big');
      requestAnimationFrame(this.animate.bind(this));
      document.getElementById("instructions").style.display = "none";
      document.getElementById("canvas-w").style.visibility = "visible";
      document.removeEventListener("keypress", this.playGame, false)
    } 
  }

  animate(time) {
    this.frameId = requestAnimationFrame(this.animate.bind(this));

    if (this.pang.gameOver === true) {
      this.gameOverMessage();   //check game over on every before any animation
      cancelAnimationFrame(this.frameId);
    } else {
      const timeDelta = time - this.lastTime;
      this.pang.step(timeDelta);
      this.pang.draw(this.ctx);
    }
    this.lastTime = time;
  }

  gameOverMessage() {
    const ctx = this.ctx;
    ctx.save();
    this.drawGameOver(ctx);
    this.drawScore(ctx)
    this.drawRetry(ctx);
    ctx.restore();

    document.addEventListener('keypress', this.resetGame)
  }

  resetGame(e) {
    // console.log('reset game')
    //reset score and lives
    document.getElementById("instructions").style.display = "flex"; 
    document.getElementById("score").innerHTML = '0';               
    document.getElementById("lives").innerHTML = '5';
    //make new game
    const pang = new Pang(); 
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 1200, 800);
    document.removeEventListener("keypress", this.resetGame); //remove this event listener
    document.getElementById("canvas-w").style.visibility = "visible";
    new GameView(pang, ctx, canvas).start();
  }

  drawGameOver(ctx) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, this.pang.DIM_X, this.pang.DIM_Y);
    // ctx.fillStyle = "url(./assets/background2.png)"
    ctx.fillStyle = 'rgb(255, 253, 58)';
    ctx.font = '123px VT323'; 
    const text = 'GAME OVER';
    const textWidth = ctx.measureText(text).width
    ctx.fillText(text, this.pang.DIM_X/2 - textWidth/2 , this.pang.DIM_Y/2 - 200)
  }

  drawScore(ctx) {
    ctx.font = "50px VT323";
    ctx.fillStyle = "#ff9";
    const score = document.getElementById("score").innerHTML
    const text = 'Your Score: ' + score;
    const textWidth = ctx.measureText(text).width;
    ctx.fillText(text, this.pang.DIM_X/2 - textWidth/2 , this.pang.DIM_Y/2 - 100)
  }

  drawRetry(ctx) {
    ctx.font = "36px VT323";
    ctx.fillStyle = "#ff9";
    const text = "Press Any Key to Play Again";
    const textWidth = ctx.measureText(text).width;
    ctx.fillText(text, this.pang.DIM_X/2 - textWidth/2 , this.pang.DIM_Y/2 + 200)
  };

  start() {
    this.lastTime = 0;
    this.bindKeyHandlers();
    // this.pang.addBubbles('big');
    // requestAnimationFrame(this.animate.bind(this));
  };
}

GameView.MOVES = {
  left: 'left',
  right: 'right'
}