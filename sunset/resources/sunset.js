var canvas;
var gl;
var uRenderScale;
var uRes;
var cWidth;
var cHeight;

// sun program variables
var programSun;
var sunHeight;
var sunXPosition = 0.5;
var pointsSunArray;
var NumSunVertices = 6;

function initSun() {
    var position = [
        -1, -1, 0,
        1, -1, 0,
        1, 1, 0,
        -1, -1, 0,
        1, 1, 0,
        -1, 1, 0
    ];

    var coreRadius = 0.015;
    setUniform(programSun, "coreRadius", "1f", coreRadius);

    var coreColor = vec3(1.0, 1.0, 1.0);
    setUniform(programSun, "coreColor", "3fv", coreColor);

    var haloColor = vec3(0.95, 0.55, 0.20);
    setUniform(programSun, "haloColor", "3fv", haloColor);

    pointsSunArray = new Float32Array(position);
}

// star program variables
var programStar;
var pointsStarsArray;
var NumStarVertices = 6;

function initStars() {
    var position = [
        -1, -1, 0,
        1, -1, 0,
        1, 1, 0,
        -1, -1, 0,
        1, 1, 0,
        -1, 1, 0
    ];

    pointsStarsArray = new Float32Array(position);
}

// beach program variables
var programBeach;
var pointsBeachArray;
var normalsBeachArray;
var NumBeachVertices = 6;

var pointsArray = [];
var normalsArray = [];

var lightAmbient = vec4(1.0, 1.0, 1.0, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var materialAmbient = vec4(0.0, 0.0, 0.0, 1.0);
var materialDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var materialShininess = 100.0;

function initBeach() {
    texBeachCoords = [
        vec2(0, 0),
        vec2(0, 1),
        vec2(1, 1),

        vec2(0, 0),
        vec2(1, 1),
        vec2(1, 0),
    ];

    texBeachCoords = flatten(texBeachCoords);
    ambientProduct = flatten(mult(lightAmbient, materialAmbient));
    specularProduct = flatten(mult(lightSpecular, materialSpecular));
    pointsArray = flatten([[-1, -0.5, 0, 1], [-1, -1, 0, 1], [1, -1, 0, 1], [-1, -0.5, 0, 1], [1, -1, 0, 1], [1, -0.5, 0, 1]]);
    normalsArray = flatten([[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]]);

    var diffuseProduct = flatten(mult(lightDiffuse, materialDiffuse));
    setUniform(programBeach, "diffuseProduct", "4fv", diffuseProduct);
    setUniform(programBeach, "ambientProduct", "4fv", ambientProduct);
    setUniform(programBeach, "specularProduct", "4fv", specularProduct);
    setUniform(programBeach, "shininess", "1f", materialShininess);
}

function setBuffersAndAttributes(program, vertices, attributeName, size) {
    // make sure we're on the right program
    gl.useProgram(program);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    // assumes flattened already
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var attribute = gl.getAttribLocation(program, attributeName);
    gl.vertexAttribPointer(attribute, size, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attribute);
}

function setUniform(program, name, type, value) {
    var location = gl.getUniformLocation(program, name);
    gl['uniform' + type](location, value);
}

function configureTexture(data, texCoords, type) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA,
        gl.RGBA, gl.UNSIGNED_BYTE,
        data);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    setBuffersAndAttributes(programBeach, texCoords, "vTexCoord", 2);
}

function drawBeach() {
    setBuffersAndAttributes(programBeach, normalsArray, "vNormal", 3);
    setBuffersAndAttributes(programBeach, pointsArray, "vPosition", 4);
    configureTexture(document.getElementById("beachTex"), texBeachCoords, "image");

    var lightPosition = vec4(0, 0, sunHeight, 0);
    gl.uniform4fv(gl.getUniformLocation(programBeach, "lightPosition"),
        flatten(lightPosition));

    gl.drawArrays(gl.TRIANGLES, 0, NumBeachVertices);
}


function drawSun() {
    gl.useProgram(programSun);
    setUniform(programSun, "uRes", "2fv", uRes);
    setUniform(programSun, "uRenderScale", "1f", uRenderScale);

    var center = vec2(sunXPosition, sunHeight);
    setUniform(programSun, "center", "2fv", center);

    var skyColor = vec3(0.53 * sunHeight, 0.81 * sunHeight, 0.92 * sunHeight);
    setUniform(programSun, "skyColor", "3fv", skyColor);

    var haloFalloff = 8 * (1 / sunHeight);
    setUniform(programSun, "haloFalloff", "1f", haloFalloff);

    setBuffersAndAttributes(programSun, pointsSunArray, "vPosition", 3);

    gl.drawArrays(gl.TRIANGLES, 0, NumSunVertices);
}

function drawStars(density) {
    gl.useProgram(programStar);
    setUniform(programStar, "uRenderScale", "1f", uRenderScale);
    setUniform(programStar, "uDensity", "1f", density);

    setBuffersAndAttributes(programStar, pointsStarsArray, "vPosition", 3);

    gl.drawArrays(gl.TRIANGLES, 0, NumStarVertices);
}

function drawScene() {
    // Draws the sunset with WebGL program
    gl.clear(gl.COLOR_BUFFER_BIT);

    // draw the sun
    drawSun();

    // draw the stars if the sun is down
    if (sunHeight <= 0.25) {
        // increase denisty of stars as sun lowers
        var distance = sunHeight - 0.1;
        var density = 0.05 * (1 - (distance / 0.15));
        drawStars(density);
    }

    // draw the beach
    drawBeach();
}

function setupGl() {
    canvas = document.getElementById("sunset-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
        return null;
    }

    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE);        
}

function setupSunCanvas() {
    programSun = initShaders(gl, "vertex-shader-sun", "fragment-shader-sun");
    gl.useProgram(programSun);
    initSun();
}

function setupStarCanvas() {
    programStar = initShaders(gl, "vertex-shader-star", "fragment-shader-star");
    gl.useProgram(programStar);
    initStars();
}

function setupBeachCanvas() {
    programBeach = initShaders(gl, "vertex-shader-beach", "fragment-shader-beach");
    gl.useProgram(programBeach);
    initBeach();
}

function resizeAndDraw() {
    resizeCanvas();
    drawScene();
}

function resizeCanvas() {
    if (!canvas) {
        return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    cWidth = canvas.width;
    cHeight = canvas.height;

    gl.viewport(0, 0, cWidth, cHeight);

    uRenderScale = Math.max(cWidth, cHeight);
    uRes = [cWidth, cHeight];
}

document.querySelector("#sunsetHeight").addEventListener('input', (e) => {
    // update sunset height with slider
    sunHeight = e.target.value;
    drawScene();
});

window.onload = function () {
    var isAutomated = navigator.webdriver
    if(isAutomated) {
        document.getElementById("container").style.display = "none";             
        document.getElementById("preview").style.display = ""; 
    } else {            
        document.getElementById("preview").style.display = "none"; 
        document.getElementById("container").style.display = "";             

        if (!gl || !canvas) {
            setupGl();
        }

        sunHeight = document.getElementById("sunsetHeight").value;

        resizeCanvas();
        setupSunCanvas();
        setupStarCanvas();
        setupBeachCanvas();
        drawScene();
    }
}

window.onresize = resizeAndDraw;