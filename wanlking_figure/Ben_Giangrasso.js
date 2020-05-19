"use strict";

var canvas;
var gl;

var NumVertices  = 288;

var pointsArray = [];
var colorsArray = [];

var swing = -0.1;
var dirBool = 0;
var walkBool = 1;
var rockBool = 0;
var done = 0;
var vertices = [
    // torso
    vec4(-0.1, -0.5,  0.7, 1.0), // 0 
    vec4(-0.1,  0.0,  0.7, 1.0), // 1
    vec4(0.1,  0.0,  0.7, 1.0), // 2
    vec4(0.1, -0.5,  0.7, 1.0), // 3
    vec4(-0.1, -0.5,  0.5, 1.0), // 4
    vec4(-0.1,  0.0,  0.5, 1.0), // 5
    vec4(0.1,  0.0,  0.5, 1.0), // 6
    vec4(0.1, -0.5,  0.5, 1.0), // 7

    // head
    vec4(-0.12, 0.05,  0.72, 1.0), // 8
    vec4(-0.12,  0.25,  0.72, 1.0), // 9
    vec4(0.12,  0.25,  0.72, 1.0), // 10
    vec4(0.12, 0.05,  0.72, 1.0), // 11
    vec4(-0.12, 0.05,  0.48, 1.0), // 12
    vec4(-0.12,  0.25,  0.48, 1.0), // 13
    vec4(0.12,  0.25,  0.48, 1.0), // 14
    vec4(0.12, 0.05,  0.48, 1.0), // 15

    // neck
    vec4(-0.08, 0.0,  0.68, 1.0), // 16
    vec4(-0.08,  0.05,  0.68, 1.0), // 17
    vec4(0.08,  0.05,  0.68, 1.0), // 18
    vec4(0.08, 0.0,  0.68, 1.0), // 19
    vec4(-0.08, 0.0,  0.52, 1.0), // 20
    vec4(-0.08,  0.05,  0.52, 1.0), // 21
    vec4(0.08,  0.05,  0.52, 1.0), // 22
    vec4(0.08, 0.0,  0.52, 1.0), // 23
];

// moving vertices
var leftLeg = [
    vec4(-0.05, -0.9,  0.69, 1.0), // 0
    vec4(-0.05,  -0.4,  0.69, 1.0), // 1
    vec4(0.05,  -0.4,  0.69, 1.0), // 2
    vec4(0.05, -0.9,  0.69, 1.0), // 3
    vec4(-0.05, -0.9,  0.65, 1.0), // 4
    vec4(-0.05,  -0.4,  0.65, 1.0), // 5
    vec4(0.05,  -0.4,  0.65, 1.0), // 6
    vec4(0.05, -0.9,  0.65, 1.0), // 7
];
var rightLeg = [
    vec4(-0.05, -0.9,  0.55, 1.0), // 0
    vec4(-0.05,  -0.4,  0.55, 1.0), // 1
    vec4(0.05,  -0.4,  0.55, 1.0), // 2
    vec4(0.05, -0.9,  0.55, 1.0), // 3
    vec4(-0.05, -0.9,  0.51, 1.0), // 4
    vec4(-0.05,  -0.4,  0.51, 1.0), // 5
    vec4(0.05,  -0.4,  0.51, 1.0), // 6
    vec4(0.05, -0.9,  0.51, 1.0), // 7
];
var leftArm = [
    vec4(-0.05, -0.4,  0.75, 1.0), // 0
    vec4(-0.05, -0.1,  0.75, 1.0), // 1
    vec4(0.05, -0.1,  0.75, 1.0), // 2
    vec4(0.05, -0.4,  0.75, 1.0), // 3
    vec4(-0.05, -0.4,  0.7, 1.0), // 4
    vec4(-0.05, -0.1,  0.7, 1.0), // 5
    vec4(0.05, -0.1,  0.7, 1.0), // 6
    vec4(0.05, -0.4,  0.7, 1.0), // 7
];
var rightArm = [
    vec4(-0.05, -0.4,  0.5, 1.0), // 0
    vec4(-0.05, -0.1,  0.5, 1.0), // 1
    vec4(0.05, -0.1,  0.5, 1.0), // 2
    vec4(0.05, -0.4,  0.5, 1.0), // 3
    vec4(-0.05, -0.4,  0.45, 1.0), // 4
    vec4(-0.05, -0.1,  0.45, 1.0), // 5
    vec4(0.05, -0.1,  0.45, 1.0), // 6
    vec4(0.05, -0.4,  0.45, 1.0), // 7
];

var rock = [
    vec4(0.2, -0.9, 0.55, 1.0),
    vec4(0.2, -0.8, 0.55, 1.0),
    vec4(0.3, -0.8, 0.55, 1.0),
    vec4(0.3, -0.9, 0.55, 1.0),
    vec4(0.2, -0.9, 0.45, 1.0),
    vec4(0.2, -0.8, 0.45, 1.0),
    vec4(0.3, -0.8, 0.45, 1.0),
    vec4(0.3, -0.9, 0.45, 1.0),
];

var vertexColors = [
    vec4( 0.957, 0.957, 0.859, 1.0 ), // light biege
    vec4( 0.9, 0.2, 0.2, 1.0 ),  // red
    vec4( 0.645, 0.164, 0.164, 1.0 ), // brown
    vec4( 0.857, 0.857, 0.759, 1.0 ), // dark biege
    vec4( 0.8, 0.1, 0.1, 1.0 ), // dark red
    vec4( 0.0, 0.0, 0.0, 1.0 ), // black
    vec4( 0.545, 0.064, 0.064, 1.0 ), // dark brown
];


var near = 0.99;
var far = 9.9;
var radius = 4.0;
var dr = 5.0 * Math.PI/180.0;
var theta  = dr * 5;
var phi    = dr;
var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect;       // Viewport aspect ratio

var mvMatrix, pMatrix;
var modelView, projection;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

// fills each trianle with a color
// two triangles create square
// e represents color
function quad(arr, a, b, c, d, e) {
    // triangle 1
    pointsArray.push(arr[a]);
    colorsArray.push(vertexColors[e]);
    pointsArray.push(arr[b]);
    colorsArray.push(vertexColors[e]);
    pointsArray.push(arr[c]);
    colorsArray.push(vertexColors[e]);
    // triangle 2
    pointsArray.push(arr[a]);
    colorsArray.push(vertexColors[e]);
    pointsArray.push(arr[c]);
    colorsArray.push(vertexColors[e]);
    pointsArray.push(arr[d]);
    colorsArray.push(vertexColors[e]);
}

// color six sides
function colorCube()
{
    // torso -> 36
    quad( vertices, 0, 1, 2, 3, 1 ); // front side
    quad( vertices, 4, 5, 6, 7, 1 ); // back side
    quad( vertices, 3, 2, 6, 7, 4 ); // right side
    quad( vertices, 1, 0, 4, 5, 4 ); // left side
    quad( vertices, 0, 3, 7, 4, 4 ); // bottom side
    quad( vertices, 6, 5, 1, 2, 4 ); // top side

    // head -> 72
    quad( vertices, 8, 9, 10, 11, 0 );
    quad( vertices, 12, 13, 14, 15, 0 );
    quad( vertices, 11, 10, 14, 15, 3 );
    quad( vertices, 9, 8, 12, 13, 3 );
    quad( vertices, 8, 11, 15, 12, 0 );
    quad( vertices, 14, 13, 9, 10, 0 );

    // neck -> 108
    quad( vertices, 16, 17, 18, 19, 0 );
    quad( vertices, 20, 21, 22, 23, 0 );
    quad( vertices, 19, 18, 22, 23, 3 );
    quad( vertices, 17, 16, 20, 21, 3 );
    quad( vertices, 16, 19, 23, 20, 0 );
    quad( vertices, 22, 21, 17, 18, 0 );

    // left leg -> 144
    quad( leftLeg, 0, 1, 2, 3, 2 );
    quad( leftLeg, 4, 5, 6, 7, 2 );
    quad( leftLeg, 3, 2, 6, 7, 6 );
    quad( leftLeg, 1, 0, 4, 5, 6 );
    quad( leftLeg, 0, 3, 7, 4, 2 );
    quad( leftLeg, 6, 5, 1, 2, 2 );

    // right leg -> 180
    quad( rightLeg, 0, 1, 2, 3, 2 );
    quad( rightLeg, 4, 5, 6, 7, 2 );
    quad( rightLeg, 3, 2, 6, 7, 6 );
    quad( rightLeg, 1, 0, 4, 5, 6 );
    quad( rightLeg, 0, 3, 7, 4, 2 );
    quad( rightLeg, 6, 5, 1, 2, 2 );

    // left arm -> 216
    quad( leftArm, 0, 1, 2, 3, 0 );
    quad( leftArm, 4, 5, 6, 7, 0 );
    quad( leftArm, 3, 2, 6, 7, 3 );
    quad( leftArm, 1, 0, 4, 5, 3 );
    quad( leftArm, 0, 3, 7, 4, 0 );
    quad( leftArm, 6, 5, 1, 2, 1 );

    // right arm -> 252
    quad( rightArm, 0, 1, 2, 3, 0 );
    quad( rightArm, 4, 5, 6, 7, 0 );
    quad( rightArm, 3, 2, 6, 7, 3 );
    quad( rightArm, 1, 0, 4, 5, 3 );
    quad( rightArm, 0, 3, 7, 4, 0 );
    quad( rightArm, 6, 5, 1, 2, 1 );

    // rock -> 288
    quad( rock, 0, 1, 2, 3, 5 );
    quad( rock, 4, 5, 6, 7, 5 );
    quad( rock, 3, 2, 6, 7, 5 );
    quad( rock, 1, 0, 4, 5, 5 );
    quad( rock, 0, 3, 7, 4, 5 );
    quad( rock, 6, 5, 1, 2, 5 );
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

        gl.viewport( 0, 0, canvas.width, canvas.height );

        aspect =  canvas.width/canvas.height;

        gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

        gl.enable(gl.DEPTH_TEST);


        //
        //  Load shaders and initialize attribute buffers
        //
        var program = initShaders( gl, "vertex-shader", "fragment-shader" );
        gl.useProgram( program );

        colorCube();

        var cBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

        var vColor = gl.getAttribLocation( program, "vColor" );
        gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vColor);

        var vBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

        var vPosition = gl.getAttribLocation( program, "vPosition" );
        gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vPosition );

        modelView = gl.getUniformLocation( program, "modelView" );
        projection = gl.getUniformLocation( program, "projection" );

    // buttons for viewing parameters

        document.getElementById("Button1").onclick = function(){theta += (dr * 2);};
        document.getElementById("Button2").onclick = function(){theta -= (dr * 2);};
        document.getElementById("Button3").onclick = function(){phi += dr;};
        document.getElementById("Button4").onclick = function(){phi -= dr;};
        document.getElementById("Button5").onclick = function(){location.reload();};
        render();
    }
}


var render = function(){
    if(swing == 0.25) {
        dirBool = 1;
    }
    if(swing == -0.25) {
        dirBool = 0;
    }
    if(dirBool == 1) {
        swing -= 0.05;
    }
    if(dirBool == 0) {
        swing += 0.05;
    }
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
    // draw torso
    mvMatrix = lookAt(eye, at , up);
    pMatrix = perspective(fovy, aspect, near, far);

    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
    gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );
    gl.drawArrays( gl.TRIANGLES, 0, 108 );

    // stop moving after 3 seconds
    setTimeout(showRock, 3000);
    if(walkBool == 1) {
        // draw left leg
        mvMatrix = lookAt(eye, at , vec3(swing, 1.0, 0.0));
        gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
        gl.drawArrays( gl.TRIANGLES, 108, 36 );

        // draw right leg
        mvMatrix = lookAt(eye, at , vec3(swing * -1.0, 1.0, 0.0));
        gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
        gl.drawArrays( gl.TRIANGLES, 144, 36 );

        // draw left arm
        mvMatrix = lookAt(eye, at , vec3(swing * -1.0, 1.0, 0.0));
        gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
        gl.drawArrays( gl.TRIANGLES, 180, 36 );

        // draw right arm
        mvMatrix = lookAt(eye, at , vec3(swing, 1.0, 0.0));
        gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
        gl.drawArrays( gl.TRIANGLES, 216, 36 );
    }
    else {
        // draw body parts that dont change from kick
        mvMatrix = lookAt(eye, at , vec3(0.0, 1.0, 0.0));
        gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
        gl.drawArrays( gl.TRIANGLES, 108, 36 );

        mvMatrix = lookAt(eye, at , vec3(0.0, 1.0, 0.0));
        gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
        gl.drawArrays( gl.TRIANGLES, 180, 36 );

        if(done == 0 && rockBool == 0) {
            // prepare limbs for kick
            // aim left leg back
            mvMatrix = lookAt(eye, at , vec3(-0.2, 1.0, 0.0));
            gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
            gl.drawArrays( gl.TRIANGLES, 144, 36 );
            // aim right arm forward
            mvMatrix = lookAt(eye, at , vec3(0.5, 1.0, 0.0));
            gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
            gl.drawArrays( gl.TRIANGLES, 216, 36 );
            
        }
        setTimeout(kickRock, 500);
        if(rockBool == 1) {
            mvMatrix = lookAt(vec3(radius*Math.sin(theta - (dr * 11))*Math.cos(phi),
            radius*Math.sin(theta - (dr * 11))*Math.sin(phi), radius*Math.cos(theta - (dr * 11))), at , vec3(0.0, 1.0, 0.0));

            gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
            gl.drawArrays( gl.TRIANGLES, 252, 36 );
            if(done == 0) {
                // aim left leg forward
                mvMatrix = lookAt(eye, at , vec3(0.2, 1.0, 0.0));
                gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
                gl.drawArrays( gl.TRIANGLES, 144, 36 );
                // aim right arm back
                mvMatrix = lookAt(eye, at , vec3(-0.5, 1.0, 0.0));
                gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
                gl.drawArrays( gl.TRIANGLES, 216, 36 );
            }
            setTimeout(doneMoving, 500);
            if(done == 1) {
                // left leg is back at side 
                // aim left leg back
                mvMatrix = lookAt(eye, at , up);
                gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
                gl.drawArrays( gl.TRIANGLES, 144, 36 );
                // right arm is back at side
                mvMatrix = lookAt(eye, at , up);
                gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
                gl.drawArrays( gl.TRIANGLES, 216, 36 );
            }
        }
        else {
            // rocks starting location
            mvMatrix = lookAt(eye, at , vec3(0.0, 1.0, 0.0));
            gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
            gl.drawArrays( gl.TRIANGLES, 252, 36 );
        }
        
    }
    requestAnimFrame(render);
}


var showRock = function(){
    walkBool = 0;
}

var kickRock = function(){
    rockBool = 1;
}

var doneMoving = function(){
    done = 1;
}

