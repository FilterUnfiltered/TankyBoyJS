let cols, rows;
let resolution = 2;  // Size of each terrain cell
let player1, player2;
let terrainBuffer;
let projectiles = []; // Active projectile
let rotating = 0;
let img;
let platforms = [];
let p1d = 0;
let p2d = 0;
let p1p = 0;
let p2p = 0;

function preload() {
	img = loadImage("platforms.png")
}


function setup() {
	let existingCanvas = document.getElementById('game');

	canvas = createCanvas(400, 700, existingCanvas);
	canvas.elt.focus();

	frameRate(60);
	cols = width / resolution;
	rows = height / resolution;
	terrain = new Uint8Array(cols * rows);
	terrainBuffer = createGraphics(width, height);
	extractPlatforms(); // Extract the platforms from the image
	generateWorld();

	//for (let i = 0; i < cols * rows; i++) {
	//	if (i > rows * cols / 2) {
	//		console.log("hi")
	//		terrain[i] = 1;
	//	}
	//}


	player1 = new Player(width / 3, 50, "red");
	player2 = new Player(2 * width / 3, 50, "blue");
	drawTerrainBuffer();  // Draw initial terrain to buffer
}

function extractPlatforms() {
	// Extract each 14x14 platform from the 42x42 image
	for (let y = 0; y < 3; y++) {
		for (let x = 0; x < 3; x++) {
			let platform = createImage(14, 14);
			platform.copy(img, x * 14, y * 14, 14, 14, 0, 0, 14, 14);
			platforms.push(platform);
		}
	}
}

function generateWorld() {
	// Randomly select a platform
	let selectedPlatform = random(platforms);

	// Randomly scale the platform (1x to 8x)
	let scaleFactor = floor(random(1, 9)); // Random scale between 1 and 8
	selectedPlatform = scaleImage(selectedPlatform, scaleFactor);

	// Randomly rotate the platform (0°, 90°, 180°, 270°)
	let rotation = floor(random(4)) * 90;
	selectedPlatform = rotateImage(selectedPlatform, rotation);

	// Randomly mirror the platform (none, horizontal, vertical)
	let mirror = random(['none', 'horizontal', 'vertical']);
	if (mirror === 'horizontal') {
		selectedPlatform = mirrorImage(selectedPlatform, 'horizontal');
	} else if (mirror === 'vertical') {
		selectedPlatform = mirrorImage(selectedPlatform, 'vertical');
	}

	// Place the platform in the terrain
	placePlatform(selectedPlatform);
}

function scaleImage(img, scaleFactor) {
	let scaled = createImage(img.width * scaleFactor, img.height * scaleFactor);
	scaled.copy(img, 0, 0, img.width, img.height, 0, 0, scaled.width, scaled.height);
	return scaled;
}

function rotateImage(img, angle) {
	let rotated = createImage(img.width, img.height);
	rotated.loadPixels();
	img.loadPixels();

	for (let y = 0; y < img.height; y++) {
		for (let x = 0; x < img.width; x++) {
			let newX, newY;
			if (angle === 90) {
				newX = y;
				newY = img.width - x - 1;
			} else if (angle === 180) {
				newX = img.width - x - 1;
				newY = img.height - y - 1;
			} else if (angle === 270) {
				newX = img.height - y - 1;
				newY = x;
			} else { // 0 degrees (no rotation)
				newX = x;
				newY = y;
			}

			let srcIndex = (x + y * img.width) * 4;
			let dstIndex = (newX + newY * img.width) * 4;

			for (let i = 0; i < 4; i++) {
				rotated.pixels[dstIndex + i] = img.pixels[srcIndex + i];
			}
		}
	}

	rotated.updatePixels();
	return rotated;
}

function mirrorImage(img, axis) {
	let mirrored = createImage(img.width, img.height);
	mirrored.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
	if (axis === 'horizontal') {
		mirrored.loadPixels();
		for (let y = 0; y < img.height; y++) {
			for (let x = 0; x < img.width / 2; x++) {
				let index1 = (x + y * img.width) * 4;
				let index2 = ((img.width - x - 1) + y * img.width) * 4;
				for (let i = 0; i < 4; i++) {
					let temp = mirrored.pixels[index1 + i];
					mirrored.pixels[index1 + i] = mirrored.pixels[index2 + i];
					mirrored.pixels[index2 + i] = temp;
				}
			}
		}
		mirrored.updatePixels();
	} else if (axis === 'vertical') {
		mirrored.loadPixels();
		for (let y = 0; y < img.height / 2; y++) {
			for (let x = 0; x < img.width; x++) {
				let index1 = (x + y * img.width) * 4;
				let index2 = (x + (img.height - y - 1) * img.width) * 4;
				for (let i = 0; i < 4; i++) {
					let temp = mirrored.pixels[index1 + i];
					mirrored.pixels[index1 + i] = mirrored.pixels[index2 + i];
					mirrored.pixels[index2 + i] = temp;
				}
			}
		}
		mirrored.updatePixels();
	}
	return mirrored;
}

function generateWorld() {
	for (let i = 0; i < 100; i++) { // freq

		let selectedPlatform = random(platforms);

		// Randomly scale the platform (1x to 8x)
		let scaleFactor = floor(random(1, 9)); // Random scale between 1 and 8
		selectedPlatform = scaleImage(selectedPlatform, scaleFactor);

		// Randomly rotate the platform (0°, 90°, 180°, 270°)
		let rotation = floor(random(4)) * 90;
		selectedPlatform = rotateImage(selectedPlatform, rotation);

		// Randomly mirror the platform (none, horizontal, vertical)
		let mirror = random(['none', 'horizontal', 'vertical']);
		if (mirror === 'horizontal') {
			selectedPlatform = mirrorImage(selectedPlatform, 'horizontal');
		} else if (mirror === 'vertical') {
			selectedPlatform = mirrorImage(selectedPlatform, 'vertical');
		}

		// Place the platform in the terrain
		placePlatform(selectedPlatform);

	}

}

function placePlatform(platform) {
	// Example: Place the platform at a random position in the terrain
	let startX = floor(random(width - platform.width)); // Ensure platform fits within bounds
	let startY = floor(random(height - platform.height));

	for (let y = 0; y < platform.height; y++) {
		for (let x = 0; x < platform.width; x++) {
			let pixelColor = platform.get(x, y); // Use get() to retrieve pixel color
			let alpha = pixelColor[2]; // Get alpha value
			if (alpha == 0) { // If the pixel is not transparent
				setTerrain(startX + x, startY + y, 1); // Set terrain to filled
			}
		}
	}
}

function scaleImage(img, scaleFactor) {
	let scaled = createImage(img.width * scaleFactor, img.height * scaleFactor);
	scaled.copy(img, 0, 0, img.width, img.height, 0, 0, scaled.width, scaled.height);
	return scaled;
}

function draw() {
	background(135, 206, 235);  // Sky blue

	// Draw Terrain from Buffer
	image(terrainBuffer, 0, 0);

	// Update and Draw Player
	player1.update();
	player1.display();
	player2.update();
	player2.display();


	fill(player1.color)
	textSize(12);
	textAlign(LEFT, LEFT);
	text(`Destroy Cooldown: ${round(p1d/60, 2)}s`, 3, 10)
	text(`Place Cooldown: ${round(p1p/60, 2)}s`, 3, 22)

	fill(player2.color)
	textSize(12);
	textAlign(RIGHT, RIGHT);
	text(`Destroy Cooldown: ${round(p2d/60, 2)}s`, width-3, 10)
	text(`Place Cooldown: ${round(p2p/60, 2)}s`, width-3, 22)

	if (p1d > 0) {
		p1d -= 1;
	}

	if (p1p > 0) {
		p1p -= 1;
	}

	if (p2d > 0) {
		p2d -= 1;
	}

	if (p2p > 0) {
		p2p -= 1;
	}

	if (player1.outOfBounds()) {
		fill(player2.color)
		textSize(40);
		textAlign(CENTER, CENTER);
		text("Player 2 wins!", width / 2, height / 2)
	}

	if (player2.outOfBounds()) {
		fill(player1.color)
		textSize(40);
		textAlign(CENTER, CENTER);
		text("Player 1 wins!", width / 2, height / 2)
	}

	if (frameCount % 120 == 0) {
		projectiles.push(new Projectile(random(width), 0, random(width), height, true, 20));
	}

	for (let proj of projectiles) {
		proj.update();
		proj.display();
		if (proj.exploded) {
			projectiles.splice(projectiles.indexOf(proj), 1)
		}
	}

	platformRotation += rotating;

	drawPlatformPreview(mouseX, mouseY, platformRotation);
}

// Add keyPressed and keyReleased functions for movement
function keyPressed() {
	if (keyIsDown(LEFT_ARROW)) {
		player2.moveLeft();

	} if (keyIsDown(RIGHT_ARROW)) {
		player2.moveRight();

	} if (keyIsDown(65)) {
		player1.moveLeft();

	} if (keyIsDown(68)) {
		player1.moveRight();

	} if (keyIsDown(32)) {
		if (p1d == 0) {
			projectiles.push(player1.shoot());
			p1d = 120;
		}

	} if (keyIsDown(45)) {
		if (p2d == 0) {
			projectiles.push(player2.shoot());
			p2d = 120;
		}

	} if (keyIsDown(67)) {
		if (p1p == 0) {
			projectiles.push(player1.shoot(false));
			p1p = 120;
		}

	} if (keyIsDown(60)) {
		if (p2p == 0) {
			projectiles.push(player2.shoot(false));
			p2p = 120;
		}

	} if (keyIsDown(69)) {
		rotating = 1;

	} if (keyIsDown(81)) {
		rotating = -1;

	} if (keyIsDown(UP_ARROW)) {
		player2.rotateLeft();

	} if (keyIsDown(DOWN_ARROW)) {
		player2.rotateRight();

	} if (keyIsDown(87)) {
		player1.rotateLeft();

	} if (keyIsDown(83)) {
		player1.rotateRight();
	}


}

function keyReleased() {
	if (!(keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW))) {
		player2.stop();
	}

	if (!(keyIsDown(UP_ARROW) || keyIsDown(DOWN_ARROW))) {
		player2.stopRotating();
	}

	if (!(keyIsDown(65) || keyIsDown(68))) {
		player1.stop();
	}

	if (!(keyIsDown(87) || keyIsDown(83))) {
		player1.stopRotating();
	}

	if (!(keyIsDown(69) || keyIsDown(81))) {
		rotating = 0;
	}

}

function mousePressed() {
	//projectile = new Projectile(player.pos.x + player.width / 2, player.pos.y, mouseX, mouseY);
	placePlank(mouseX, mouseY, platformRotation);
}