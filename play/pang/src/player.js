import MovingObject from "./moving_object";
import Bullet from './bullet';
import Bubble from './bubble';

export default class Player extends MovingObject {
  constructor(options) {
    options.radius = Player.RADIUS;
    options.color = 'black';
    options.vel = options.vel || [0,0];
    super(options)
    this.state = options.state || 'standingRight'
    this.isBounceable = false;
    this.moveRight = false;
    this.moveLeft = false;
    this.tick = 0;
    this.width = Player.WIDTH;
    this.height = Player.HEIGHT;
  }

  bounds(pos) {
    if (pos[0] < 0) {
      pos[0] = 0;
    } else if (pos[0] + Player.WIDTH > 1200) {
      pos[0] = 1200-Player.WIDTH;
    } else if (pos[1] > 800) {
      pos[1] = 800-Player.HEIGHT;
    }

    return pos;
  }

  draw(ctx) {
    // ctx.beginPath();
    // ctx.rect(this.pos[0], this.pos[1], Player.WIDTH, Player.HEIGHT);
    // ctx.closePath();
    // ctx.stroke();
    if (this.tick >= 40) {
      this.tick = 0;
    }
    const img = new Image();
    img.src = "./assets/pang.png";
    
    //Set the state of the player
    if (this.vel[0] < 0.3 && this.vel[0] > -0.3) {
      this.tick = 0;
      this.state = 'standingRight';
    } else if (this.vel[0] >= 0.3 && this.vel[0] <= 4) {
      this.state = 'walkingRight';
    } else if (this.vel[0] <= -0.3 && this.vel[0] >= -4) {
      this.state = 'walkingLeft';
    } else if (this.vel[0] > 4) {
      this.tick++;
      if (this.tick === 8) {
        this.state = 'runningRight'
      } else if ( this.tick === 16) {
        this.state = 'steppingRight'
      } else if ( this.tick === 24) {
        this.state = 'runningRight2'
      } else if ( this.tick === 32) {
        this.state = 'steppingRight2'
      }
    } else if (this.vel[0] < -4) {
      this.tick++;
      if (this.tick === 8) {
        this.state = 'runningLeft'
      } else if ( this.tick === 16) {
        this.state = 'steppingLeft'
      } else if ( this.tick === 24) {
        this.state = 'runningLeft2'
      } else if ( this.tick === 32) {
        this.state = 'steppingLeft2'
      }
    }
    //Draw appropriate sprite based on state
    if (this.state === 'standingRight') {
      ctx.drawImage( img, 172, 1.3, 29, 38, this.pos[0]-10, this.pos[1], 110, 150 )
    } else if (this.state === 'walkingRight') {
      ctx.drawImage( img, 0, 1.3, 30, 38, this.pos[0]-10, this.pos[1], 110, 150 )
    } else if (this.state === 'walkingLeft') {
      ctx.drawImage( img, 510.5, 1.3, 31, 38, this.pos[0]-10, this.pos[1], 110, 150 )
    } else if (this.state === 'runningRight') {
      ctx.drawImage( img, 35, 1.3, 30, 38, this.pos[0]-10, this.pos[1], 110, 150 )
    } else if (this.state === 'runningLeft') {
      ctx.drawImage( img, 476.5, 1.3, 31, 38, this.pos[0]-10, this.pos[1], 110, 150 )
    } else if ( this.state === 'steppingRight') {
      ctx.drawImage( img, 69.5, 1.3, 30, 38, this.pos[0]-10, this.pos[1], 110, 150 )  
    } else if ( this.state === 'steppingLeft' ) {
      ctx.drawImage( img, 442.5, 1.3, 31, 38, this.pos[0]-10, this.pos[1], 110, 150 )
    } else if (this.state === 'runningRight2') {
      ctx.drawImage( img, 102.5, 1.3, 30, 38, this.pos[0]-10, this.pos[1], 110, 150 )
    } else if (this.state === 'runningLeft2') {
      ctx.drawImage( img, 408.5, 1.3, 31, 38, this.pos[0]-10, this.pos[1], 110, 150 )
    } else if ( this.state === 'steppingRight2') {
      ctx.drawImage( img, 136.5, 1.3, 30, 38, this.pos[0]-10, this.pos[1], 110, 150 )   
    } else if ( this.state === 'steppingLeft2' ) {
      ctx.drawImage( img, 374.5, 1.3, 31, 38, this.pos[0]-10, this.pos[1], 110, 150 )
    }
  }

  fireBullet() {
    if (this.pang.bullets.length === 0) {
      const bullet = new Bullet({
        pos: [this.pos[0] + 28, this.pos[1]+100],
        vel: [0, -10],
        color: 'pink',
        pang: this.pang
      });
      this.pang.add(bullet);
    }
  }

  isCollidedWith(otherObject) {
    if (otherObject instanceof Bubble) {
      //center X and Y of the rectangle
      let centerX = Math.abs(this.pos[0] + (this.width * 0.5));
      let centerY = Math.abs(this.pos[1] + (this.height * 0.5));
      
      //distance from center of circle to center of rectangle
      let distX = Math.abs(otherObject.pos[0] - centerX);
      let distY = Math.abs(otherObject.pos[1] - centerY);

      //No collision if either of these are true
      if (distX > ((this.width * 0.5) + otherObject.radius)) { return false };
      if (distY > ((Math.abs(this.height) * 0.5) + otherObject.radius)) { return false };

      //collision if both these are true. The circle and rectangle must be in the overlapping
      if (distX <= (otherObject.radius * 0.5)) {
        return true;
      }

      if (distY <= (otherObject.radius * 0.5 )) {
        return true
      }

      let dx = distX - this.pos[0] * 0.5;
      let dy = distY - Math.abs(this.pos[1]) * 0.5;
      return (dx*dx + dy*dy <= (otherObject.radius * otherObject.radius)) 
    }
  }

  move(delta) {
    const velocityScale = delta / Player.NORMAL_FRAME_TIME_DELTA;
    // const offsetX = this.vel[0] * velocityScale;
    // const offsetY = this.vel[1] * velocityScale;

    if (this.moveRight === true) {
      this.vel[0] +=  Player.SPEED;
    } 

    if (this.moveLeft === true) {
      this.vel[0] -= Player.SPEED;
    }

    this.pos[0] += this.vel[0]

    //friction
    this.vel[0] *= 0.92; 
    this.vel[1] *= 0.92; 
    
    this.pos = this.bounds(this.pos)
  }
};

Player.WIDTH = 70;
Player.HEIGHT = 125;
Player.RADIUS = 0;
Player.SPEED = 0.45;
Player.NORMAL_FRAME_TIME_DELTA = 1000 / 60;
Player.STATES = ['standing', 'walking', 'shooting', 'climbing']