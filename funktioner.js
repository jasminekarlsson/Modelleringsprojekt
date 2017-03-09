// Lots of global variables. (This is JavaScript. No use complaining.)
      var container;
      var camera, scene, renderer;
      var stats;
      var controls; 
      var geometry, materials, mesh, gparent, parent;
      var radiusCamera = 500, theta = 0, phi = 0;
      var pressed = {};
      
      var collidableMeshList = [];
      
      //var clock = new THREE.Clock(true);
      
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
      rotxValues = [0, 0, 0];
      rotyValues = [0, 0, 0];
      rotzValues = [0, 0, 0];

      var accrotx = 0, velrotx = 0, anglerotx = 0;
      var accroty = 0, velroty = 0, angleroty = 0;
      var accrotz = 0, velrotz = 0, anglerotz = 0;
      
      //Translation startvärden
      var accx = 0, velx = 0, posx = 0;
      var accy = 0, vely = 0, posy = 0;
      var accz = 0, velz = 0, posz = 0;
      var rotmatx, rotmaty, rotmatz, trans1mat, trans2mat;
      //Start value Force

      var force = new THREE.Vector3(1000, 0, 0);

      var forceInit = force.clone();
      
      //Define Hmin/Hmax
      var Hminx;
      var Hmaxx;
      var Hminy;
      var Hmaxy;
      var Hminz;
      var Hmaxz;

      var gravity = 9.82;
      var haveRotatedForwardx = false; 
      var haveRotatedForwardz = false;
      var haveRotatedBackwardx = false;
      var haveRotatedBackwardz = false;
      var normalRotation = false;

      var step = 1/120;

function onWindowResize() 
{
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function translateCube(cube, translationVector, object) 
{

  trans1mat.makeTranslation(translationVector.x * step, translationVector.y * step, translationVector.z * step);
  for (index = 0; index < 8; index++) {
    cube.vertices[index].applyMatrix4(trans1mat);
  }
  cube.verticesNeedUpdate = true;
  object.updateMatrix();
}

function boxOnGround(cube) 
{

  var counter = 0;
  for (index = 0; index < 8; index++) {
    if (cube.vertices[index].y < -1.50001) {
      counter++;

      if (counter == 4) {

        //console.log('Jag har 3 vertex på marken');

        return true;
      }
    }
  }
  return false;
}
function rotationCube(cube, rotationVector, translationVector, object) 
{
  trans1mat.makeTranslation(translationVector.x, translationVector.y, translationVector.z);
  trans2mat.makeTranslation(-translationVector.x, -translationVector.y, -translationVector.z);

  rotmatx.makeRotationX(rotationVector.x * step);
  rotmaty.makeRotationY(rotationVector.y * step);
  rotmatz.makeRotationZ(rotationVector.z * step);

  for (idx = 0; idx < 8; idx++) {
    geom.vertices[idx].applyMatrix4(trans2mat);
    geom.vertices[idx].applyMatrix4(rotmatx);
    geom.vertices[idx].applyMatrix4(rotmaty);
    geom.vertices[idx].applyMatrix4(rotmatz);
    geom.vertices[idx].applyMatrix4(trans1mat);


  }
  cube.verticesNeedUpdate = true;
  object.updateMatrixWorld();
}

//------ PRESS KEYS --------------
function handleDown(e) { pressed[e.keyCode] = true; }
function handleUp(e) { pressed[e.keyCode] = false; }

function handleKeys() {
  // Left

  if (pressed[37]) phi -= 0.01;
  // Right
  if (pressed[39]) phi += 0.01;
  // Up
  if (pressed[38]) theta -= 0.01;
  // Down
  if (pressed[40]) theta += 0.01;

}

document.onkeydown = handleDown;
document.onkeyup = handleUp;

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
            // console.log('Går in i if båda krafterna mindre än 0');
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
            // console.log('Går in i if båda krafterna större än 0 ');            
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
            // console.log('Går in i if z krafterna mindre än 0, x>0');
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
            // console.log('Går in i if x krafterna mindre än 0, z>0');
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

function ontheGround(cube) 
{
  for (index = 0; index < 8; index++) {
    if (cube.vertices[index].y <= -2) {
      return index;
    }
  }
  return -1;
}

function keepRotating(anglerot) 
{

  if (Math.abs(anglerot) < Math.PI / 4) {

    return false;
  }

  return true;
}


function ForwardRotation(accrot, velrot, anglerot, radius, Hmax, inertia, force, sideOnGround, onGround, haveRotatedForward, CoR, gravity, mass) 
{

  if (radius > Hmax) {
    accrot = (1 / inertia) * (force * radius);// + gravity*mass*Math.sin(anglerotz);
    // velrot = velrot + step * accrot;
    // anglerot = anglerot + step * velrot;
    if (anglerot >= Math.PI / 2) {
      anglerot = anglerot - (Math.PI / 2);
    }

    if (sideOnGround && haveRotatedForward) {

      //accrot = 0;  
      velrot = -velrot * CoR;
      //console.log('sideOnGround ' + velrotz);
      if (Math.abs(velrot) < 0.001) {
        velrot = 0;
      }
    } else if (onGround != -1 && haveRotatedForward) {
      //console.log('onGround != -1 ' + velrotz);
      if (keepRotating(anglerot)) {

        accrot = (1 / inertia) * (force * radius) + gravity * mass * Math.cos(anglerot);
      } else { //if(Math.abs(mass * (velrot/step)) < Math.abs(gravity*mass*Math.cos(anglerot))) {

        accrot = (1 / inertia) * (force * radius) - gravity * mass * Math.cos(anglerot);
      }

    }
    velrot = velrot + step * accrot;
    anglerot = anglerot + step * velrot;
  }
  var returnValues = [accrot, velrot, anglerot];

  return returnValues;

}

  function keepRotating(anglerot) 
  {

    if (Math.abs(anglerot) < Math.PI / 4) {
      //console.log(anglerot);
      return false;
    }

    return true;
  }



  function backwardRotation(accrot, anglerot, velrot, height, mass, radius, sideOnGround, haveRotatedBackward, onGround, CoR, Hmin, frictionMove, force) 
  {

    m = 1;
    M = 1;
    console.log('Roterar bakåt');

    if (radius < Hmin) {
      //console.log("jag roterar bakåt runt x-axeln");
      accrot = ((M + m) * (gravity * Math.sin(anglerot) - frictionMove * velrot) - (height * m * velrot * Math.sin(anglerot) + force) * Math.cos(anglerot)) / (height * (M + (1 - Math.cos(anglerot) * Math.cos(anglerot)) * m));
      velrot = velrot + step * accrot * mass;
      anglerot = anglerot + step * velrot;

      if (anglerot < Math.PI / 2) {
        //anglerot = anglerot + (Math.PI/2);
        normalRotation = true;
      }


      if (sideOnGround && haveRotatedBackward) {

        accrot = 0;
        velrot = -velrot * CoR;
        if (Math.abs(velrot) < 1) {

          // if(collision(cuve)&& haveRotatedForward ){

          //   accrot = 0;  
          //   velrot = -velrot*CoR;
          //     if(Math.abs(velrot) < 0.001){

          velrot = 0;
        }
      } else if (onGround != -1 && haveRotatedBackward) //if(Math.abs(mass * (velrot/step)) < Math.abs(gravity*mass*Math.cos(anglerot)))
      {
        if (keepRotating(anglerot)) {

          accrot = ((M + m) * (gravity * Math.sin(anglerot) - frictionMove * velrot) - (height * m * velrot * Math.sin(anglerot) + force) * Math.cos(anglerot)) / (height * (M + (1 - Math.cos(anglerot) * Math.cos(anglerot)) * m)) + gravity * mass * Math.cos(anglerot);

        } else if (Math.abs(mass * (velrot / step)) < Math.abs(gravity * mass * Math.cos(anglerot))) {

          accrot = ((M + m) * (gravity * Math.sin(anglerot) - frictionMove * velrot) - (height * m * velrot * Math.sin(anglerot) + force) * Math.cos(anglerot)) / (height * (M + (1 - Math.cos(anglerot) * Math.cos(anglerot)) * m)) - gravity * mass * Math.cos(anglerot);

        }
        velrot = velrot + step * accrot * mass;
        anglerot = anglerot + step * velrot;
      }
    }

    var returnValues = [accrot, velrot, anglerot];


    return returnValues;
  }



  function translationBackwardRotation(anglerot, velrot, acc, vel, pos, height, mass, frictionMove, force) 
  {

    acc = ((-m * gravity * Math.sin(anglerot) * Math.cos(anglerot) + m * height * velrot * velrot * Math.sin(anglerot) + force)) / (M + (1 - Math.cos(anglerot) * Math.cos(anglerot)) * m) - frictionMove * vel;
    vel = vel + step * acc;
    pos = pos + step * vel;

    //console.log('acc = ' + acc + ' vel = ' + vel + ' pos = ' + pos);

    var returnValues = [acc, vel, pos];

    return returnValues

  }

  function TranslationForward(acc, vel, pos, forcein, forceInit, frictionStill, frictionMove, onGround, mass) 
  {

    if (Math.abs(forceInit) >= frictionStill) {
      // Beräknar accelerationen i x-led
      // Om den är i luften
      //
      //<-- KOLLA SAMTLIGA VERTEXPOSITIONERS Y-VÄRDE SÅ ATT INGA ÄR PÅ MARKEN -->
      //
      if (onGround == -1) {
        acc = 1 / mass * (forcein);
      } else {  // Om den är på marken
        acc = 1 / mass * (forcein - frictionMove * vel);
      }
      // Beräknar hastigheten i x-led
      vel = vel + step * acc;
      // Beräknar positionen i x-led
      pos = pos + step * vel;
    }

    //console.log('acc = ' + acc + ' vel = ' + vel + ' pos = ' + pos);  
    var returnValues = [acc, vel, pos];



    return returnValues;


  }

  function TranslationGravity(acc, vel, pos, mass, force, gravity, onGround, step, CoR) 
  {

    if (onGround == -1) {
      //console.log('jag är i luften');
      acc = 1 / mass * (force - gravity * mass);
      vel = vel + step * acc;
      pos = pos + step * vel;

    }
    else //Studs 
    {
      //console.log('jag är på marken, STOPPA MIG!');
      acc = 1 / mass * force;
      vel = -vel * CoR + step * acc;
      pos = pos + step * vel;
      if (vel < 0.01) {
        vel = 0;
      }
    }
    var returnValues = [acc, vel, pos];
    return returnValues;
  }


    function translationBackwardRotation(anglerot, velrot, vel, height, mass, frictionMove, force) 
    {


      acc = ((-m * gravity * Math.sin(anglerot) * Math.cos(anglerot) + m * height * velrot * velrot * Math.sin(anglerot) + force)) / (M + (1 - Math.cos(anglerot) * Math.cos(anglerot)) * m) - frictionMove * vel;
      vel = velx + step * accx;
      pos = posx + step * velx;

      return vel;
  }
      
     
      function collision(cube)
      {
           //console.log(object.position);
           var intersects = 0;

          for (var vertexIndex = 0; vertexIndex < cube.geometry.vertices.length; vertexIndex++)
          {       
              var localVertex = cube.geometry.vertices[vertexIndex].clone();
              var globalVertex = localVertex.applyMatrix4(cube.matrix);//.multiplyVector3(localVertex);
              var directionVector = globalVertex.sub( cube.position );
              var ray = new THREE.Raycaster( cube.position.clone(), directionVector.clone().normalize() );
              var collisionResults = ray.intersectObjects( collidableMeshList );

              //console.log('Hejsan')
              if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
              {
                  //console.log("true");
                  return true;
              }
          }
          //console.log('false');
          return false;
      }
  



    




