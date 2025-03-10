let platformWidth = 50; // Width of the platform in pixels
let platformHeight = 10; // Height of the platform in pixels
let platformRotation = 0;

function placePlank(placeX, placeY, rotation) {
	// Convert mouse position to grid coordinates
	let centerX = placeX;
	let centerY = placeY;
	// Convert rotation from degrees to radians
	let angle = radians(rotation);

	// Loop through the platform's area
	for (let x = -platformWidth / 2; x < platformWidth / 2; x++) {
		for (let y = -platformHeight / 2; y < platformHeight / 2; y++) {
			// Apply rotation to the platform's local coordinates
			let rotatedX = x * cos(angle) - y * sin(angle);
			let rotatedY = x * sin(angle) + y * cos(angle);

			// Convert back to grid coordinates
			let gridX = floor((centerX + rotatedX) / resolution);
			let gridY = floor((centerY + rotatedY) / resolution);

			// Ensure the coordinates are within the terrain bounds
			if (gridX >= 0 && gridX < cols && gridY >= 0 && gridY < rows) {
				setTerrain(gridX, gridY, 1); // Set the cell to ground
			}
		}
	}

	// Redraw the terrain buffer to reflect the changes
	drawTerrainBuffer();
	platformRotation = 0;
}

function drawPlatformPreview(placeX, placeY, previewRotation) {
	// Convert mouse position to grid coordinates
	let centerX = placeX / resolution;
	let centerY = placeY / resolution;

	// Convert rotation from degrees to radians
	let angle = radians(previewRotation);

	// Set preview style
	fill(0, 255, 0, 100); // Semi-transparent green
	noStroke();

	// Loop through the platform's area
	for (let x = -platformWidth / 4; x < platformWidth / 4; x++) {
		for (let y = -platformHeight / 4; y < platformHeight / 4; y++) {
			// Apply rotation to the platform's local coordinates
			let rotatedX = x * cos(angle) - y * sin(angle);
			let rotatedY = x * sin(angle) + y * cos(angle);

			// Convert back to pixel coordinates
			let pixelX = (centerX + rotatedX) * resolution;
			let pixelY = (centerY + rotatedY) * resolution;

			// Draw the preview rectangle
			rect(pixelX, pixelY, resolution, resolution);
		}
	}
}