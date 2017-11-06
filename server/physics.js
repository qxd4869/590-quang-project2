// our custom message class for sending message back
// to the main process
const Message = require('./messages/Message.js');

let charList = {}; // list of characters
const attacks = []; // array of attack to handle

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
 
    for (let j = 0; j < keys.length; j++) {
      const char1 = characters[keys[j]];
      for (let k = j +1; k < keys.length; k++) {
         const char2 = characters[keys[k]];
         const hit = checkCollisions(char1, char2, 61, 121);
     
         if(hit){
           let data;
           data.first = char1;
           data.second = char2;
           process.send(new Message('crashCollision', data));
         }
         else {
                  
         }
      } 
    } 
};

const crashHelper = (character) => {
  switch(character.direction)
  {
    case directions.DOWN: {
      character.speedY = -4;
      break;
    }
    // if left, set the height/width of attack to face left
    // and offset attack left from user
    case directions.LEFT: {
      character.speedX = 1;
      break;
    }
    // if right, set the height/width of attack to face right
    // and offset attack right from user
    case directions.RIGHT: {
      break;
    }
    // if up, set the height/width of attack to face up
    // and offset attack upward from user
    case directions.UP: {
      break;
    }
  }
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
    //if message type is attack
    case 'attack': {
      //add our attack object from the message
      attacks.push(messageObject.data);
      break;
    }
    //otherwise default
    default: {
      console.log('Type not recognized');
    }
  }
});

