/**
 * Molshoy Fotografi - Interactive Three.js 3D Background Scene
 * Features 24 Realistic Photographic Camera & Production Gears
 * Sourced directly from professional equipment photography:
 * Cinema Camera on Tripod, Hollywood Clapperboard, Sony Mirrorless, Canon DSLR,
 * 70-200mm White Telephoto Lens, Black Telephoto Lens, 4K Drone, Flash, Backpack & Vintage Camera.
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

  // Master Group for smooth rotational easing & mouse parallax
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // Scene Lighting for realistic material & glass reflections
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
  keyLight.position.set(60, 70, 50);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xf59e0b, 1.3);
  rimLight.position.set(-60, -50, -40);
  scene.add(rimLight);

  const softFillLight = new THREE.DirectionalLight(0x818cf8, 0.8);
  softFillLight.position.set(0, -60, 40);
  scene.add(softFillLight);

  // Dynamic cursor point light for real-time specular lens glares
  const cursorLight = new THREE.PointLight(0xffffff, 2.4, 250);
  cursorLight.position.set(0, 0, 55);
  scene.add(cursorLight);

  // Texture Loader & Gear Textures Sourced From Attached Photos
  const textureLoader = new THREE.TextureLoader();

  const gearTextures = {
    cinemaCamera: textureLoader.load('assets/images/gears/gear_cinema_camera.png'),
    clapperboard: textureLoader.load('assets/images/gears/gear_clapperboard.png'),
    drone: textureLoader.load('assets/images/gears/gear_drone.png'),
    sonyCamera: textureLoader.load('assets/images/gears/gear_sony_camera.png'),
    canonCamera: textureLoader.load('assets/images/gears/gear_canon_camera.png'),
    whiteLens: textureLoader.load('assets/images/gears/gear_white_lens.png'),
    telephotoLens: textureLoader.load('assets/images/gears/gear_telephoto_lens.png'),
    flash: textureLoader.load('assets/images/gears/gear_flash.png'),
    backpack: textureLoader.load('assets/images/gears/gear_backpack.png'),
    vintageCam: textureLoader.load('assets/images/gears/gear_vintage_cam.png')
  };

  // Configure high-definition texture sampling
  Object.values(gearTextures).forEach(tex => {
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
  });

  /**
   * Helper to build a 3D physical camera gear element with realistic photographic texture,
   * sleek backing plate, specular optical glare plane, and glowing edge trim.
   */
  function createTexturedGear(texKey, baseWidth, baseHeight, scale, accentHex) {
    const grp = new THREE.Group();
    const w = baseWidth * scale;
    const h = baseHeight * scale;

    // 1. Front photographic gear mesh
    const frontMat = new THREE.MeshStandardMaterial({
      map: gearTextures[texKey],
      transparent: true,
      alphaTest: 0.05,
      roughness: 0.32,
      metalness: 0.5,
      side: THREE.DoubleSide
    });
    const frontPlane = new THREE.Mesh(new THREE.PlaneGeometry(w, h), frontMat);
    grp.add(frontPlane);

    // 2. Sleek dark carbon-metallic backing plate for authentic 3D physical depth
    const backMat = new THREE.MeshStandardMaterial({
      color: 0x0c1017,
      roughness: 0.45,
      metalness: 0.85,
      side: THREE.DoubleSide
    });
    const backPlane = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.98, h * 0.98), backMat);
    backPlane.position.z = -0.35 * scale;
    grp.add(backPlane);

    // 3. Subtle luminous rim frame matching the portfolio accent palette
    const edgeGeo = new THREE.EdgesGeometry(new THREE.PlaneGeometry(w * 1.01, h * 1.01));
    const edgeMat = new THREE.LineBasicMaterial({
      color: accentHex,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    const edgeLine = new THREE.LineSegments(edgeGeo, edgeMat);
    edgeLine.position.z = -0.15 * scale;
    grp.add(edgeLine);

    // 4. Optical glass specular overlay that reacts to moving cursor light
    const glareMat = new THREE.MeshStandardMaterial({
      color: accentHex,
      transparent: true,
      opacity: 0.07,
      roughness: 0.04,
      metalness: 0.95,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const glarePlane = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.95, h * 0.95), glareMat);
    glarePlane.position.z = 0.15 * scale;
    grp.add(glarePlane);

    return grp;
  }

  // -------------------------------------------------------------
  // Instantiate 24 Camera Gears Distributed Throughout 3D Space
  // -------------------------------------------------------------
  const cameraGears = [
    // --- Hero Foreground Gears (Prominent & Highly Visible) ---
    // 1. Vintage Cinema Camera on Wooden Tripod (Left)
    { mesh: createTexturedGear('cinemaCamera', 7.6, 14.0, 1.25, 0xf59e0b), initPos: [-36, 14, -12] },
    // 2. Sony Alpha Mirrorless with Zoom Lens (Right Hero)
    { mesh: createTexturedGear('sonyCamera', 6.9, 10.0, 1.35, 0x38bdf8), initPos: [36, 16, -10] },
    // 3. Canon Professional DSLR Body & Lens (Lower Right)
    { mesh: createTexturedGear('canonCamera', 12.5, 10.0, 1.05, 0xf59e0b), initPos: [42, -18, -14] },
    // 4. Hollywood Film Director's Clapperboard (Top Center-Left)
    { mesh: createTexturedGear('clapperboard', 8.3, 10.0, 1.2, 0x818cf8), initPos: [-16, 28, -14] },
    // 5. 4K Aerial Drone (Top Right)
    { mesh: createTexturedGear('drone', 9.6, 10.0, 1.15, 0x38bdf8), initPos: [16, 32, -16] },
    // 6. White Telephoto 70-200mm G-Master Lens (Mid-Left)
    { mesh: createTexturedGear('whiteLens', 4.6, 10.0, 1.3, 0xf59e0b), initPos: [-42, -8, -14] },
    // 7. Pro Camera Backpack (Bottom Left)
    { mesh: createTexturedGear('backpack', 7.5, 10.0, 1.25, 0x38bdf8), initPos: [-28, -26, -14] },
    // 8. Speedlight Camera Flash (Bottom Right)
    { mesh: createTexturedGear('flash', 5.3, 10.0, 1.2, 0x818cf8), initPos: [24, -30, -16] },
    // 9. Black Telephoto Zoom Lens (Right Edge)
    { mesh: createTexturedGear('telephotoLens', 3.7, 10.0, 1.35, 0x38bdf8), initPos: [48, 0, -16] },
    // 10. Vintage Rangefinder Camera (Bottom Center)
    { mesh: createTexturedGear('vintageCam', 12.9, 10.0, 0.95, 0xf59e0b), initPos: [4, -34, -14] },

    // --- Mid-Depth Floating Gears (Enhanced Parallax) ---
    // 11. Secondary Canon DSLR (Left Mid)
    { mesh: createTexturedGear('canonCamera', 12.5, 10.0, 0.9, 0x38bdf8), initPos: [-48, 2, -22] },
    // 12. Secondary White 70-200 Lens (Top Right Mid)
    { mesh: createTexturedGear('whiteLens', 4.6, 10.0, 1.05, 0x818cf8), initPos: [44, 28, -22] },
    // 13. Secondary Sony Mirrorless (Lower Mid-Left)
    { mesh: createTexturedGear('sonyCamera', 6.9, 10.0, 1.05, 0xf59e0b), initPos: [-18, -14, -20] },
    // 14. Secondary Clapperboard (Far Right Mid)
    { mesh: createTexturedGear('clapperboard', 8.3, 10.0, 0.95, 0x38bdf8), initPos: [52, -12, -22] },
    // 15. Secondary Drone (Upper Left Depth)
    { mesh: createTexturedGear('drone', 9.6, 10.0, 0.9, 0xf59e0b), initPos: [-32, 34, -24] },
    // 16. Secondary Flash (Mid-Left Depth)
    { mesh: createTexturedGear('flash', 5.3, 10.0, 0.95, 0x38bdf8), initPos: [-10, 12, -22] },
    // 17. Secondary Vintage Cam (Upper Center)
    { mesh: createTexturedGear('vintageCam', 12.9, 10.0, 0.85, 0x818cf8), initPos: [2, 22, -22] },
    // 18. Secondary Telephoto Lens (Bottom Center Depth)
    { mesh: createTexturedGear('telephotoLens', 3.7, 10.0, 1.05, 0xf59e0b), initPos: [14, -18, -22] },

    // --- Ambient Deep Background Gears (Subtle Atmospheric Layer) ---
    // 19. Deep Cinema Camera (Far Left Deep)
    { mesh: createTexturedGear('cinemaCamera', 7.6, 14.0, 0.75, 0x38bdf8), initPos: [-54, -20, -30] },
    // 20. Deep Backpack (Far Right Deep)
    { mesh: createTexturedGear('backpack', 7.5, 10.0, 0.8, 0x818cf8), initPos: [54, 18, -30] },
    // 21. Deep Sony Camera (Top Center Deep)
    { mesh: createTexturedGear('sonyCamera', 6.9, 10.0, 0.75, 0xf59e0b), initPos: [26, 36, -28] },
    // 22. Deep White Lens (Bottom Left Deep)
    { mesh: createTexturedGear('whiteLens', 4.6, 10.0, 0.8, 0x38bdf8), initPos: [-44, -34, -28] },
    // 23. Deep Drone (Far Upper Deep)
    { mesh: createTexturedGear('drone', 9.6, 10.0, 0.75, 0x818cf8), initPos: [-6, 38, -32] },
    // 24. Deep Canon Camera (Far Lower Deep)
    { mesh: createTexturedGear('canonCamera', 12.5, 10.0, 0.7, 0xf59e0b), initPos: [38, -34, -28] }
  ];

  cameraGears.forEach(gear => {
    gear.mesh.position.set(...gear.initPos);
    mainGroup.add(gear.mesh);
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

    // Direct cursor point light to cast real-time glares on camera lenses
    cursorLight.position.x = (event.clientX - windowHalfX) * 0.14;
    cursorLight.position.y = -(event.clientY - windowHalfY) * 0.14;
  });

  // Window Resize Handling
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Smooth Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth whole-group easing to cursor position
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    mainGroup.rotation.y = elapsedTime * 0.025 + targetX * 0.008;
    mainGroup.rotation.x = elapsedTime * 0.012 + targetY * 0.008;

    // 3D Physics Tilt, Harmonic Bobbing, and Individual Rotation for All 24 Camera Gears
    cameraGears.forEach((item, idx) => {
      const speed = 0.12 + (idx % 6) * 0.035;
      const dir = idx % 2 === 0 ? 1 : -1;

      // Realistic 3D rotational tilt reacting to mouse position & elapsed time
      item.mesh.rotation.x = Math.sin(elapsedTime * speed) * 0.28 + (targetY * 0.022 * dir);
      item.mesh.rotation.y = elapsedTime * (0.15 * dir) + (targetX * 0.022 * dir);
      item.mesh.rotation.z = Math.cos(elapsedTime * speed * 0.85) * 0.14;

      // Gentle floating buoyancy wave
      item.mesh.position.y = item.initPos[1] + Math.sin(elapsedTime * 1.3 + idx * 0.95) * 1.6;
      item.mesh.position.x = item.initPos[0] + Math.cos(elapsedTime * 0.8 + idx * 0.7) * 0.8;
    });

    renderer.render(scene, camera);
  }

  animate();
});
