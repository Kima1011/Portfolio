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
