function init() {
  //container = document.getElementById( 'container' );
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  //camera.position.z = 10;
  //scene = new THREE.Scene();


  controls = new THREE.OrbitControls(camera); // -----------------
  controls.addEventListener('change', render); //----------------
  scene = new THREE.Scene();

  gparent = new THREE.Object3D();  //----------------
  scene.add(gparent);  //----------------
  parent = new THREE.Object3D();  //----------------
  gparent.add(parent);  //----------------
  parent.add(camera); //----------------
  camera.position.set(0, 0, 10); //----------------

  // MESH block
  var geometryBlock = new THREE.PlaneGeometry(2, 2);
  var materialBlock = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: false });
  //materialBlock.wireframe = true;
  block = new THREE.Mesh(geometryBlock, materialBlock);
  // MESH object 3D ----------------------------------------------------
  var meshMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  //meshMaterial.wireframe = true;
  geom = new THREE.Geometry();
  v0 = new THREE.Vector3(-2, -2, -2);
  v1 = new THREE.Vector3(2, -2, -2);
  v2 = new THREE.Vector3(2, -2, 2);
  v3 = new THREE.Vector3(-2, -2, 2);
  v4 = new THREE.Vector3(-2, 2, -2);
  v5 = new THREE.Vector3(2, 2, -2);
  v6 = new THREE.Vector3(2, 2, 2);
  v7 = new THREE.Vector3(-2, 2, 2);
  geom.vertices.push(v0);
  geom.vertices.push(v1);
  geom.vertices.push(v2);
  geom.vertices.push(v3);
  geom.vertices.push(v4);
  geom.vertices.push(v5);
  geom.vertices.push(v6);
  geom.vertices.push(v7);
  geom.faces.push(new THREE.Face3(0, 1, 2)); // face0
  geom.faces.push(new THREE.Face3(0, 2, 3)); // face0
  geom.faces.push(new THREE.Face3(1, 5, 6)); // face1
  geom.faces.push(new THREE.Face3(6, 2, 1)); // face1
  geom.faces.push(new THREE.Face3(2, 7, 3)); // face2
  geom.faces.push(new THREE.Face3(2, 6, 7)); // face2
  geom.faces.push(new THREE.Face3(0, 4, 5)); // face3
  geom.faces.push(new THREE.Face3(0, 5, 1)); // face3
  geom.faces.push(new THREE.Face3(0, 3, 4)); // face4
  geom.faces.push(new THREE.Face3(3, 7, 4)); // face4
  geom.faces.push(new THREE.Face3(4, 7, 5)); // face5
  geom.faces.push(new THREE.Face3(5, 7, 6)); // face5
  geom.computeFaceNormals();
  geom.computeVertexNormals();
  object = new THREE.Mesh(geom, meshMaterial);
  object.doubleSided = true;
  block3D = new THREE.Object3D();
  block3D.add(object);
  block3D.matrixAutoUpdate = true;

  // MESH golv 3D ---------------------------------------------------
  var geometryGolv = new THREE.BoxGeometry(160, 0.1, 100);
  var materialGolv = new THREE.MeshBasicMaterial({ color: 0x99FF00 });
  golv = new THREE.Mesh(geometryGolv, materialGolv);

  // Top-level node
  scene.add(sceneRoot);

  // Sun branch
  sceneRoot.add(block3D); //New node for translation transformation
  sceneRoot.add(golv);
  collidableMeshList.push(golv);
  collidableMeshList.push(block3D);

  /*
   renderer = new THREE.WebGLRenderer();
   renderer.setClearColor( 0x000000 );
   renderer.setPixelRatio( window.devicePixelRatio );
   renderer.setSize( window.innerWidth, window.innerHeight );
   container.appendChild( renderer.domElement );
   window.addEventListener( 'resize', onWindowResize, false );
   */

  // renderer -------------------------
  renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container = document.getElementById('container');
  container.appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize, false);


  //renderer.setClearColor( 0x000000 );
  //renderer.setPixelRatio( window.devicePixelRatio );

  rotmatx = new THREE.Matrix4();
  rotmatx.identity();
  rotmaty = new THREE.Matrix4();
  rotmaty.identity();
  rotmatz = new THREE.Matrix4();
  rotmatz.identity();
  trans1mat = new THREE.Matrix4();
  trans1mat.identity();
  trans2mat = new THREE.Matrix4();
  trans2mat.identity();
  //Anger startpositionen för kuben
  var startTranslation = new THREE.Vector3(-6, 5, -2);
  geom.translate(startTranslation.x, startTranslation.y, startTranslation.z);
  geom.verticesNeedUpdate = true;


  posx = startTranslation.x;
  posy = startTranslation.y;
  posz = startTranslation.z;


}

function render() {

  // Variabler för att räkna ut acceleration, hastighet och vinkel
  //Kraftpåverkande konstanter
  var radius = 5;

  //Blockets konstanter  
  var mass = 5;
  var width = Math.abs(geom.vertices[3].x - geom.vertices[2].x);
  var depth = Math.abs(geom.vertices[3].z - geom.vertices[0].z);
  var height = Math.abs(geom.vertices[3].y - geom.vertices[7].y);
  //tröghetsmoment
  var inertiax = mass / 3 * (height * height + depth * depth);
  var inertiay = mass / 3 * (depth * depth + width * width);
  var inertiaz = mass / 3 * (height * height + width * width);

  //Konstanter mellan block och golv
  var frictionStill = 5;
  var frictionMove = 3;
  var CoR = 0.15; // ett tal mellan 0-1, studskoefficient

  // Set up the camera
  camera.position.x = 0;
  camera.position.y = mouseY * 10;
  //Startposition för golvets mittpunkt       
  golv.position.x = 0;
  golv.position.y = -2;
  //Checking if any vertex touched the ground
  var onGround = ontheGround(geom);
  //Checking if an entire side of the box is on the ground
  var sideOnGround;// = boxOnGround(geom);
  var rotVertexID = rotationVertex(geom);

  if (collision() > 3) {
    sideOnGround = true;
  }
  else {
    sideOnGround = false;
  }

  //Om radie < Hmin -> tippar bakåt, Om radie > Hmax -> tippar framåt
  if (force.x != 0) //<-- HÄR SKA DET SKAPAS FÖR X, Y OCH Z -->
  {
    Hminx = (Math.abs(forceInit.x) * height / 2 - mass * gravity * width / 2 - frictionStill * height / 2) / Math.abs(forceInit.x);
    Hmaxx = (Math.abs(forceInit.x) * height / 2 + mass * gravity * width / 2 - frictionStill * height / 2) / Math.abs(forceInit.x);
    //console.log('Hmin = ' + Hmin + ', Hmax = ' + Hmax);
  }
  if (force.y != 0) //<-- HÄR SKA DET SKAPAS FÖR X, Y OCH Z -->
  {
    Hminy = (Math.abs(forceInit.y) * height / 2 - mass * gravity * width / 2 - frictionStill * height / 2) / Math.abs(forceInit.y);
    Hmaxy = (Math.abs(forceInit.y) * height / 2 + mass * gravity * width / 2 - frictionStill * height / 2) / Math.abs(forceInit.y);
    //console.log('Hmin = ' + Hmin + ', Hmax = ' + Hmax);
  }
  if (force.z != 0) //<-- HÄR SKA DET SKAPAS FÖR X, Y OCH Z -->
  {
    Hminz = (Math.abs(forceInit.z) * height / 2 - mass * gravity * width / 2 - frictionStill * height / 2) / Math.abs(forceInit.z);
    Hmaxz = (Math.abs(forceInit.z) * height / 2 + mass * gravity * width / 2 - frictionStill * height / 2) / Math.abs(forceInit.z);
    //console.log('Hmin = ' + Hmin + ', Hmax = ' + Hmax);
  }

  if (radius > Hmaxx || radius > Hmaxy || radius > Hmaxz) //faller framåt
  {

    //console.log('Faller framåt');
    //Rotation kring x-axeln, framåt
    rotxValues = [0, 0, 0];//ForwardRotation(accrotx, velrotx, anglerotx, radius, Hmaxx, inertiax, force.z, sideOnGround, onGround, haveRotatedForward, CoR, gravity, mass);


    //Rotation kring y-axeln, framåt
    if (collision(object)) {
      accroty = (1 / inertiay) * (force.y * radius) - frictionMove * velroty;
      velroty = velroty + step * accroty;
      angleroty = angleroty + step * velroty;
      if (angleroty > Math.PI / 2) {
        angleroty = angleroty - (Math.PI / 2);
      }
    } else {
      accroty = (1 / inertiay) * (force.y * radius);
      velroty = velroty + step * accroty;
      angleroty = angleroty - step * velroty;
    }



    //Rotation kring z-axeln, framåt
    rotzValues = ForwardRotation(accrotz, velrotz, anglerotz, radius, Hmaxx, inertiaz, force.x, sideOnGround, onGround, haveRotatedForward, CoR, gravity, mass);
    //console.log(rotxValues);



    //Translation i x-led
    if (Math.abs(forceInit.x) >= frictionStill) {
      // Beräknar accelerationen i x-led
      // Om den är i luften
      //
      //<-- KOLLA SAMTLIGA VERTEXPOSITIONERS Y-VÄRDE SÅ ATT INGA ÄR PÅ MARKEN -->
      //
      if (onGround == -1) {
        accx = 1 / mass * (force.x);
      } else {  // Om den är på marken
        accx = 1 / mass * (force.x - frictionMove * velx);
      }
      // Beräknar hastigheten i x-led
      velx = velx + step * accx;
      // Beräknar positionen i x-led
      posx = posx + step * velx;
    }

    //Translation i y-led
    //
    // <-- BORDE KUNNA KNUFFAS UPPÅT ÄVEN OM DEN STÅR PÅ MARKEN -->
    if (onGround == -1) {
      //console.log('jag är i luften');
      accy = 1 / mass * (force.y - gravity * mass);
      vely = vely + step * accy;
      posy = posy + step * vely;

    }
    else //Studs 
    {
      //console.log('jag är på marken, STOPPA MIG!');
      accy = 1 / mass * force.y;
      vely = -vely * CoR + step * accy;
      posy = posy + step * vely;
      if (vely < 0.01) {
        vely = 0;
      }

    }

    //Translation i z-led
    if (Math.abs(forceInit.z) >= frictionStill) {
      // Beräknar accelerationen i 2-led
      // Om den är i luften
      //
      //<-- KOLLA SAMTLIGA VERTEXPOSITIONERS Y-VÄRDE SÅ ATT INGA ÄR PÅ MARKEN -->
      //
      if (onGround == -1) {
        accz = 1 / mass * (force.z);
      } else {  // Om den är på marken
        accz = 1 / mass * (force.z - frictionMove * velz);
      }
      // Beräknar hastigheten i x-led
      velz = velz + step * accz;
      // Beräknar positionen i x-led
      posz = posz + step * velx;
    }

    if (anglerotz >= Math.PI / 4) {
      haveRotatedForward = true;
    }

  }
  else if (radius < Hminx || radius < Hminy || radius < Hminz) //Roterar bakåt
  {
    // console.log('Faller bakåt');
    m = 1;
    M = 1;



    rotxValues = backwardRotation(accrotx, anglerotx, velrotx, height, mass, radius, sideOnGround, onGround, CoR, Hminz, frictionMove, force.z);


    //Vinkelacceleration i x-led
    // if(radius < Hminz){
    //   console.log("jag roterar bakåt runt x-axeln");
    //   accrotx = ((M+m)*(gravity*Math.sin(anglerotx)-frictionMove*velrotx)- (height*m*velrotx*Math.sin(anglerotx)+force.z)*Math.cos(anglerotx))/(height*(M+(1-Math.cos(anglerotx)*Math.cos(anglerotx))*m));
    //   velrotx = velrotx + step * accrotx;
    //   anglerotx = anglerotx + step * velrotx;
    //   if(anglerotx > Math.PI/2){
    //     anglerotx = anglerotx - (Math.PI/2);
    //   }
    // }
    // if(sideOnGround){
    //   accrotx = 0;  
    //   velrotx = -velrotx*CoR;
    //     if(Math.abs(velrotx) < 0.001){
    //       velrotx = 0;
    //     }
    // }else if(onGround != -1){
    //   if(rotForward(anglerotx)){
    //       if(anglerotx > 0){
    //         accrotx = ((M+m)*(gravity*Math.sin(anglerotx)-frictionMove*velrotx)- (height*m*velrotx*Math.sin(anglerotx)+force.z)*Math.cos(anglerotx))/(height*(M+(1-Math.cos(anglerotx)*Math.cos(anglerotx))*m));
    //       } 
    //   }else{
    //     if(anglerotx > 0){
    //       accrotx = ((M+m)*(gravity*Math.sin(anglerotz)-frictionMove*velrotx)- (height*m*velrotx*Math.sin(anglerotx)+force.z)*Math.cos(anglerotx))/(height*(M+(1-Math.cos(anglerotx)*Math.cos(anglerotx))*m));
    //     } 
    //     velrotx = velrotx + step*accrotx*mass;
    //     anglerotx = anglerotx + step*velrotx;
    //   }
    // }



    //Rotation kring y-axeln
    accroty = (1 / inertiay) * (force.y * radius) - frictionMove * velroty;
    velroty = velroty + step * accroty;
    angleroty = angleroty - step * velroty;

    //Rotation i z-led

    rotzValues = backwardRotation(accrotz, anglerotz, velrotz, height, mass, radius, sideOnGround, onGround, CoR, Hminx, frictionMove, force.x);




    //   console.log('velrotz = ' + velrotz);
    // if(radius < Hminx){
    //   console.log("jag roterar bakåt runt z-axeln");
    //   accrotz = ((M+m)*(gravity*Math.sin(anglerotz)-frictionMove*velrotz)- (height*m*velrotz*Math.sin(anglerotz)+force.x)*Math.cos(anglerotz))/(height*(M+(1-Math.cos(anglerotz)*Math.cos(anglerotz))*m));
    //   velrotz = velrotz + step * accrotz;
    //   anglerotz = anglerotz + step * velrotz;
    //   // if(anglerotz > Math.PI/2){
    //   //   anglerotz = anglerotz - (Math.PI/2);
    //   // }
    // }
    // if(sideOnGround){
    //   accrotz = 0;  
    //   velrotz = -velrotz*CoR;
    //     if(Math.abs(velrotx) < 0.001){
    //       velrotx = 0;
    //     }
    //   }


    // Translation x-led
    // velx = translationBackwardRotation(anglerotx, velrotx, velx, height, mass, frictionMove, force.x);
    if (forceInit.x != 0) {
      accx = ((-m * gravity * Math.sin(anglerotx) * Math.cos(anglerotx) + m * height * velrotx * velrotx * Math.sin(anglerotx) + force.x)) / (M + (1 - Math.cos(anglerotx) * Math.cos(anglerotx)) * m) - frictionMove * velx;
      velx = velx + step * accx;
      posx = posx + step * velx;
    }
    //Translation i y-led
    if (onGround == -1) {
      accy = 1 / mass * (force.y - gravity * mass);
      vely = vely + step * accy;
      posy = posy + step * vely;
    }
    else {
      vely = -vely * CoR;
      posy = posy + step * vely;
    }

    // Translation z-led
    if (forceInit.z != 0) {
      accz = ((-m * gravity * Math.sin(anglerotz) * Math.cos(anglerotz) + m * height * velrotz * velrotz * Math.sin(anglerotz) + force.z)) / (M + (1 - Math.cos(anglerotz) * Math.cos(anglerotz)) * m) - frictionMove * velz;
      velz = velz + step * accz;
      posz = posz + step * velz;
    }
    //console.log(anglerotx);


    if (anglerotz <= -Math.PI / 4) {
      haveRotatedBackward = true;
    }


  }
  else //Translaterar endast
  {
    console.log('Translaterar');
    //Translation i x-led
    // console.log(' forceInit.x = ' + forceInit.x + 'frictionStill = ' + frictionStill);
    if (Math.abs(forceInit.x) >= frictionStill) {
      // Beräknar accelerationen i x-led
      // Om den är i luften
      //
      //<-- KOLLA SAMTLIGA VERTEXPOSITIONERS Y-VÄRDE SÅ ATT INGA ÄR PÅ MARKEN -->
      //
      if (onGround == -1) {
        accx = 1 / mass * (force.x);
      } else {  // Om den är på marken
        accx = 1 / mass * (force.x - frictionMove * velx);
      }
      console.log('accx = ' + accx);
      // Beräknar hastigheten i x-led
      velx = velx + step * accx;
      // Beräknar positionen i x-led
      posx = posx + step * velx;
    }

    //Translation i y-led
    //
    // <-- BORDE KUNNA KNUFFAS UPPÅT ÄVEN OM DEN STÅR PÅ MARKEN -->
    if (onGround == -1) {
      //console.log('jag är i luften');
      accy = 1 / mass * (force.y - gravity * mass);
      vely = vely + step * accy;
      posy = posy + step * vely;

    }
    else //Studs 
    {
      //console.log('jag är på marken, STOPPA MIG!');
      vely = -vely * CoR;
      posy = posy + step * vely;

    }

    //Translation i z-led
    if (forceInit.z >= frictionStill) {
      // Beräknar accelerationen i 2-led
      // Om den är i luften
      //
      //<-- KOLLA SAMTLIGA VERTEXPOSITIONERS Y-VÄRDE SÅ ATT INGA ÄR PÅ MARKEN -->
      //
      if (onGround == -1) {
        accz = 1 / mass * (force.z);
      } else {  // Om den är på marken
        accz = 1 / mass * (force.z - frictionMove * velz);
      }
      // Beräknar hastigheten i x-led
      velz = velz + step * accz;
      // Beräknar positionen i x-led
      posz = posz + step * velx;
    }
  }




  //console.log('rotx = ' + velrotx + ' roty = ' + velroty + ' rotz = ' + velrotz );
  //console.log('posx = ' + posx + ' posy = ' + posy + ' posz = ' + posz );
  // console.log('onGround = ' + onGround);
  // console.log('vertex 0 position : ' + geom.vertices[0].y);
  //Rotation rund samtliga axlar negativt för att det ska bli rätt med enhetscirkeln

  // Set the values from the funtions.
  accrotx = rotxValues[0];
  velrotx = rotxValues[1];
  anglerotx = rotxValues[2];

  accrotz = rotzValues[0];
  velrotz = rotzValues[1];
  anglerotz = rotzValues[2];


  rotationVector = new THREE.Vector3(-velrotx, -velroty, -velrotz);
  if (onGround != -1) {
    rotTransVector = new THREE.Vector3(geom.vertices[rotVertexID].x, geom.vertices[rotVertexID].y, geom.vertices[rotVertexID].z);

    //console.log( ' onGround position ' + geom.vertices[onGround].x +' '+ geom.vertices[onGround].y + ' ' +geom.vertices[onGround].z);
  } else {
    rotTransVector = new THREE.Vector3((geom.vertices[0].x + geom.vertices[6].x) / 2, (geom.vertices[0].y + geom.vertices[6].y) / 2, (geom.vertices[0].z + geom.vertices[6].z) / 2);
  }
  rotationCube(geom, rotationVector, rotTransVector, block3D);

  //Translation i samtliga led
  translationVector = new THREE.Vector3(velx, vely, velz);
  //console.log('velx = ' + velx);
  translateCube(geom, translationVector, block3D);

  // Sätter kraften till 0 eftersom det endast är en impuls
  force.setX(0);
  force.setY(0);
  force.setZ(0);
  //objectTranslation.position.y = objectTranslation.position.y*Math.sin(angle);
  // Render the scene
  //console.log(anglerotz)
  handleKeys();//---------------------
  gparent.rotation.y = phi; //---------------------
  parent.rotation.x = theta; //---------------------
  renderer.render(scene, camera); //---------------------
}

function animate() {
  requestAnimationFrame(animate); // Request to be called again for next frame
  controls.update(); //---------------------
}


init();    // Set up the scene
animate(); // Enter an infinite loop
window.requestAnimationFrame(animate);
