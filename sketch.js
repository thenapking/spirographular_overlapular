let cirPath = [];
let triPath = [];
let currentPath = [];

let spacer = 2.5; // for the concentric circles
let moire = 0.75;//
let scale = 1;

let radius = 1;
let f = 7; // number of circles

// draw the hexagon
let spacing = 6; // some values will not work
let n_sides = 6; //less than 7, more than 2.
let div = 360/n_sides;


var t=0;
var speed = 2;
var pulse_speed = 0.33; // higher is slower
var pulse_offset = 135; // higher is slower


function setup_art() {
  colorMode(HSB, 360);
  strokeWeight(0.5);
  angleMode(DEGREES);
  noFill();
  stroke(360);
  populate_arrays();
}

function draw_art() {
  let p = cos(t/pulse_speed+pulse_offset);
  let amt = ease(p);
  p = cos(4*t/3)*sin(4*t/3);
  amt = constrain(p, 0, 1);
  
  // only calculate the morph once per frame to save CPU
  morph_shape(amt);
  
  for(let i=-f; i<0; i++){
    draw_multiple(amt, 0, spacer*i/(f-i), -i*spacer*f*2, i);
  }
  
}

function draw_multiple(amt, x_c, y_c, r, i){
  for(let th = 0; th<360; th+=moire){
    //this aligns it to centre
    let x = cos(th)*cos(th)-0.5; 
    // this helps vertical alignment but also contributes to error
    let y = cos(th)*sin(th)+0.24; 
    // colour
    let c = map(double_easy(th, t),-1,1,0,360); 
    // alpha
    let a = map(-6*i,0,15*7,0,96); 

    draw_shape(amt, x + x_c, y + y_c, c, a, r*scale, r*scale);
    
  }
}

function draw_shape(amt, x, y, c, a, inner_radius, outer_radius){
  stroke(c, 360, 360, a);
  beginShape();
    for (let i = 0; i < cirPath.length; i++) {
      let x_coord = outer_radius*currentPath[i].x + inner_radius*x;
      let y_coord = outer_radius*currentPath[i].y + inner_radius*y;
      vertex(x_coord, y_coord);
    }
  endShape(CLOSE);
}

///////////////////////////////////////////////////////////////////
// Code to switch between hex and circle

function morph_shape(amt){
  for (let i = 0; i < cirPath.length; i++) {
    currentPath[i] = morph_vertex(i, amt);
  }
}

function morph_vertex(i, amt){
  let cv = cirPath[i];
  let tv = triPath[i];
  let x = lerp(cv.x, tv.x, amt);
  let y = lerp(cv.y, tv.y, amt);
  
  return createVector(x, y);
}

function populate_arrays(){
  let startA = 0;
  let endA = div;
  let start = polarToCartesian(radius, startA);
  let end = polarToCartesian(radius, endA);
  
  for (let a = startA; a < 360; a += spacing) {
    let nv = polarToCartesian(0, a);
    currentPath.push(nv);
    
    let cv = polarToCartesian(radius, a);
    cirPath.push(cv);
    
    let amt = (a % div) / (endA - startA);
    let tv = p5.Vector.lerp(start, end, amt);
    triPath.push(tv);

    if ((a + spacing) % div === 0) {
      startA = startA + div;
      endA = endA + div;
      start = polarToCartesian(radius, startA);
      end = polarToCartesian(radius, endA);
    }
  }
}

/////////////////////////////////////////////////////////

function ease(p) {
  p = constrain(p, 0, 1);
  return 3*pow(p,2) - 2*pow(p,3);
}

function double_easy(th, t) {
  return cos(th-t)*sin(th+t)
}

function polarToCartesian(r, angle) {
  return createVector(r * cos(angle), r * sin(angle));
}

////////////////////////////////////////////////////////

function setup_frame(){
  // scaling has to be done this way because image was
  // hardcoded to work for 800x800
  scale = width/800
  height_correct = 240*scale
  translate(width/2, height/2+height_correct);
  // define time
  t = round(speed * frameCount * fps / desired_fps);
  console.log(t)
  
  blendMode(BLEND);
  background(0);
  blendMode(ADD); // Makes it brighter
}



