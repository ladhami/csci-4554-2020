Jekko Syquia
# GWU, Washington Circle Animation THREE.js Project
This is a webgl program that implements the use of THREE.js modules to create a 3D diorama animation. 
It features panning, camera rotation, there is a mini animation of a car running around Washington Circle.

The map data was extracted from Google Maps and created in Blender. 
The process for the model can be seen in the /3DScreenshots folder
Blender allowed for exporting to gltf file format that preserve animation. 


# Instructions for Setup: 
## UNIX: 
To run make sure python is installed to create a local server, since THREE.js requires a server to function for security issues. 
Run the server in this directory.

### Python 2.x 
python -m SimpleHTTPServer


### Python 3.x
python -m http.server

## Windows:
Run a local server in this folder
C:\Python27\python.exe (Make sure Python27 is installed or a different version) :w


# Viewing
Enter the folowing in your browser
http://localhost:8000/

# Loading a Different Model
-   To load a smaller scale model replace model/WashingtonCircleFullScene.glb with
    model/WashingtonCircleAnimation.glb
