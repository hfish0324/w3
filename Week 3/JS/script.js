console.log("Script Loaded");

//get button vars
console.log(document)
var lineBtn = document.getElementById("line");
var circleBtn = document.getElementById("circle");
var starBtn = document.getElementById("star");
var pentagonBtn = document.getElementById("pentagon");
var squareBtn = document.getElementById("square");

//other vars
var activebutton = null;
var canDraw = false;
var rootStyle = document.documentElement.style;

//Set initial mouse position to 0,0
var mousePos = {x:0, y:0};
var mousePosTXT = document.getElementById("mousePos");

//Set initial log to null (empty)
var log = null;


// get canvas vars
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var canvasBounds = canvas.getBoundingClientRect();
console.log(
    `Canvas bounds are: 
    Top: ${canvasBounds.top}, 
    Left: ${canvasBounds.left}, 
    Right: ${canvasBounds.right}, 
    Bottom: ${canvasBounds.bottom}`);




//functions
function getMousePos(event){ 

        var x = event.clientX - canvasBounds.left;
        var y = event.clientY - canvasBounds.top;

        return {x: x, y: y};
}

function setActiveButton(newActiveButton){
    log = `1. setActiveButton function called from ${newActiveButton.id + "btn"}`;
    if(activebutton != null){
        if(activebutton.id == newActiveButton.id){
            log += `
            2. ${activebutton.id + "btn"} is already active so turning off button`;

            activebutton.classList.remove("active");
            activebutton.style.borderColor = 'black';
            activebutton.style.borderRadius = '0%';
            activebutton = null;
            

            log += `
            3. No button active now`;

        }else{
            log += `
            Replacing active button from ${activebutton.id + "btn"} to ${newActiveButton.id + "btn"}`;

            activebutton.classList.remove("active");
            activebutton.style.borderColor = 'black';
            activebutton.style.borderRadius = '0%';

            activebutton = newActiveButton;
            activebutton.classList.add("active");
            activebutton.style.borderColor = 'yellow';
            activebutton.style.borderRadius = '20%';
            }
    }else{
        activebutton = newActiveButton;
        activebutton.classList.add("active");
        activebutton.style.borderColor = 'yellow';
        activebutton.style.borderRadius = '20%';

        log += `
        2. There were no active buttons so added: ${activebutton.id + "btn"} to active class`;
    }
    console.log(log);
    log = null;
}


//button click events
lineBtn.addEventListener("click", function(){
    setActiveButton(this);
});

circleBtn.addEventListener("click", function(){
    setActiveButton(this);
});

starBtn.addEventListener("click", function(){
    setActiveButton(this);
});

pentagonBtn.addEventListener("click", function(){
    setActiveButton(this);
});

squareBtn.addEventListener("click", function(){
    setActiveButton(this);
});


//get mouse position on canvas
canvas.addEventListener("mousemove", function(event) {
    mousePos = getMousePos(event);
    mousePosTXT.innerText = `${Math.round(mousePos.x)}, ${Math.round(mousePos.y)}`;
    rootStyle.setProperty('--can-draw', 'green');
    canDraw = true;
});
canvas.addEventListener("mouseleave", function() {
    rootStyle.setProperty('--can-draw', 'red');
    mousePosTXT.innerText = `Not in canvas`;
    mousePos = {x:0, y:0};
    canDraw = false;
});




//canvas drawing code

var startX , startY; //starting mouse position for drawing shapes
var endX, endY; //ending mouse position for drawing shapes
var isDrawing = false; //var to indicate if drawing is in progress



function drawShape(x1, y1, x2, y2, shapeType) { //draw shape based on type and start/end coordinates
    ctx.strokeStyle = "black";
    ctx.fillStyle = "yellow";
    ctx.lineWidth = 2;

    log = `1. Setting strokeStyle to black, fillStyle to yellow and lineWidth to 2`;

    ctx.beginPath();
    log += `
    2. Starting Draw Path`;

    switch(shapeType) {
        case "line":
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            log += `
            3. Drawing Line from (${x1}, ${y1}) to (${x2}, ${y2})`;
            break;
        case "circle":
            var radius = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2)); //calculate radius based on distance between start and end points
            ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
            log += `
            3. Drawing Circle at (${x1}, ${y1}) with radius ${radius}`;
            break;
        case "star":
            drawStar(x1, y1, 5, 30, 15);
            log += `
            3. Drawing Star at (${x1}, ${y1}) with outer radius 30 and inner radius 15`;
            break;
        case "pentagon":
            drawPolygon(x1, y1, 5, 30);
            log += `
            3. Drawing Pentagon at (${x1}, ${y1}) with radius 30`;
            break;
        case "square":
            var side = Math.abs(x2 - x1); //calculate side length based on horizontal distance
            ctx.rect(x1, y1, side, side);
            log += `
            3. Drawing Square at (${x1}, ${y1}) with side length ${side}`;
            break;
        default:
            log += `
            3. Error with shape type: ${shapeType}`;
            return;
    }
    ctx.fill();
    ctx.stroke();
    log += `
    4. Drawing shape`;
    ctx.closePath();
    log += `
    5. Closing Shape`;
    console.log(log);
    log = null;
}

function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    var rot = Math.PI / 2 * 3;
    var x = cx;
    var y = cy;
    var step = Math.PI /
    spikes;
    ctx.moveTo(cx, cy - outerRadius);
    for (i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;
        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function drawPolygon(x, y, sides, radius) {
    if (sides < 3) return;
    var angle = (Math.PI * 2) / sides;
    ctx.moveTo(x + radius * Math.cos(0), y + radius * Math.sin(0));
    for (var i = 1; i <= sides; i++) {
        ctx.lineTo(x + radius * Math.cos(i * angle), y + radius * Math.sin(i * angle));
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    }



//mouse events for drawing
canvas.addEventListener("mousedown", function(event) {
    console.log("Mouse Down");
    if (canDraw && activebutton) { //only draw if canDraw is true and a button is active
        isDrawing = true;
        startX = mousePos.x;
        startY = mousePos.y;
    }
});

canvas.addEventListener("mouseup", function(event) {
    console.log("Mouse Up");
    if (isDrawing && canDraw && activebutton) { //only draw if canDraw is true, a button is active and drawing is in progress
        isDrawing = false;
        endX = mousePos.x;
        endY = mousePos.y;
        drawShape(startX, startY, endX, endY, activebutton.id);
    }
});

