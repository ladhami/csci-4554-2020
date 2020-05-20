//=============================================INSTRUCTIONS===================================
/*This objFileLoader is for analyzing the obj file and mtl file  and return all the data in an array drawInfo with using a function
"readOBJFile(fileName, modelObject, mtlArray, objArray, scale, reverse, index)", the parameter you may modify including 
fileName(file path), scale(array(3)), reverse(true or false) and index. The index should be set in order and keep it instance to one model 
when you apply other functions to operate this model.

Note: this loader is not availabel to read usemtl file in the OBJ file. May need to make 
some edit on the OBJ file  */
//================================================================================================

var StringParser = function(str) {
    this.str = null;   // Store the string specified by the argument
    this.index = 0; // Position in the string to be processed
    this.init(str);
};
// Initialize StringParser object
StringParser.prototype.init = function(str){
    this.str = str;
    this.index = 0;
};

// Skip delimiters
StringParser.prototype.skipDelimiters = function()  {
    for(var i = this.index, len = this.str.length; i < len; i++){
        var c = this.str.charAt(i);
        // Skip TAB, Space, '(', ')
        if (c == '\t'|| c == ' ' || c == '(' || c == ')' || c == '"') continue;
        break;
    }
    this.index = i;
};

// Skip to the next word
StringParser.prototype.skipToNextWord = function() {
    this.skipDelimiters();
    var n = getWordLength(this.str, this.index);
    this.index += (n + 1);
};

// Get word
StringParser.prototype.getWord = function() {
    this.skipDelimiters();
    var n = getWordLength(this.str, this.index);
    if (n == 0) return null;
    var word = this.str.substr(this.index, n);
    this.index += (n + 1);

    return word;
};

// Get integer
StringParser.prototype.getInt = function() {
    return parseInt(this.getWord());
};

// Get floating number
StringParser.prototype.getFloat = function() {
    return parseFloat(this.getWord());
};

// Get the length of word
function getWordLength(str, start) {
    var n = 0;
    for(var i = start, len = str.length; i < len; i++){
        var c = str.charAt(i);
        if (c == '\t'|| c == ' ' || c == '(' || c == ')' || c == '"')
            break;
    }
    return i - start;
}
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// MTLDoc Object
//------------------------------------------------------------------------------
var MTLDoc = function() {
    this.complete = false; // MTL is configured correctly
    this.materials = new Array(0);
};

MTLDoc.prototype.parseNewmtl = function(sp) {
    return sp.getWord();         // Get name
};

MTLDoc.prototype.parseRGB = function(sp, name) {
    var r = sp.getFloat();
    var g = sp.getFloat();
    var b = sp.getFloat();
    return (new Material(name, r, g, b, 1));
};

//------------------------------------------------------------------------------
// Material Object
//------------------------------------------------------------------------------
var Material = function(name, r, g, b, a) {
    this.name = name;
    this.color = new Color(r, g, b, a);
};

//------------------------------------------------------------------------------
// Vertex Object
//------------------------------------------------------------------------------
var Vertex = function(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
};

//------------------------------------------------------------------------------
// VTertex Object
//------------------------------------------------------------------------------
var VTertex = function(x,y){
    this.x = x;
    this.y = y;
};

//------------------------------------------------------------------------------
// Normal Object
//------------------------------------------------------------------------------
var Normal = function(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
};

//------------------------------------------------------------------------------
// Color Object
//------------------------------------------------------------------------------
var Color = function(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
};

//------------------------------------------------------------------------------
// OBJObject Object
//------------------------------------------------------------------------------
var OBJObject = function(name) {
    this.name = name;
    this.faces = new Array(0);
    this.numIndices = 0;
};

OBJObject.prototype.addFace = function(face) {
    this.faces.push(face);
    this.numIndices += face.numIndices;
};

//------------------------------------------------------------------------------
// Face Object
//------------------------------------------------------------------------------
var Face = function(materialName) {
    this.materialName = materialName;
    if(materialName == null)  this.materialName = "";
    this.vIndices = new Array(0);
    this.nIndices = new Array(0);
    this.tIndices = new Array(0); // 用来记录纹理坐标
};

//------------------------------------------------------------------------------
// DrawInfo Object
//------------------------------------------------------------------------------
var DrawingInfo = function(vertices, normals, colors, indices, textureVt) {
    this.vertices = vertices;
    this.normals = normals;
    this.colors = colors;
    this.indices = indices;
    this.textureVt=textureVt;
};


var OBJDoc = function(fileName) {
    this.fileName = fileName;
    this.mtls = new Array(0);      // Initialize the property for MTL
    this.objects = new Array(0);   // Initialize the property for Object 这个就是部分的组合  因为obj可能是分部分的

    this.vertices = new Array(0);  // Initialize the property for Vertex
    this.normals = new Array(0);   // Initialize the property for Normal

    //Add vertice for texture
    this.textureVt = new Array(0);
};

function parseMtllib(sp, fileName) {
    // Get directory path
    var i = fileName.lastIndexOf("/");
    var dirPath = "";
    if(i > 0) dirPath = fileName.substr(0, i+1);

    return dirPath + sp.getWord();   // Get path
}

function parseObjectName(sp) {
    var name = sp.getWord();
    return (new OBJObject(name));
}

function parseVertex(sp, scale) {
    var x = sp.getFloat() * scale;
    var y = sp.getFloat() * scale;
    var z = sp.getFloat() * scale;
    return (new Vertex(x, y, z));
}

function parseVTertex(sp,scale){
    var x = sp.getFloat() * scale;
    var y = sp.getFloat() * scale;
    return (new VTertex(x, y));
}

function parseNormal(sp) {
    var x = sp.getFloat();
    var y = sp.getFloat();
    var z = sp.getFloat();
    return (new Normal(x, y, z));
}

function parseUsemtl(sp) {
    return sp.getWord();
}

var iiii = 1;

function parseFace(sp, materialName, vertices, textureVt, Normals, reverse) {
    var face = new Face(materialName);
    // get indices
    for(;;){
        var word = sp.getWord();
        if(!word||!word.replace( /^\s+|\s+$/g, "" )) break;
        var subWords;
        // if(word.indexOf("//">-1)) subWords = word.split('//');
        subWords = word.split('/');

        if(subWords.length >= 1){
            var vi = parseInt(subWords[0])<0?vertices.length+parseInt(subWords[0]):parseInt(subWords[0])- 1;
            if(iiii<4)console.log(vi,"vi",parseInt(subWords[0]),subWords,word,(word.replace( /^\s+|\s+$/g, "" )));
            face.vIndices.push(vi);
        }
        if(subWords.length >= 2){
            if(subWords[1]) {
                var ti = parseInt(subWords[1]) < 0 ? textureVt.length + parseInt(subWords[1]) : parseInt(subWords[1]) - 1;
                face.tIndices.push(ti);
            }
        }else{
            // face.tIndices.push(undefined);
        }
        if(subWords.length >= 3){
            var ni = parseInt(subWords[2])<0?Normals.length+parseInt(subWords[2]):parseInt(subWords[2])- 1;
            face.nIndices.push(ni);
        }else{
            face.nIndices.push(-1);
        }
        // else if(subWords.length<1){
        //     console.log("word,subwords",word,subWords,subWords.length);
        //     //face.nIndices.push(-1);
        // }
    }
    if(iiii<4)console.log(face.vIndices,"face.vIndices",vertices[face.vIndices[0]],vertices[face.vIndices[1]],vertices[face.vIndices[2]]);

    // calc normal
    // console.log(vertices,face.vIndices[0],face.vIndices[1],face.vIndices[2]);
    var v0 = [
        vertices[face.vIndices[0]].x,
        vertices[face.vIndices[0]].y,
        vertices[face.vIndices[0]].z];
    var v1 = [
        vertices[face.vIndices[1]].x,
        vertices[face.vIndices[1]].y,
        vertices[face.vIndices[1]].z];
    var v2 = [
        vertices[face.vIndices[2]].x,
        vertices[face.vIndices[2]].y,
        vertices[face.vIndices[2]].z];

   
    var t1,t2,t3;

    if(face.tIndices.length>=3) {
        if(!textureVt[face.tIndices[0]]){
            console.log("textureVt.length:",textureVt.length,"face.tIndices[0]",face.tIndices,"face.tIndices.length",face.tIndices.length);
            throw("hhhh");
        }
        t1 = [
            textureVt[face.tIndices[0]].x,
            textureVt[face.tIndices[0]].y];
        t2 = [
            textureVt[face.tIndices[1]].x,
            textureVt[face.tIndices[1]].y];
        t3 = [
            textureVt[face.tIndices[2]].x,
            textureVt[face.tIndices[2]].y];
    }
    // normals calculation
    var normal = calcNormal(v0, v1, v2);
    
    if (normal == null) {
        if (face.vIndices.length >= 4) { // // calculate the normal when the faces are rectangles
            var v3 = [
                vertices[face.vIndices[3]].x,
                vertices[face.vIndices[3]].y,
                vertices[face.vIndices[3]].z ];
            normal = calcNormal(v1, v2, v3);
        }
        if(normal == null){         // default normal: z-axis
            normal = [0.0, 1.0, 0.0];
        }
    }
    if(reverse){
        normal[0] = -normal[0];
        normal[1] = -normal[1];
        normal[2] = -normal[2];
    }
    face.normal = new Normal(normal[0], normal[1], normal[2]);
    face.textureVt = [t1,t2,t3];

    // Devide to triangles if face contains over 3 points.
    if(face.vIndices.length > 3){
        var n = face.vIndices.length - 2;
        var newVIndices = new Array(n * 3);
        var newNIndices = new Array(n * 3);
        var newTIndices = new Array(n * 3);
        for(var i=0; i<n; i++){
            newVIndices[i * 3]     = face.vIndices[0];
            newVIndices[i * 3 + 1] = face.vIndices[i + 1];
            newVIndices[i * 3 + 2] = face.vIndices[i + 2];
            newNIndices[i * 3]     = face.nIndices[0];
            newNIndices[i * 3 + 1] = face.nIndices[i + 1];
            newNIndices[i * 3 + 2] = face.nIndices[i + 2];
            newTIndices[i * 3]     = face.tIndices[0];
            newTIndices[i * 3 + 1] = face.tIndices[i + 1];
            newTIndices[i * 3 + 2] = face.tIndices[i + 2]
        }
        face.vIndices = newVIndices;
        face.nIndices = newNIndices;
        face.tIndices = newTIndices;
        if(iiii<4)console.log("face.vIndices",face.vIndices);
    }
    face.numIndices = face.vIndices.length;

    iiii++;

    return face;
}


function onReadMTLFile(fileString, mtl, modelObject, index, mtlArray) {
    var lines = fileString.split('\n');  // Break up into lines and store them as array
    lines.push(null);           // Append null
    var tempindex = 0;              // Initialize index of line

    // Parse line by line
    var line;      // A string in the line to be parsed
    var name = ""; // Material name
    var sp = new StringParser();  // Create StringParser
    while ((line = lines[tempindex++]) != null) {
        sp.init(line);                  // init StringParser
        var command = sp.getWord();     // Get command
        if(command == null)	 continue;  // check null command

        switch(command){
            case '#':
                continue;    // Skip comments
            case 'newmtl': // Read Material chunk
                name = mtl.parseNewmtl(sp);    // Get name
                continue; // Go to the next line
            case 'Kd':   // Read normal
                if(name == "") continue; // Go to the next line because of Error
                var material = mtl.parseRGB(sp, name);
                mtl.materials.push(material);
                name = "";
                continue; // Go to the next line
        }
    }
    mtl.complete = true;

    var tempii = 0,templock=false;
    console.log("modelObject[index]",modelObject[index].mtls);
    for(;tempii<modelObject[index].mtls.length;tempii++){
        if(!!modelObject[index].mtls[tempii]){
            templock=true;
        }
    }
    mtlArray[index]=templock;
    console.log(templock,mtlArray);
    //直接这样好像还不太行...?
}


// Read a file from .....
//add index to bind with modelObject, mtlArray, objArray,

function OBJDocparser (fileString, modelObject, mtlArray, objArray, scale, reverse, index) {
    var lines = fileString.split('\n');  // Break up into lines and store them as array
    lines.push(null); // Append null
    var tempIndex = 0;    // Initialize index of line

    var currentObject = null;//理解为一个代号?
    var currentMaterialName = "";
    var ifmtl=false;

    // Parse line by line
    var line;         // A string in the line to be parsed
    var sp = new StringParser();  // Create StringParser
    while ((line = lines[tempIndex++]) != null) {
        sp.init(line);                  // init StringParser
        var command = sp.getWord();     // Get command
        if(command == null)	 continue;  // check null command

        switch(command){
            case '#':
                continue;  // Skip comments
            case 'mtllib':
                ifmtl=true;// Read Material chunk
                var path = parseMtllib(sp, this.fileName);
                var mtl = new MTLDoc();   // Create MTL instance
                this.mtls.push(mtl);
                console.log(this.mtls,":this.mtls",modelObject[index].mtls);
                var request = new XMLHttpRequest();
                request.onreadystatechange = function() {
                    if (request.readyState == 4) {
                        if (request.status != 404) {
                            onReadMTLFile(request.responseText, mtl, modelObject, index, mtlArray);
                        }else{
                            mtlArray[index]=!modelObject[index].mtls.some(function(x){return !x});
                            console.log("need a mtlib, but there is none",mtlArray[index]);
                            mtl.complete = true;
                        }
                    }
                };
                request.onerror=function(error){
                    console.log(error);
                };
                request.ontimeout=function(error){
                    console.log("timeout",error);
                };
                request.open('GET', path, true);  // Create a request to acquire the file
                request.send();
                continue; // Go to the next line
            case 'o':
            case 'g':   // Read Object name
                var object = parseObjectName(sp);
                this.objects.push(object);
                currentObject = object;
                
                continue; // Go to the next line
            case 'v':   // Read vertex
                var vertex = parseVertex(sp, scale);
                this.vertices.push(vertex);
                continue; // Go to the next line
            case 'vn':   // Read normal
                var normal = parseNormal(sp);
                this.normals.push(normal);
                continue; // Go to the next line
            case 'usemtl': // Read Material name
                currentMaterialName = parseUsemtl(sp);
                continue; // Go to the next line
            case 'f': // Read face
                var face = parseFace(sp, currentMaterialName, this.vertices,this.textureVt, this.normals, reverse);
                currentObject.addFace(face);
                continue; // Go to the next line
            case 'vt':
                var VTvertex = parseVTertex(sp,1);
                this.textureVt.push(VTvertex);
                continue;
            default:
                continue;
        }
    }
    objArray[index]=true;
    if(!ifmtl)mtlArray[index]=true;
    return true;
}


//------------------------------------------------------------------------------
// Common function
//------------------------------------------------------------------------------
function calcNormal(p0, p1, p2) {
    // v0: a vector from p1 to p0, v1; a vector from p1 to p2
    var v0 = new Float32Array(3);
    var v1 = new Float32Array(3);
    for (var i = 0; i < 3; i++){
        v0[i] = p0[i] - p1[i];
        v1[i] = p2[i] - p1[i];
    }

    // The cross product of v0 and v1
    var c = vec3();
    c[0] = v0[1] * v1[2] - v0[2] * v1[1];
    c[1] = v0[2] * v1[0] - v0[0] * v1[2];
    c[2] = v0[0] * v1[1] - v0[1] * v1[0];

    // Normalize the result
    
    v=normalize(c);
    return flatten(v);
}

// var ss=0;


function findColor(target,name){
    for(var i = 0; i < target.mtls.length; i++){
        for(var j = 0; j < target.mtls[i].materials.length; j++){
            // ss++;
            // if(ss<10)console.log("compare...")
            // if(ss<10)console.log(target.mtls[i].materials[j].name,name,target.mtls[i].materials[j].color);
            // if(ss<10)console.log(target.mtls[i].materials[j].name.toLowerCase().replace( /^\s+|\s+$/g, "" ) == name,typeof target.mtls[i].materials[j].name.toLowerCase(),"material");
            // console.log("......");
            if(target.mtls[i].materials[j].name.replace( /^\s+|\s+$/g, "" ) == name.replace( /^\s+|\s+$/g, "" )){
                return(target.mtls[i].materials[j].color)
            }
        }
    }
    return(new Color(1, 1, 1, 1));
}

function readOBJFile(fileName, modelObject, mtlArray, objArray, scale, reverse, index) {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status !== 404) {

            //先初始化状态锁，不知道在这行不行
            mtlArray[index]=false;
            objArray[index]=false;
            modelObject[index]=new OBJDoc(fileName);

            var result = OBJDocparser.bind(modelObject[index])(request.responseText, modelObject, mtlArray, objArray, scale, reverse, index); // Parse the file
            if (!result) {
                g_objDoc = null; g_drawingInfo = null;
                console.log("OBJ file parsing error:",fileName);
                return;
            }            
        }
    };

    request.open('GET', fileName, true); // Create a request to acquire the file
    request.send();                      // Send the request
}
