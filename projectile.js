class Projectile {
	constructor(x, y, targetX, targetY, destructive=true, size=16) {
		this.pos = createVector(x, y); // Starting position
		this.vel = createVector(targetX - x, targetY - y).setMag(10); // Constant starting velocity
		this.gravity = 0.5; // Gravity effect
		this.radius = size; // Explosion radius
		this.exploded = false; // Whether the projectile has exploded
		this.destructive = destructive;
	}

	update() {
		if (!this.exploded) {
			this.vel.y += this.gravity; // Apply gravity
			this.pos.add(this.vel); // Update position

			// Check if the projectile hits the ground
			if (isGround(this.pos.x, this.pos.y)) {
				this.explode();
			}
		}
	}

	explode() {
		modifyTerrain(this.pos.x, this.pos.y, this.radius, !this.destructive); // Explode terrain
		this.exploded = true; // Mark as exploded
		drawTerrainBuffer()
	}

	display() {
		if (!this.exploded) {
			fill(255, 0, 0); // Red projectile
			noStroke();
			ellipse(this.pos.x, this.pos.y, 10, 10); // Draw projectile
		}
	}
}