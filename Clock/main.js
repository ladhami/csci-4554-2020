
var gl;
var shaderProgram = []; //shaderProgram ["graphic"] = ..

var texture= [];   //texture["name"] = ..

var mGraphic;

var matrixModel = scalem(1,1,1);;//mat4.create();
var matrixView  = scalem(1,1,1);;//mat4.create();
var matrixPro   = scalem(1,1,1);;//mat4.create();

var mTranslation = [0,0,0];
var mRotateAng   = [0,0,0];


function createGLContext(CanvasId)
{
    var canvas = document.getElementById(CanvasId);

    if (!canvas)
    {
        console.log('Failed to retrieve the <canvas> element.');
        return;
    }
    var wgl = canvas.getContext("webgl");
    wgl.viewportWidth = canvas.clientWidth;
    wgl.viewportHeight = canvas.clientHeight;
    return wgl;
}
//init
function InitData(gl) {

    //init shader
    {
        {
            //shader 2
            shaderProgram["light"] = initShaders(gl,"shader-vs","shader-fs1");// CreateShader(gl,"shader-vs","shader-fs");
            gl.useProgram(shaderProgram["light"]);
            {
                matrixView =  lookAt([0.0, 0.0, 150.0],[0.0,0.0,0.0],[0.0,1.0,0.0]);
                matrixPro = perspective(45.0,gl.viewportWidth/gl.viewportHeight,0.1,-1000);
                gl.uniformMatrix4fv(shaderProgram["light"].u_ProMatrix, false, flatten(matrixPro));
                gl.uniformMatrix4fv(shaderProgram["light"].u_ViewMatrix, false, flatten(matrixView));
            }
            gl.useProgram(null);

            //shader 1

            shaderProgram["graphic"] = initShaders(gl,"shader-vs","shader-fs");// CreateShader(gl,"shader-vs","shader-fs");
            gl.useProgram(shaderProgram["graphic"]);
            {
               matrixView =  lookAt([0.0, 0.0, 150.0],[0.0,0.0,0.0],[0.0,1.0,0.0]);
               matrixPro = perspective(45.0,gl.viewportWidth/gl.viewportHeight,0.1,-1000);
               gl.uniformMatrix4fv(shaderProgram["graphic"].u_ProMatrix, false, flatten(matrixPro));
               gl.uniformMatrix4fv(shaderProgram["graphic"].u_ViewMatrix, false, flatten(matrixView));
           }
            gl.useProgram(null);
        }
    }

    {
        texture["wall"]  =  LoadTexture(gl,"res/wall1.png");
        texture["clock"] =  LoadTexture(gl,"res/clock.png");
        texture["normal"]=  LoadTexture(gl,"res/normal.png");
        texture["sun"]   =  LoadTexture(gl,"res/sun.bmp");
    }


    {
        mGraphic = new Graphic(shaderProgram["graphic"],gl);
        mGraphic.initRenderData();
    }

}

function InitWebgl(gl)
{
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clearColor(0.0,0.0,0.0,1.0); //R G B A
    gl.enable(gl.DEPTH_TEST);
}
function DrawClock(matrixModel)
{
   var speed = 0.5;
    mRotateAng[1]+= speed;
    mRotateAng[2]+= speed * 30.0;
    mRotateAng[1] = mRotateAng[1]  % 360;
    mRotateAng[2] =  mRotateAng[2] % 360;
    //clock
    {
         var matrixModel1 =mult(matrixModel, scalem(1,1,1));
         mGraphic.Draw(1, matrixModel1,texture["clock"], [0, 0.0, 0], [10, 10, 2.0], [0.0,  0.0, 0.0]);
    }

    //hour
    {
        var matrixModel1 =mult(matrixModel, scalem(1,1,1));
        matrixModel1 = mult(matrixModel1,rotateZ(-mRotateAng[1]));
        matrixModel1 = mult(matrixModel1,translate(0,1,0));
        mGraphic.Draw(1, matrixModel1,texture["wall"], [0, 0, 1.25], [0.8, 3, 0.5], [0.0,  0.0, 0.0]);
    }
    //min
    {
        var matrixModel1 =mult(matrixModel, scalem(1,1,1));
        matrixModel1 = mult(matrixModel1,rotateZ(-mRotateAng[2] ));
        matrixModel1 = mult(matrixModel1,translate(0,2,0));
         mGraphic.Draw(1, matrixModel1,texture["wall"], [0, 0, 1.5], [0.5, 4, 0.5], [0.0,  0.0, 0.0]);
    }
}

function draw(gl)
{

    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

    {
         matrixModel =mult(translate([0,0,0]),matrixModel);
        matrixModel = mult(rotateY(0.0  * Math.PI/180.0),matrixModel);
    }
    matrixView =  lookAt([0.0, 0.0, 100.0],[0.0,0.0,0.0],[0.0,1.0,0.0]);
    matrixPro = perspective(45.0,gl.viewportWidth/gl.viewportHeight,0.1,-1000);

    {
        gl.useProgram(shaderProgram["graphic"]);
        gl.uniform3f(shaderProgram["graphic"].u_LightPos,0,50*Math.sin(mRotateAng[1]* Math.PI/180.0),50*Math.cos(mRotateAng[1]* Math.PI/180.0));
    }

    mGraphic.SetShader(shaderProgram["graphic"])
    {
        var modelMatrix1 = mult(matrixModel,translate(0,0,5));
        DrawClock(modelMatrix1);
    }

    {
        var modelMatrix1 = mult(matrixModel,rotateX(-mRotateAng[1]))
        modelMatrix1 = mult(modelMatrix1,translate(10*Math.cos(mRotateAng[1]* Math.PI/180.0),0,50));
        mGraphic.Draw(2, modelMatrix1,texture["sun"], [0, 0.0, 0], [3, 3, 3.0], [0.0,  0.0,0]);
    }

    gl.useProgram(shaderProgram["light"]);
    gl.uniform3f(shaderProgram["light"].u_LightPos,0.0,50*Math.sin(mRotateAng[1]* Math.PI/180.0),50*Math.cos(mRotateAng[1]* Math.PI/180.0));
    mGraphic.SetShader(shaderProgram["light"]);
    mGraphic.SettexNormal(texture["normal"]);
    mGraphic.Draw(1, matrixModel,texture["wall"], [0, 0.0, 0], [50, 50, 5.0], [0.0,  0.0,0]);
}


function onDocumentKeyDown(event){

    switch(event.keyCode){
        case 65:  //A

            break;
        case 68:  //D

            break;
        case 87:  //W

            break;
        case 83:  //S

            break;
        case 81:  //Q

            break;
        case 69:  //E

            break;
        case 90:  //Z

            break;
        case 88:  //X

            break;
        case 67:  //C

            break;
    }

}
function onDocumentKeyUp(event){

    switch(event.keyCode){
        case 'S':

            break;
    }
}

function main()
{
    var isAutomated = navigator.webdriver    
    if(isAutomated) {
        document.getElementById("container").style.display = "none";             
    } else {            
        document.getElementById("preview").style.display = "none"; 

        gl =  createGLContext("myCanvas");

        InitData(gl);

        InitWebgl(gl);

        {

            document.addEventListener('keydown',onDocumentKeyDown,false);
            document.addEventListener('keyup',onDocumentKeyUp,false);

        }

        tick();
    }
}

function tick()
{
    requestAnimationFrame(tick);
    draw(gl);
}
window.requestAnimFrame = (function ()
{
    return window.requestAnimationFrame||
        window.webkitRequestAnimationFrame||
        window.mozRequestAnimationFrame||
        window.oRequestAnimationFrame||
        window.msRequestAnimationFrame||
        function(callback,element){
            window.setTimeout(callback,1000/60);
        };

})


