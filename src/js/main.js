var draw = (function () {

  //Get the height and width of the main we will use this set canvas to the full
  //size of the main element.
  var mWidth = document.querySelector('main').offsetWidth,
      mHeight = document.querySelector('main').offsetHeight,
      // mWidthx = $('main').offsetWidth,
      // mHeightx = $('main').offsetHeight,

      //Create the canvas
      canvas = document.createElement("canvas"),

      //Create the context
      ctx = canvas.getContext("2d"),

      //Create the initial bounding rectangle
      rect = canvas.getBoundingClientRect(),

      //current x,y position
      x = 0,
      y = 0,

      //starting x,y
      x1 = 0,
      y1 = 0,

      //ending x,y
      x2 = 0,
      y2 = 0,

      //Tracks the last x,y state
      lx = false,
      ly = false,

      //What shape are we drawing?
      shape = '',

      //Are we drawimg a path?
      isDrawing = false;

  //stroke color
  stroke = '';

  //fill color
  fill = '';



  // all matched (slightly)
  return {
      setIsDrawing: function (bool) {
          isDrawing = bool;
      },

      getIsDrawing: function () {
          return isDrawing;
      },

      getShape: function () {
          return shape;
      },

      //Sets the shape to be drawn
      setShape: function (shp) {
          shape = shp;
      },

      //Set a random color
      randColor: function () {
          return '#' + Math.floor(Math.random() * 16777215).toString(16);
      },

      //A setter for stroke
      setStrokeColor: function (color) {
          stroke = color;
      },

      //A setter for fill
      setFillColor: function (color) {
          fill = color;
      },

      //A getter for stroke
      getStrokeColor: function () {

          if (stroke.length > 6) {
              return stroke;
          }

          return this.randColor();
      },

      //A getter for fill
      getFillColor: function () {

          if (fill.length > 6) {
              return fill;
          }

          return this.randColor();
      },

      //Set the x1,y1
      setStart: function () {
          x1 = x;
          y1 = y;
      },

      //Set the x2,y2
      setEnd: function () {
          x2 = x;
          y2 = y;
      },

      //Set the x,y coords based on current event data
      setXY: function (evt) {

          //Track last x,y position before setting the current posiiton.
          lx = x;
          ly = y;

          //Set the current x,y position
          x = (evt.clientX - rect.left) - canvas.offsetLeft;
          y = (evt.clientY - rect.top) - canvas.offsetTop;
      },

      //Write the x,y coods to the target div
      writeXY: function () {
          document.getElementById('trackX').innerHTML = 'X: ' + x;
          document.getElementById('trackY').innerHTML = 'Y: ' + y;
      },

      //Draws the selected shape
      draw: function () {
          ctx.restore();
          if (shape === 'rectangle') {
              this.drawRect();
          } else if (shape === 'line') {
              this.drawLine();
          } else if (shape === 'path') {
              this.drawPath();
          } else if (shape === 'circle') {
              this.drawCircle();
          }
          //triangle
          else if (shape === 'triangle') {
              this.drawTriangle();
          } else {
              alert('Please choose a shape');
          }
          ctx.save();
      },

      // CIRCLE
      drawCircle: function () {
          // ctx.strokeStyle = '#' + Math.floor(Math.random() * 16777215).toString(16);
          // ctx.fillStyle = '#' + Math.floor(Math.random() * 16777215).toString(16);
          ctx.strokeStyle = this.getStrokeColor();
          ctx.fillStyle = this.getFillColor();

          let a = (x1 - x2)
          let b = (y1 - y2)
          let radius = Math.sqrt(a * a + b * b);

          ctx.beginPath();
          ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.fill();
      },

      // LINE
      drawLine: function () {
          //Start by using random fill colors.
          // ctx.strokeStyle = '#' + Math.floor(Math.random() * 16777215).toString(16);
          ctx.strokeStyle = this.getStrokeColor();
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
      },

      // TRIANGLE
      drawTriangle: function () {
          //Start by using random fill colors.
          // ctx.fillStyle = '#' + Math.floor(Math.random() * 16777215).toString(16);
          ctx.fillStyle = this.getFillColor();
          ctx.strokeStyle = this.getStrokeColor();
          //ctx.fillRect(x1, y1, (x1 - y2), (x2 - y2));
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x1, y2);
          ctx.lineTo(x2, y2);
          ctx.lineTo(x1, y1);
          ctx.stroke();
          ctx.fill();
      },

      // PATH
      drawPath: function () {
          ctx.strokeStyle = this.getStrokeColor();
          ctx.beginPath();
          ctx.moveTo(lx, ly);
          ctx.lineTo(x, y);
          ctx.stroke();
      },

      // RECTANGLE
      //Draw a rectangle
      drawRect: function () {
          //Start by using random fill colors.
          // ctx.fillStyle = '#' + Math.floor(Math.random() * 16777215).toString(16);
          ctx.fillStyle = this.getFillColor();
          ctx.strokeStyle = this.getStrokeColor();
          ctx.fillRect(x1, y1, (x2 - x1), (y2 - y1));
      },

      getCanvas: function () {
          return canvas;
      },

      //Initialize the object, this must be called before anything else
      init: function () {
          canvas.width = mWidth;
          canvas.height = mHeight;
          document.querySelector('main').appendChild(canvas);

      }
  };

})();

//Initialize draw
draw.init();


// MOUSE MOVEMENTS

//Add a mousemove listener to the canvas
//When the mouse reports a change of position use the event data to
//set and report the x,y position on the mouse.
draw.getCanvas().addEventListener('mousemove', function (evt) {
  draw.setXY(evt);
  draw.writeXY();
  if (draw.getShape() == 'path' && draw.getIsDrawing() === true) {
      draw.draw();
  }
}, false);

//Add a mousedown listener to the canvas
//Set the starting position
// FOR RECTANGLE
draw.getCanvas().addEventListener('mousedown', function () {
  draw.setStart();
  draw.setIsDrawing(true);
}, false);

//Add a mouseup listener to the canvas
//Set the end position and draw the rectangle
// FOR RECTANGLE
draw.getCanvas().addEventListener('mouseup', function () {
  draw.setEnd();
  draw.draw();
  draw.setIsDrawing(false);
}, false);

//Make for triangle
draw.getCanvas().addEventListener('mouseup', function () {
  draw.setEnd();
  draw.draw();
  draw.setIsDrawing(false);
}, false);

draw.getCanvas().addEventListener('mousedown', function () {
  draw.setStart();
  draw.setIsDrawing(true);
}, false);

// CLICK EVENTS

document.getElementById('btnRect').addEventListener('click', function () {
  draw.setShape('rectangle');
}, false);

document.getElementById('btnLine').addEventListener('click', function () {
  draw.setShape('line');
}, false);

document.getElementById('btnCircle').addEventListener('click', function () {
  draw.setShape('circle');
}, false);

document.getElementById('btnPath').addEventListener('click', function () {
  draw.setShape('path');
}, false);

document.getElementById('btnTriangle').addEventListener('click', function () {
  draw.setShape('triangle');
}, false);

document.getElementById('strokeColor').addEventListener('change', function(){
  draw.setStrokeColor(document.getElementById('strokeColor').value);
});

document.getElementById('randStrokeColor').addEventListener('change', function(){
  draw.setStrokeColor('');
});

document.getElementById('fillColor').addEventListener('change', function(){
  draw.setFillColor(document.getElementById('fillColor').value);
});

document.getElementById('randFillColor').addEventListener('change', function(){
  draw.setFillColor('');
});

//$('btnTriangle').click(function() { /* handle click event */ });
//$('btnTriangle').mouseenter(function() {  /* handle click event */ });
//$(document).keyup(function() {  /* handle key up event */  });

//$(function() {
 // $('btnTriangle').on('click', function(){
 // })
//})
