
class Unit {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.maxForce = 0.05;
    this.maxSpeed = 2;
  }

  edges() {
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }
    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }
  }

  align(units) {
    let perceptionRadius = 15;
    let steering = createVector();
    let total = 0;
    for (let other of units) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  separation(units) {
    let perceptionRadius = 24;
    let steering = createVector();
    let total = 0;
    for (let other of units) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d * d);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  cohesion(units) {
    let perceptionRadius = 50;
    let steering = createVector();
    let total = 0;
    for (let other of units) {
      let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if (other != this && d < perceptionRadius) {
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  flock(units) {
    let alignment = this.align(units);
    let cohesion = this.cohesion(units);
    let separation = this.separation(units);
    let mouseAvoidance = this.avoidMouse(); 

    //alignment.mult(alignSlider.value());
    //cohesion.mult(cohesionSlider.value());
    //separation.mult(separationSlider.value());

    alignment.mult(1.5);
    cohesion.mult(1);
    separation.mult(1.3);
    mouseAvoidance.mult(1.5);

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
    this.acceleration.add(mouseAvoidance);
  }

  avoidMouse() {
    let mousePosition = createVector(mouseX, mouseY);
    let perceptionRadius = 100; // Distance at which units start avoiding the mouse
    let avoidanceForce = createVector(); // Force to steer away from the mouse

    let d = dist(this.position.x, this.position.y, mousePosition.x, mousePosition.y);
    if (d < perceptionRadius) {
      let diff = p5.Vector.sub(this.position, mousePosition); // Calculate vector pointing away from the mouse
      diff.normalize(); // Normalize to get direction
      diff.div(d); // Weight by distance (closer means stronger force)
      avoidanceForce.add(diff);
    }

    if (avoidanceForce.mag() > 0) {
      avoidanceForce.setMag(this.maxSpeed); // Set to max speed
      avoidanceForce.sub(this.velocity); // Steering = Desired - Velocity
      avoidanceForce.limit(this.maxForce); // Limit the force
    }
    return avoidanceForce;
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
  }

  show() {
    let arrowSize = 30;
  
    // Calculate the heading from the velocity
    let heading = this.velocity.heading();
    
    // Normalize the heading to a value between 0 and 360 for hue
    // Note: The heading can range from -PI to PI, so we map from 0 to TWO_PI to ensure a positive range
    let hue = map((heading + PI), 0, TWO_PI, 0, 360);
    
    // Set the color to a hue based on the unit's orientation with full saturation and brightness
    let boidColor = color(hue, 100, 100);
    
    push();
    translate(this.position.x, this.position.y);
    rotate(heading); // Use the actual heading for rotation
    
    strokeWeight(5);
    stroke(boidColor); // Use the hue-based color
    
    // Draw the arrow: line for the body and two lines for the arrowhead
    line(0, 0, arrowSize, 0); // Arrow body
    line(arrowSize, 0, arrowSize - 8, -8); // Arrowhead left
    line(arrowSize, 0, arrowSize - 8, 8); // Arrowhead right
    
    pop();
  }
  
  


}
