const flock = [];

let alignSlider, cohesionSlider, separationSlider;

function setup() {
  // Set the canvas to fill the whole screen
  colorMode(HSB, 360, 100, 100)
  //alignSlider = createSlider(0, 2, 1.5, 0.1);
  //cohesionSlider = createSlider(0, 2, 1, 0.1);
  //separationSlider = createSlider(0, 2, 1.3, 0.1);
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 300; i++) {
    flock.push(new Unit());
  }
} 

function draw() {
  background(0);
  for (let boid of flock) {
    boid.edges();
    boid.flock(flock);
    boid.update();
    boid.show();
  }
}

// Add this function to resize the canvas when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
