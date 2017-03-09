// Lots of global variables. (This is JavaScript. No use complaining.)
      var container;
      var camera, scene, renderer;
      var stats;
      var controls; 
      var geometry, materials, mesh, gparent, parent;
      var radiusCamera = 500, theta = 0, phi = 0;
      var pressed = {};
      
      var collidableMeshList = [];
      
      var clock = new THREE.Clock(true);
      
      var mouseX = 0, mouseY = 0;
      var windowHalfX = window.innerWidth / 2;
      var windowHalfY = window.innerHeight / 2;     
      
      // Object3D ("Group") nodes and Mesh nodes
      var sceneRoot = new THREE.Group();
      var block;
      var plan;
      var geom;
      var v0,v1,v2,v3,v4,v5,v6,v7;
      var object; //3D
      var golv; //3D
      var block3D; 
      
      //Rotation startvärden
      var accrotx = 0, velrotx = 0, anglerotx = 0;
      var accroty = 0, velroty = 0, angleroty = 0;
      var accrotz = 0, velrotz = 0, anglerotz = 0;
      
      //Translation startvärden
      var accx = 0, velx = 0, posx = 0;
      var accy = 0, vely = 0, posy = 0;
      var accz = 0, velz = 0, posz = 0;
      var rotmatx, rotmaty, rotmatz, trans1mat, trans2mat;
      //Start value Force
      var force = new THREE.Vector3(0, 0, -1000);
      var forceInit = force.clone();
      
      //Define Hmin/Hmax
      var Hminx = 0;
      var Hmaxx = 0;
      var Hminy = 0;
      var Hmaxy = 0;
      var Hminz = 0;
      var Hmaxz = 0;
      //
      var step = 1/120; 
      function onWindowResize() 
      {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
      }
      function translateCube(cube , translationVector ,object){
        //console.log(translationVector);
        trans1mat.makeTranslation(translationVector.x*step,translationVector.y*step,translationVector.z*step);
        
        for( index = 0; index < 8; index++){
            cube.vertices[index].applyMatrix4(trans1mat);
         
            // cube.vertices[index].setX(translationVector.x - geom.vertices[index].x);
            // cube.vertices[index].setY(translationVector.y - geom.vertices[index].y);
            // cube.vertices[index].setZ(translationVector.z - geom.vertices[index].z);
          }
        cube.verticesNeedUpdate = true;
        object.updateMatrix();
      }
    function boxOnGround(cube){
        
        var counter = 0;
        for( index = 0; index < 8; index++){
            if(cube.vertices[index].y < -1.50001){
              counter++;
              if (counter == 4){
                //console.log('Jag har 3 vertex på marken');
                return true;
              }
            }
          }
        return false;
      }
      function rotationCube(cube, rotationVector, translationVector, object){
        trans1mat.makeTranslation(translationVector.x,translationVector.y,translationVector.z);
        trans2mat.makeTranslation(-translationVector.x,-translationVector.y,-translationVector.z);
        
        rotmatx.makeRotationX(rotationVector.x*step);
        rotmaty.makeRotationY(rotationVector.y*step);
        rotmatz.makeRotationZ(rotationVector.z*step);
          for(idx = 0; idx<8; idx++)
          {
            geom.vertices[idx].applyMatrix4(trans2mat);
            geom.vertices[idx].applyMatrix4(rotmatx);
            geom.vertices[idx].applyMatrix4(rotmaty);
            geom.vertices[idx].applyMatrix4(rotmatz);
            geom.vertices[idx].applyMatrix4(trans1mat);
            
          }
          cube.verticesNeedUpdate = true;
          object.updateMatrix();
      }
      
        //------ PRESS KEYS --------------
      function handleDown(e) { pressed[e.keyCode] = true; }
      function handleUp(e) { pressed[e.keyCode] = false; }
      
      function handleKeys() {
        // Left
        if(pressed[37]) phi += 0.01;
        // Right
        if(pressed[39]) phi -= 0.01;
        // Up
        if(pressed[38]) theta += 0.01;
        // Down
        if(pressed[40]) theta -= 0.01;
      }
      
      document.onkeydown = handleDown;
      document.onkeyup = handleUp;
      
      function collision()
      {
        var originPoint = object.position.clone(); // klonar object*s position
        
        for (var vertexIndex = 0; vertexIndex < object.geometry.vertices.length; vertexIndex++) //går igenom alla vertex
        { 
          var localVertex = object.geometry.vertices[vertexIndex].clone(); //lägger objectets vertex koord i localVertex??
          var globalVertex = localVertex.applyMatrix4( object.matrix ); //wtf applyMatrix4
          var directionVector = globalVertex.sub( object.position ); // wtf sub
        
          var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
          var collisionResults = ray.intersectObjects( collidableMeshList );
          if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
            console.log(' Hit ');
            
            
            // GÅR INTE IN I IF?!?!??
        }
  
      //stats.collision();
      }
      
      function rotationVertex(cube){
        var vertexArray = [];
        for( index = 0; index < 8; index++){
          if( cube.vertices[index].y <= -2){
            vertexArray.push(index);
            
          }
        }
        var rotVertex = vertexArray[0];
        for( arrayIndex = 0 ; arrayIndex < vertexArray.length; arrayIndex++){
          if(forceInit.x < 0 && forceInit.z < 0){
            console.log('Går in i if båda krafterna mindre än 0');
              if(Math.abs(forceInit.x) > Math.abs(forceInit.z)){
                if(cube.vertices[vertexArray[arrayIndex]].x < cube.vertices[rotVertex].x){
                  rotVertex = vertexArray[arrayIndex];
                }
              }
              else{
                if(cube.vertices[vertexArray[arrayIndex]].z < cube.vertices[rotVertex].z){
                  rotVertex = vertexArray[arrayIndex];
                }
              }
          }else if (forceInit.x >= 0 && forceInit.z >= 0){
            console.log('Går in i if båda krafterna större än 0 ');            
              if(Math.abs(forceInit.x) > Math.abs(forceInit.z)){
                if(cube.vertices[vertexArray[arrayIndex]].x > cube.vertices[rotVertex].x){
                  rotVertex = vertexArray[arrayIndex];
                }
              }
              else{
                if(cube.vertices[vertexArray[arrayIndex]].z > cube.vertices[rotVertex].z){
                  rotVertex = vertexArray[arrayIndex];
                }
              }
          }else if (forceInit.x >= 0 && forceInit.z < 0){
            console.log('Går in i if z krafterna mindre än 0, x>0');
            if(Math.abs(forceInit.x) > Math.abs(forceInit.z)){
                if(cube.vertices[vertexArray[arrayIndex]].x > cube.vertices[rotVertex].x){
                  rotVertex = vertexArray[arrayIndex];
                }
              }
              else{
                if(cube.vertices[vertexArray[arrayIndex]].z < cube.vertices[rotVertex].z){
                  rotVertex = vertexArray[arrayIndex];
                }
              }
          }else if (forceInit.x < 0 && forceInit.z >= 0){
            console.log('Går in i if x krafterna mindre än 0, z>0');
            if(Math.abs(forceInit.x) > Math.abs(forceInit.z)){
                if(cube.vertices[vertexArray[arrayIndex]].x < cube.vertices[rotVertex].x){
                  rotVertex = vertexArray[arrayIndex];
                }
              }
              else{
                if(cube.vertices[vertexArray[arrayIndex]].z > cube.vertices[rotVertex].z){
                  rotVertex = vertexArray[arrayIndex];
                }
              }
          }
        }
        return rotVertex;
      }
      function ontheGround(cube){
        for( index = 0; index < 8; index++){
          if( cube.vertices[index].y <= -2){
            return index;
          }
        }
        return -1;
      }
      function rotForward(anglerot){
          
          if(anglerot < Math.PI/4){
            
            return false;
          }
          
          return true;
      }