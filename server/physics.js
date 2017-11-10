// our custom message class for sending message back
// to the main process
const Message = require('./messages/Message.js');

let charList = {}; // list of characters
const directions = {
  DOWNLEFT: 0,
  DOWN: 1,
  DOWNRIGHT: 2,
  LEFT: 3,
  UPLEFT: 4,
  RIGHT: 5,
  UPRIGHT: 6,
  UP: 7,
  NONE: 8,
};

// box collision check between two rectangles
// of a set width/height
const checkCollisions = (rect1, rect2, width, height) => {
  if (rect1.x < rect2.x + width &&
     rect1.x + width > rect2.x &&
     rect1.y < rect2.y + height &&
     height + rect1.y > rect2.y) {
    return true; // is colliding
  }
  return false; // is not colliding
};

const crashHelper = (firstHash, secondHash) =>  {
  let firstX = 0;
  let firstY = 0;
  let secondX = 0;
  let secondY = 0;
  switch(charList[firstHash].direction)
  {
    case directions.DOWN: {
      firstY = -2;
      break;
    }
    // if left, set the height/width of attack to face left
    // and offset attack left from user
    case directions.LEFT: {
      firstX = 2;
      break;
    }
    // if right, set the height/width of attack to face right
    // and offset attack right from user
    case directions.RIGHT: {
      firstX = -2;
      break;
    }
    // if up, set the height/width of attack to face up
    // and offset attack upward from user
    case directions.UP: {
      firstY = 2;
      break;
    }
    case directions.DOWNLEFT: {
      firstX = 2;
      firstY = -2;
      break;
    }
    case directions.DOWNRIGHT: {
      firstX = -2;
      firstY = -2;
      break;
    }
    case directions.UPLEFT: {
      firstX = 2;
      firstY = 2;
      break;
    }
    case directions.UPRIGHT: {
      firstX = -2;
      firstY = 2;
      break;
    }
    case directions.NONE: {
      switch(charList[secondHash].direction)
      {
        case directions.DOWN: {
          firstY = 2;
          break;
        }
        // if left, set the height/width of attack to face left
        // and offset attack left from user
        case directions.LEFT: {
          firstX = -2;
          break;
        }
        // if right, set the height/width of attack to face right
        // and offset attack right from user
        case directions.RIGHT: {
          firstX = 2;
          break;
        }
        // if up, set the height/width of attack to face up
        // and offset attack upward from user
        case directions.UP: {
          firstY = -2;
          break;
        }
        case directions.DOWNLEFT: {
          firstX = -2;
          firstY = 2;
          break;
        }
        case directions.DOWNRIGHT: {
          firstX = 2;
          firstY = 2;
          break;
        }
        case directions.UPLEFT: {
          firstX = -2;
          firstY = -2;
          break;
        }
        case directions.UPRIGHT: {
          firstX = 2;
          firstY = -2;
          break;
        }
        default:
          break;
      }
    }
    default:
      break;
  }
  
  switch(charList[secondHash].direction)
  {
    case directions.DOWN: {
      secondY = -2;
      break;
    }
    // if left, set the height/width of attack to face left
    // and offset attack left from user
    case directions.LEFT: {
      secondX = 2;
      break;
    }
    // if right, set the height/width of attack to face right
    // and offset attack right from user
    case directions.RIGHT: {
      secondX = -2;
      break;
    }
    // if up, set the height/width of attack to face up
    // and offset attack upward from user
    case directions.UP: {
      secondY = 2;
      break;
    }
    case directions.DOWNLEFT: {
      secondX = 2;
      secondY = -2;
      break;
    }
    case directions.DOWNRIGHT: {
      secondX = -2;
      secondY = -2;
      break;
    }
    case directions.UPLEFT: {
      secondX = 2;
      secondY = 2;
      break;
    }
    case directions.UPRIGHT: {
      secondX = -2;
      secondY = 2;
      break;
    }
    case directions.NONE: {
      switch(charList[firstHash].direction)
      {
        case directions.DOWN: {
          secondY = 2;
          break;
        }
        // if left, set the height/width of attack to face left
        // and offset attack left from user
        case directions.LEFT: {
          secondX = -2;
          break;
        }
        // if right, set the height/width of attack to face right
        // and offset attack right from user
        case directions.RIGHT: {
          secondX = 2;
          break;
        }
        // if up, set the height/width of attack to face up
        // and offset attack upward from user
        case directions.UP: {
          secondY = -2;
          break;
        }
        case directions.DOWNLEFT: {
          secondX = -2;
          secondY = 2;
          break;
        }
        case directions.DOWNRIGHT: {
          secondX = 2;
          secondY = 2;
          break;
        }
        case directions.UPLEFT: {
          secondX = -2;
          secondY = -2;
          break;
        }
        case directions.UPRIGHT: {
          secondX = 2;
          secondY = -2;
          break;
        }
        default:
 
      }
    }
    default:
  }
  
  return {firstX, firstY, secondX, secondY};
}

// check attack collisions to see if colliding with the
// user themselves and return false so users cannot damage
// themselves

// handle each attack and calculate collisions
const checkCrash = () => {
  // if we have attack
    // get all characters
    const keys = Object.keys(charList);
    const characters = charList;
  
    let data = {};
    for (let i = 0; i < keys.length; i++) {
    // console.log(`Object ${i} with speed ` +characters[keys[i]].speedX);
    }
    
    for (let i = 0; i < keys.length; i++) {
      let speedX = characters[keys[i]].speedX;
      let speedY = characters[keys[i]].speedY;    
      if(speedX < 0){
        characters[keys[i]].speedX += 0.02;
        //console.log(`Object ${i} with speed ` +characters[keys[i]].speedX)
      } 
      if(speedX > 0){
        characters[keys[i]].speedX -= 0.02;
      } 
      if(speedY < 0){
        characters[keys[i]].speedY += 0.02;
      }
      if(speedY > 0){
        characters[keys[i]].speedY -= 0.02;
      }
     
     data.hash = characters[keys[i]].hash;
     data.speedX =  characters[keys[i]].speedX;
     data.speedY =  characters[keys[i]].speedY;
     //console.log(characters[keys[i]].speedX);
     process.send(new Message('speedUpdate', data));
      
    }  
  
    for (let j = 0; j < keys.length; j++) {
      let char1 = characters[keys[j]];
      for (let k = j +1; k < keys.length; k++) {
         let char2 = characters[keys[k]];
         const hit = checkCollisions(char1, char2, 50, 50);
      
         if(hit){
            
           let result = crashHelper(keys[j], keys[k]);
           characters[keys[j]].speedX = result.firstX;
           characters[keys[j]].speedY = result.firstY;
           characters[keys[k]].speedX = result.secondX;
           characters[keys[k]].speedY = result.secondY;
           
           data = {};
           data.first = characters[keys[j]];
           data.second = characters[keys[k]];
           process.send(new Message('crashCollision', data));
           
         }
      } 
   } 
};

 

// check for collisions every 20ms
setInterval(() => {
  checkCrash();
}, 20);

//listen for messages from the main process
/** 
 Since this is a child process and it has separate memory, it
 cannot directly access variables or call functions in the main process
 and vice versa. 
 
 The server will send() messages to this process. We are using a custom
 message type for consistency in messages.
**/
process.on('message', (messageObject) => {
  //check our custom message object for the type
  switch (messageObject.type) {
    //if message type is charList
    case 'charList': {
      //update our character list with the data provided
      charList = messageObject.data;
      break;
    }
    //if message type is char
    case 'char': {
      //update a specific character with the character provided
      const character = messageObject.data;
      charList[character.hash] = character;
      break;
    }
    //otherwise default
    default: {
      console.log('Type not recognized');
    }
  }
});

