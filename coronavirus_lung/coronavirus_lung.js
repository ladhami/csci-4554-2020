

function getShaderSource(scriptID){
			var shaderScript = document.getElementById(scriptID);
			if (shaderScript == null) return "";

			var sourceCode = "";
			var child = shaderScript.firstChild;
			while(child){
				if (child.nodeType == child.TEXT_NODE) sourceCode += child.textContent;
				child = child.nextSibling;
			}

			return sourceCode;
		}
		
		const MAX = 65532;
		const MAX_OBJECT = 24;
		const GlOBAL_SCALE = 0.01;
//------------------canvas init-----------------------
		var webgl 			   		= null;
		var canvas;
		var model;
		var vertexShaderObject 		= null;
		var fragmentShaderObject 	= null;
		var programObject 			= null;
		var animationID;

//----------------model------------------------------
		var modelObject 			=[];
		var modelDrawInfo			=[];
		
		var mtlArray = [];
		var objArray = [];
		

		var a_Position;
		var a_Normal;
		var a_TextCord;
		var a_Color
		
		var u_ifCertainColor;
		var u_certainColor;
		var mtlOK=0;


		

//----------------projection-------------------
		
		var u_MvpMatrix;
		var u_ModelViewMatrix;
		var u_NormalMatrix;
		var projectMat 				= mat4();
		var viewMat 				= mat4();
		var matRotX = mat4();
		var matRotY = mat4();

//---------------camera------------------------------
		var cameraEye				= vec3();
		var cameraCenter 			= vec3();
		var cameraUp				= vec3();
		var cameraLookAt 			= vec3();
		var cameraRight				= vec3();
		var radius 					= 40;
		var viewPortW				= 0;
		var viewPortH 				= 0;

		var times   =   (new Date()).valueOf();
	
		var eye_Position;

//------------------textures---------------------------
		var u_Sampler;
        var TextureArray = [];
        var loadTextures = {unload:0};		

		var texWidth = 0;
		var texHeight = 0;

//-----------------lighting--------------------
		
		

		var lightColor = vec3(0.5, 0.5, 0.5);
		var lightPosition = vec3(-2,0,-5);

		 

//==================update initial model-infor functions==============================

function updateDrawInfo(index, _rot, _pos, _scale, _color, _ifCertainColor,_ifshow ){
    if(!modelDrawInfo[index])
        modelDrawInfo[index]={};

    //set inial transformation
    modelDrawInfo[index].rotateX=_rot[0];
    modelDrawInfo[index].rotateY=_rot[1];
    modelDrawInfo[index].rotateZ=_rot[2];

    //set inial Position
    modelDrawInfo[index].offsetX=_pos[0];
    modelDrawInfo[index].offsetY=_pos[1];
    modelDrawInfo[index].offsetZ=_pos[2];

    //set initial scale
    modelDrawInfo[index].scaleX=_scale[0];
    modelDrawInfo[index].scaleY=_scale[1];
    modelDrawInfo[index].scaleZ=_scale[2];

    //set initial certain colors
    modelDrawInfo[index].r=_color[0];
    modelDrawInfo[index].g=_color[1];
    modelDrawInfo[index].b=_color[2];
    modelDrawInfo[index].a=_color[3];

    modelDrawInfo[index].u_ifCertainColor=_ifCertainColor;

    //set hide or show this object
    modelDrawInfo[index].ifShow=_ifshow;

    return modelDrawInfo;

}

function printf(v){
            
       console.log(v);
        }
//===================loading-data-to-buffers functions===============================
var jjjj = 0;

function getDrawingInfo(ifTexture) {
    // Create an arrays for vertex coordinates, normals, colors, and indices
    var numIndices = 0;
    for(var i = 0; i < this.objects.length; i++){
        numIndices += this.objects[i].numIndices;
        //每一个objects[i].numIndices 是它的所有的face的顶点数加起来
    }
    var numVertices = numIndices;
    var vertices = new Float32Array(numVertices * 3);
    var normals = new Float32Array(numVertices * 3);
    var colors = new Float32Array(numVertices * 4);
    
    var indices = new Uint16Array(numIndices);

    
    var textureVt = new Float32Array(numVertices * 3);

    // Set vertex, normal, texture and color
    
    var index_indices = 0;
    for(i = 0; i < this.objects.length; i++){
        var object = this.objects[i];
        if(jjjj<1)console.log("object.faces.length",object.faces.length,this.objects.length);
        for(var j = 0; j < object.faces.length; j++){
            var face = object.faces[j];
            var color = findColor(this,face.materialName);
            // console.log(face.materialName,color);
            var faceNormal = face.normal;
            for(var k = 0; k < face.vIndices.length; k++){
                // Set index
                indices[index_indices] = index_indices%MAX;
                // Copy vertex
                var vIdx = face.vIndices[k];
                var vertex = this.vertices[vIdx];
                vertices[index_indices * 3    ] = vertex.x;
                vertices[index_indices * 3 + 1] = vertex.y;
                vertices[index_indices * 3 + 2] = vertex.z;

                var tIdx = face.tIndices[k];
                var Tvertex = this.textureVt[tIdx];
                if(!!Tvertex) {
                    textureVt[index_indices * 3] = Tvertex.x;
                    textureVt[index_indices * 3 + 1] = Tvertex.y;
                    textureVt[index_indices * 3 + 2] = ifTexture;
                }
                else{
                    
                    textureVt[index_indices * 3] = 0;
                    textureVt[index_indices * 3 + 1] = 0;
                    textureVt[index_indices * 3 + 2] = ifTexture;
                }

                // Copy color
                colors[index_indices * 4    ] = color.r;
                colors[index_indices * 4 + 1] = color.g;
                colors[index_indices * 4 + 2] = color.b;
                colors[index_indices * 4 + 3] = color.a;
                // console.log(colors,color);
                // Copy normal
                var nIdx = face.nIndices[k];
                if(nIdx >= 0){
                    var normal = this.normals[nIdx];
                    normals[index_indices * 3    ] = normal.x;
                    normals[index_indices * 3 + 1] = normal.y;
                    normals[index_indices * 3 + 2] = normal.z;
                }else{
                    normals[index_indices * 3    ] = faceNormal.x;
                    normals[index_indices * 3 + 1] = faceNormal.y;
                    normals[index_indices * 3 + 2] = faceNormal.z;
                }
                index_indices ++;
            }
            jjjj++;
        }
    }
    return new DrawingInfo(vertices, normals, colors, indices, textureVt);
}

var ready = true;


function onReadComplete(webgl, model, target,begin,numbers,ifTexture) {
    // Acquire the vertex coordinates and colors from OBJ file
    //console.log("target",target);
    var drawingInfo = getDrawingInfo.call(target,ifTexture);
    if(ready) {
        console.log(drawingInfo, "drawingInfo");
        ready = !ready;
    }
    // Write date into the buffer object
    webgl.bindBuffer(webgl.ARRAY_BUFFER, model.vertexBuffer);
    webgl.bufferData(webgl.ARRAY_BUFFER, drawingInfo.vertices.slice(begin*3,(begin+numbers)*3), webgl.STATIC_DRAW);

    webgl.bindBuffer(webgl.ARRAY_BUFFER, model.normalBuffer);
    webgl.bufferData(webgl.ARRAY_BUFFER, drawingInfo.normals.slice(begin*3,(begin+numbers)*3), webgl.STATIC_DRAW);

    webgl.bindBuffer(webgl.ARRAY_BUFFER, model.colorBuffer);
    webgl.bufferData(webgl.ARRAY_BUFFER, drawingInfo.colors.slice(begin*4,(begin+numbers)*4), webgl.STATIC_DRAW);

    webgl.bindBuffer(webgl.ARRAY_BUFFER, model.textBuffer);
    webgl.bufferData(webgl.ARRAY_BUFFER, drawingInfo.textureVt.slice(begin*3,(begin+numbers)*3), webgl.STATIC_DRAW);

    // Write the indices to the buffer object
    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
    webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, drawingInfo.indices.slice(begin,begin+numbers), webgl.STATIC_DRAW);

    return drawingInfo;
}

//=======================Create empty buffers function=========================

//---------------Create vertex buffer object
		function create_vbo(a_attribute, num, type){

			var vertexBuffer = webgl.createBuffer();
			// Create a buffer object
    		if (!vertexBuffer) {
        		console.log('Failed to create the buffer object');
        		return null;
    }
			webgl.bindBuffer(webgl.ARRAY_BUFFER, vertexBuffer);

    		webgl.vertexAttribPointer(a_attribute, num, type, true, 0, 0);  // Assign the buffer object to the attribute variable
    		webgl.enableVertexAttribArray(a_attribute);
			

			return vertexBuffer;
		}
//-----------------Create index buffer objects-----------------
		function create_ibo(){

			var indexBuffer = webgl.createBuffer();
			webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			return indexBuffer;
		}
//-----------------init vertex buffers---------------------------------------------
function initVertexBuffers() {
     var o = new Object(); // Utilize Object object to return multiple buffer objects
    o.vertexBuffer = create_vbo( a_Position, 3, webgl.FLOAT);
    o.normalBuffer = create_vbo( a_Normal, 3, webgl.FLOAT);
    o.colorBuffer = create_vbo( a_Color, 4, webgl.FLOAT);
    o.textBuffer = create_vbo( a_TextCord, 3, webgl.FLOAT);
    o.indexBuffer = create_ibo();

    if (!o.vertexBuffer || !o.normalBuffer || !o.textBuffer || !o.colorBuffer || !o.indexBuffer) { return null; }

    webgl.bindBuffer(webgl.ARRAY_BUFFER, null);

    return o;
}
//===========================init textures======================================
function initTextures(thisTexture) {
    console.log(webgl,"image to onload ..",webgl);
    var texture = webgl.createTexture();   // Create a texture object
    if (!texture) {
        console.log('Failed to create the texture object');
        return false;
    }

    // Get the storage location of u_Sampler
    var u_Sampler = webgl.getUniformLocation(programObject, 'u_Sampler');
    //console.log("u_Sampler",u_Sampler);
    if (!u_Sampler) {
        console.log('Failed to get the storage location of u_Sampler');
        return false;
    }
    var image = new Image();  // Create the image object
    if (!image) {
        console.log('Failed to create the image object');
        return false;
    }
    // Register the event handler to be called on loading an image
    image.onload = function(){
        mtlOK++;
        console.log("image onload");
        loadTexture(thisTexture.n, texture, u_Sampler, image);
    };
    // Tell the browser to load an image
    image.src = thisTexture.TextureUrl;

    return true;
}

function loadTexture(n, texture, u_Sampler, image) {
    var TextureList = [webgl.TEXTURE0,webgl.TEXTURE1,webgl.TEXTURE2,webgl.TEXTURE3,webgl.TEXTURE4,webgl.TEXTURE5,webgl.TEXTURE6,webgl.TEXTURE7];

    webgl.pixelStorei(webgl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    // Enable texture unit0
    webgl.activeTexture(TextureList[n]);
    // Bind the texture object to the target
    webgl.bindTexture(webgl.TEXTURE_2D, texture);

    // Set the texture parameters
    
    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.NEAREST);//纹理放大算法
            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.NEAREST);//纹理缩小算法
            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.REPEAT);//纹理包装
            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.REPEAT);
    // Set the texture image
    webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGB, webgl.RGB, webgl.UNSIGNED_BYTE, image);

    loadTextures.unload-=1;
    // Set the texture unit 0 to the sampler
    // webgl.uniform1i(u_Sampler, n);
}




    function init()
    {
        var isAutomated = navigator.webdriver    
        if(isAutomated) 
        {
            document.getElementById("container").style.display = "none";             
        } 
        else 
        {  

            document.getElementById("preview").style.display = "none"; 

            var canvas = document.getElementById("myCanvas");
            webgl = canvas.getContext("webgl");

            webgl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);

            projectMat = perspective(45.0, canvas.clientWidth/canvas.clientHeight, 1.0, 5000.0 );
            orthoMat   = ortho(0, canvas.clientWidth, canvas.clientHeight, 0, -1.0, +1.0);
            texWidth = canvas.clientWidth;
            texHeight = canvas.clientHeight;

            viewPortW   =   canvas.clientWidth;
            viewPortH   =   canvas.clientHeight;
            
            cameraEye[0] = 0;
            cameraEye[1] = 10;
            cameraEye[2] = 0;

            cameraCenter[0] = 0;
            cameraCenter[1] = 0;
            cameraCenter[2] = 1;
            cameraUp[0] = 0;
            cameraUp[1] = 1;
            cameraUp[2] = 0;
            
            cameraLookAt = subtract(cameraCenter, cameraEye);
            cameraLookAt = normalize(cameraLookAt);

            viewMat = lookAt(cameraEye, cameraCenter, cameraUp);
        
            vertexShaderObject = webgl.createShader(webgl.VERTEX_SHADER);
            fragmentShaderObject = webgl.createShader(webgl.FRAGMENT_SHADER);

            webgl.shaderSource(vertexShaderObject, getShaderSource("shader-vs"));
            webgl.shaderSource(fragmentShaderObject, getShaderSource("shader-fs"));

            webgl.compileShader(vertexShaderObject);
            webgl.compileShader(fragmentShaderObject);

            if (!webgl.getShaderParameter(vertexShaderObject, webgl.COMPILE_STATUS))
            {
                alert("error:vertexShaderObject");
                return;
            }

            if (!webgl.getShaderParameter(fragmentShaderObject, webgl.COMPILE_STATUS))
            {

                alert("error:fragmentShaderObject");
                return;
            }

            programObject = webgl.createProgram();

            webgl.attachShader(programObject, vertexShaderObject);
            webgl.attachShader(programObject, fragmentShaderObject);


            webgl.linkProgram(programObject);
            
            if(!webgl.getProgramParameter(programObject, webgl.LINK_STATUS))
            {
                alert("error:programObject");
                return;
            }

            webgl.useProgram(programObject);

            a_Position = webgl.getAttribLocation(programObject, 'a_Position');
            a_Normal = webgl.getAttribLocation(programObject, 'a_Normal');
            a_Color = webgl.getAttribLocation(programObject, 'a_Color');
            a_TextCord = webgl.getAttribLocation(programObject, 'a_TextCord');
            u_MvpMatrix = webgl.getUniformLocation(programObject, 'u_MvpMatrix');
            u_NormalMatrix = webgl.getUniformLocation(programObject, 'u_NormalMatrix');
            u_ModelMatrix = webgl.getUniformLocation(programObject, 'u_ModelMatrix');
            u_light_position = webgl.getUniformLocation(programObject, 'u_light_position');
            u_ifCertainColor = webgl.getUniformLocation(programObject, 'u_ifCertainColor');
            u_ifCertainColor = webgl.getUniformLocation(programObject, 'u_ifCertainColor');
            eye_Position =webgl.getUniformLocation(programObject, 'eye_Position');
            u_lightColor = webgl.getUniformLocation(programObject, 'u_lightColor');

            model = initVertexBuffers();
            if (!model) {
                console.log('Failed to set the vertex information');
                return;
            }

			return canvas;			
            }
		}


		var varRotX = 0;
		var varRotY = 0;
		var varRotZ = 0;
		var offsetY_u = 0;
		var offsetX_u = 0;
		
		var mouseDown = false;
		

		var lastMouseX = 0;
		var lastMouseY = 0;

        function handleMouseDown(event){
            
            mouseDown = true;
            
            varRotX = offsetX_u;
            varRotY = offsetY_u;
            matRotX = rotate (varRotX ,[1.0, 0.0, 0.0]);
			matRotY = rotate (varRotY ,[0.0, 1.0, 0.0]);
            console.log("down",varRotX, varRotY);


            
            lastMouseX = event.clientX;
            lastMouseY = event.clientY;//

        }
    

        function handleMouseUp(event){

            mouseDown = false;
            
            
           

            
        }

        function handleMouseMove(event){
            if (!mouseDown)
                    return;
            var offsetX = event.clientX - lastMouseX;
            var offsetY = event.clientY - lastMouseY;
            

            matRotX = rotate (varRotX + offsetX,[1.0, 0.0, 0.0]);
			matRotY = rotate (varRotY + offsetY,[0.0, 1.0, 0.0]);

			offsetX_u = varRotX+offsetX;
			offsetY_u = varRotY+offsetY;
			console.log("move","x",offsetX_u, "y",offsetY_u);

            
            


            }

        function handleMouseWheel(event){

            if (event.wheelDelta > 0){
                radius *= 1.1;
            }

            else{
                radius *= 0.9;
            }
        }
    



		

		function updateCamera(){

			cameraEye[0] = cameraCenter[0] - cameraLookAt[0]*radius;
			cameraEye[1] = cameraCenter[1] - cameraLookAt[1]*radius;
			cameraEye[2] = cameraCenter[2] - cameraLookAt[2]*radius;

			var upDir = normalize(cameraUp);
			
			viewMat = lookAt(cameraEye, cameraCenter, upDir);


		}

		

		

		
//========================= Main ====================================		

	function webglStart(){

			canvas = init();
			
			canvas.onmousedown = handleMouseDown;
            canvas.onmouseup = handleMouseUp;
            canvas.onmousemove = handleMouseMove;
            canvas. onmousewheel = handleMouseWheel;	
			

		
//------------------loading all models------------------------------
        readOBJFile('model/Coronavirus_hipoly.obj', modelObject,  mtlArray, objArray, 0.3, false, 0);
    	TextureArray[0]={ifTexture:1.0,TextureUrl:'model/coronavirus diffuse.png',n:0};
    	updateDrawInfo(0,[0.0,0.0,0.0], [0,0.0,0.0], [1,1,1],  [0.5,0.5,0.5,1], 0 , 1);
	    readOBJFile('model/lungs.obj', modelObject,  mtlArray, objArray, 4.0, false, 1);
	    TextureArray[1]={ifTexture:0.0,TextureUrl:'none',n:1};
	    updateDrawInfo(1,[95,190,0], [0,0.0,0], [1,1,1],  [0.5,0.5,0.5,1], 0 ,0);

        readOBJFile('model/cloud1.obj', modelObject,  mtlArray, objArray, 1.0, false, 2);
        TextureArray[2]={ifTexture:1.0,TextureUrl:'repeat',n:0};
        updateDrawInfo(2,[125,170,0], [1,-3.0,-6], [1,1,1],  [0.5,0.5,0.5,1], 0 ,0);

        readOBJFile('model/cloud1.obj', modelObject,  mtlArray, objArray, 1.0, false, 3);
        TextureArray[3]={ifTexture:1.0,TextureUrl:'repeat',n:0};
        updateDrawInfo(3,[0,0,-2], [1.0,2.0,-5], [1.5,1,1],  [0.5,0.5,0.5,1], 0 ,0);

        readOBJFile('model/cloud1.obj', modelObject,  mtlArray, objArray, 1.0, false, 4);
        TextureArray[4]={ifTexture:1.0,TextureUrl:'repeat',n:0};
        updateDrawInfo(4,[0,0,-2], [1.0,2.0,0], [1.5,1.0,1],  [0.5,0.5,0.5,1], 0 ,0);


        readOBJFile('model/cloud1.obj', modelObject,  mtlArray, objArray, 1.0, false, 5);
        TextureArray[5]={ifTexture:1.0,TextureUrl:'repeat',n:0};
        updateDrawInfo(5,[0,0,0], [-6,-0.0,0], [1,1,1],  [0.5,0.5,0.5,1], 0 ,0);
       
//-------------------event--------------------------------------
           
               
        document.getElementById("coronavirus").onclick = function(){
            updateDrawInfo(0,[0.0,0.0,0.0], [0,0.0,0.0], [1,1,1],  [0.5,0.5,0.5,1], 0 , 1);
            updateDrawInfo(1,[95,190,0], [0,0.0,0], [1,1,1],  [0.5,0.5,0.5,1], 0 ,0);
             updateDrawInfo(1,[95,190,0], [0,0.0,0], [1,1,1],  [0.5,0.5,0.5,1], 0 ,0);
            updateDrawInfo(2,[125,170,0], [1,-3.0,-6], [1,1,1],  [0.5,0.5,0.5,1], 0 ,0);
            updateDrawInfo(3,[0,0,-2], [1.0,2.0,-5], [1.5,1,1],  [0.5,0.5,0.5,1], 0 ,0);
            updateDrawInfo(4,[0,0,-2], [1.0,2.0,0], [1.5,1.0,1],  [0.5,0.5,0.5,1], 0 ,0);
            updateDrawInfo(5,[0,0,0], [-6,-0.0,0], [1,1,1],  [0.5,0.5,0.5,1], 0 ,0);

        };
        document.getElementById("lung").onclick = function(){
            updateDrawInfo(0,[0.0,0.0,0.0], [0,0.0,0.0], [1,1,1],  [0.5,0.5,0.5,1], 0 , 0);
            updateDrawInfo(1,[95,190,0], [0,0.0,0], [1,1,1],  [0.5,0.5,0.5,1], 0 ,1); 
            updateDrawInfo(2,[125,170,0], [1,-3.0,-6], [1,1,1],  [0.5,0.5,0.5,1], 0 ,0);
            updateDrawInfo(3,[0,0,-2], [1.0,2.0,-5], [1.5,1,1],  [0.5,0.5,0.5,1], 0 ,0);
            updateDrawInfo(4,[0,0,-2], [1.0,2.0,0], [1.5,1.0,1],  [0.5,0.5,0.5,1], 0 ,0);
            updateDrawInfo(5,[0,0,0], [-6,-0.0,0], [1,1,1],  [0.5,0.5,0.5,1], 0 ,0);

        };

        document.getElementById("infected lung").onclick = function(){
            updateDrawInfo(0,[0.0,0.0,0.0], [0,0.0,0.0], [1,1,1],  [0.5,0.5,0.5,1], 0 , 0);
            updateDrawInfo(1,[95,190,0], [0,0.0,0], [1,1,1],  [0.5,0.5,0.5,1], 0 ,1);
            updateDrawInfo(2,[125,170,0], [1,-3.0,-6], [1,1,1],  [0.5,0.5,0.5,1], 0 ,1);
            updateDrawInfo(3,[0,0,-2], [1.0,2.0,-5], [1.5,1,1],  [0.5,0.5,0.5,1], 0 ,1);
            updateDrawInfo(4,[0,0,-2], [1.0,2.0,0], [1.5,1.0,1],  [0.5,0.5,0.5,1], 0 ,1);
            updateDrawInfo(5,[0,0,0], [-6,-0.0,0], [1,1,1],  [0.5,0.5,0.5,1], 0 ,1);

        };
    
//--------------------------draw----------------------------------			
		for(var ii=0;ii<TextureArray.length;ii++){
        if(TextureArray[ii].TextureUrl!="none" && TextureArray[ii].TextureUrl!="repeat"){
            loadTextures.unload++;
            initTextures(TextureArray[ii]);
        }
    }
    initrender();
    tick();	



		}
//============================== draw functions =============================
var tttt = 0;

function initrender(){
	var elapsed = (new Date()).valueOf() - times;
			times = (new Date()).valueOf();

			

			
			updateCamera();

			webgl.clearColor(0.0, 0.0, 0.0, 1.0);

			webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
			webgl.enable(webgl.DEPTH_TEST);
			webgl.uniform3f(u_light_position,cameraEye[0], cameraEye[1],cameraEye[2]);
   			webgl.uniform3f(u_lightColor,lightColor[0],lightColor[1],lightColor[2]);

}	



function renderScene(model,index){

	

	
    
	if(!modelDrawInfo[index].ifShow) return;  //not show

    //not ready
    if(!mtlArray[index] || !objArray[index]){
        console.log("no object!!!");
        return;
    }
    // set texture
     if(TextureArray[index].ifTexture==1.0){
        var u_Sampler = webgl.getUniformLocation(programObject, 'u_Sampler');
        webgl.uniform1i(u_Sampler, TextureArray[index].n);
    }

    //calculate the vertexnum
    var numIndices = 0;
    for(var i = 0; i < modelObject[index].objects.length; i++){
        numIndices += modelObject[index].objects[i].numIndices;
        //每一个objects[i].numIndices 是它的所有的face的顶点数加起来
    }

     

    webgl.uniform4f(u_certainColor,modelDrawInfo[index].r,modelDrawInfo[index].g,modelDrawInfo[index].b,modelDrawInfo[index].a);
    webgl.uniform1f(u_ifCertainColor,modelDrawInfo[index].u_ifCertainColor);

    		var mvp = mat4();
    		var matinitScale = mat4();
    		var matInitModel = mat4();
    		var matinitTrans = mat4();
			var matinitRotX = mat4();
			var matinitRotY = mat4();
			var matinitRotZ = mat4();
			var matinitRot = mat4();


			
			var matTrans = mat4();
			var matRot = mat4();
			var matModel = mat4();
			var matTemp = mat4();
			

    for(var ii=0;ii<Math.ceil(numIndices/MAX);ii++){
        if(tttt<1)console.log("when tttt < 1",numIndices,(numIndices-ii*MAX)<MAX?(numIndices-ii*MAX):MAX);
        g_drawingInfo = onReadComplete(webgl, model, modelObject[index],ii*MAX,(numIndices-ii*MAX)<MAX?(numIndices-ii*MAX):MAX,TextureArray[index].ifTexture);
        g_objDoc = null;
        
        //init model Position
        matinitTrans = translate(modelDrawInfo[index].offsetX,modelDrawInfo[index].offsetY,modelDrawInfo[index].offsetZ);
        matinitRotX = rotate(modelDrawInfo[index].rotateX, [1.0, 0.0, 0.0]);
        matinitRotY = rotate(modelDrawInfo[index].rotateY, [0.0, 1.0, 0.0]);
        matinitRotZ = rotate(modelDrawInfo[index].rotateZ, [0.0, 0.0, 1.0]);
        matinitScale = scalem(modelDrawInfo[index].scaleX,modelDrawInfo[index].scaleY,modelDrawInfo[index].scaleZ);

        matinitRot = mult(matinitRotX, matinitRotY);
        matinitRot = mult(matinitRot, matinitRotZ);
        matInitModel = mult(matinitRot,matinitScale);
        matInitModel = mult(matInitModel,matinitTrans);
        


		//transformation
			//varRotZ += 1;

       		
			matRotZ = rotate(varRotZ,[0.0, 0.0, 1.0]) // 设置模型旋转矩阵


       		
      
        

        matRot = mult(matRotY, matRotX);
        matRot = mult(matRot, matRotZ);
		matModel = mult(matTrans, matRot);
		matModel = mult(matModel,matInitModel);
		

		matTemp = mult(projectMat, viewMat);
		mvp = mult(matTemp, matModel);
		matMV = mult(viewMat, matModel);

        

        var normalMatrix = mat4();
			normalMatrix = inverse4(matMV);

			normalMatrix = transpose(normalMatrix);

		webgl.uniformMatrix4fv(u_NormalMatrix, false, flatten(normalMatrix));
		webgl.uniformMatrix4fv(u_ModelMatrix, false, flatten(matModel));
		
		webgl.uniformMatrix4fv(u_MvpMatrix, false, flatten(mvp));
        

        // Draw
        webgl.drawElements(webgl.TRIANGLES,(numIndices-ii*MAX)<MAX?(numIndices-ii*MAX):MAX, webgl.UNSIGNED_SHORT, 0);
    }

    tttt++;

}



			

			

		function tick(){

		if(loadTextures.unload<=0){
            initrender();
            for(var ii=0;ii<modelObject.length;ii++){
                renderScene(model,ii);
            }
        }
        animationID = requestAnimationFrame(tick, canvas);
    };//先告诉做这件事，再render