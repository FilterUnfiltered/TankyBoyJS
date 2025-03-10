
let terrain;


function isGround(x, y) {
	// Convert pixel coordinates to grid coordinates
	let col = floor(x / resolution);
	let row = floor(y / resolution);

	// Ensure the coordinates are within the bounds of the terrain array
	if (col >= 0 && col < cols && row >= 0 && row < rows) {
		return getTerrain(col, row) === 1; // 1 = ground, 0 = air
	}
	return false; // Out of bounds is considered air
}

function stepsToAir(x, y) {
	let steps = 0;
	let currentY = y;

	// Loop upward until air is found or we go out of bounds
	while (currentY >= 0) {
		if (!isGround(x, currentY)) { // If it's air
			return steps;
		}
		steps++; // Increment step count
		currentY -= resolution; // Move up by resolution
	}

	// If we reach the top of the canvas without finding air
	return steps;
}

// Function to access terrain data
function getTerrain(x, y) {
    return terrain[x + y * cols];
}

function setTerrain(x, y, value) {
    terrain[x + y * cols] = value;
}

// Optimized destroyTerrain function
function modifyTerrain(px, py, radius, value) {
    let cx = floor(px / resolution);
    let cy = floor(py / resolution);
    let radiusSq = radius * radius;

    for (let x = -radius; x <= radius; x++) {
        for (let y = -radius; y <= radius; y++) {
            if (x * x + y * y < radiusSq) {
                let nx = cx + x;
                let ny = cy + y;
                if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
                    setTerrain(nx, ny, value);
                }
            }
        }
    }
}

function drawTerrainBuffer() {
	terrainBuffer.background(135, 206, 235); // Clear buffer with sky blue
	terrainBuffer.noStroke(); // Disable stroke for filled shapes

	// Draw green ground
	for (let x = 0; x < cols; x++) {
		for (let y = 0; y < rows; y++) {
			if (getTerrain(x, y) === 1) { // If it's ground
				terrainBuffer.fill(34, 139, 34); // Green color
				terrainBuffer.rect(x * resolution - 1, y * resolution - 1, resolution, resolution);
			}
		}
	}

	// Draw Marching Squares lines (optional, for visual detail)
	terrainBuffer.stroke(0);
	terrainBuffer.strokeWeight(2);
	terrainBuffer.noFill();
	for (let x = 0; x < cols - 1; x++) {
		for (let y = 0; y < rows - 1; y++) {
			let x0 = x * resolution;
			let y0 = y * resolution;

			// Get state of 4 corners
			let a = getTerrain(x, y);
			let b = getTerrain(x + 1, y);
			let c = getTerrain(x + 1, y + 1);
			let d = getTerrain(x, y + 1);
			let state = getState(a, b, c, d);

			// Interpolated Midpoints
			let mx = resolution / 2;
			let my = resolution / 2;
			let midX = x0 + mx;
			let midY = y0 + my;

			// Smoother Marching Squares Lines
			terrainBuffer.beginShape();
			switch (state) {
				case 1: terrainBuffer.vertex(x0, midY); terrainBuffer.vertex(midX, y0 + resolution); break;
				case 2: terrainBuffer.vertex(midX, y0 + resolution); terrainBuffer.vertex(x0 + resolution, midY); break;
				case 3: terrainBuffer.vertex(x0, midY); terrainBuffer.vertex(x0 + resolution, midY); break;
				case 4: terrainBuffer.vertex(midX, y0); terrainBuffer.vertex(x0 + resolution, midY); break;
				case 5: terrainBuffer.vertex(midX, y0); terrainBuffer.vertex(midX, y0 + resolution); break;
				case 6: terrainBuffer.vertex(midX, y0); terrainBuffer.vertex(x0 + resolution, midY);
					terrainBuffer.vertex(midX, y0 + resolution); break;
				case 7: terrainBuffer.vertex(midX, y0); terrainBuffer.vertex(x0 + resolution, midY); break;
				case 8: terrainBuffer.vertex(x0, midY); terrainBuffer.vertex(midX, y0); break;
				case 9: terrainBuffer.vertex(x0, midY); terrainBuffer.vertex(midX, y0 + resolution);
					terrainBuffer.vertex(midX, y0); break;
				case 10: terrainBuffer.vertex(midX, y0); terrainBuffer.vertex(midX, y0 + resolution); break;
				case 11: terrainBuffer.vertex(x0, midY); terrainBuffer.vertex(x0 + resolution, midY); break;
				case 12: terrainBuffer.vertex(midX, y0); terrainBuffer.vertex(x0 + resolution, midY); break;
				case 13: terrainBuffer.vertex(midX, y0); terrainBuffer.vertex(x0 + resolution, midY); break;
				case 14: terrainBuffer.vertex(x0, midY); terrainBuffer.vertex(midX, y0); break;
			}
			terrainBuffer.endShape();
		}
	}
}

function getState(a, b, c, d) {
	return a * 8 + b * 4 + c * 2 + d * 1;
}