import Pang from './pang';

export default class Splash {
  constructor(ctx) {
    this.ctx = ctx;
    // this.splashGIF = document.getElementById('splash-gif');
    this.splashGIF = new Image();
    // this.splashGIF.src = "./assets/intro2.gif";
    this.splashGIF.src = "./assets/splash.png";
    this.stepCount = 0;
  }

  loop(ctx) {
    this.frameId = requestAnimationFrame(this.loop.bind(this))
    this.draw();
  };

  draw() {
    const ctx = this.ctx;

    let x = 1200;
    let y = 800;

    ctx.save();
    ctx.clearRect(0, 0, x, y);
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, x, y);
    ctx.clearRect(0, 0, x, y);
    ctx.restore();
    ctx.drawImage(this.splashGIF, -100, -100, x+100, y+100)
  }

  end() {
    cancelAnimationFrame(this.frameId);
  }
}