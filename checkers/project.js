"use strict";

var canvas;
var gl;

var totalnum = 0;
var index = 0;
var verts = 0;
var pointsArray = [];
var colors = [];
var vertices = [];
var normalsArray = [];
var cubes = 0;

var checkers = [[0,1,0,1,0,1,0,1],
                [1,0,1,0,1,0,1,0],
                [0,1,0,1,0,1,0,1],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [2,0,2,0,2,0,2,0],
                [0,2,0,2,0,2,0,2],
                [2,0,2,0,2,0,2,0]];

var pieces = [];
var piecenum = 0;

var near = 0.3;
var far = 10.0;
//var radius = 4.0;
var radius = 2.1;
//var theta  = 0.1;
//var phi    = -1.57079633;
//var dr = 5.0 * Math.PI/180.0;
var theta  = 0;
var phi    = 0;
var dr = 0;

//var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  fovy = 90.0;
var  aspect = 1.0;       // Viewport aspect ratio

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

////////////////sphere

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);

////////////////
var lightPosition = vec4(1.5,.2,1.0,1);
var lightAmbient = vec4(0.05, 0.05, 0.05, 1.0 );
var lightDiffuse = vec4( 0.05, 0.05, 0.05, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 1000.0;

var ctm;
var ambientColor, diffuseColor, specularColor;
var normalMatrix, normalMatrixLoc;

var modelView, projection;
var viewerPos;
var program;
////////////////

function quad(a, b, c, d) {

     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[b]);
     var normal = cross(t1, t2);
     var normal = vec3(normal);

     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     pointsArray.push(vertices[b]);
     normalsArray.push(normal);
     pointsArray.push(vertices[c]);
     normalsArray.push(normal);
     pointsArray.push(vertices[a]);
     normalsArray.push(normal);
     pointsArray.push(vertices[c]);
     normalsArray.push(normal);
     pointsArray.push(vertices[d]);
     normalsArray.push(normal);

     totalnum += 6;
}

function colorCube(a, b, c, d ,e ,f ,g ,h)
{
    //1, 0, 3, 2
    quad( b, a, d, c );
    quad( c, d, h, g );
    quad( d, a, e, h );
    quad( g, f, b, c );
    quad( e, f, g, h );
    quad( f, e, a, b );
}

function Piece(x, y, num, bot, top, left, right, cubenum)
{
    this.x = x;
    this.y = y;
    this.side = num;
    this.bot = bot;
    this.top = top;
    this.left = left;
    this.right = right;
    this.cubenum = cubenum;
}

function inside(x, y, bot, top, left, right)
{
    if(y < top && y > bot && x < right && x > left)
        return true;
    return false;
}


var locationx;
var locationy;
var locationx2;
var locationy2;
var first = true;
var pieceHolder;

window.onload = function init()
{
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

        gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

        gl.enable(gl.DEPTH_TEST);


        //  Load shaders and initialize attribute buffers

        var program = initShaders( gl, "vertex-shader", "fragment-shader" );
        gl.useProgram( program );

        //board
        for(var x=0; x<8; x++)
        {
            for(var y=0; y<8; y++)
            {
                vertices.push(vec4(-1+(0.25*x), 0.75-(0.25*y), 1.1, 1.0));
                vertices.push(vec4(-1+(0.25*x), 1-(0.25*y), 1.1, 1.0));
                vertices.push(vec4(-0.75+(0.25*x), 1-(0.25*y), 1.1, 1.0));
                vertices.push(vec4(-0.75+(0.25*x), .75-(0.25*y), 1.1, 1.0));

                vertices.push(vec4(-1+(0.25*x), 0.75-(0.25*y), 0.9, 1.0));
                vertices.push(vec4(-1+(0.25*x), 1-(0.25*y), 0.9, 1.0));
                vertices.push(vec4(-0.75+(0.25*x), 1-(0.25*y), 0.9, 1.0));
                vertices.push(vec4(-0.75+(0.25*x), .75-(0.25*y), 0.9, 1.0));

                verts += 8;

                colorCube(verts-8, verts-7, verts-6, verts-5, verts-4, verts-3, verts-2, verts-1);
                

                for(var c=0; c<36; c++)
                {
                    //black
                    if((x+y)%2 == 0)
                        colors.push(vec4( 0.0, 0.0, 0.0, 1.0 ));
                    else
                        colors.push(vec4( 0.8, 0.8, 0.8, 1.0 ));
                    //gray
                }
                cubes++;

                if(checkers[y][x] != 0)
                {
                    vertices.push(vec4(-1+(0.25*x)+.05, 0.75-(0.25*y)+.05, 1.15, 1.0));
                    vertices.push(vec4(-1+(0.25*x)+.05, 1-(0.25*y)-.05, 1.15, 1.0));
                    vertices.push(vec4(-0.75+(0.25*x)-.05, 1-(0.25*y)-.05, 1.15, 1.0));
                    vertices.push(vec4(-0.75+(0.25*x)-.05, .75-(0.25*y)+.05, 1.15, 1.0));

                    vertices.push(vec4(-1+(0.25*x)+.05, 0.75-(0.25*y)+.05, 1.1, 1.0));
                    vertices.push(vec4(-1+(0.25*x)+.05, 1-(0.25*y)-.05, 1.1, 1.0));
                    vertices.push(vec4(-0.75+(0.25*x)-.05, 1-(0.25*y)-.05, 1.1, 1.0));
                    vertices.push(vec4(-0.75+(0.25*x)-.05, .75-(0.25*y)+.05, 1.1, 1.0));

                    verts += 8;
                    colorCube(verts-8, verts-7, verts-6, verts-5, verts-4, verts-3, verts-2, verts-1);
                    

                    pieces.push(new Piece(y, x, checkers[y][x], 0.8-(0.25*y), 0.95-(0.25*y), -0.95+(0.25*x), -0.8+(0.25*x), cubes));
                    piecenum++;

                    for(var c=0; c<36; c++)
                    {
                        if(checkers[y][x] == 1){
                            if(c == 1 || c == 5)
                                colors.push(vec4( 0.0, 0.0, 0.0, 1.0 ));
                            else
                                colors.push(vec4( 1.0, 0.0, 0.0, 1.0 ));
                        }
                        else if(checkers[y][x] == 2){
                            if(c == 0 || c == 4)
                                colors.push(vec4( 0.0, 0.0, 0.0, 1.0 ));
                            else
                                colors.push(vec4( 0.0, 0.0, 1.0, 1.0 ));
                        }
                    }
                    cubes++;
                }
            }
        }


        ////////////////////////////////////////
        var nBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
        gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

        var vNormal = gl.getAttribLocation( program, "vNormal" );
        //4 -> 3
        gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vNormal);


        var cBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
        gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

        var vColor = gl.getAttribLocation( program, "vColor" );
        gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vColor);

        var vBuffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

        var vPosition = gl.getAttribLocation( program, "vPosition" );
        gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vPosition );


        
        var ambientProduct = mult(lightAmbient, materialAmbient);
        var diffuseProduct = mult(lightDiffuse, materialDiffuse);
        var specularProduct = mult(lightSpecular, materialSpecular);

        modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
        projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
        normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );

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

        canvas.addEventListener("mousedown", function(event){
            gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);

            if(first){
                
                locationx = 2*event.clientX/canvas.width-1;
                locationy = 2*(canvas.height-event.clientY)/canvas.height-1;

                for(var loop = 0; loop < piecenum; loop++)
                {
                    if(inside(locationx, locationy, pieces[loop].bot, pieces[loop].top, pieces[loop].left, pieces[loop].right))
                    {

                        pieceHolder = loop;

                        for(var c=0; c<36; c++)
                        {
                            colors[pieces[loop].cubenum*36 + c] = vec4( 0.6, 0.0, 0.8, 1.0 );
                        }

                        first = false;
                    }
                }
            }
            else{
                locationx2 = 2*event.clientX/canvas.width-1;
                locationy2 = 2*(canvas.height-event.clientY)/canvas.height-1;

                //remove piece from checkers array
                //add piece to checkers array in new place

                //finds index in checkers array
                var oldx = findIndex('x', locationx);
                var oldy = findIndex('y', locationy);
                var newx = findIndex('x', locationx2);
                var newy = findIndex('y', locationy2);

                //holds the piece's identifier
                var side = checkers[oldy][oldx];

                if(oldx == newx && oldy == newy)
                {
                    for(var c=0; c<36; c++)
                    {
                        if(side == 1){
                            if(c == 1 || c == 5)
                                colors[pieces[pieceHolder].cubenum*36 + c] = vec4( 0.0, 0.0, 0.0, 1.0 );
                            else
                                colors[pieces[pieceHolder].cubenum*36 + c] = vec4( 1.0, 0.0, 0.0, 1.0 );
                        }
                        else if(side == 2){
                            if(c == 0 || c == 4)
                                colors[pieces[pieceHolder].cubenum*36 + c] = vec4( 0.0, 0.0, 0.0, 1.0 );
                            else
                                colors[pieces[pieceHolder].cubenum*36 + c] = vec4( 0.0, 0.0, 1.0, 1.0 );
                        }
                    }
                    first = true;
                }

                if(((Math.abs(oldx - newx) == 2) && (Math.abs(oldy - newy) == 2) || (Math.abs(oldx - newx) == 1) && (Math.abs(oldy - newy) == 1)) && checkers[newy][newx] == 0){

                    checkers[oldy][oldx] = 0;
                    checkers[newy][newx] = side;

                    //edit pieces array
                    //colorCube and add to colors
                    //replace vertices, normalsArray, pointsArray, colors
                    createMove(newy, newx, side);

                    //check for jumps
                    var middlex = Math.max(oldx, newx) - 1;
                    var middley = Math.max(oldy, newy) - 1;
                    if((Math.abs(oldx - newx) == 2) && (Math.abs(oldy - newy) == 2) && checkers[middley][middlex] != 0)
                    {
                        //remove the middle cube from vertices, normalsArray, pointsArray, colors; pieces, checkers
                        checkers[middley][middlex] = 0;

                        for(var loop = 0; loop < piecenum; loop++)
                        {
                            if(middley == pieces[loop].x && middlex == pieces[loop].y)
                            {
                                var remove = pieces[loop].cubenum;
                                pieces.splice(loop, 1);
                                piecenum--;

                                for(var rem = 0; rem < 8; rem++){
                                    vertices[(remove*8)+rem] = 0;
                                }
                                for(var rem = 0; rem < 36; rem++){
                                    vertices[(remove*36)+rem] = 0;
                                    normalsArray[(remove*36)+rem] = 0;
                                    pointsArray[(remove*36)+rem] = 0;
                                    colors[(remove*36)+rem] = 0;
                                }
                            }
                        }
                    }

                    first = true;
                }
            }


            var nBuffer = gl.createBuffer();
            gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
            gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

            var vNormal = gl.getAttribLocation( program, "vNormal" );
            //4 -> 3
            gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
            gl.enableVertexAttribArray( vNormal);


            var cBuffer = gl.createBuffer();
            gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
            gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

            var vColor = gl.getAttribLocation( program, "vColor" );
            gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
            gl.enableVertexAttribArray( vColor);

            var vBuffer = gl.createBuffer();
            gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
            gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

            var vPosition = gl.getAttribLocation( program, "vPosition" );
            gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
            gl.enableVertexAttribArray( vPosition );

            modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
            projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
            normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );
        } );
        

        render();
    }
};

function findIndex(vari, num)
{
    if(vari == 'x'){
        if(num >= -1 && num <= -.75)
            return 0;
        else if(num >= -.75 && num <= -.5)
            return 1;
        else if(num >= -.5 && num <= -.25)
            return 2;
        else if(num >= -.25 && num <= 0)
            return 3;
        else if(num >= 0 && num <= .25)
            return 4;
        else if(num >= .25 && num <= .5)
            return 5;
        else if(num >= .5 && num <= .75)
            return 6;
        else if(num >= .75 && num <= 1)
            return 7;
    }
    else{
        if(num >= -1 && num <= -.75)
            return 7;
        else if(num >= -.75 && num <= -.5)
            return 6;
        else if(num >= -.5 && num <= -.25)
            return 5;
        else if(num >= -.25 && num <= 0)
            return 4;
        else if(num >= 0 && num <= .25)
            return 3;
        else if(num >= .25 && num <= .5)
            return 2;
        else if(num >= .5 && num <= .75)
            return 1;
        else if(num >= .75 && num <= 1)
            return 0;
	}
    return num;
}
function createMove(y, x, side)
{
    var startV = pieces[pieceHolder].cubenum*8;

    vertices[startV] = (vec4(-1+(0.25*x)+.05, 0.75-(0.25*y)+.05, 1.15, 1.0));
    vertices[startV+1] = (vec4(-1+(0.25*x)+.05, 1-(0.25*y)-.05, 1.15, 1.0));
    vertices[startV+2] = (vec4(-0.75+(0.25*x)-.05, 1-(0.25*y)-.05, 1.15, 1.0));
    vertices[startV+3] = (vec4(-0.75+(0.25*x)-.05, .75-(0.25*y)+.05, 1.15, 1.0));

    vertices[startV+4] = (vec4(-1+(0.25*x)+.05, 0.75-(0.25*y)+.05, 1.1, 1.0));
    vertices[startV+5] = (vec4(-1+(0.25*x)+.05, 1-(0.25*y)-.05, 1.1, 1.0));
    vertices[startV+6] = (vec4(-0.75+(0.25*x)-.05, 1-(0.25*y)-.05, 1.1, 1.0));
    vertices[startV+7] = (vec4(-0.75+(0.25*x)-.05, .75-(0.25*y)+.05, 1.1, 1.0));

    pieces[pieceHolder] = new Piece(y, x, checkers[y][x], 0.8-(0.25*y), 0.95-(0.25*y), -0.95+(0.25*x), -0.8+(0.25*x), pieces[pieceHolder].cubenum);

    colorCube2(startV, startV+1, startV+2, startV+3, startV+4, startV+5, startV+6, startV+7, pieces[pieceHolder].cubenum*36);

    //colors[pieces[loop].cubenum*36 + c] = vec4( 1.0, 1.0, 1.0, 1.0 );
    for(var c=0; c<36; c++)
    {
        if(side == 1){
            if(c == 1 || c == 5)
                colors[pieces[pieceHolder].cubenum*36 + c] = vec4( 0.0, 0.0, 0.0, 1.0 );
            else
                colors[pieces[pieceHolder].cubenum*36 + c] = vec4( 1.0, 0.0, 0.0, 1.0 );
        }
        else if(side == 2){
            if(c == 0 || c == 4)
                colors[pieces[pieceHolder].cubenum*36 + c] = vec4( 0.0, 0.0, 0.0, 1.0 );
            else
                colors[pieces[pieceHolder].cubenum*36 + c] = vec4( 0.0, 0.0, 1.0, 1.0 );
		}
    }
}


function quad2(a, b, c, d, start) {

     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[b]);
     var normal = cross(t1, t2);
     var normal = vec3(normal);

     pointsArray[start] = (vertices[a]);
     normalsArray[start] = normal;
     pointsArray[start+1] = (vertices[b]);
     normalsArray[start+1] = normal;
     pointsArray[start+2] = (vertices[c]);
     normalsArray[start+2] = normal;
     pointsArray[start+3] = (vertices[a]);
     normalsArray[start+3] = normal;
     pointsArray[start+4] = (vertices[c]);
     normalsArray[start+4] = normal;
     pointsArray[start+5] = (vertices[d]);
     normalsArray[start+5] = normal;
}

function colorCube2(a, b, c, d, e, f, g, h, start)
{
    //1, 0, 3, 2
    quad2( b, a, d, c, start );
    quad2( c, d, h, g, start+6 );
    quad2( d, a, e, h, start+12 );
    quad2( g, f, b, c, start+18 );
    quad2( e, f, g, h, start+24 );
    quad2( f, e, a, b, start+30 );
}


var render = function(){

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = perspective(fovy, aspect, near, far);

    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

    normalMatrix = [
        vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );

    for( var x=0; x<totalnum; x+=6)
        gl.drawArrays( gl.TRIANGLES, x, 6 );

    requestAnimFrame(render);
}
