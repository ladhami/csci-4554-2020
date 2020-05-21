"use strict";

var canvas;
var gl;

var numVertices  = 24;
var maxNumParticles = 10000;
var program;

var dt = 1;

var numParticles = 1000;
var pointSize = 2;
var speed = 0.000125;

var pointsArray = [];
var colorsArray =[];

var projectionMatrix, modelViewMatrix;
var eye;
var at;
var up;

var near = -10;
var far = 10;

var left = -3.0;
var right = 3.0;
var ytop =3.0;
var bottom = -3.0;

var cBufferId, vBufferId;

var vertexColors = vec4( 1.0, 1.0, 1.0, 1.0 )  // white



function particle(){

    var p = {};
    p.color = vec4(0, 0, 0, 1);
    p.position = vec4(0, 0, 0, 1);
    p.velocity = vec4(0, 0, 0, 0);
    p.mass = 1;

    return p;
}

var particleSystem = [];

for(var i = 0; i< maxNumParticles; i++) particleSystem.push(particle());


var d2 = []
for(var i=0; i<maxNumParticles; i++) d2[i] =  new Float32Array(maxNumParticles);

var bufferId;

window.onload = function init() {
        document.getElementById("preview").style.display = "none"; 

        canvas = document.getElementById( "gl-canvas" );

        gl = WebGLUtils.setupWebGL( canvas );
        if ( !gl ) { alert( "WebGL isn't available" ); }

        gl.viewport( 0, 0, canvas.width, canvas.height );
        gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

        //
        //  Load shaders and initialize attribute buffers
        //
        program = initShaders( gl, "vertex-shader", "fragment-shader" );
        gl.useProgram( program );

        bufferId = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );

        eye =  vec3(1.5, 1.0, 1.0);
        at = vec3(0.0, 0.0, 0.0);
        up = vec3(0.0, 1.0, 0.0);

        modelViewMatrix = lookAt(eye, at, up);
        projectionMatrix = ortho(left, right, bottom, ytop, near, far);

        gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix" ), false, flatten(modelViewMatrix) );
        gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix" ), false, flatten(projectionMatrix) );

        gl.uniform1f(gl.getUniformLocation(program, "pointSize"), pointSize);

        cBufferId = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
        gl.bufferData( gl.ARRAY_BUFFER, 16*(maxNumParticles+numVertices), gl.STATIC_DRAW );

        var vColor = gl.getAttribLocation( program, "vColor" );
        gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vColor );

        vBufferId = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
        gl.bufferData( gl.ARRAY_BUFFER, 16*(maxNumParticles+numVertices), gl.STATIC_DRAW );

        var vPosition = gl.getAttribLocation( program, "vPosition" );
        gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vPosition );

        gl.uniform1f(gl.getUniformLocation(program, "pointSize"), pointSize);

        simulation();
    
}

var simulation = function(){

    // set up particles with random locations and velocities

    for ( var i = 0; i < numParticles; i++ ) {
        particleSystem[i].mass = 1.0;
        particleSystem[i].color = vertexColors[0];
        for ( var j = 0; j < 4; j++ ) {
            particleSystem[i].position[j] = 10.0 * Math.random() - 1.0;
            particleSystem[i].velocity[j] = speed *20000 * Math.random() - 1.0;
        }
        particleSystem[i].position[3] = 1.2;
    }

    for(var i =0; i<numParticles; i++) {
       pointsArray.push(particleSystem[i].position);
       colorsArray.push(particleSystem[i].color);
       }

    gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(colorsArray));

    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(pointsArray));

    render();

}


var forces = function( ParticleI)
{
    var force = vec4(0, 0, 0, 0);
    return ( force );
}


var update = function(){
    for (var i = 0; i < numParticles; i++ ) {
            particleSystem[i].position = add( particleSystem[i].position, scale(speed*dt, particleSystem[i].velocity));
            particleSystem[i].velocity = add( particleSystem[i].velocity, scale(speed*dt/ particleSystem[i].mass, forces(i)));
        }
    for (var i = 0; i < numParticles; i++ ) ;
    colorsArray = [];
    pointsArray = [];
    for(var i = 0; i<numParticles; i++) {
       pointsArray.push(particleSystem[i].position);
       colorsArray.push(particleSystem[i].color);
    }
    gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
    gl.bufferSubData( gl.ARRAY_BUFFER, 0, flatten(colorsArray));
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
    gl.bufferSubData( gl.ARRAY_BUFFER, 0, flatten(pointsArray));
}

var render = function(){
            gl.clear( gl.COLOR_BUFFER_BIT );
            update();
            gl.drawArrays(gl.POINTS, numVertices, numParticles);
            requestAnimFrame(render);
        }
