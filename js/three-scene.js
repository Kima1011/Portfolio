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

  // 2. Floating 3D Geometric Wireframe Node
  const geoIcosahedron = new THREE.IcosahedronGeometry(18, 1);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    wireframe: true,
    transparent: true,
    opacity: 0.25
  });
  const wireMesh = new THREE.Mesh(geoIcosahedron, wireMat);
  wireMesh.position.set(45, 10, -20);
  mainGroup.add(wireMesh);

  // 3. Secondary Torus Knot Node
  const geoTorus = new THREE.TorusGeometry(12, 3, 16, 50);
  const torusMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    wireframe: true,
    transparent: true,
    opacity: 0.2
  });
  const torusMesh = new THREE.Mesh(geoTorus, torusMat);
  torusMesh.position.set(-50, -20, -30);
  mainGroup.add(torusMesh);

  // 4. Floating 3D Camera Icons with Physics Tilt Effects
  function create3DCameraIcon(colorHex, scale = 1) {
    const camGroup = new THREE.Group();

    const mat = new THREE.MeshBasicMaterial({
      color: colorHex,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });

    const lensMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });

    // Camera Main Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(8 * scale, 5.5 * scale, 3.5 * scale), mat);
    camGroup.add(body);

    // Camera Lens Cylinder
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(2.2 * scale, 2.2 * scale, 2.8 * scale, 18), lensMat);
    lens.rotation.x = Math.PI / 2;
    lens.position.z = 2.2 * scale;
    camGroup.add(lens);

    // Lens Ring Detail
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.3 * scale, 0.25 * scale, 8, 18), lensMat);
    ring.position.z = 3.6 * scale;
    camGroup.add(ring);

    // Top Viewfinder / Flash
    const topBox = new THREE.Mesh(new THREE.BoxGeometry(2.8 * scale, 1.4 * scale, 2.2 * scale), mat);
    topBox.position.set(0, 3.2 * scale, 0);
    camGroup.add(topBox);

    // Shutter Button
    const button = new THREE.Mesh(new THREE.CylinderGeometry(0.6 * scale, 0.6 * scale, 0.8 * scale, 10), mat);
    button.position.set(2.6 * scale, 3.1 * scale, 0);
    camGroup.add(button);

    return camGroup;
  }

  const cameraIcons = [
    { mesh: create3DCameraIcon(0x38bdf8, 0.9), initPos: [32, 14, -10] },
    { mesh: create3DCameraIcon(0xf59e0b, 0.85), initPos: [-38, -12, -18] },
    { mesh: create3DCameraIcon(0x818cf8, 0.75), initPos: [-22, 22, -28] },
    { mesh: create3DCameraIcon(0x38bdf8, 0.7), initPos: [40, -18, -25] }
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

    mainGroup.rotation.y = elapsedTime * 0.04 + targetX * 0.01;
    mainGroup.rotation.x = elapsedTime * 0.02 + targetY * 0.01;

    // Rotate geometric meshes independently
    wireMesh.rotation.x = elapsedTime * 0.2;
    wireMesh.rotation.y = elapsedTime * 0.3;
    
    torusMesh.rotation.x = -elapsedTime * 0.15;
    torusMesh.rotation.z = elapsedTime * 0.25;

    // 3D Physics Tilt Effects and rotation for Camera Icons in background
    cameraIcons.forEach((item, idx) => {
      const speed = 0.18 + idx * 0.06;
      const dir = idx % 2 === 0 ? 1 : -1;
      item.mesh.rotation.x = Math.sin(elapsedTime * speed) * 0.3 + (targetY * 0.025 * dir);
      item.mesh.rotation.y = elapsedTime * (0.22 * dir) + (targetX * 0.025 * dir);
      item.mesh.rotation.z = Math.cos(elapsedTime * speed * 0.8) * 0.15;
      item.mesh.position.y = item.initPos[1] + Math.sin(elapsedTime * 1.4 + idx * 1.5) * 1.8;
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
