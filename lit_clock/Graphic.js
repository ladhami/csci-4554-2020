
function Graphic(shader,gl)
{
    this.gl        = gl;
    this.shader    = shader;
    this.quadVAO   = null;
    this.cubeVAO   = null;
    this.shpereVEO = null;
    this.shpereVAO = null;
    this.texNormal = null;
    this.SetShader = function (shader) {
        this.shader = shader;
    }
    this.SettexNormal = function (texNormal) {
        this.texNormal = texNormal;
    }
    //init
    this.initRenderData = function () {
        this.gl.useProgram(this.shader);

        {

            var triangleVertices1 = [
                -0.5,  0.5, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0,  //Pos tex normal
                0.5, -0.5, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0,
                -0.5, -0.5, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0,
                -0.5,  0.5, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0,
                0.5,  0.5, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0,
                0.5, -0.5, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0
            ];
            var triangleIndex1 = [
                0,1,2,
                0,2,3
            ]
            this.FSIZE = triangleVertices1.BYTES_PER_ELEMENT;
            this.quadVAO = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.quadVAO);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices1), gl.STATIC_DRAW);
            {
                gl.vertexAttribPointer(this.shader.a_Position, 3, gl.FLOAT, false, 4*8, 0);
                gl.enableVertexAttribArray(this.shader.a_Position);//a_Position
                gl.vertexAttribPointer(this.shader.a_Texcoord, 2, gl.FLOAT, false, 4*8, 4*3);
                gl.enableVertexAttribArray(this.shader.a_Texcoord);//a_Texcoord
                gl.vertexAttribPointer(this.shader.a_Normal, 3, gl.FLOAT, false, 4*8, 4*5);
                gl.enableVertexAttribArray(this.shader.a_Normal);//a_Normal

            }
        }

        {
            var cubeVertices = [
                // Pos                 // Tex
                -0.5, -0.5, -0.5,  0.0, 0.0,  0.0,  0.0, -1.0,
                0.5, -0.5, -0.5,  1.0, 0.0,  0.0,  0.0, -1.0,
                0.5,  0.5, -0.5,  1.0, 1.0,  0.0,  0.0, -1.0,
                0.5,  0.5, -0.5,  1.0, 1.0,  0.0,  0.0, -1.0,
                -0.5,  0.5, -0.5,  0.0, 1.0,  0.0,  0.0, -1.0,
                -0.5, -0.5, -0.5,  0.0, 0.0,  0.0,  0.0, -1.0,

                -0.5, -0.5,  0.5,  0.0, 0.0,  0.0,  0.0,  1.0,
                0.5, -0.5,  0.5,  1.0, 0.0,  0.0,  0.0,  1.0,
                0.5,  0.5,  0.5,  1.0, 1.0,  0.0,  0.0,  1.0,
                0.5,  0.5,  0.5,  1.0, 1.0,  0.0,  0.0,  1.0,
                -0.5,  0.5,  0.5,  0.0, 1.0,  0.0,  0.0,  1.0,
                -0.5, -0.5,  0.5,  0.0, 0.0,  0.0,  0.0,  1.0,

                -0.5,  0.5,  0.5,  1.0, 0.0, -1.0,  0.0,  0.0,
                -0.5,  0.5, -0.5,  1.0, 1.0, -1.0,  0.0,  0.0,
                -0.5, -0.5, -0.5,  0.0, 1.0, -1.0,  0.0,  0.0,
                -0.5, -0.5, -0.5,  0.0, 1.0, -1.0,  0.0,  0.0,
                -0.5, -0.5,  0.5,  0.0, 0.0, -1.0,  0.0,  0.0,
                -0.5,  0.5,  0.5,  1.0, 0.0, -1.0,  0.0,  0.0,

                0.5,  0.5,  0.5,  1.0, 0.0,  1.0,  0.0,  0.0,
                0.5,  0.5, -0.5,  1.0, 1.0,  1.0,  0.0,  0.0,
                0.5, -0.5, -0.5,  0.0, 1.0,  1.0,  0.0,  0.0,
                0.5, -0.5, -0.5,  0.0, 1.0,  1.0,  0.0,  0.0,
                0.5, -0.5,  0.5,  0.0, 0.0,  1.0,  0.0,  0.0,
                0.5,  0.5,  0.5,  1.0, 0.0,  1.0,  0.0,  0.0,

                -0.5, -0.5, -0.5,  0.0, 1.0,  0.0, -1.0,  0.0,
                0.5, -0.5, -0.5,  1.0, 1.0,  0.0, -1.0,  0.0,
                0.5, -0.5,  0.5,  1.0, 0.0,  0.0, -1.0,  0.0,
                0.5, -0.5,  0.5,  1.0, 0.0,  0.0, -1.0,  0.0,
                -0.5, -0.5,  0.5,  0.0, 0.0,  0.0, -1.0,  0.0,
                -0.5, -0.5, -0.5,  0.0, 1.0,  0.0, -1.0,  0.0,

                -0.5,  0.5, -0.5,  0.0, 1.0,  0.0,  1.0,  0.0,
                0.5,  0.5, -0.5,  1.0, 1.0,  0.0,  1.0,  0.0,
                0.5,  0.5,  0.5,  1.0, 0.0,  0.0,  1.0,  0.0,
                0.5,  0.5,  0.5,  1.0, 0.0,  0.0,  1.0,  0.0,
                -0.5,  0.5,  0.5,  0.0, 0.0,  0.0,  1.0,  0.0,
                -0.5,  0.5, -0.5,  0.0, 1.0,  0.0,  1.0,  0.0
            ]
            this.cubeVAO = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVAO);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.STATIC_DRAW);
        }
          {
            var latitudeBands  = 50;
            var longitudeBands = 50;
            var positions      = [];//x，y，z
            var indices        = [];
        
            for(var latNum = 0; latNum <= latitudeBands; latNum++){
                var lat = latNum * Math.PI / (latitudeBands) - Math.PI / 2;//-π/2 to π/2
                var sinLat = Math.sin(lat);
                var cosLat = Math.cos(lat);

                for(var longNum = 0; longNum <= longitudeBands; longNum++){
                    var lon = longNum * 2 * Math.PI / (longitudeBands) - Math.PI;//-π to π
                    var sinLon = Math.sin(lon);
                    var cosLon = Math.cos(lon);

                    var x = cosLat * cosLon;
                    var y = cosLat * sinLon;
                    var z = sinLat;
                    var u = (longNum / (longitudeBands));
                    var v = (latNum / (latitudeBands));

                    positions.push(x);
                    positions.push(y);
                    positions.push(z);
                    positions.push(u);
                    positions.push(v);
                }
            }


            for(var latNum = 0; latNum < latitudeBands; latNum++){
                for(var longNum = 0; longNum < longitudeBands; longNum++)
				{
                    var first = latNum * (longitudeBands + 1) + longNum;
                    var second = first + longitudeBands + 1;
                    indices.push(first);
                    indices.push(first + 1);
                    indices.push(second);

                    indices.push(second);
                    indices.push(second + 1);
                    indices.push(first + 1);
                }
            }

            var vertices = new Float32Array(positions);
            var indices = new Uint16Array(indices);

            this.shpereVAO = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.shpereVAO);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            this.shpereVEO = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,  this.shpereVEO);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER,null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,  null);
        this.gl.useProgram(null);
    }

    this.Draw = function (modetype,modelmatrix,textureID,position,size,rotate) {
        gl.useProgram(this.shader);
          var matrixModel =scalem(1,1,1);
          matrixModel = mult(modelmatrix,translate(position[0],position[1],position[2]));
          matrixModel = mult(matrixModel,rotateX(rotate[0] * Math.PI/180.0));
          matrixModel = mult(matrixModel,rotateY(rotate[1] * Math.PI/180.0));
          matrixModel = mult(matrixModel,rotateZ(rotate[2] * Math.PI/180.0));
          matrixModel = mult(matrixModel,scalem(size[0],size[1],size[2]));
          gl.uniformMatrix4fv(this.shader.u_ModelMatrix, false, flatten(matrixModel));//normalMatrix
          gl.uniformMatrix4fv(this.shader.u_NormalMatrix, false,   flatten(normalMatrix(matrixModel,false)));
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D,textureID);
        gl.uniform1i(this.shader.s_Image1,0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D,this.texNormal);
        gl.uniform1i(this.shader.s_Image2,1);

        if(modetype == 0)
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.quadVAO);
            {
                gl.vertexAttribPointer(this.shader.a_Position, 3, gl.FLOAT, false, 4*8, 0);
                gl.enableVertexAttribArray(this.shader.a_Position);//a_Position
                gl.vertexAttribPointer(this.shader.a_Texcoord, 2, gl.FLOAT, false, 4*8, 4*3);
                gl.enableVertexAttribArray(this.shader.a_Texcoord);//a_Texcoord
                gl.vertexAttribPointer(this.shader.a_Normal, 3, gl.FLOAT, false, 4*8, 4*5);
                gl.enableVertexAttribArray(this.shader.a_Normal);//a_Normal
            }
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

        }
        else if(modetype == 1)
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVAO);
            {

                gl.vertexAttribPointer(this.shader.a_Position, 3, gl.FLOAT, false, 4*8, 0);
                gl.enableVertexAttribArray(this.shader.a_Position);// a_Position
                gl.vertexAttribPointer(this.shader.a_Texcoord, 2, gl.FLOAT, false, 4*8, 4*3);
                gl.enableVertexAttribArray(this.shader.a_Texcoord);// a_Texcoord
                gl.vertexAttribPointer(this.shader.a_Normal, 3, gl.FLOAT, false, 4*8, 4*5);
                gl.enableVertexAttribArray(this.shader.a_Normal);// a_Normal
            }
            gl.drawArrays(gl.TRIANGLES, 0, 36);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

        }
        else if(modetype == 2)
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.shpereVAO);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,  this.shpereVEO);
            {
                gl.vertexAttribPointer(this.shader.a_Position, 3, gl.FLOAT, false, 4*5, 0);
                gl.enableVertexAttribArray(this.shader.a_Position);// a_Position
                gl.vertexAttribPointer(this.shader.a_Texcoord, 2, gl.FLOAT, false, 4*5, 4*3);
                gl.enableVertexAttribArray(this.shader.a_Texcoord);//a_Texcoord
                gl.vertexAttribPointer(this.shader.a_Normal, 3, gl.FLOAT, false, 4*5, 4*0);
                gl.enableVertexAttribArray(this.shader.a_Normal);// a_Normal

            }
            gl.drawElements(gl.TRIANGLES,50*50*6,gl.UNSIGNED_SHORT,0);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        }
        gl.useProgram(null);
    }

}