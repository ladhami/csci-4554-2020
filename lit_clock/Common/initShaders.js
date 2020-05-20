//
//  initShaders.js
//

function initShaders( gl, vertexShaderId, fragmentShaderId )
{
    var vertShdr;
    var fragShdr;

    var vertElem = document.getElementById( vertexShaderId );
    if ( !vertElem ) { 
        alert( "Unable to load vertex shader " + vertexShaderId );
        return -1;
    }
    else {
        vertShdr = gl.createShader( gl.VERTEX_SHADER );
        gl.shaderSource( vertShdr, vertElem.text );
        gl.compileShader( vertShdr );
        if ( !gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS) ) {
            var msg = "Vertex shader failed to compile.  The error log is:"
        	+ "<pre>" + gl.getShaderInfoLog( vertShdr ) + "</pre>";
            alert( msg );
            return -1;
        }
    }

    var fragElem = document.getElementById( fragmentShaderId );
    if ( !fragElem ) { 
        alert( "Unable to load vertex shader " + fragmentShaderId );
        return -1;
    }
    else {
        fragShdr = gl.createShader( gl.FRAGMENT_SHADER );
        gl.shaderSource( fragShdr, fragElem.text );
        gl.compileShader( fragShdr );
        if ( !gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS) ) {
            var msg = "Fragment shader failed to compile.  The error log is:"
        	+ "<pre>" + gl.getShaderInfoLog( fragShdr ) + "</pre>";
            alert( msg );
            return -1;
        }
    }

    var program = gl.createProgram();
    gl.attachShader( program, vertShdr );
    gl.attachShader( program, fragShdr );
    gl.linkProgram( program );
    
    if ( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
        var msg = "Shader program failed to link.  The error log is:"
            + "<pre>" + gl.getProgramInfoLog( program ) + "</pre>";
        alert( msg );
        return -1;
    }
    // 创建动态属性获取着色器中
    gl.useProgram(program);
    program.a_Position      = gl.getAttribLocation(program,   "a_Position");
    program.a_Texcoord      = gl.getAttribLocation(program,   "a_Texcoord");
    program.a_Color         = gl.getAttribLocation(program,   "a_Color");
    program.a_Normal        = gl.getAttribLocation(program,   "a_Normal");

    program.u_ModelMatrix   = gl.getUniformLocation(program,  "u_ModelMatrix");
    program.u_ProMatrix     = gl.getUniformLocation(program,  "u_ProMatrix");
    program.u_ViewMatrix    = gl.getUniformLocation(program,  "u_ViewMatrix");
    program.u_NormalMatrix  = gl.getUniformLocation(program,  "u_NormalMatrix");
    program.u_ViewPos       = gl.getUniformLocation(program,  "u_ViewPos");
    program.u_LightPos      = gl.getUniformLocation(program,  "u_LightPos");
    program.s_Image1        = gl.getUniformLocation(program,  "s_Image1");
    program.s_Image2        = gl.getUniformLocation(program,  "s_Image2");
    program.s_Image3        = gl.getUniformLocation(program,  "s_Image3");
    gl.useProgram(null);
    return program;
}
