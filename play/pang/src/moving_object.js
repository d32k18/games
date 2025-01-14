import Util from './utils';

export default class MovingObject {
  constructor(options){
    this.pos = options.pos;
    this.vel = options.vel;
    this.radius = options.radius;
    this.color = options.color;
    this.pang = options.pang;
    this.isBounceable = options.isBounceable;
  }

  collideWith(otherObject) {
    //if Bubble collides with Bullet, split the bubble, remove the bullet
    //if Bubble collides with Player, reset the level
  }

  draw(ctx){
    ctx.beginPath();
    ctx.arc( this.pos[0], this.pos[1], this.radius, 0, 2*Math.PI, true );
    ctx.fillStyle = this.color;
    ctx.fill();
  }
  
  isCollidedWith(otherObject) {
    const centerDist = Util.dist(this.pos, otherObject.pos);
    return centerDist < (this.radius + otherObject.radius);
  }

  move(timeDelta) {
    //timeDelta = number of ms since last call of move(
    //if computer is busy --> timeDelta will be larger
    //--> moveObject should move MORE to make up for lag
    //velocity of an object is how far it should move in 1/60th of a second
    const velocityScale = timeDelta / MovingObject.NORMAL_FRAME_TIME_DELTA;
    const offsetX = this.vel[0] * velocityScale;
    const offsetY = this.vel[1] * velocityScale;

    this.pos[0] = this.pos[0] + offsetX;
    this.pos[1] = this.pos[1] + offsetY;


    if (this.pang.isOutOfBounds(this.pos, this.radius)) {
      if (this.isBounceable) {
        this.vel = this.pang.bounce(this.pos, this.vel, this.radius);
      } else {
        this.remove();
      }
    }
  }
  
  remove() {
    this.pang.remove(this);
  }
}

MovingObject.NORMAL_FRAME_TIME_DELTA = 1000 / 60;
