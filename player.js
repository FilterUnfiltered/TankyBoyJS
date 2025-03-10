class Player {

	constructor(x, y, color) {
		this.pos = createVector(x, y);
		this.vel = createVector(0, 0);
		this.width = 30;
		this.height = 20;
		this.maxClimb = 3;  // Maximum height the player can climb
		this.gravity = 0.5;
		this.speed = 2;
		this.onGround = false;
		this.color = color
		this.cannon_rotation = 0;
		this.rotationVelocity = 0;
	}

	update() {
		this.vel.y += this.gravity;
		this.cannon_rotation += this.rotationVelocity;

		fall:
		for (let pixel = 0; pixel < this.vel.y; pixel++) {
			for (let checkPos = 0; checkPos <= this.width; checkPos += resolution) {
				if (isGround(this.pos.x + checkPos, this.pos.y + this.height + 1)) {
					this.vel.y = 0;
					break fall;
				}
			}
			this.pos.y += 1;
		}

		shouldgo:
		switch (this.vel.x) {
			case (this.speed): {

				let climb = stepsToAir(this.pos.x + this.width + this.vel.x, this.pos.y + this.height)
				for (let checkPos = 0; checkPos <= this.height; checkPos++) {
					let potential = stepsToAir(this.pos.x + this.width + this.vel.x, this.pos.y + this.height - checkPos)
					if (potential > climb) {
						console.log("wall");
						break shouldgo;
					}
				}

				if (climb <= this.maxClimb) {
					this.pos.x += this.vel.x;
					this.pos.y -= climb;
				}
				break;
			}
			case (-this.speed): { // going left
				let climb = stepsToAir(this.pos.x + this.vel.x, this.pos.y + this.height)
				for (let checkPos = 0; checkPos <= this.height; checkPos++) {
					let potential = stepsToAir(this.pos.x + this.vel.x, this.pos.y + this.height - checkPos)
					if (potential > climb) {
						console.log("wall", potential, climb);
						break shouldgo;
					}
				}
				if (climb <= this.maxClimb) {
					this.pos.x += this.vel.x;
					this.pos.y -= climb;
				}
				break;
			}
		}

	}

	outOfBounds() {
		return (
			this.pos.x + this.width < 0 || // Left boundary
			this.pos.x > width || // Right boundary
			this.pos.y + this.height < 0 || // Top boundary
			this.pos.y > height // Bottom boundary
		);
	}

	rotateLeft() {
		this.rotationVelocity = -2;
	}

	rotateRight() {
		this.rotationVelocity = 2;
	}

	stopRotating() {
		this.rotationVelocity = 0;
	}

	moveLeft() {
		this.vel.x = -this.speed;
	}

	moveRight() {
		this.vel.x = this.speed;
	}

	stop() {
		this.vel.x = 0;
	}

	display() {
		fill(this.color);
		stroke(1);
		rect(this.pos.x, this.pos.y, this.width, this.height);
		push()
		translate(this.pos.x + this.width / 2, this.pos.y + 3);
		rotate(radians(this.cannon_rotation));
		rectMode(CENTER);
		rect(this.width / 2, 0, this.width, 10)
		pop()
	}

	shoot(destructive = true) {
		let tip = createVector(this.width, 0);

		// Rotate the vector by the cannon's rotation
		tip.rotate(radians(this.cannon_rotation));

		// Add the translation offset to get the global position
		let globalTip = createVector(this.pos.x + this.width / 2, this.pos.y + 3).add(tip);

		let direction = createVector(100, 0).rotate(radians(this.cannon_rotation));

		let directionTip = globalTip.copy().add(direction);

		return new Projectile(globalTip.x, globalTip.y, directionTip.x, directionTip.y, destructive)
	}
}