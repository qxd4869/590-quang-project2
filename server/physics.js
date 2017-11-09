// our custom message class for sending message back
// to the main process
const Message = require('./messages/Message.js');

let charList = {}; // list of characters
const attacks = []; // array of attack to handle
const directions = {
  DOWNLEFT: 0,
  DOWN: 1,
  DOWNRIGHT: 2,
  LEFT: 3,
  UPLEFT: 4,
  RIGHT: 5,
  UPRIGHT: 6,
  UP: 7,
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
     process.send(new Message('speedUpdate', data));
      
    }  
  
    for (let j = 0; j < keys.length; j++) {
      let char1 = characters[keys[j]];
      for (let k = j +1; k < keys.length; k++) {
         let char2 = characters[keys[k]];
         const hit = checkCollisions(char1, char2, 61, 121);
      
         if(hit){
              
           characters[keys[j]].speedX = crashHelper(keys[j]).speedX;
           characters[keys[j]].speedY = crashHelper(keys[j]).speedY;
           characters[keys[k]].speedX = crashHelper(keys[k]).speedX;
           characters[keys[k]].speedY = crashHelper(keys[k]).speedY;
           
           data = {};
           data.first = characters[keys[j]];
           data.second = characters[keys[k]];
           process.send(new Message('crashCollision', data));
           
         }
      } 
   } 
};

const crashHelper = (characterHash) =>  {
  let speedX = 0;
  let speedY = 0;
  switch(charList[characterHash].direction)
  {
    case directions.DOWN: {
      speedY = -4;
      break;
    }
    // if left, set the height/width of attack to face left
    // and offset attack left from user
    case directions.LEFT: {
      speedX = 4;
      break;
    }
    // if right, set the height/width of attack to face right
    // and offset attack right from user
    case directions.RIGHT: {
      speedX = -4;
      break;
    }
    // if up, set the height/width of attack to face up
    // and offset attack upward from user
    case directions.UP: {
      speedY = 4;
      break;
    }
  }
  
  return {speedX, speedY};
} 

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

