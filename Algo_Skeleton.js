// Define states
const STATES = {
    WAITING_FOR_COLLISION: 'WAITING_FOR_COLLISION',
    MOVING_FORWARD: 'MOVING_FORWARD',
    MOVING_BACKWARD: 'MOVING_BACKWARD',
    TERMINAL: 'TERMINAL',
  };
  
  let currentState = STATES.WAITING_FOR_COLLISION;
  let startPosition = null;
  
  
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
          break;
  
        case STATES.MOVING_FORWARD:
          await roll(0, 50, 2); // Roll forward
          break;
  
        case STATES.MOVING_BACKWARD:
            //Move back to user and get distance traveled
          await changeState(STATES.TERMINAL);
          break;
  
        case STATES.TERMINAL:
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
  