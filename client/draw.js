//Possible directions a user can move
//their character. These are mapped
//to integers for fast/small storage
const directions = {
  DOWNLEFT: 0,
  DOWN: 1,
  DOWNRIGHT: 2, 
  LEFT: 3,
  UPLEFT: 4,
  RIGHT: 5, 
  UPRIGHT: 6,
  UP: 7
};

//size of our character sprites
const spriteSizes = {
  WIDTH: 61,
  HEIGHT: 121
};

//function to lerp (linear interpolation)
//Takes position one, position two and the 
//percentage of the movement between them (0-1)
const lerp = (v0, v1, alpha) => {
  return (1 - alpha) * v0 + alpha * v1;
};

//redraw with requestAnimationFrame
const redraw = (time) => {
  //update this user's positions
  updatePosition();

  ctx.clearRect(0, 0, 500, 500);

  //each user id
  const keys = Object.keys(squares);

  //for each user
  for(let i = 0; i < keys.length; i++) {

    const square = squares[keys[i]];

    //if alpha less than 1, increase it by 0.01
    if(square.alpha < 1) square.alpha += 0.05;

    //applying a filter effect to other characters
    //in order to see our character easily
    if(square.hash === hash) {
      ctx.fillStyle = "red"
    }
    else {
      ctx.fillStyle = "blue";
    }

    //calculate lerp of the x/y from the destinations
    square.x = lerp(square.prevX, square.destX, square.alpha);
    square.y = lerp(square.prevY, square.destY, square.alpha);


    //draw our characters
    ctx.fillRect(
      square.x, 
      square.y, 
      spriteSizes.WIDTH, 
      spriteSizes.HEIGHT
    );
    
    //highlight collision box for each character
    ctx.strokeRect(square.x, square.y, spriteSizes.WIDTH, spriteSizes.HEIGHT);
  }


  //set our next animation frame
  animationFrame = requestAnimationFrame(redraw);
};