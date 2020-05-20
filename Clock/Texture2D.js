
function handleLoadTexture(gl,texture)
{
    gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,texture.image);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT);
    gl.bindTexture(gl.TEXTURE_2D,null);
}

function LoadTexture(gl,imagefile)
{

    var textureHandle = gl.createTexture();
    textureHandle.image = new Image();
    textureHandle.image.src= imagefile;
    textureHandle.image.onload = function(){
        handleLoadTexture(gl,textureHandle);
    }
    return  textureHandle;
}