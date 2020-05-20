"use strict";

var canvas, gl, program;
var NumVertices = 36; //(6 faces)(2 triangles/face)(3 vertices/triangle)
var points = [];
var colors = [];
var n_fps = 10;
var x = 1;
var a = 0.35;
var b = 1;

var counter = 0; 

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5, -0.5, -0.5, 1.0 )
];

var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 0.4, 0.4, 0, .35  ),  // yellow star 
    //vec4( 0.0, 0.0, .5, .5 ),  // light blue
    vec4( 0.5, 0.3, .1, .83  ),  // less light brown
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    //vec4( 0.0, 0.0, .5, .75 ),  // dark blue
    vec4( 0.5, 0.3, .1, .99  ),  // darker brown
    vec4( 0.5, 0.3, .1, .93 ),  // darkbrown - front 
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];

// Shader transformation matrices

var modelViewMatrix, projectionMatrix;

// Array of rotation angles (in degrees) for each rotation axis

var Base = 0;
var theta= [ 20, 0, 0]; //final 0 to 10 
var angle = 0;
var modelViewMatrixLoc;
var vBuffer, cBuffer;

function quad(  a,  b,  c,  d ) {
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[b]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[d]);
}

function colorCube() {
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

window.onload = function init() {

    var isAutomated = navigator.webdriver    
    if(isAutomated) {
        document.getElementById("container").style.display = "none";             
    } else {            
        document.getElementById("preview").style.display = "none"; 
        
        canvas = document.getElementById( "gl-canvas" );

        gl = WebGLUtils.setupWebGL( canvas );
        if ( !gl ) { alert( "WebGL isn't available" ); }

        //gl.viewport( 0, 0, canvas.width, canvas.height );
        gl.viewport( 1, -450, canvas.width*1.55, canvas.height*1.75 );

        gl.clearColor( 1.0, 1.0, 1.0, 0.0 );
        gl.enable( gl.DEPTH_TEST );

        //  Load shaders and initialize attribute buffers
        program = initShaders( gl, "vertex-shader", "fragment-shader" );

        gl.useProgram( program );

        colorCube();
        //colorCube2();
        // Load shaders and use the resulting shader program
        program = initShaders( gl, "vertex-shader", "fragment-shader" );
        gl.useProgram( program );

        // Create and initialize  buffer objects
        vBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

        var vPosition = gl.getAttribLocation( program, "vPosition" );
        gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vPosition );

        cBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

        var vColor = gl.getAttribLocation( program, "vColor" );
        gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vColor );

        document.getElementById("slider1").onchange = function(event) {
            theta[0] = event.target.value;
        };

        modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

        projectionMatrix = ortho(-10, 10, -10, 10, -10, 10);
        gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),  false, flatten(projectionMatrix) );

        render();
    }
}

//----------------------------------------------------------------------------
function build(BASE_WIDTH, BASE_HEIGHT, LENGTH) {
    var s = scale4(BASE_WIDTH, BASE_HEIGHT, LENGTH);
    var instanceMatrix = mult( translate( 0.0, 0.5 * BASE_HEIGHT, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

function star(BASE_WIDTH, BASE_HEIGHT, NumVertices) {
    var s = scale4(BASE_WIDTH, BASE_HEIGHT, BASE_WIDTH);
    var instanceMatrix = mult( translate( 0.0, 0.5 * BASE_HEIGHT, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

var c = .7;
var pb = .25;
var bo1 = 0; 
var bo2 = 0;
var bo3 = .25;
var bo4 = 1;
var oy = .8; 
var yb1 = 1; 
var yb2 = .35; 
var yb3 = 0; 
var yb4 = .45;
var bb = .1; 
var lbo1 = 0; 
var lbo2 = 0; 
var lbo3 = 1; 
var lbo4 = .2;
var op1 = 1; 
var op2 = .3; 
var op3 = 0; 
var op4 = .85; 



var render = function() {

    setTimeout(function() {

    x = -1;


    if (counter<130){  //going from east light to west (sunrise to sunset)
        a *= (1  + 1/(n_fps*10*2)); //darkerish
        b *= (1  - 1/(n_fps*10*2)); //lighter
        counter++; 
        // console.log(counter);  
        if (counter<70) {
            // gl.clearColor(0,0, 1 ,.1); //llight blue
            gl.clearColor(0,0, 1 ,bb); 
            bb += (.1/70); 
        } 
        else if (counter>100 && counter<130 )  {
            gl.clearColor(0,0, 1 ,.2);  //less light blue 
            // gl.clearColor(lbo1, lbo2, lbo3, lbo4); 
            // lbo1 += (1/30); 
            // lbo2 += (.3/30); 
            // lbo3 -= (1/30); 
            // lbo4 += (.65/30);
        }
        //100 is highest poitn of sun           
    }
    else if (counter>=130 && counter < 200 ) {  //sunset to dark 
        a *= (1  + 1/(n_fps*10));
        b *= (1  + 1/(n_fps*10));
        counter++;
        // console.log(counter);
        if (counter<160) {  //light blue to orange
            gl.clearColor(lbo1, lbo2, lbo3, lbo4); 
            lbo1 += (1/30); 
            lbo2 += (.3/30); 
            lbo3 -= (1/30); 
            lbo4 += (.65/30);
        } 
        else if (counter<180 ) {
            // gl.clearColor(1, .3, 0 ,.85); //darker orange
            gl.clearColor(op1, op2, op3, op4); //darker orange
            op1 -= (.75/20); 
            op2 -= (.3/20);
            op3 += (.25/20); 
            op4 += (.15/20);

        } 
        else if (counter<200)  {
            // gl.clearColor(.25, 0, .25 ,1); //purple
            gl.clearColor(pb, 0, .25 ,1);
            pb -= .25/20;
        }
       // gl.clearColor(2, 1, 0, .6);
    }
    else if (counter == 330 ) {  //catch and reset to sunrise loop beginning 
       // gl.clearColor(1, 1, 0 ,.6);
        a = 0.35;
        b = 1;
        counter = 0; 
        c = .7; 
        pb = .25;
        bo1 = 0; bo2 = 0; bo3 = .25; bo4 = 1;
        oy = .8; 
        yb1 = 1; yb2 = .35; yb3 = 0; yb4 = .45;
        bb = .1; 
        lbo1 = 0; lbo2 = 0; lbo3 = 1; lbo4 = .2; 
        op1 = 1; op2 = .3; op3 = 0; op4 = .85; 
        // console.log(counter);
    }
    else if (counter>=200 && counter < 330 ) {  //dark to sunrise
        a *= (1  - 1/(n_fps*10)); //light
        b *= (1  + 1/(n_fps*10*2)); //darker
        counter++;
        // console.log(counter);
        if (counter<250) {
            gl.clearColor(0, 0, .25 ,1); //stay midngihtblue
        }
        else if (counter<280) {
            // gl.clearColor(0, 0, .25 ,1); //midngihtblue
            gl.clearColor(bo1, bo2, bo3 ,bo4);
            bo1 += (1/30); 
            bo2 += (.35/30);
            bo3 -= (.25/30);
            bo4 -= (.2/30)
        }
        else if (counter<290) {
            // gl.clearColor(1, .35, 0 ,.8); //orange
            gl.clearColor(1, .35, 0 ,oy); 
            oy -= (.35/10);

        }
        else if (counter<330) {
            // gl.clearColor(1, .35, 0 ,.45); //yellow
            gl.clearColor(yb1, yb2, yb3 ,yb4); 
            yb1 -= (1/40);
            yb2 -= (.35/40); 
            yb3 += (1/40); 
            yb4 -= (.35/40); 
        }

    }
 
    if (x==1) {
        colorCube();
        gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    } 
    else {

        //console.log(a);
        var points2 = [];
        var colors2 = [];
        var vertexColors2 = [
        vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
        //vec4( 0.0, 0.0, .5, a ),  // a light blue
        vec4( 0.5, 0.3, .1, a  ),
        vec4( 0.5, 0.3, .1, .83  ),  // less light brown
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
        vec4( 0.5, 0.3, .1, .99  ),  // darker brown
        vec4( 0.5, 0.3, .1, b  ),  // b brown shadow 
        //vec4( 0.0, 0.0, .5, .5 ),  // light blue
        vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
        vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
    ];

    function quad2(  a,  b,  c,  d ) {
        colors2.push(vertexColors2[a]);
        points2.push(vertices[a]);
        colors2.push(vertexColors2[a]);
        points2.push(vertices[b]);
        colors2.push(vertexColors2[a]);
        points2.push(vertices[c]);
        colors2.push(vertexColors2[a]);
        points2.push(vertices[a]);
        colors2.push(vertexColors2[a]);
        points2.push(vertices[c]);
        colors2.push(vertexColors2[a]);
        points2.push(vertices[d]);
    }
    function colorCube2() {
        quad2( 1, 0, 3, 2 );
        quad2( 2, 3, 7, 6 );
        quad2( 3, 0, 4, 7 );
        quad2( 6, 5, 1, 2 );
        quad2( 4, 5, 6, 7 );
        quad2( 5, 4, 0, 1 );
    }
        colorCube2();
        gl.bufferData( gl.ARRAY_BUFFER, flatten(colors2), gl.STATIC_DRAW );
    }

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    
    modelViewMatrix = rotate(theta[Base]-5, 0, 1, 0 );  //empire state
    build(1.5, 5.5, 1.5);
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, 5.5, 0.0));
    build(1.35, 1, 1.35);
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, 1, 0.0));
    build(1, .5, 1);
    modelViewMatrix  = mult(modelViewMatrix, translate(0.0, .5, 0.0));
    build(0.75, .25, .75);
   // modelViewMatrix  = mult(modelViewMatrix, rotate(0, 0, 1, 0));
    modelViewMatrix  = mult(modelViewMatrix, translate(0.0, .25, 0.0));
    build(0.25, 1, .25);
    modelViewMatrix  = mult(modelViewMatrix, translate(0.0, 1, 0.0));
    build(0.05, 1, .05);
    modelViewMatrix  = mult(modelViewMatrix, translate(0.0, -.3, 0.0));
    build(0.1, .5, .1);
    modelViewMatrix  = mult(modelViewMatrix, translate(0.0, .6, 0.0));
    build(0.1, .07, .1);
    modelViewMatrix  = mult(modelViewMatrix, translate(0.0, .4, 0.0));
    build(0.1, .07, .1);
    
    modelViewMatrix = rotate(0, 0, 2, 0 );
    modelViewMatrix  = mult(modelViewMatrix, translate(1.5, 0, 0.0));    //metlife
    build(2.5, 4.5, 2.5);
    modelViewMatrix  = mult(modelViewMatrix, translate(1.25, 0, 0.0)); //strip to right of metlife 
    build(.25, 4.25, 1);

    modelViewMatrix = rotate(theta[Base]-5, 0, 2, 0 );
    modelViewMatrix  = mult(modelViewMatrix, translate(-1.35, 0, 0));    //left of empire
    build(.5, 3.5, 1.5);
    modelViewMatrix = rotate(theta[Base]-5, 0, 2, 0 );
    modelViewMatrix  = mult(modelViewMatrix, translate(-3, 0, 0));     //left of empire
    build(2, 4, 1.5);
    modelViewMatrix  = mult(modelViewMatrix, translate(-1, 0, 0));     
    build(.2, 3.75, 1.5);
    modelViewMatrix  = mult(modelViewMatrix, translate(-.65, 0, 0));     //pointy short
    build(.5, 3.1, .75);
    modelViewMatrix  = mult(modelViewMatrix, translate(.1, 0, 0)); //point 
    build(.1, 4, .1);
    modelViewMatrix  = mult(modelViewMatrix, translate(-.1, 0, 0)); //point 
    modelViewMatrix  = mult(modelViewMatrix, translate(-1.5, 0, 0));    //3 peak
    build(.5, 4.5, 2);
    modelViewMatrix  = mult(modelViewMatrix, translate(-.3, 0, 0));    
    build(.1, 5, 1.9);
    modelViewMatrix  = mult(modelViewMatrix, translate(-.1, 0, .5));
    build(.1, 4.75, .5);
    modelViewMatrix  = mult(modelViewMatrix, translate(0, 0, -.8));
    build(.1, 4.9, .5);
    modelViewMatrix  = mult(modelViewMatrix, translate(-.4, 0, .8));    
    build(.6, 4.2, 1.8);

    modelViewMatrix  = mult(modelViewMatrix, translate(-.4, 0, 0));    
    build(.6, 3, 1);

    modelViewMatrix = rotate(theta[Base]-5, 0, 2, 0 );
    modelViewMatrix  = mult(modelViewMatrix, translate(-5, 0, 0));     //3pointy
    build(1, 2.25, 1);
    modelViewMatrix  = mult(modelViewMatrix, translate(-.1, 0, 0));
    build(.05, 2.75, .3);
    modelViewMatrix  = mult(modelViewMatrix, translate(-.15, 0, 0));
    build(.05, 2.75, .3);
    modelViewMatrix  = mult(modelViewMatrix, translate(-.15, 0, 0));
    build(.05, 2.75, .3);

    modelViewMatrix = rotate(theta[Base]-5, 0, 2, 0 );
    modelViewMatrix  = mult(modelViewMatrix, translate(-8.15, 0, 0));     //new yorker
    build(.25, 4.7, .25);
    build(.5, 4.5, .5);
    build(.7, 4.1, .7);
    build(.8, 3.7, .9);

    modelViewMatrix  = mult(modelViewMatrix, translate(-.5, 0, 0));     
    build(1.25, 3.5, .5);
    modelViewMatrix  = mult(modelViewMatrix, translate(-.7, 0, 0));     
    build(.3, 2.5, .5);

    modelViewMatrix = rotate(theta[Base]-5, 0, 2, 0 );
    modelViewMatrix  = mult(modelViewMatrix, translate(-10, 0, 0));     //tall build
    build(.75, 7, 1);

    modelViewMatrix = rotate(theta[Base]-5, 0, 2, 0 );
    modelViewMatrix  = mult(modelViewMatrix, translate(1.5, 0, 2));     //in front on metlife
    build(1, 4, .75);


     if (counter> 170 && counter<230) { //stars
        colorCube();
        gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
        modelViewMatrix = rotate(0, 0, 2, 0 );
        modelViewMatrix  = mult(modelViewMatrix, translate(1.5, 9, 2));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(1, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-1, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-2, 0, 0));     
        build(.05, .1, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-2, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-2, 0, 0));     
        build(.05, .1, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-1.5, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(.3, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(1, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(3, 0, 0));     
        build(.05, .1, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-1, -1, 0));     
        build(.01, .1, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-2, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-1, 0, 0));     
        build(.03, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(4, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(7, 0, 0));     
        build(.05, .1, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-2, 0, 0));     
        build(.05, .1, .05);  

    }


    if (counter> 180 && counter<250) { //stars
        colorCube();
        gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
        modelViewMatrix = rotate(0, 0, 2, 0 );
        modelViewMatrix  = mult(modelViewMatrix, translate(1.5, 9, 2));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(1, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-1, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-2, 0, 0));     
        build(.05, .1, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-2, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-2, 0, 0));     
        build(.05, .1, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-1.5, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-2, 0, 0));     
        build(.05, .1, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-2, 0, 0));     
        build(.05 , .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(1, .5, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(2, 0, 0));     
        build(.05, .1, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(.3, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(1, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(3, 0, 0));     
        build(.05, .1, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-1, -1, 0));     
        build(.01, .1, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-2, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-1, 0, 0));     
        build(.03, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(4, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(7, 0, 0));     
        build(.05, .1, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-2, 0, 0));     
        build(.05, .1, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(0, -1, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-0.5, .5, 0));     
        build(.05, .05, .05);
        
        modelViewMatrix  = mult(modelViewMatrix, translate(-0.5, .5, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(0, -1, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-2, .5, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(0, -.75, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-2, .5, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-1, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-1, .25, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-1.3, 1, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-3, 0, 0));     
        build(.05, .1, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-1, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(1, -1, 0));     
        build(.1, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(1, .3, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(1, .3, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(0, .3, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(1, -1, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(1, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(1, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(2, 1, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(.5, -1, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(1, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(1, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(1, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(.5, -.5, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-3, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-.75, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-1, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-2, .5, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-1, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-2, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-1, -.5, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(0, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(0, .5, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(2, -.5, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(1, 0, 0));     
        build(.05, .05, .05);


    }

         if (counter> 240 && counter<260) { //stars
        colorCube();
        gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
        modelViewMatrix = rotate(0, 0, 2, 0 );
        modelViewMatrix  = mult(modelViewMatrix, translate(-4.5, 9, 2));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(1, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-1, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-2, 0, 0));     
        build(.05, .1, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-2, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-2, 0, 0));     
        build(.05, .1, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-1.5, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(.3, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(1, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(3, 0, 0));     
        build(.05, .1, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-1, -1, 0));     
        build(.01, .1, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-2, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-1, 0, 0));     
        build(.03, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(4, 0, 0));     
        build(.05, .05, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(7, 0, 0));     
        build(.05, .1, .05);
        modelViewMatrix  = mult(modelViewMatrix, translate(-2, 0, 0));     
        build(.05, .1, .05);  

    }
    
    

    requestAnimFrame(render);  //this lets you reload
    }, 1000 / n_fps);
}

