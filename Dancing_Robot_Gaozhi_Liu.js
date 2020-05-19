"use strict";

var canvas;
var gl;

var NumVertices  = 216;

var points = [];
var normals = [];

var axis = 1;
var theta = [ 0, 0, 0 ];

var thetaLoc;

var near = 1;
var far = 5.0;
var radius = 4.0;
var theta1  = 30*(Math.PI/180.0);
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect = 1.0;       // Viewport aspect ratio

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
const eye = vec3(2.0, 0.0, 2.0);
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 2.0, 0.0);

var lightPosition = vec4(1.0, 1.0, 1.0, 1.0 );

var lightAmbient = vec4(0.5, 0.6, 0.6, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 1.0, 1.0);
var materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialShininess = 100.0;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    aspect =  canvas.width/canvas.height;

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);


    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    colorCube();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );


    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );




    thetaLoc = gl.getUniformLocation(program, "theta");

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
        flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
        flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
        flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
        flatten(lightPosition) );

    gl.uniform1f(gl.getUniformLocation(program,
        "shininess"),materialShininess);

    render();
}

function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
    //8+x head
    quad( 9, 8, 11, 10 );
    quad( 10, 11, 15, 14 );
    quad( 11, 8, 12, 15 );
    quad( 14, 13, 9, 10 );
    quad( 12, 13, 14, 15 );
    quad( 13, 12, 8, 9 );
    //16+x leg1
    quad( 17, 16, 19, 18 );
    quad( 18, 19, 23, 22 );
    quad( 19, 16, 20, 23);
    quad( 22, 21, 17, 18 );
    quad( 20, 21, 22, 23 );
    quad( 21, 20, 16, 17 );
    //leg2
    quad( 25, 24, 27, 26 );
    quad( 26, 27, 31, 30 );
    quad( 27, 24, 28, 31);
    quad( 30, 29, 25, 26 );
    quad( 28, 29, 30, 31 );
    quad( 29, 28, 24, 25 );
    //arm1
    quad( 33, 32, 35, 34 );
    quad( 34, 35, 39, 38 );
    quad( 35, 32, 36, 39);
    quad( 38, 37, 33, 34);
    quad( 36, 37, 38, 39 );
    quad( 37, 36, 32, 33 );
    //arm2
    quad( 41, 40, 43, 42 );
    quad( 42, 43, 47, 46 );
    quad( 43, 40, 44, 47);
    quad( 46, 45, 41, 42);
    quad( 44, 45, 46, 47 );
    quad( 45, 44, 40, 41 );
}

var vertices = [
    //body
    //left bot near 0
    vec4( -0.23, -0.3,  0.2, 1.0 ),
    //left top near 1
    vec4( -0.23,  0.3,  0.2, 1.0 ),
    //right top near 2
    vec4(  0.23,  0.3,  0.2, 1.0 ),
    //right bot near 3
    vec4(  0.23, -0.3,  0.2, 1.0 ),
    //left bot far 4
    vec4( -0.23, -0.3, -0.2, 1.0 ),
    //left top far 5
    vec4( -0.23,  0.3, -0.2, 1.0 ),
    //right top far 6
    vec4(  0.23,  0.3, -0.2, 1.0 ),
    //right bot far 7
    vec4(  0.23, -0.3, -0.2, 1.0 ),

    //head
    vec4( -0.10,  0.3,  0.10, 1.0 ),
    vec4( -0.10,  0.5,  0.10, 1.0 ),
    vec4(  0.10,  0.5,  0.10, 1.0 ),
    vec4(  0.10,  0.3,  0.10, 1.0 ),
    vec4( -0.10,  0.3,  -0.10, 1.0 ),
    vec4( -0.10,  0.5,  -0.10, 1.0 ),
    vec4(  0.10,  0.5,  -0.10, 1.0 ),
    vec4(  0.10,  0.3,  -0.10, 1.0 ),


    //leg1
    vec4( -0.20,  -0.8,  0.075, 1.0 ),
    vec4( -0.20,  -0.3,  0.075, 1.0 ),
    vec4( -0.05,  -0.3,  0.075, 1.0 ),
    vec4( -0.05,  -0.8,  0.075, 1.0 ),
    vec4( -0.20,  -0.8,  -0.075, 1.0 ),
    vec4( -0.20,  -0.3,  -0.075, 1.0 ),
    vec4( -0.05,  -0.3,  -0.075, 1.0 ),
    vec4( -0.05,  -0.8,  -0.075, 1.0 ),

    //leg2
    vec4( 0.45,  -0.6,  0.075, 1.0 ),
    vec4( 0.05,  -0.3,  0.075, 1.0 ),
    vec4( 0.20,  -0.3,  0.075, 1.0 ),
    vec4( 0.70,  -0.6,  0.075, 1.0 ),
    vec4( 0.45,  -0.6,  -0.075, 1.0 ),
    vec4( 0.05,  -0.3,  -0.075, 1.0 ),
    vec4( 0.20,  -0.3,  -0.075, 1.0 ),
    vec4( 0.70,  -0.6,  -0.075, 1.0 ),

    //arm1
    vec4(  0.23,  0.10,  0.05, 1.0 ),
    vec4(  0.23,  0.20,  0.05, 1.0 ),
    vec4(  0.63,  0.20,  0.05, 1.0 ),
    vec4(  0.63,  0.10,  0.05, 1.0 ),
    vec4(  0.23,  0.10,  -0.05, 1.0 ),
    vec4(  0.23,  0.20,  -0.05, 1.0 ),
    vec4(  0.63,  0.20,  -0.05, 1.0 ),
    vec4(  0.63,  0.10,  -0.05, 1.0 ),

    //arm2
    // vec4(  -0.63,  0.50,  0.05, 1.0 ),
    // vec4(  -0.63,  0.60,  0.05, 1.0 ),
    // vec4(  -0.23,  0.20,  0.05, 1.0 ),
    // vec4(  -0.23,  0.10,  0.05, 1.0 ),
    // vec4(  -0.63,  0.50,  -0.05, 1.0 ),
    // vec4(  -0.63,  0.60,  -0.05, 1.0 ),
    // vec4(  -0.23,  0.20,  -0.05, 1.0 ),
    // vec4(  -0.23,  0.10,  -0.05, 1.0 ),
    vec4(  -0.63,  0.50,  0.05, 1.0 ),
    vec4(  -0.63,  0.60,  0.05, 1.0 ),
    vec4(  -0.23,  0.20,  0.05, 1.0 ),
    vec4(  -0.23,  0.10,  0.05, 1.0 ),
    vec4(  -0.63,  0.50,  -0.05, 1.0 ),
    vec4(  -0.63,  0.60,  -0.05, 1.0 ),
    vec4(  -0.23,  0.20,  -0.05, 1.0 ),
    vec4(  -0.23,  0.10,  -0.05, 1.0 )
];

function quad(a, b, c, d)
{
    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    var t1 = subtract(vertices[a], vertices[d]);
    var t2 = subtract(vertices[d], vertices[c]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);

    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        normals.push(normal);
    }


}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta[axis] += 1.0;
    gl.uniform3fv(thetaLoc, theta);

    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = perspective(fovy, aspect, near, far);

    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    requestAnimFrame( render );
}
