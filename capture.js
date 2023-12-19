// Extract files to a folder. Open PowerShell to that folder and use this command:
// ffmpeg -r 28.8 -f image2 -s 400x400 -i "%07d.png" -vcodec libx264 -crf 17 -pix_fmt yuv420p output.mp4
// ffmpeg -i output.mp4 -pix_fmt rgb24 -s 200x200 output4.gif

// TODO
// Fix code so it can resize image without zooming (DONE)
// Add to Github (DONE)
// Get pulsing in time (Colour is in time)
// Use a different easing function to get it in sync

// Output of this turns out to be at 133.33bpm
// Easiest solution is to re-render at a different frame rate
// sun osc is 128 bpm

// ffmpeg -i output_Y.mp4 -vf scale=400:400 output_Ys.mp4

var capture = true;

let three_sixty = 0;
var startMillis;
var fps = 25;
var desired_fps = 30;
var increments_per_cycle = 360;
var number_of_cycles = 2;
var max_t = increments_per_cycle * number_of_cycles;
var desiredFrameCount = max_t * desired_fps / fps;
var duration_s = desiredFrameCount / fps;

var capturer = new CCapture({
  format: 'png',
  framerate: fps
});

function setup() {
  createCanvas(400,400)
	frameRate(fps);
  // prevent overlapping the circles at 360 by subtracting a small number
  // cannot be done above because PI not defined
  three_sixty = TWO_PI-0.02;
  if(capture){capturer.start()};
  setup_art()
  draw(); //why we need to manually call this I don't know
}


function draw() {
  
  var duration_ms = duration_s * 1000;
  var frameErrorCount = 1;
  var totalFrameCount = fps * duration_s - frameErrorCount;



  if (capture && (frameCount == desiredFrameCount)) {
    noLoop();
    console.log('finished recording.');
    capturer.stop();
    capturer.save();
    return;
  }
	
	// ACTUAL DRAW FUNCTIONS HERE
  setup_frame();
  draw_art()
  
  capturer.capture(document.getElementById('defaultCanvas0'));
}
