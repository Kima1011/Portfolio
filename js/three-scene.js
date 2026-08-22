/**
 * Interactive Three.js 3D Background Scene
 * Creates floating 3D particle field and geometric wireframe nodes responding to cursor motion
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvasContainer = document.getElementById('threejs-hero-canvas');
  if (!canvasContainer || typeof THREE === 'undefined') return;

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 80;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvasContainer.appendChild(renderer.domElement);

  // Group for rotating elements
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // 1. Particle Constellation Field
  const particleCount = window.innerWidth < 768 ? 200 : 450;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const color1 = new THREE.Color(0x38bdf8); // Cyan
  const color2 = new THREE.Color(0xf59e0b); // Amber
  const color3 = new THREE.Color(0x818cf8); // Indigo

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 220;
    positions[i3 + 1] = (Math.random() - 0.5) * 160;
    positions[i3 + 2] = (Math.random() - 0.5) * 120;

    // Mixed colors
    const mixedColor = i % 3 === 0 ? color1 : i % 3 === 1 ? color2 : color3;
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Particle Material
  const pMaterial = new THREE.PointsMaterial({
    size: 2.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });

  const particles = new THREE.Points(geometry, pMaterial);
  mainGroup.add(particles);

  // Scene Lighting for realistic material reflections
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
  keyLight.position.set(50, 60, 40);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xf59e0b, 1.0);
  rimLight.position.set(-50, -40, -30);
  scene.add(rimLight);

  // Dynamic cursor point light for real-time specular lens glares
  const cursorLight = new THREE.PointLight(0xffffff, 1.8, 180);
  cursorLight.position.set(0, 0, 50);
  scene.add(cursorLight);

  // 2. Floating 3D Geometric Wireframe Node
  const geoIcosahedron = new THREE.IcosahedronGeometry(16, 1);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    wireframe: true,
    transparent: true,
    opacity: 0.2
  });
  const wireMesh = new THREE.Mesh(geoIcosahedron, wireMat);
  wireMesh.position.set(48, 12, -25);
  mainGroup.add(wireMesh);

  // 3. Secondary Torus Knot Node
  const geoTorus = new THREE.TorusGeometry(10, 2.5, 16, 50);
  const torusMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    wireframe: true,
    transparent: true,
    opacity: 0.18
  });
  const torusMesh = new THREE.Mesh(geoTorus, torusMat);
  torusMesh.position.set(-52, -22, -32);
  mainGroup.add(torusMesh);

  // 4. Realistic 3D Mirrorless/DSLR Camera Construction
  function createRealistic3DCamera(accentHex, scale = 1) {
    const camGroup = new THREE.Group();

    // Shared high-grade materials
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x141a26,
      roughness: 0.4,
      metalness: 0.7
    });

    const gripMat = new THREE.MeshStandardMaterial({
      color: 0x0c1017,
      roughness: 0.85,
      metalness: 0.2
    });

    const metalMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      roughness: 0.2,
      metalness: 0.95
    });

    const barrelMat = new THREE.MeshStandardMaterial({
      color: 0x111622,
      roughness: 0.35,
      metalness: 0.8
    });

    const glassMat = new THREE.MeshStandardMaterial({
      color: accentHex,
      roughness: 0.05,
      metalness: 0.9,
      transparent: true,
      opacity: 0.85
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: accentHex,
      roughness: 0.25,
      metalness: 0.85,
      emissive: accentHex,
      emissiveIntensity: 0.4
    });

    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x080c14,
      roughness: 0.1,
      metalness: 0.9
    });

    const ledMat = new THREE.MeshStandardMaterial({
      color: 0xff3b30,
      emissive: 0xff3b30,
      emissiveIntensity: 0.9
    });

    // 1. Camera Main Body (Box)
    const bodyGeo = new THREE.BoxGeometry(8.8 * scale, 5.8 * scale, 3.4 * scale);
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    camGroup.add(bodyMesh);

    // 2. Right Ergonomic Handgrip
    const gripGeo = new THREE.BoxGeometry(2.4 * scale, 5.6 * scale, 2.0 * scale);
    const gripMesh = new THREE.Mesh(gripGeo, gripMat);
    gripMesh.position.set(3.4 * scale, 0, 1.2 * scale);
    camGroup.add(gripMesh);

    // 3. Viewfinder / Pentaprism Top Housing
    const prismGeo = new THREE.CylinderGeometry(1.8 * scale, 2.8 * scale, 1.8 * scale, 4);
    const prismMesh = new THREE.Mesh(prismGeo, bodyMat);
    prismMesh.rotation.y = Math.PI / 4;
    prismMesh.position.set(0, 3.6 * scale, 0);
    camGroup.add(prismMesh);

    // 4. Hotshoe Bracket on Top of Prism
    const hotshoeGeo = new THREE.BoxGeometry(1.6 * scale, 0.4 * scale, 1.8 * scale);
    const hotshoeMesh = new THREE.Mesh(hotshoeGeo, metalMat);
    hotshoeMesh.position.set(0, 4.6 * scale, 0);
    camGroup.add(hotshoeMesh);

    // 5. Lens Mount Chrome Ring
    const mountGeo = new THREE.CylinderGeometry(2.6 * scale, 2.6 * scale, 0.6 * scale, 32);
    const mountMesh = new THREE.Mesh(mountGeo, metalMat);
    mountMesh.rotation.x = Math.PI / 2;
    mountMesh.position.set(-0.6 * scale, 0.1 * scale, 1.8 * scale);
    camGroup.add(mountMesh);

    // 6. Main Lens Outer Barrel
    const lensGeo = new THREE.CylinderGeometry(2.4 * scale, 2.4 * scale, 3.6 * scale, 32);
    const lensMesh = new THREE.Mesh(lensGeo, barrelMat);
    lensMesh.rotation.x = Math.PI / 2;
    lensMesh.position.set(-0.6 * scale, 0.1 * scale, 3.6 * scale);
    camGroup.add(lensMesh);

    // 7. Focus / Zoom Ribbed Rubber Rings
    const ring1Geo = new THREE.CylinderGeometry(2.48 * scale, 2.48 * scale, 1.0 * scale, 32);
    const ring1Mesh = new THREE.Mesh(ring1Geo, gripMat);
    ring1Mesh.rotation.x = Math.PI / 2;
    ring1Mesh.position.set(-0.6 * scale, 0.1 * scale, 3.0 * scale);
    camGroup.add(ring1Mesh);

    // 8. Luxury Accent Ring (Red/Cyan/Gold G-Master Ring)
    const accentRingGeo = new THREE.TorusGeometry(2.45 * scale, 0.12 * scale, 8, 32);
    const accentRingMesh = new THREE.Mesh(accentRingGeo, accentMat);
    accentRingMesh.position.set(-0.6 * scale, 0.1 * scale, 5.0 * scale);
    camGroup.add(accentRingMesh);

    // 9. Front Lens Hood Flange
    const hoodGeo = new THREE.CylinderGeometry(2.6 * scale, 2.4 * scale, 0.8 * scale, 32);
    const hoodMesh = new THREE.Mesh(hoodGeo, barrelMat);
    hoodMesh.rotation.x = Math.PI / 2;
    hoodMesh.position.set(-0.6 * scale, 0.1 * scale, 5.4 * scale);
    camGroup.add(hoodMesh);

    // 10. Front Curved Optical Glass Element
    const glassGeo = new THREE.SphereGeometry(2.2 * scale, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.rotation.x = -Math.PI / 2;
    glassMesh.position.set(-0.6 * scale, 0.1 * scale, 5.2 * scale);
    camGroup.add(glassMesh);

    // 11. Top Mode Dial (Left)
    const dialGeo = new THREE.CylinderGeometry(1.0 * scale, 1.0 * scale, 0.8 * scale, 16);
    const dialMesh = new THREE.Mesh(dialGeo, metalMat);
    dialMesh.position.set(-3.0 * scale, 3.2 * scale, 0);
    camGroup.add(dialMesh);

    // 12. Shutter Release Button on Right Grip
    const shutterGeo = new THREE.CylinderGeometry(0.6 * scale, 0.6 * scale, 0.6 * scale, 16);
    const shutterMesh = new THREE.Mesh(shutterGeo, metalMat);
    shutterMesh.position.set(3.2 * scale, 3.1 * scale, 0.8 * scale);
    camGroup.add(shutterMesh);

    // 13. Secondary Control Wheel
    const wheelGeo = new THREE.CylinderGeometry(0.8 * scale, 0.8 * scale, 0.5 * scale, 16);
    const wheelMesh = new THREE.Mesh(wheelGeo, metalMat);
    wheelMesh.position.set(2.0 * scale, 3.1 * scale, -0.4 * scale);
    camGroup.add(wheelMesh);

    // 14. Red AF Assist / Tally LED Lamp
    const ledGeo = new THREE.SphereGeometry(0.3 * scale, 12, 12);
    const ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.set(1.5 * scale, 1.8 * scale, 1.8 * scale);
    camGroup.add(ledMesh);

    // 15. Rear Large LCD Monitor Screen
    const screenGeo = new THREE.BoxGeometry(6.2 * scale, 4.2 * scale, 0.15 * scale);
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0.2 * scale, 0, -1.75 * scale);
    camGroup.add(screenMesh);

    // 16. Rear Viewfinder Eyepiece
    const eyeGeo = new THREE.BoxGeometry(1.8 * scale, 1.2 * scale, 0.6 * scale);
    const eyeMesh = new THREE.Mesh(eyeGeo, gripMat);
    eyeMesh.position.set(0, 3.5 * scale, -1.8 * scale);
    camGroup.add(eyeMesh);

    return camGroup;
  }

  // Instantiate realistic 3D camera models at balanced background depths
  const cameraIcons = [
    { mesh: createRealistic3DCamera(0x38bdf8, 1.05), initPos: [34, 16, -12] },
    { mesh: createRealistic3DCamera(0xf59e0b, 0.95), initPos: [-38, -14, -18] },
    { mesh: createRealistic3DCamera(0x818cf8, 0.85), initPos: [-24, 22, -28] },
    { mesh: createRealistic3DCamera(0x38bdf8, 0.8), initPos: [42, -18, -24] }
  ];

  cameraIcons.forEach(cam => {
    cam.mesh.position.set(...cam.initPos);
    mainGroup.add(cam.mesh);
  });

  // Mouse Interaction Variables
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) * 0.05;
    mouseY = (event.clientY - windowHalfY) * 0.05;

    // Update cursor light in 3D space
    cursorLight.position.x = (event.clientX - windowHalfX) * 0.12;
    cursorLight.position.y = -(event.clientY - windowHalfY) * 0.12;
  });

  // Handle Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth camera / group easing to cursor
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    mainGroup.rotation.y = elapsedTime * 0.03 + targetX * 0.008;
    mainGroup.rotation.x = elapsedTime * 0.015 + targetY * 0.008;

    // Rotate geometric meshes independently
    wireMesh.rotation.x = elapsedTime * 0.2;
    wireMesh.rotation.y = elapsedTime * 0.3;
    
    torusMesh.rotation.x = -elapsedTime * 0.15;
    torusMesh.rotation.z = elapsedTime * 0.25;

    // 3D Physics Tilt Effects and rotation for Camera Icons in background
    cameraIcons.forEach((item, idx) => {
      const speed = 0.15 + idx * 0.04;
      const dir = idx % 2 === 0 ? 1 : -1;
      item.mesh.rotation.x = Math.sin(elapsedTime * speed) * 0.25 + (targetY * 0.02 * dir);
      item.mesh.rotation.y = elapsedTime * (0.18 * dir) + (targetX * 0.02 * dir);
      item.mesh.rotation.z = Math.cos(elapsedTime * speed * 0.8) * 0.12;
      item.mesh.position.y = item.initPos[1] + Math.sin(elapsedTime * 1.2 + idx * 1.5) * 1.6;
    });

    // Subtle wave pulsing
    const pos = geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3 + 1;
      pos[idx] += Math.sin(elapsedTime * 1.5 + i) * 0.05;
    }
    geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();
});
