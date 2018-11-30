////////// get the canvas and contex //////////

var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext('2d');

///////// you can change the background color here //////////
//c.fillStyle = 'rgb(187, 202, 212)'
//c.fillRect(100, 100, 100, 100);

//////////////use code below to make random background every time you refresh the page//////////////
////////////// the background is biased towrads darker color ///////////
//c.fillStyle = '#' + (Math.floor(Math.random()*50)+50).toString(16) + (Math.floor(Math.random()*50)+50).toString(16) + (Math.floor(Math.random()*50)+50).toString(16);
//c.fillRect(0, 0, canvas.width, canvas.height);

///////// the color was generated form https://coolors.co/c5c3c6-46494c-ffaddb-4c5c68-1985a1 /////////
///////// the colors are matching and looks nice ////////////
/////////  you can use random color if you like, for that, use commented code described below //////////
let colorArray = [
  {red: 58, green: 79, blue: 65},
  {red: 185, green: 49, blue: 79},
  {red: 255, green: 173, blue: 219},
  {red: 213, green: 161, blue: 142},
  {red: 25, green: 133, blue: 161}
];

////////// to store the mouse position //////////
let mouse = {
  x: undefined,
  y: undefined
};

////////// this function is called whenever you move yor mouse and stores its position //////////
////////// he event is an object which has the current mouse coordinates //////////
window.addEventListener('mousemove', (event) => {
  //console.log(event);
  mouse.x = event.x;
  mouse.y = event.y;
});

////////// whenever window is re-sized, re-create new circles by calling init() //////////
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

////////// circle constructor //////////
function Circle(center_x, center_y, radius, vel_x, vel_y, color_r, color_g, color_b) {
  this.centerX = center_x;
  this.centerY = center_y;
  this.radius = radius;
  this.preRad = radius;        ////// keeps track of original radius
  this.velX = vel_x;
  this.preVelX = vel_x;        ///// keeps track of original X location
  this.velY = vel_y;
  this.preVelY = vel_y;        ///// keeps track of original Y location
  this.colorR = color_r;
  this.colorG = color_g;
  this.colorB = color_b;
  this.display = false;       ////// we only display circles which are near to current mouse position

  this.drawCircle = function() {
    if(this.display){
      c.beginPath();
      c.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2, false);
      c.strokeStyle = 'rgb('+this.colorR+','+this.colorG+','+this.colorB+')';     /// convert the command into string
      c.fillStyle = c.strokeStyle;
      c.fill();
      c.stroke();
    }
  }

  ////// updates the position of circle and takes care of limits //////////
  this.update = function() {
    ///first change the postion by adding velocity
    this.centerX += this.velX;
    this.centerY += this.velY;
    /// check the limit such that circle won't exceed canvas size
    //for right sde of screen
    if(this.centerX > canvas.width - this.radius) {
      this.centerX = canvas.width - this.radius;
      this.velX = - this.velX;          /// invert the velocity once t reaches the edge
      this.preVelX = - this.preVelX;    /// need to invert this too
    }
    /// for left side of screen
    if(this.centerX < this.radius) {
      this.centerX = this.radius;
      this.velX = - this.velX;
      this.preVelX = - this.preVelX;
    }
    /// for bottom side of screen as top-most height is zero
    if(this.centerY > canvas.height - this.radius) {
      this.centerY = canvas.height - this.radius;
      this.velY = - this.velY;
      this.preVelY = - this.preVelY;
    }
    /// for top side of screen
    if(this.centerY < this.radius) {
      this.centerY = this.radius;
      this.velY = - this.velY;
      this.preVelY = - this.preVelY;
    }

    /// check if the distance beween mouse cordinate and center of circle is less than 50 for both x and y.
    if(Math.abs(this.centerX - mouse.x) < 50 && Math.abs(this.centerY - mouse.y) < 50) {
      this.radius += 1;       /// rate of increase of radius
      if(this.radius > this.preRad + 20){       ///compared with original radius + constant value to give variation
        this.radius = this.preRad + 20;         ///as we could have just compared with constant value only, but
      }                                         ///if we do like that, every circle will grow to same size.
      this.velX = this.preVelX / 2;   ///slow the speed of near circles
      this.velY = this.preVelY / 2;   ///you can make it faster too, or not change it at all
      this.display = true;
    }
    ///when the circles reach far, decrease their size slowly, and dont display them once they become
    ///equal to their orginal size
    else {
      this.radius -= 1;
      if(this.radius < this.preRad) {
        this.radius = this.preRad;   ///restore the original radius once its farther from mouse pointer
        this.display = false;               ///placing this here makes it a lot smoother
      }
      this.velX = this.preVelX;   ///restore the original velocity
      this.velY = this.preVelY;
      //this.display = false;               ///I kept this line here at first but it doesnot feel that smooth
    }

  }
}

/// to store the circles created
let circleArray = [];

/// create circles
function init() {
  circleArray = []; ///initialise to empty array as this function is also called by resize event dynamically
  for(let i = 0; i < 800; i++){   ///specify the number of circles i < number
    let radius = Math.floor(Math.random() * 10) + 5;   ///generate a random radius for each circle
    let posX = Math.floor(Math.random() * (canvas.width - radius)) + radius;    ///generate a random cordinate for each circle
    let posY = Math.floor(Math.random() * (canvas.height - radius)) + radius;   ///create random number beween radius and canvas sze - radius
    let velX = Math.random()*5 - 2.5;   ///generate a random velocity for each circle
    let velY = Math.random()*5 - 2.5;   ///random number beween -2.5 and 2.5

    /// select random color from the colorArray variable from top
    let randIndex = Math.floor(Math.random()*colorArray.length);
    let colorR = colorArray[randIndex].red;
    let colorG = colorArray[randIndex].green;
    let colorB = colorArray[randIndex].blue;

    /// use code below to generate totally random color for each circle
    //let colorR = Math.floor(Math.random()*255);
    //let colorG = Math.floor(Math.random()*255);
    //let colorB = Math.floor(Math.random()*255);

    /// create a circle object from values generated above and store it in circleArray
    let circle = new Circle(posX, posY, radius, velX, velY, colorR, colorG, colorB);
    circleArray.push(circle);
  }
}

/// call the created function
init();

//console.log(circleArray);

/// animate function loops forever
function animate() {
  c.clearRect(0, 0, canvas.width, canvas.height);    /// clear the background each frame
  circleArray.map((x) => {      /// loop through the content of circleArray and
    x.drawCircle();             /// call each circle's methods
    x.update();
  })

  /// tell the browser to perform an animation and request to call the animate function
  /// so that this function is called again and again to create endless loop
  window.requestAnimationFrame(animate);
}

/// call this once and it will loop forever
animate();
