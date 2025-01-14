import MovingObject from "./moving_object";
import Bubble from './bubble';

export default class Bullet extends MovingObject{
  constructor(options) {
    options.radius = Bullet.RADIUS;
    super(options)
    this.isBounceable = false;
    this.height = Bullet.HEIGHT;
    this.width = Bullet.WIDTH;
  }

  move(delta){
    this.height -= 10;
    if (Math.abs(this.height) >= 800){
      this.remove()
    }
  }

  draw(ctx) {
    const img = new Image();
    img.src = './assets/pang2.png';
    ctx.drawImage(img, 19, 1, 14, 200, this.pos[0], this.pos[1]+20, this.width, this.height-20)
  }

  //if any point of the bullet is touching a bubble, pop it
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

      if (distY <= (Math.abs(this.height) * 0.5 )) {
        return true
      }

      let dx = distX - this.pos[0] * 0.5;
      let dy = distY - Math.abs(this.pos[1]) * 0.5;
      return (dx*dx + dy*dy <= (otherObject.radius * otherObject.radius)) 
    }
  }
}

Bullet.WIDTH = 15;
Bullet.HEIGHT = 0;
Bullet.SPEED = 5;
