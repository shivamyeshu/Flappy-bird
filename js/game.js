// Create the canvas and context
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 144;
canvas.height = 256;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/background.png";

// Bird image
var birdReady = false;
var birdImage = new Image();
birdImage.onload = function () {
    birdReady = true;
};
birdImage.src = "images/bird.png";

// Upper bar images
var upper1Ready = false, upper2Ready = false, upper3Ready = false;
var upper1Image = new Image(), upper2Image = new Image(), upper3Image = new Image();
upper1Image.onload = function () { upper1Ready = true; };
upper2Image.onload = function () { upper2Ready = true; };
upper3Image.onload = function () { upper3Ready = true; };
upper1Image.src = "images/upper.png";
upper2Image.src = "images/upper.png";
upper3Image.src = "images/upper.png";

// Lower bar images
var lower1Ready = false, lower2Ready = false, lower3Ready = false;
var lower1Image = new Image(), lower2Image = new Image(), lower3Image = new Image();
lower1Image.onload = function () { lower1Ready = true; };
lower2Image.onload = function () { lower2Ready = true; };
lower3Image.onload = function () { lower3Ready = true; };
lower1Image.src = "images/lower.png";
lower2Image.src = "images/lower.png";
lower3Image.src = "images/lower.png";

// Game objects
var bird = {
    xspeed: 0,
    yspeed: 0,
    xacc: 0,
    yacc: 200,
    x: 2,
    y: 2,
    score: 0
};

var upper1 = { xspeed: -30, x: 20, y: -100 };
var upper2 = { xspeed: -30, x: 75, y: -50 };
var upper3 = { xspeed: -30, x: 130, y: -70 };
var lower1 = { xspeed: -30, x: 20, y: 150 };
var lower2 = { xspeed: -30, x: 75, y: 135 };
var lower3 = { xspeed: -30, x: 130, y: 160 };

// Key controls
var keysDown = {};
addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);
addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
    f = 0;
}, false);

// Reset game function
var reset = function () {
    bird.xspeed = 0;
    bird.yspeed = 0;
    bird.x = 2;
    bird.y = 120;
    bird.score = 0;
    
    // Reset bar positions
    upper1.x = 20; upper2.x = 75; upper3.x = 130;
    lower1.x = 20; lower2.x = 75; lower3.x = 130;
};

var f = 0;
var difficulty = -40;

// Update function
var update = function (modifier) {
    bird.score += modifier;
    if (38 in keysDown && f == 0) { // Up arrow key for jump
        bird.yspeed = -100;
        f = 1;
    }

    // Update bird's position and speed
    bird.x += bird.xspeed * modifier;
    bird.y += bird.yspeed * modifier;
    bird.xspeed += bird.xacc * modifier;
    bird.yspeed += bird.yacc * modifier;

    // Update bar positions
    [upper1, upper2, upper3, lower1, lower2, lower3].forEach(function(bar) {
        bar.x += bar.xspeed * modifier;
        if (bar.x < -25) {
            bar.x = 144;
            bar.y = (bar === upper1 || bar === upper2 || bar === upper3)
                ? difficulty + 10 - Math.random() * 50
                : -difficulty + 160 - Math.random() * 50;
        }
    });

    // Collision detection
    if (bird.y > 256 || 
        (upper1.x < 15 && bird.y < upper1.y + 135) || 
        (upper2.x < 15 && bird.y < upper2.y + 135) || 
        (upper3.x < 15 && bird.y < upper3.y + 135) || 
        (lower1.x < 15 && bird.y > lower1.y - 10) || 
        (lower2.x < 15 && bird.y > lower2.y - 10) || 
        (lower3.x < 15 && bird.y > lower3.y - 10)) {
        reset();
    }
};

// Render function
var render = function () {
    if (bgReady) { ctx.drawImage(bgImage, 0, 0); }
    if (birdReady) { ctx.drawImage(birdImage, bird.x, bird.y); }
    if (upper1Ready) { ctx.drawImage(upper1Image, upper1.x, upper1.y); }
    if (upper2Ready) { ctx.drawImage(upper2Image, upper2.x, upper2.y); }
    if (upper3Ready) { ctx.drawImage(upper3Image, upper3.x, upper3.y); }
    if (lower1Ready) { ctx.drawImage(lower1Image, lower1.x, lower1.y); }
    if (lower2Ready) { ctx.drawImage(lower2Image, lower2.x, lower2.y); }
    if (lower3Ready) { ctx.drawImage(lower3Image, lower3.x, lower3.y); }

    // Display score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "15px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillText("Score: " + Math.floor(bird.score), 12, 32);
};

// Main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;
    update(delta / 1000);
    render();
    then = now;
    requestAnimationFrame(main);
};

// Initial setup
var then = Date.now();
reset();
main();


// Restart button event listener
restartButton.addEventListener("click", function () {
    reset();
});
