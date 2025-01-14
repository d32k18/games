// import Level from './level';
//Game holds my current level. 
// ==> Level should hold platforms & spawn bubbles? Or should I have game 
// hold all my bubbles for a given lavel and just spawn based on what level we're on
import Bubble from './bubble';
import Player from './player';
import Bullet from './bullet';

export default class Pang {
  constructor(){
    this.bubbles = [];
    this.players = [];
    this.bullets = [];
    this.level = 1;
    this.lives = 5;
    this.gameOver = false;
    this.numBubbles = Pang.NUM_BUBBLES;
    this.DIM_X = Pang.DIM_X;
    this.DIM_Y = Pang.DIM_Y;
  }

  add(object) {
    if (object instanceof Bubble) {
      this.bubbles.push(object)
    } else if (object instanceof Player) {
      this.players.push(object)
    } else if (object instanceof Bullet) {
      this.bullets.push(object)
    } else {
      throw new Error("Unknown type of object")
    }
  }

  addBubbles(size) {
    for (let i = 0; i < this.level; i++) {
      this.add(new Bubble({ pang: this, size: size}))
    }
  }

  addSplitBubbles(size, radius, pos) {
    this.add(new Bubble({ pang: this, size: size, radius: radius, pos: this.nearbyPos(pos) }));
    this.add(new Bubble({ pang: this, size: size, radius: radius, pos: this.nearbyPos(pos) }));
  }

  addPlayer() {
    const player = new Player({ 
      pang: this,
      pos: Pang.PLAYER_START_POS
    })
    this.add(player);
    
    return player;
  }

  allObjects() {
    return [].concat(this.bullets, this.bubbles, this.players);
  }

  bounce(pos, vel, radius) {
    if ((pos[0]+radius) >= Pang.DIM_X || (pos[0]-radius) <= 0) {
      vel[0] *= -1
    } 
    else if ((pos[1]+radius) >= Pang.DIM_Y || (pos[1]-radius) <= 0) {
      vel[1] *=-1
    }
    return vel;
  };
  
  bounds(pos, radius) {
    if (pos[0] + radius > Pang.DIM_X) {
      pos[0] = Pang.DIM_X - radius;
    } else if (pos[0] - radius < 0) {
      pos[0] = radius;
    } else if (pos[1] + radius > Pang.DIM_Y) {
      pos[1] = Pang.DIM_Y - radius;
    } else if (pos[1] - radius < 0) {
      pos[1] = radius
    } 

    return pos;
  };

  checkCollisions() {
    const allObjects = this.allObjects();
      for ( let i = 0; i < allObjects.length; i++ ) {
        for ( let j = 0; j < allObjects.length; j++) {
          const obj1 = allObjects[i];
          const obj2 = allObjects[j];
          if (obj1.isCollidedWith(obj2) && (obj1 !== obj2)) {
            const collision = obj2.collideWith(obj1);
            if (collision) return;
          }
        }
      }
  }

  // Make bubbles a function based on the current level. 
  // Spawn different amount of bubbles based on what level it is
  checkLevelOver() {
    if (!this.bubbles.length) {
      this.level += 1;
      this.addBubbles();
    }
  }

  draw(ctx) {
    ctx.clearRect(0, 0, Pang.DIM_X, Pang.DIM_Y);
    ctx.fillStyle = Pang.BG_Color;
    ctx.clearRect(0, 0, Pang.DIM_X, Pang.DIM_Y);
    this.allObjects().forEach(object => {
      object.draw(ctx)
    })
  }

  isOutOfBounds(pos, radius) {
    if (pos[0] - radius <= 0 || pos[0] + radius >= Pang.DIM_X) return true;
    if (pos[1] - radius <= 0 || pos[1] + radius >= Pang.DIM_Y) return true;
    return false;
  }

  moveObjects(delta) {
    this.allObjects().forEach(object => {
      object.move(delta)
    })
  }

  nearbyPos(pos) {
    const dx = pos[0] + (Math.random() * (50) - 25);
    const dy = pos[1] + (Math.random() * (50) - 25);
    return [dx, dy]
  }

  randomPosition() {
    return[100 + (1000 * Math.random()), 125 ]
  }

  remove(object) {
    if (object instanceof Bubble) {
      this.bubbles.splice(this.bubbles.indexOf(object), 1);
    } else if (object instanceof Player) {
      this.players.splice(this.players.indexOf(object), 1);
    } else if (object instanceof Bullet) {
      this.bullets.splice(this.bullets.indexOf(object), 1);
    } 
  }

  resetLevel() {
    this.bubbles.forEach(bubble => {
      this.bubbles = []
    })
    this.addBubbles('big');
    this.players[0].pos = Pang.PLAYER_START_POS;
  }

  // restartLevel() {
  //   this.resetAll();
  // }

  step(delta) {
    this.checkLevelOver();
    this.moveObjects(delta);
    this.checkCollisions();
  }
}

Pang.BG_Color = '#000000'
Pang.DIM_X = 1200;
Pang.DIM_Y = 800;
Pang.FPS = 60;
Pang.NUM_BUBBLES = 2;
Pang.PLAYER_START_POS = [Pang.DIM_X/2 - 40, Pang.DIM_Y-123];