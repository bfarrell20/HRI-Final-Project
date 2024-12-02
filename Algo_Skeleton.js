/*
 * changes needed: 
 * change distance to an integer instead of a float
 * figure out better behavior for the waiting for collision state...it's hard to prevent it from hanging
 * it reads out underscores, so maybe we shouldn't have it announce the state has changed in the final product
*/

// Define states
const STATES = {
    WAITING_FOR_COLLISION: 'WAITING_FOR_COLLISION',
    MOVING_FORWARD: 'MOVING_FORWARD',
    MOVING_BACKWARD: 'MOVING_BACKWARD',
    TERMINAL: 'TERMINAL',
  };
const STATE_COLORS = {
	WAITING_FOR_COLLISION: { r: 102, g: 255, b: 255 }, //blue
	MOVING_FORWARD: { r: 90, g: 255, b: 90 }, //green
	MOVING_BACKWARD: { r: 102, g: 255, b: 255 }, //yellow
	TERMINAL: { r: 255, g: 102, b: 102 }, //red
};
  
  let currentState = STATES.WAITING_FOR_COLLISION;
  let startPosition = null;
  let first_distance = 0;
  let final_distance = 0;
  
  
  // Function to change state and update LED color
  async function changeState(newState) {
    currentState = newState;
    let color = STATE_COLORS[newState];
    await setMainLed(color);
    await speak(`State changed to ${newState}`);
  }
  
  // Collision handler
  async function onCollision() {
    await speak("Collision Detected");
    switch (currentState) {
      case STATES.WAITING_FOR_COLLISION:
        await changeState(STATES.MOVING_FORWARD);
        break;
      case STATES.MOVING_FORWARD:
        final_distance = await getDistance();
		await spin(180, 1);
        await changeState(STATES.MOVING_BACKWARD);
        break;
      case STATES.MOVING_BACKWARD:
        await changeState(STATES.TERMINAL);
        break;
    }
  }
  
  // Main FSM loop
  async function fsmLoop() {
    while (true) {
      switch (currentState) {
        case STATES.WAITING_FOR_COLLISION:
            //store starting position
          first_distance = await getDistance();
          await delay(5);
		  await changeState(STATES.MOVING_FORWARD);
          break;
  
        case STATES.MOVING_FORWARD:
          await roll(0, 50, 20); // Roll forward
          break;
  
        case STATES.MOVING_BACKWARD:
            //Move back to user and get distance traveled
          final_distance = await getDistance();
          await roll(0, 50, 20);
          await changeState(STATES.TERMINAL);
          break;
  
        case STATES.TERMINAL:
          if (final_distance == 0) {
              await speak("No obstacles detected.");
          }
          else {
              distance = final_distance - first_distance;
              text = "Obstacle detected at " + distance.toString() + " centimeters.";
              await speak(text);
          }
          await speak("Program ended.");
          await exitProgram();
          break;
      }
    }
  }
  
  // Register collision event
  registerEvent(EventType.onCollision, onCollision);
  
  // Start the program
  async function startProgram() {
    await changeState(STATES.WAITING_FOR_COLLISION); // Set initial state
    await fsmLoop();
  }
  
