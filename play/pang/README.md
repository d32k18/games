# Pang
#### A remake of the classic Arcade game written purely in JavaScript!
### Live Site: https://93lykevin.github.io/PangGame/

![Home](/readme_media/Home.png)

Pang is an arcade game where a player moves around, shoots his harpoon gun, and pops the bouncing balls while trying not to get hit.
A Player earns more points for every ball popped. 

![Play](/readme_media/Play.png)

## Key Features
+ Game Physics
  + Bouncing balls, player movement, bullet movement, collisions are a huge factor in this game. 
  + Applied appropriate acceleration and velocity to balls to simulate quasi random motion.
+ Sprites
  + Used many different sprites to animate character movements.
+ Canvas
  + The API used to draw the entire game. 
  + Allows for smoothe and easy drawing and redrawing of all objects on screen for smoothe gameplay.
  
## Code Snippets
```
Bubble motion. Bubbles of different sizes move a little differently.

move(timeDelta) {
    //timeDelta = number of ms since last call of move(
    //if computer is busy --> timeDelta will be larger
    //--> moveObject should move MORE to make up for lag
    //velocity of an object is how far it should move in 1/60th of a second
    const velocityScale = timeDelta / MovingObject.NORMAL_FRAME_TIME_DELTA;
    const offsetX = this.vel[0] * velocityScale;
    const offsetY = this.vel[1] * velocityScale;

    if (this.vel[1] >= Bubble.MAX_VEL) this.vel[1] = Bubble.MAX_VEL;
    if (this.vel[0] >= Bubble.MAX_VEL) this.vel[0] = Bubble.MAX_VEL;

    if (this.size === 'big' && this.pos[1] <= 200 && this.dir === 'up') {
      this.vel[1] += Bubble.ACCEL;
    } 
    if (this.size === 'medium' && this.pos[1] <= 250 && this.dir === 'up') {
      this.vel[1] += Bubble.ACCEL;
    } 
    if (this.size === 'small' && this.pos[1] <= 400 && this.dir === 'up') {
      this.vel[1] += Bubble.ACCEL;
    } 
    if (this.size === 'tiny' && this.pos[1] <= 500 && this.dir === 'up') {
      this.vel[1] += Bubble.ACCEL;
    } 

    if (this.pos[1] >= Bubble.MIN_HEIGHT_BIG && (this.size === 'big') && (Math.abs(this.vel[1]) < 3)) {
      this.vel[1] -= Bubble.ACCEL*2
    }  

    if (this.pos[1] >= Bubble.MIN_HEIGHT_MEDIUM && this.size === 'medium') {
      if (Math.abs(this.vel[1]) < 8) {
        this.vel[1] -= Bubble.ACCEL*3
      }
      this.vel[1] -= Bubble.ACCEL*2
    }

    if (this.pos[1] >= Bubble.MIN_HEIGHT_SMALL && this.size === 'small') {
      if (Math.abs(this.vel[1]) < 8) {
        this.vel[1] -= Bubble.ACCEL*3
      }
      this.vel[1] -= Bubble.ACCEL*2
    }

    if (this.pos[1] >= Bubble.MIN_HEIGHT_TINY && this.size === 'tiny') {
      if (Math.abs(this.vel[1]) < 8) {
        this.vel[1] -= Bubble.ACCEL*3
      }
      this.vel[1] -= Bubble.ACCEL*2
    }

    this.vel[1] += Bubble.ACCEL;
  
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];

    if (this.pang.isOutOfBounds(this.pos, this.radius)) {
      if (this.isBounceable) {
        this.vel = this.pang.bounce(this.pos, this.vel, this.radius);
        this.dir = this.dir === 'down' ? 'up' : 'down'
      } else {
        this.remove();
      }
    }
  }
```
```
Player sprite. Change the image based on the player's velocity and implement a small counter to delay sprite change.

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
```

## Future Additions
+ Multiplayer using web sockets.
+ Platforms for different levels.
+ Breakable objects to add some new challenges.
+ Power ups.
