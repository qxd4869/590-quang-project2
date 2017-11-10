class Character {
 
  constructor(hash) {
    let a = Math.floor(Math.random() * 400);
    this.hash = hash;
    this.lastUpdate = new Date().getTime();
    this.x = a;
    this.y = a;
    this.prevX = a;
    this.prevY = a;
    this.destX = a;
    this.destY = a;
    this.height = 100;
    this.width = 100;
    this.alpha = 0;
    this.direction = 0;
    this.frame = 0;
    this.frameCount = 0;
    this.moveLeft = false;
    this.moveRight = false;
    this.moveDown = false;
    this.moveUp = false;
    this.speedX = 0;
    this.speedY = 0;
  }
}

module.exports = Character;
