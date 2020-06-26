const NORTH = 1,
  EAST = -0.5,
  SOUTH = 2,
  WEST = 0.5,
  LEAP = 240;

var camera,
  scene,
  controls,
  renderer,
  stats,
  loader,
  pmremGenerator,
  mouse = new THREE.Vector2(),
  raycaster = new THREE.Raycaster(),
  carList = [],
  manager = new THREE.LoadingManager(),
  loader = new THREE.GLTFLoader(manager);

var clusterNames = [
  'factory',
  'house2',
  'shoparea',
  'house',
  'apartments',
  'shops',
  'fastfood',
  'house3',
  'stadium',
  'gas',
  'supermarket',
  'coffeeshop',
  'residence',
  'bus',
  'park',
  'supermarket',
];

const cluster = [
  { x: 1, z: 0, cluster: 'road' },

  { x: 2, z: 2, cluster: clusterNames[0], direction: SOUTH },
  { x: 2, z: 1, cluster: clusterNames[1], direction: SOUTH },
  { x: 2, z: 0, cluster: clusterNames[2], direction: SOUTH },
  { x: 2, z: -1, cluster: clusterNames[3], direction: SOUTH },
  { x: 2, z: -2, cluster: clusterNames[0], direction: SOUTH },
  { x: 2, z: -3, cluster: clusterNames[1], direction: SOUTH },
  { x: 2, z: -4, cluster: clusterNames[2], direction: SOUTH },
  { x: 2, z: -5, cluster: clusterNames[3], direction: SOUTH },

  { x: 1, z: 2, cluster: clusterNames[4], direction: SOUTH },
  { x: 1, z: 1, cluster: clusterNames[7], direction: SOUTH },
  { x: 1, z: 0, cluster: clusterNames[8], direction: SOUTH },
  { x: 1, z: -1, cluster: clusterNames[9], direction: SOUTH },
  { x: 1, z: -2, cluster: clusterNames[4], direction: SOUTH },
  { x: 1, z: -3, cluster: clusterNames[7], direction: SOUTH },
  { x: 1, z: -4, cluster: clusterNames[8], direction: SOUTH },
  { x: 1, z: -5, cluster: clusterNames[9], direction: SOUTH },

  { x: 0, z: 2, cluster: clusterNames[5], direction: SOUTH },
  { x: 0, z: 1, cluster: clusterNames[10], direction: SOUTH },
  { x: 0, z: 0, cluster: clusterNames[12], direction: SOUTH },
  { x: 0, z: -1, cluster: clusterNames[13], direction: SOUTH },
  { x: 0, z: -2, cluster: clusterNames[5], direction: SOUTH },
  { x: 0, z: -3, cluster: clusterNames[10], direction: SOUTH },
  { x: 0, z: -4, cluster: clusterNames[12], direction: SOUTH },
  { x: 0, z: -5, cluster: clusterNames[13], direction: SOUTH },

  { x: -1, z: 2, cluster: clusterNames[6], direction: SOUTH },
  { x: -1, z: 1, cluster: clusterNames[11], direction: SOUTH },
  { x: -1, z: 0, cluster: clusterNames[14], direction: SOUTH },
  { x: -1, z: -1, cluster: clusterNames[15], direction: SOUTH },
  { x: -1, z: -2, cluster: clusterNames[6], direction: SOUTH },
  { x: -1, z: -3, cluster: clusterNames[11], direction: SOUTH },
  { x: -1, z: -4, cluster: clusterNames[14], direction: SOUTH },
  { x: -1, z: -5, cluster: clusterNames[15], direction: SOUTH },

  { x: -2, z: 2, cluster: clusterNames[0], direction: SOUTH },
  { x: -2, z: 1, cluster: clusterNames[1], direction: SOUTH },
  { x: -2, z: 0, cluster: clusterNames[2], direction: SOUTH },
  { x: -2, z: -1, cluster: clusterNames[3], direction: SOUTH },
  { x: -2, z: -2, cluster: clusterNames[0], direction: SOUTH },
  { x: -2, z: -3, cluster: clusterNames[1], direction: SOUTH },
  { x: -2, z: -4, cluster: clusterNames[2], direction: SOUTH },
  { x: -2, z: -5, cluster: clusterNames[3], direction: SOUTH },

  { x: -3, z: 2, cluster: clusterNames[4], direction: SOUTH },
  { x: -3, z: 1, cluster: clusterNames[7], direction: SOUTH },
  { x: -3, z: 0, cluster: clusterNames[8], direction: SOUTH },
  { x: -3, z: -1, cluster: clusterNames[9], direction: SOUTH },
  { x: -3, z: -2, cluster: clusterNames[4], direction: SOUTH },
  { x: -3, z: -3, cluster: clusterNames[7], direction: SOUTH },
  { x: -3, z: -4, cluster: clusterNames[8], direction: SOUTH },
  { x: -3, z: -5, cluster: clusterNames[9], direction: SOUTH },

  { x: -4, z: 2, cluster: clusterNames[5], direction: SOUTH },
  { x: -4, z: 1, cluster: clusterNames[10], direction: SOUTH },
  { x: -4, z: 0, cluster: clusterNames[12], direction: SOUTH },
  { x: -4, z: -1, cluster: clusterNames[13], direction: SOUTH },
  { x: -4, z: -2, cluster: clusterNames[5], direction: SOUTH },
  { x: -4, z: -3, cluster: clusterNames[10], direction: SOUTH },
  { x: -4, z: -4, cluster: clusterNames[12], direction: SOUTH },
  { x: -4, z: -5, cluster: clusterNames[13], direction: SOUTH },

  { x: -5, z: 2, cluster: clusterNames[6], direction: SOUTH },
  { x: -5, z: 1, cluster: clusterNames[11], direction: SOUTH },
  { x: -5, z: 0, cluster: clusterNames[14], direction: SOUTH },
  { x: -5, z: -1, cluster: clusterNames[15], direction: SOUTH },
  { x: -5, z: -2, cluster: clusterNames[6], direction: SOUTH },
  { x: -5, z: -3, cluster: clusterNames[11], direction: SOUTH },
  { x: -5, z: -4, cluster: clusterNames[14], direction: SOUTH },
  { x: -5, z: -5, cluster: clusterNames[15], direction: SOUTH },
];

function main() {
  const canvas = document.querySelector('#c');
  renderer = new THREE.WebGLRenderer({ canvas });

  camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
  );
  camera.position.set(80, 140, 80);
  camera.lookAt(new THREE.Vector3());
  camera.position.y = 200;

  controls = new THREE.OrbitControls(camera, canvas);
  this.controls.autoRotate = false;
  this.controls.autoRotateSpeed = -10;
  this.controls.screenSpacePanning = true;

  scene = new THREE.Scene();
  scene.background = new THREE.Color('#353535');

  renderer.shadowMap.enabled = true;
  renderer.gammaInput = renderer.gammaOutput = true;
  renderer.gammaFactor = 2.0;

  {
    // const light = new THREE.DirectionalLight(16774618, 2);
    // light.position.set(100, 150, -40);
    // light.castShadow = true;
    // light.shadow.radius = 1;
    // light.shadow.bias = -0.001;
    // light.shadow.mapSize.width = 2048;
    // light.shadow.mapSize.height = 2048;
    // light.shadow.camera.near = 50;
    // light.shadow.camera.far = 300;
    // this._resizeShadowMapFrustum(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // scene.add(light);
    // scene.add(light.target);

    const light = new THREE.DirectionalLight(16774618, 0.7);
    light.position.set(-300, 750, -300);
    light.castShadow = true;
    light.shadow.mapSize.width = light.shadow.mapSize.height = 4096;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 1000;
    light.shadow.camera.left = light.shadow.camera.bottom = -200;
    light.shadow.camera.right = light.shadow.camera.top = 200;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    scene.add(light);
    scene.add(light.target);
    scene.add(new THREE.HemisphereLight(0xefefef, 0xffffff, 1));
  }

  {
    pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
  }

  function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
    const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
    const halfFovY = THREE.MathUtils.degToRad(camera.fov * 0.5);
    const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
    // compute a unit vector that points in the direction the camera is now
    // in the xz plane from the center of the box
    const direction = new THREE.Vector3()
      .subVectors(camera.position, boxCenter)
      .multiply(new THREE.Vector3(1, 0, 1))
      .normalize();

    // move the camera to a position distance units way from the center
    // in whatever direction the camera was from the center already
    camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));

    // pick some near and far values for the frustum that
    // will contain the box.
    camera.near = boxSize / 100;
    camera.far = boxSize * 100;

    camera.updateProjectionMatrix();

    // point the camera to look at the center of the box
    camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
  }

  const gltfLoader = new THREE.GLTFLoader();

  cluster.forEach((cl) => loadClusters(cl));

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render() {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    controls.update();

    if (camera.position.x > 130) {
      controls.target.x -= LEAP;
      camera.position.x -= LEAP;
      carList.forEach((car) => (car.position.x -= LEAP));
    } else if (camera.position.x < -120) {
      controls.target.x += LEAP;
      camera.position.x += LEAP;
      carList.forEach((car) => (car.position.x += LEAP));
    }
    if (camera.position.z > 130) {
      controls.target.z -= LEAP;
      camera.position.z -= LEAP;
      carList.forEach((car) => (car.position.z -= LEAP));
    } else if (camera.position.z < -120) {
      controls.target.z += LEAP;
      camera.position.z += LEAP;
      carList.forEach((car) => (car.position.z += LEAP));
    }

    raycaster.setFromCamera(mouse, camera);

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  function loadClusters({ x, z, cluster, direction }) {
    gltfLoader.load(`../gltf/${cluster}.gltf`, (gltf) => {
      // compute the box that contains all the stuff
      // from root and below
      const box = new THREE.Box3().setFromObject(gltf.scene);

      const boxSize = box.getSize(new THREE.Vector3()).length();
      const boxCenter = box.getCenter(new THREE.Vector3());

      // set the camera to frame the box
      // frameArea(boxSize * 0.5, boxSize, boxCenter, camera);

      // update the Trackball controls to handle the new size
      controls.maxDistance = boxSize * 10;
      camera.position.copy(boxCenter);
      camera.position.x += boxSize / 2.0;
      camera.position.y += boxSize / 5.0;
      camera.position.z += boxSize / 2.0;
      camera.lookAt(boxCenter);
      camera.near = boxSize / 100;
      camera.far = boxSize * 100;
      camera.updateProjectionMatrix();
      controls.target.copy(boxCenter);
      controls.update();

      gltf.scene.traverse(function (child) {
        console.log(child);
        if (child.isMesh) {
          child.receiveShadow = true;
          child.castShadow = true;
        }
        if (child.isLight) {
          this.state.addLights = false;
        } else if (child.isMesh) {
          // TODO(https://github.com/mrdoob/three.js/pull/18235): Clean up.
          child.material.depthWrite = !child.material.transparent;
        }
      });

      gltf.scene.position.set(x * 60, 0, z * 60);
      if (direction) gltf.scene.rotation.y = Math.PI * direction;
      else if (direction === EAST) gltf.scene.position.x += 20;
      else if (direction === WEST) gltf.scene.position.z += 20;
      else if (direction === NORTH)
        gltf.scene.position.set(
          gltf.scene.position.x + 20,
          0,
          gltf.scene.position.z + 20
        );

      scene.add(gltf.scene);
      addLights();
    });
  }
  requestAnimationFrame(render);
}

main();
//Events
window.addEventListener('resize', onResize, false);
window.addEventListener('mousemove', onMouseMove, false);

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function addLights() {
  // if (this.options.preset === Preset.ASSET_GENERATOR) {
  //   const hemiLight = new HemisphereLight();
  //   hemiLight.name = 'hemi_light';
  //   this.scene.add(hemiLight);
  //   this.lights.push(hemiLight);
  //   return;
  // }

  const light1 = new THREE.AmbientLight(0xffffff, 2);
  light1.name = 'ambient_light';
  camera.add(light1);

  const light2 = new DirectionalLight(0xffffff, 4);
  light2.position.set(0.5, 0, 0.866); // ~60º
  light2.name = 'main_light';
  camera.add(light2);

  renderer.toneMappingExposure = 1;
}
