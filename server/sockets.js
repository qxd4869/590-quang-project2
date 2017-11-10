// fast hashing library
const xxh = require('xxhashjs');
// node built-in module to start separate processes
// managed by this node process. This means they will
// have separate memory and processing (can run across processor cores)
const child = require('child_process');
// Character custom class
const Character = require('./messages/Character.js');
// Custom message class for sending messages to our other process
const Message = require('./messages/Message.js');

// object to hold user character objects
const charList = {};

//socketio server instance
let io;

// Possible directions a user can move
// their character. These are mapped
// to integers for fast/small storage
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

// start a child process for our custom physics file 
// This will kick off a process of that file and execute it
// as a separate node process. When it completes it will call
// close (when the process completely ends) and 
// exit (when the process finishes processing, but might have streams open)
// Ours will not exit because it is running a timer to constantly check 
// calculations for us. In this case, it will only close/exit on failure.
/**
  Please note: These separate processes can only communicate via a messaging 
  system. They do not share memory or scope so transferring data/variables
  has to happen through messages. Calling functions in the other process
  must also happen through messages.
**/
const physics = child.fork('./server/physics.js');

// when we receive a message object from our physics process
physics.on('message', (m) => {
    //since we are using a custom message object with a type
    //we know we can check the type field to see what type of
    //message we are receiving
    switch (m.type) {
      //if the message type is 'attackHit'
      case 'attackHit': {
          //send out the attackHit event to all users along
          //with the data we received from the physics message
          io.sockets.in('room1').emit('attackHit', m.data);
          break;
      }
      case 'speedUpdate': {
          if(charList[m.data.hash]){
            //send out the attackHit event to all users along
            //with the data we received from the physics message
            charList[m.data.hash].speedX = m.data.speedX;
            charList[m.data.hash].speedY = m.data.speedY;
          }
          break;
      }
      case 'crashCollision': {
          charList[m.data.first.hash] = m.data.first;
          //console.log(m.data.first.speedX);
          // update the timestamp of the last change for this character
          charList[m.data.first.hash].lastUpdate = new Date().getTime();
          charList[m.data.second.hash] = m.data.second;
          // update the timestamp of the last change for this character
          charList[m.data.second.hash].lastUpdate = new Date().getTime();
          break;
      }
      //otherwise we will assume we do not recongize the message type
      default: {
          console.log('Received unclear type from physics');
      } 
    }
});

//when we receive an error from our physics process
physics.on('error', (error) => {
  //console.dir(error);
});

//when our physics process closes - meaning the process exited
//and all streams/files/etc have been closed
physics.on('close', (code, signal) => {
  console.log(`Child closed with ${code} ${signal}`);
});

//when our physics process exits - meaning it finished processing
//but there might still be streams/files/etc open
physics.on('exit', (code, signal) => {
  console.log(`Child exited with ${code} ${signal}`);
});

/**
  send our character list over to physics to populate its character list.
  We use our custom message type so we can send consistent messages between
  processes. 
  
  We have to send messages because other node processes are separate and do
  not share memory or scope. We can only transfer data or call functions
  through sending a message as physics.send(). Similarly, the other process
  will have an 'on' listener for the message.
**/
physics.send(new Message('charList', charList));

// function to setup our socket server
const setupSockets = (ioServer) =>  {
  // set our io server instance
  io = ioServer;

  // on socket connections
  io.on('connection', (sock) => {
    const socket = sock;

    // join user to our socket room
    socket.join('room1');

    // create a unique id for the user based on the socket id and time
    const hash = xxh.h32(`${socket.id}${new Date().getTime()}`, 0xCAFEBABE).toString(16);

    // create a new character and store it by its unique id
    charList[hash] = new Character(hash);

    // add the id to the user's socket object for quick reference
    socket.hash = hash;

    // emit a joined event to the user and send them their character
    socket.emit('joined', charList[hash]);

    // when this user sends the server a movement update
    socket.on('movementUpdate', (data) => {
      // update the user's info
      // NOTICE: THIS IS NOT VALIDED AND IS UNSAFE
      
      //const{speedX, speedY, ...others} = data;
 
  
      charList[socket.hash].x = data.x;
      charList[socket.hash].y = data.y; 
      charList[socket.hash].prevX = data.prevX; 
      charList[socket.hash].prevY = data.prevY; 
      charList[socket.hash].destX = data.destX; 
      charList[socket.hash].destY = data.destY;
      charList[socket.hash].direction = data.direction;
      charList[socket.hash].moveLeft = data.moveLeft; 
      charList[socket.hash].moveUp = data.moveUp; 
      charList[socket.hash].moveDown = data.moveDown; 
      charList[socket.hash].moveRight = data.moveRight; 
      
      // update the timestamp of the last change for this character
      charList[socket.hash].lastUpdate = new Date().getTime();
      
      //console.log(charList[socket.hash]);
      // update our physics simulation with the character's updates
      physics.send(new Message('charList', charList));
      
      
      // notify everyone of the user's updated movement
      io.sockets.in('room1').emit('updatedMovement', charList[socket.hash]);
    });


    // when the user disconnects
    socket.on('disconnect', () => {
      // let everyone know this user left  
      io.sockets.in('room1').emit('left', charList[socket.hash]);
      // remove this user from our object
      delete charList[socket.hash];
      // update the character list in our physics calculations
      physics.send(new Message('charList', charList));

      // remove this user from the socket room
      socket.leave('room1');
    });
  });
};

module.exports.setupSockets = setupSockets;
