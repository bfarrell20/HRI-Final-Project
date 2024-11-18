async function onCollision() {
	await roll(0,0, 0);
	await speak("Collision Detected");
	await spin(180,1);
	
}


registerEvent(EventType.onCollision, onCollision);

async function startProgram() {
	await delay(2);
	setSpeed(100);
				
}