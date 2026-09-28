/**
 * Molshoy Fotografi - Interactive Three.js 3D Background Scene
 * Features 24 Procedural 3D Cameras and Photography/Videography Gears
 * Completely removes abstract floating particles and focuses 100% on professional camera equipment.
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
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
  keyLight.position.set(60, 70, 50);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xf59e0b, 1.2);
  rimLight.position.set(-60, -50, -40);
  scene.add(rimLight);

  const softFillLight = new THREE.DirectionalLight(0x818cf8, 0.7);
  softFillLight.position.set(0, -60, 40);
  scene.add(softFillLight);

  // Dynamic cursor point light for real-time specular lens glares
  const cursorLight = new THREE.PointLight(0xffffff, 2.2, 220);
  cursorLight.position.set(0, 0, 55);
  scene.add(cursorLight);

  // Shared high-grade realistic materials
  function createSharedMaterials(accentHex) {
    return {
      body: new THREE.MeshStandardMaterial({ color: 0x141a26, roughness: 0.38, metalness: 0.72 }),
      cinemaBody: new THREE.MeshStandardMaterial({ color: 0x0c1017, roughness: 0.45, metalness: 0.85 }),
      grip: new THREE.MeshStandardMaterial({ color: 0x07090e, roughness: 0.92, metalness: 0.12 }),
      metal: new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.2, metalness: 0.95 }),
      darkMetal: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3, metalness: 0.88 }),
      gold: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.25, metalness: 0.9 }),
      barrel: new THREE.MeshStandardMaterial({ color: 0x111622, roughness: 0.35, metalness: 0.8 }),
      whiteLens: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.28, metalness: 0.65 }),
      glass: new THREE.MeshStandardMaterial({ color: accentHex, roughness: 0.04, metalness: 0.92, transparent: true, opacity: 0.85 }),
      accent: new THREE.MeshStandardMaterial({ color: accentHex, roughness: 0.25, metalness: 0.85, emissive: accentHex, emissiveIntensity: 0.45 }),
      screen: new THREE.MeshStandardMaterial({ color: 0x080c14, roughness: 0.1, metalness: 0.9 }),
      screenActive: new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.15, metalness: 0.8, emissive: 0x0369a1, emissiveIntensity: 0.6 }),
      led: new THREE.MeshStandardMaterial({ color: 0xff3b30, emissive: 0xff3b30, emissiveIntensity: 0.95 }),
      ledGreen: new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 0.95 }),
      diffuser: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4, metalness: 0.1, transparent: true, opacity: 0.92, emissive: 0xffffff, emissiveIntensity: 0.45 }),
      silver: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.15, metalness: 0.95 }),
      foam: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.96, metalness: 0.05 })
    };
  }

  // 1. DSLR / Mirrorless Camera Body
  function create3DCamera(accentHex, scale = 1) {
    const grp = new THREE.Group();
    const m = createSharedMaterials(accentHex);

    // Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(8.8 * scale, 5.8 * scale, 3.4 * scale), m.body);
    grp.add(body);

    // Grip
    const grip = new THREE.Mesh(new THREE.BoxGeometry(2.4 * scale, 5.6 * scale, 2.0 * scale), m.grip);
    grip.position.set(3.4 * scale, 0, 1.2 * scale);
    grp.add(grip);

    // Pentaprism / Viewfinder
    const prism = new THREE.Mesh(new THREE.CylinderGeometry(1.8 * scale, 2.8 * scale, 1.8 * scale, 4), m.body);
    prism.rotation.y = Math.PI / 4;
    prism.position.set(0, 3.6 * scale, 0);
    grp.add(prism);

    // Hotshoe
    const hotshoe = new THREE.Mesh(new THREE.BoxGeometry(1.6 * scale, 0.4 * scale, 1.8 * scale), m.metal);
    hotshoe.position.set(0, 4.6 * scale, 0);
    grp.add(hotshoe);

    // Mount & Lens
    const mount = new THREE.Mesh(new THREE.CylinderGeometry(2.6 * scale, 2.6 * scale, 0.6 * scale, 32), m.metal);
    mount.rotation.x = Math.PI / 2;
    mount.position.set(-0.6 * scale, 0.1 * scale, 1.8 * scale);
    grp.add(mount);

    const lens = new THREE.Mesh(new THREE.CylinderGeometry(2.4 * scale, 2.4 * scale, 3.6 * scale, 32), m.barrel);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(-0.6 * scale, 0.1 * scale, 3.6 * scale);
    grp.add(lens);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.45 * scale, 0.12 * scale, 8, 32), m.accent);
    ring.position.set(-0.6 * scale, 0.1 * scale, 5.0 * scale);
    grp.add(ring);

    const glass = new THREE.Mesh(new THREE.SphereGeometry(2.2 * scale, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), m.glass);
    glass.rotation.x = -Math.PI / 2;
    glass.position.set(-0.6 * scale, 0.1 * scale, 5.2 * scale);
    grp.add(glass);

    // Dials & Shutter
    const dial = new THREE.Mesh(new THREE.CylinderGeometry(1.0 * scale, 1.0 * scale, 0.8 * scale, 16), m.metal);
    dial.position.set(-3.0 * scale, 3.2 * scale, 0);
    grp.add(dial);

    const shutter = new THREE.Mesh(new THREE.CylinderGeometry(0.6 * scale, 0.6 * scale, 0.6 * scale, 16), m.metal);
    shutter.position.set(3.2 * scale, 3.1 * scale, 0.8 * scale);
    grp.add(shutter);

    const led = new THREE.Mesh(new THREE.SphereGeometry(0.3 * scale, 12, 12), m.led);
    led.position.set(1.5 * scale, 1.8 * scale, 1.8 * scale);
    grp.add(led);

    // Rear Monitor Screen
    const screen = new THREE.Mesh(new THREE.BoxGeometry(6.2 * scale, 4.2 * scale, 0.15 * scale), m.screen);
    screen.position.set(0.2 * scale, 0, -1.75 * scale);
    grp.add(screen);

    return grp;
  }

  // 2. Cinema Production Camera (RED / ARRI Style Modular Rig)
  function create3DCinemaCamera(accentHex, scale = 1) {
    const grp = new THREE.Group();
    const m = createSharedMaterials(accentHex);

    // Main Boxy Cinema Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(7.6 * scale, 7.0 * scale, 8.2 * scale), m.cinemaBody);
    grp.add(body);

    // Top Cheese Plate
    const topPlate = new THREE.Mesh(new THREE.BoxGeometry(6.8 * scale, 0.5 * scale, 7.8 * scale), m.darkMetal);
    topPlate.position.set(0, 3.7 * scale, 0);
    grp.add(topPlate);

    // Top Carry Handle
    const handleBar = new THREE.Mesh(new THREE.BoxGeometry(1.4 * scale, 1.0 * scale, 7.0 * scale), m.metal);
    handleBar.position.set(0, 5.6 * scale, 0);
    grp.add(handleBar);

    const handlePillarF = new THREE.Mesh(new THREE.BoxGeometry(1.4 * scale, 1.8 * scale, 0.9 * scale), m.darkMetal);
    handlePillarF.position.set(0, 4.5 * scale, 2.6 * scale);
    grp.add(handlePillarF);

    const handlePillarB = new THREE.Mesh(new THREE.BoxGeometry(1.4 * scale, 1.8 * scale, 0.9 * scale), m.darkMetal);
    handlePillarB.position.set(0, 4.5 * scale, -2.6 * scale);
    grp.add(handlePillarB);

    // 15mm Base Rods (Carbon fiber rails)
    for (let i of [-1.8, 1.8]) {
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.35 * scale, 0.35 * scale, 14.0 * scale, 16), m.darkMetal);
      rod.rotation.x = Math.PI / 2;
      rod.position.set(i * scale, -4.2 * scale, 2.0 * scale);
      grp.add(rod);
    }

    // Heavy Cinema Prime Lens Barrel
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(2.8 * scale, 2.8 * scale, 5.2 * scale, 32), m.barrel);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(0, 0, 6.2 * scale);
    grp.add(lens);

    // Gear Focus Ring
    const gearRing = new THREE.Mesh(new THREE.CylinderGeometry(3.0 * scale, 3.0 * scale, 0.8 * scale, 24), m.darkMetal);
    gearRing.rotation.x = Math.PI / 2;
    gearRing.position.set(0, 0, 5.5 * scale);
    grp.add(gearRing);

    // Matte Box with Sunshade Flags
    const matteBox = new THREE.Mesh(new THREE.BoxGeometry(7.2 * scale, 5.4 * scale, 1.2 * scale), m.body);
    matteBox.position.set(0, 0, 8.8 * scale);
    grp.add(matteBox);

    const topFlag = new THREE.Mesh(new THREE.BoxGeometry(7.6 * scale, 0.2 * scale, 3.2 * scale), m.darkMetal);
    topFlag.rotation.x = -Math.PI / 10;
    topFlag.position.set(0, 3.2 * scale, 9.8 * scale);
    grp.add(topFlag);

    // Large Front Optical Glass
    const glass = new THREE.Mesh(new THREE.SphereGeometry(2.6 * scale, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), m.glass);
    glass.rotation.x = -Math.PI / 2;
    glass.position.set(0, 0, 8.7 * scale);
    grp.add(glass);

    // Articulated Side Monitor Screen
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.3 * scale, 0.3 * scale, 2.4 * scale, 12), m.metal);
    arm.rotation.z = Math.PI / 2;
    arm.position.set(-4.6 * scale, 2.0 * scale, 1.0 * scale);
    grp.add(arm);

    const monitor = new THREE.Mesh(new THREE.BoxGeometry(0.3 * scale, 3.8 * scale, 5.2 * scale), m.screenActive);
    monitor.position.set(-5.8 * scale, 2.0 * scale, 1.0 * scale);
    grp.add(monitor);

    // Rear V-Mount Battery Brick
    const vMount = new THREE.Mesh(new THREE.BoxGeometry(5.6 * scale, 6.2 * scale, 2.6 * scale), m.body);
    vMount.position.set(0, 0, -5.2 * scale);
    grp.add(vMount);

    const ledPower = new THREE.Mesh(new THREE.BoxGeometry(0.2 * scale, 2.4 * scale, 0.4 * scale), m.ledGreen);
    ledPower.position.set(2.85 * scale, 0, -5.2 * scale);
    grp.add(ledPower);

    return grp;
  }

  // 3. Vintage Rangefinder Camera (Classic Leica M Style)
  function create3DRangefinder(accentHex, scale = 1) {
    const grp = new THREE.Group();
    const m = createSharedMaterials(accentHex);

    // Chrome Top Plate
    const topPlate = new THREE.Mesh(new THREE.BoxGeometry(8.2 * scale, 1.2 * scale, 3.2 * scale), m.silver);
    topPlate.position.set(0, 2.4 * scale, 0);
    grp.add(topPlate);

    // Textured Leatherette Mid-Body
    const midBody = new THREE.Mesh(new THREE.BoxGeometry(8.0 * scale, 3.6 * scale, 3.0 * scale), m.grip);
    grp.add(midBody);

    // Chrome Base Plate
    const basePlate = new THREE.Mesh(new THREE.BoxGeometry(8.2 * scale, 0.6 * scale, 3.2 * scale), m.silver);
    basePlate.position.set(0, -2.1 * scale, 0);
    grp.add(basePlate);

    // Dual Rangefinder & Viewfinder Windows
    const vfWindow = new THREE.Mesh(new THREE.BoxGeometry(0.8 * scale, 0.6 * scale, 0.3 * scale), m.glass);
    vfWindow.position.set(2.8 * scale, 2.4 * scale, 1.6 * scale);
    grp.add(vfWindow);

    const rfWindow = new THREE.Mesh(new THREE.CylinderGeometry(0.4 * scale, 0.4 * scale, 0.3 * scale, 16), m.glass);
    rfWindow.rotation.x = Math.PI / 2;
    rfWindow.position.set(0.6 * scale, 2.4 * scale, 1.6 * scale);
    grp.add(rfWindow);

    // Classic Red Dot Brand Badge
    const redDot = new THREE.Mesh(new THREE.CylinderGeometry(0.55 * scale, 0.55 * scale, 0.2 * scale, 16), m.led);
    redDot.rotation.x = Math.PI / 2;
    redDot.position.set(-2.4 * scale, 1.0 * scale, 1.55 * scale);
    grp.add(redDot);

    // Shutter Speed Dial & Film Advance Lever
    const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.9 * scale, 0.9 * scale, 0.7 * scale, 16), m.silver);
    dial.position.set(-1.2 * scale, 3.3 * scale, 0);
    grp.add(dial);

    const lever = new THREE.Mesh(new THREE.BoxGeometry(2.4 * scale, 0.25 * scale, 0.8 * scale), m.silver);
    lever.position.set(2.6 * scale, 3.2 * scale, -0.4 * scale);
    grp.add(lever);

    // Vintage Pancake Prime Lens
    const lensMount = new THREE.Mesh(new THREE.CylinderGeometry(2.2 * scale, 2.2 * scale, 0.5 * scale, 32), m.silver);
    lensMount.rotation.x = Math.PI / 2;
    lensMount.position.set(0, 0, 1.7 * scale);
    grp.add(lensMount);

    const lensBarrel = new THREE.Mesh(new THREE.CylinderGeometry(2.0 * scale, 2.0 * scale, 2.2 * scale, 32), m.silver);
    lensBarrel.rotation.x = Math.PI / 2;
    lensBarrel.position.set(0, 0, 2.8 * scale);
    grp.add(lensBarrel);

    const lensAperture = new THREE.Mesh(new THREE.TorusGeometry(1.9 * scale, 0.1 * scale, 8, 32), m.accent);
    lensAperture.position.set(0, 0, 3.8 * scale);
    grp.add(lensAperture);

    const glass = new THREE.Mesh(new THREE.SphereGeometry(1.7 * scale, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), m.glass);
    glass.rotation.x = -Math.PI / 2;
    glass.position.set(0, 0, 3.8 * scale);
    grp.add(glass);

    return grp;
  }

  // 4. Action Camera (Rugged GoPro Style)
  function create3DActionCam(accentHex, scale = 1) {
    const grp = new THREE.Group();
    const m = createSharedMaterials(accentHex);

    // Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(5.2 * scale, 3.8 * scale, 2.8 * scale), m.cinemaBody);
    grp.add(body);

    // Front Lens Housing Bezel
    const bezel = new THREE.Mesh(new THREE.BoxGeometry(2.2 * scale, 2.2 * scale, 0.8 * scale), m.metal);
    bezel.position.set(-1.2 * scale, 0.4 * scale, 1.6 * scale);
    grp.add(bezel);

    const wideLens = new THREE.Mesh(new THREE.SphereGeometry(1.0 * scale, 24, 16), m.glass);
    wideLens.position.set(-1.2 * scale, 0.4 * scale, 2.0 * scale);
    grp.add(wideLens);

    // Front Selfie Preview Screen
    const frontScreen = new THREE.Mesh(new THREE.BoxGeometry(1.6 * scale, 1.6 * scale, 0.1 * scale), m.screenActive);
    frontScreen.position.set(1.3 * scale, 0.4 * scale, 1.45 * scale);
    grp.add(frontScreen);

    // Top Record Shutter Button
    const recordBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.55 * scale, 0.55 * scale, 0.4 * scale, 16), m.led);
    recordBtn.position.set(-1.4 * scale, 2.0 * scale, 0);
    grp.add(recordBtn);

    // Rear Touchscreen
    const rearScreen = new THREE.Mesh(new THREE.BoxGeometry(4.6 * scale, 3.2 * scale, 0.1 * scale), m.screen);
    rearScreen.position.set(0, 0, -1.45 * scale);
    grp.add(rearScreen);

    // Bottom Folding Mount Fingers
    for (let x of [-0.6, 0.6]) {
      const finger = new THREE.Mesh(new THREE.BoxGeometry(0.3 * scale, 0.9 * scale, 1.2 * scale), m.metal);
      finger.position.set(x * scale, -2.3 * scale, 0);
      grp.add(finger);
    }

    return grp;
  }

  // 5. Aerial 4K Drone Quadcopter (DJI Style)
  function create3DDrone(accentHex, scale = 1) {
    const grp = new THREE.Group();
    const m = createSharedMaterials(accentHex);

    // Sleek Aerodynamic Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(4.8 * scale, 1.8 * scale, 7.2 * scale), m.silver);
    grp.add(body);

    // Front Sensor Visor
    const visor = new THREE.Mesh(new THREE.BoxGeometry(3.6 * scale, 1.2 * scale, 1.0 * scale), m.screen);
    visor.position.set(0, 0.1 * scale, 3.6 * scale);
    grp.add(visor);

    // 4 Diagonal Motor Arms with Propellers
    const armCoords = [
      [3.8, 3.4], [-3.8, 3.4], [3.8, -3.4], [-3.8, -3.4]
    ];

    armCoords.forEach(([ax, az]) => {
      // Carbon arm
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.3 * scale, 0.3 * scale, 4.4 * scale, 12), m.darkMetal);
      arm.rotation.z = Math.atan2(ax, 2.5);
      arm.rotation.y = Math.atan2(az, ax);
      arm.position.set(ax * 0.5 * scale, 0.1 * scale, az * 0.5 * scale);
      grp.add(arm);

      // Motor Hub
      const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.7 * scale, 0.7 * scale, 0.8 * scale, 16), m.metal);
      motor.position.set(ax * scale, 0.4 * scale, az * scale);
      grp.add(motor);

      // Dual Propeller Blades
      const prop = new THREE.Mesh(new THREE.BoxGeometry(4.8 * scale, 0.08 * scale, 0.55 * scale), m.body);
      prop.position.set(ax * scale, 0.85 * scale, az * scale);
      prop.rotation.y = Math.random() * Math.PI;
      grp.add(prop);
    });

    // Underside 3-Axis 4K Gimbal Camera
    const gimbalStrut = new THREE.Mesh(new THREE.CylinderGeometry(0.3 * scale, 0.3 * scale, 1.2 * scale, 12), m.metal);
    gimbalStrut.position.set(0, -1.4 * scale, 1.8 * scale);
    grp.add(gimbalStrut);

    const gimbalCam = new THREE.Mesh(new THREE.SphereGeometry(1.1 * scale, 24, 16), m.cinemaBody);
    gimbalCam.position.set(0, -2.4 * scale, 2.0 * scale);
    grp.add(gimbalCam);

    const glass = new THREE.Mesh(new THREE.SphereGeometry(0.65 * scale, 20, 16), m.glass);
    glass.position.set(0, -2.4 * scale, 2.8 * scale);
    grp.add(glass);

    return grp;
  }

  // 6. Pro White 70-200mm Telephoto Zoom Lens (Canon L / Sony GM Style)
  function create3DWhiteTelephotoLens(accentHex, scale = 1) {
    const grp = new THREE.Group();
    const m = createSharedMaterials(accentHex);

    // Bayonet Mount
    const mount = new THREE.Mesh(new THREE.CylinderGeometry(2.4 * scale, 2.4 * scale, 0.9 * scale, 32), m.metal);
    mount.position.y = -5.0 * scale;
    grp.add(mount);

    // Iconic White Main Barrel
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(2.6 * scale, 2.4 * scale, 9.2 * scale, 32), m.whiteLens);
    grp.add(barrel);

    // Tripod Collar Ring & Foot
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(2.9 * scale, 2.9 * scale, 1.4 * scale, 32), m.whiteLens);
    collar.position.y = -3.2 * scale;
    grp.add(collar);

    const foot = new THREE.Mesh(new THREE.BoxGeometry(1.4 * scale, 1.2 * scale, 2.8 * scale), m.metal);
    foot.position.set(0, -3.2 * scale, 2.8 * scale);
    grp.add(foot);

    // Textured Rubber Zoom & Focus Rings
    const zoomRing = new THREE.Mesh(new THREE.CylinderGeometry(2.75 * scale, 2.75 * scale, 2.0 * scale, 32), m.grip);
    zoomRing.position.y = -0.8 * scale;
    grp.add(zoomRing);

    const focusRing = new THREE.Mesh(new THREE.CylinderGeometry(2.78 * scale, 2.78 * scale, 2.2 * scale, 32), m.grip);
    focusRing.position.y = 2.4 * scale;
    grp.add(focusRing);

    // Luxury Red / Gold Ring
    const acc = new THREE.Mesh(new THREE.TorusGeometry(2.65 * scale, 0.12 * scale, 8, 32), m.accent);
    acc.rotation.x = Math.PI / 2;
    acc.position.y = 4.2 * scale;
    grp.add(acc);

    // Front Hood & Optical Glass Element
    const hood = new THREE.Mesh(new THREE.CylinderGeometry(2.95 * scale, 2.7 * scale, 1.6 * scale, 32), m.whiteLens);
    hood.position.y = 5.2 * scale;
    grp.add(hood);

    const glass = new THREE.Mesh(new THREE.SphereGeometry(2.5 * scale, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), m.glass);
    glass.position.y = 4.8 * scale;
    grp.add(glass);

    return grp;
  }

  // 7. Fast Prime Portrait Lens (50mm / 85mm f/1.2 Style)
  function create3DPrimeLens(accentHex, scale = 1) {
    const grp = new THREE.Group();
    const m = createSharedMaterials(accentHex);

    // Mount
    const mount = new THREE.Mesh(new THREE.CylinderGeometry(2.3 * scale, 2.3 * scale, 0.7 * scale, 32), m.metal);
    mount.position.y = -2.6 * scale;
    grp.add(mount);

    // Wide Stocky Body
    const body = new THREE.Mesh(new THREE.CylinderGeometry(3.0 * scale, 2.6 * scale, 4.6 * scale, 32), m.barrel);
    grp.add(body);

    // Knurled Focus Ring
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(3.12 * scale, 3.12 * scale, 2.2 * scale, 32), m.grip);
    ring.position.y = 0.2 * scale;
    grp.add(ring);

    // Accent Ring
    const acc = new THREE.Mesh(new THREE.TorusGeometry(3.05 * scale, 0.12 * scale, 8, 32), m.accent);
    acc.rotation.x = Math.PI / 2;
    acc.position.y = 1.8 * scale;
    grp.add(acc);

    // Huge Front Curved Glass Element
    const glass = new THREE.Mesh(new THREE.SphereGeometry(2.8 * scale, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), m.glass);
    glass.position.y = 2.0 * scale;
    grp.add(glass);

    return grp;
  }

  // 8. Handheld 3-Axis Gimbal Stabilizer (DJI Ronin / Zhiyun Style)
  function create3DGimbal(accentHex, scale = 1) {
    const grp = new THREE.Group();
    const m = createSharedMaterials(accentHex);

    // Handle Grip
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.85 * scale, 0.85 * scale, 8.5 * scale, 16), m.grip);
    grp.add(handle);

    // Control Joystick
    const joystick = new THREE.Mesh(new THREE.SphereGeometry(0.35 * scale, 12, 12), m.metal);
    joystick.position.set(0, 3.4 * scale, 0.9 * scale);
    grp.add(joystick);

    // Pan Motor Hub (Base of gimbal)
    const panMotor = new THREE.Mesh(new THREE.CylinderGeometry(1.4 * scale, 1.4 * scale, 1.2 * scale, 20), m.cinemaBody);
    panMotor.position.y = 4.8 * scale;
    grp.add(panMotor);

    // Roll Motor Arm
    const rollArm = new THREE.Mesh(new THREE.BoxGeometry(0.7 * scale, 3.4 * scale, 0.7 * scale), m.darkMetal);
    rollArm.position.set(2.4 * scale, 6.2 * scale, 0);
    grp.add(rollArm);

    const rollMotor = new THREE.Mesh(new THREE.CylinderGeometry(1.2 * scale, 1.2 * scale, 1.2 * scale, 20), m.cinemaBody);
    rollMotor.rotation.z = Math.PI / 2;
    rollMotor.position.set(2.4 * scale, 8.0 * scale, 0);
    grp.add(rollMotor);

    // Tilt Arm & Cradle
    const tiltArm = new THREE.Mesh(new THREE.BoxGeometry(4.2 * scale, 0.6 * scale, 0.7 * scale), m.darkMetal);
    tiltArm.position.set(0.6 * scale, 8.0 * scale, 1.8 * scale);
    grp.add(tiltArm);

    // Quick-Release Camera Plate
    const plate = new THREE.Mesh(new THREE.BoxGeometry(3.6 * scale, 0.4 * scale, 3.4 * scale), m.accent);
    plate.position.set(0, 8.4 * scale, 0);
    grp.add(plate);

    return grp;
  }

  // 9. Camera Tripod
  function create3DTripod(accentHex, scale = 1) {
    const grp = new THREE.Group();
    const m = createSharedMaterials(accentHex);

    // Quick Release Plate
    const plate = new THREE.Mesh(new THREE.BoxGeometry(2.4 * scale, 0.4 * scale, 2.4 * scale), m.metal);
    plate.position.y = 5.2 * scale;
    grp.add(plate);

    // Ball Head
    const ball = new THREE.Mesh(new THREE.SphereGeometry(1.1 * scale, 16, 16), m.metal);
    ball.position.y = 4.2 * scale;
    grp.add(ball);

    // Pan Handle
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.2 * scale, 0.2 * scale, 3.4 * scale, 12), m.grip);
    handle.rotation.z = Math.PI / 2.5;
    handle.position.set(1.6 * scale, 4.4 * scale, 0);
    grp.add(handle);

    // Hub
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(1.4 * scale, 1.4 * scale, 0.8 * scale, 6), m.body);
    hub.position.y = 3.2 * scale;
    grp.add(hub);

    // 3 Telescopic Legs
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const legGrp = new THREE.Group();
      
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.32 * scale, 0.22 * scale, 11.0 * scale, 12), m.metal);
      leg.position.y = -5.5 * scale;
      legGrp.add(leg);

      const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.42 * scale, 0.42 * scale, 0.8 * scale, 12), m.accent);
      collar.position.y = -4.0 * scale;
      legGrp.add(collar);

      const foot = new THREE.Mesh(new THREE.SphereGeometry(0.4 * scale, 8, 8), m.grip);
      foot.position.y = -11.0 * scale;
      legGrp.add(foot);

      legGrp.position.set(Math.cos(angle) * 1.0 * scale, 3.0 * scale, Math.sin(angle) * 1.0 * scale);
      legGrp.rotation.z = Math.cos(angle) * 0.28;
      legGrp.rotation.x = Math.sin(angle) * 0.28;
      grp.add(legGrp);
    }

    return grp;
  }

  // 10. Speedlight Camera Flash
  function create3DSpeedlight(accentHex, scale = 1) {
    const grp = new THREE.Group();
    const m = createSharedMaterials(accentHex);

    const foot = new THREE.Mesh(new THREE.BoxGeometry(1.4 * scale, 0.4 * scale, 1.4 * scale), m.metal);
    foot.position.y = -3.8 * scale;
    grp.add(foot);

    const body = new THREE.Mesh(new THREE.BoxGeometry(3.0 * scale, 3.8 * scale, 2.4 * scale), m.body);
    body.position.y = -1.8 * scale;
    grp.add(body);

    const screen = new THREE.Mesh(new THREE.BoxGeometry(2.0 * scale, 1.6 * scale, 0.1 * scale), m.accent);
    screen.position.set(0, -1.8 * scale, -1.25 * scale);
    grp.add(screen);

    const elbow = new THREE.Mesh(new THREE.CylinderGeometry(1.1 * scale, 1.1 * scale, 2.2 * scale, 16), m.metal);
    elbow.rotation.z = Math.PI / 2;
    elbow.position.y = 0.4 * scale;
    grp.add(elbow);

    const head = new THREE.Mesh(new THREE.BoxGeometry(3.8 * scale, 2.2 * scale, 4.0 * scale), m.body);
    head.position.set(0, 1.6 * scale, 0.8 * scale);
    grp.add(head);

    const diffuser = new THREE.Mesh(new THREE.BoxGeometry(3.4 * scale, 1.8 * scale, 0.2 * scale), m.diffuser);
    diffuser.position.set(0, 1.6 * scale, 2.85 * scale);
    grp.add(diffuser);

    return grp;
  }

  // 11. Studio Softbox Lighting
  function create3DSoftbox(accentHex, scale = 1) {
    const grp = new THREE.Group();
    const m = createSharedMaterials(accentHex);

    const cone = new THREE.Mesh(new THREE.CylinderGeometry(5.4 * scale, 1.8 * scale, 4.8 * scale, 4), m.body);
    cone.rotation.y = Math.PI / 4;
    cone.rotation.x = Math.PI / 2;
    cone.position.set(0, 3.0 * scale, 1.8 * scale);
    grp.add(cone);

    const diffuser = new THREE.Mesh(new THREE.BoxGeometry(7.2 * scale, 7.2 * scale, 0.15 * scale), m.diffuser);
    diffuser.position.set(0, 3.0 * scale, 4.25 * scale);
    grp.add(diffuser);

    const strobe = new THREE.Mesh(new THREE.CylinderGeometry(1.2 * scale, 1.2 * scale, 2.0 * scale, 16), m.metal);
    strobe.rotation.x = Math.PI / 2;
    strobe.position.set(0, 3.0 * scale, -1.0 * scale);
    grp.add(strobe);

    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.28 * scale, 0.28 * scale, 8.5 * scale, 12), m.metal);
    mast.position.set(0, -1.5 * scale, -1.0 * scale);
    grp.add(mast);

    return grp;
  }

  // 12. Studio Ring Light (LED Video Light)
  function create3DRingLight(accentHex, scale = 1) {
    const grp = new THREE.Group();
    const m = createSharedMaterials(accentHex);

    // Glowing Circular Ring Diffuser
    const ring = new THREE.Mesh(new THREE.TorusGeometry(5.2 * scale, 0.85 * scale, 16, 40), m.diffuser);
    grp.add(ring);

    // Outer Bezel Case
    const casing = new THREE.Mesh(new THREE.TorusGeometry(5.6 * scale, 0.3 * scale, 8, 40), m.body);
    grp.add(casing);

    // Camera Center Cold Shoe Bracket
    const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.5 * scale, 3.2 * scale, 0.4 * scale), m.metal);
    bracket.position.set(0, -2.4 * scale, 0);
    grp.add(bracket);

    const mount = new THREE.Mesh(new THREE.BoxGeometry(1.4 * scale, 0.6 * scale, 1.2 * scale), m.accent);
    mount.position.set(0, -0.6 * scale, 0);
    grp.add(mount);

    // Support Stand
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.25 * scale, 0.25 * scale, 6.0 * scale, 12), m.metal);
    stand.position.set(0, -7.5 * scale, 0);
    grp.add(stand);

    return grp;
  }

  // 13. Shotgun Boom Microphone (Røde Style with Windscreen / Deadcat)
  function create3DShotgunMic(accentHex, scale = 1) {
    const grp = new THREE.Group();
    const m = createSharedMaterials(accentHex);

    // Fluffy Acoustic Deadcat Windscreen
    const deadcat = new THREE.Mesh(new THREE.CylinderGeometry(1.3 * scale, 1.3 * scale, 7.8 * scale, 16), m.foam);
    deadcat.rotation.x = Math.PI / 2;
    grp.add(deadcat);

    // Rear Barrel / Connector
    const rear = new THREE.Mesh(new THREE.CylinderGeometry(0.8 * scale, 0.8 * scale, 2.4 * scale, 16), m.metal);
    rear.rotation.x = Math.PI / 2;
    rear.position.set(0, 0, -4.6 * scale);
    grp.add(rear);

    // Shockmount Lyre Suspension
    const shockMount = new THREE.Mesh(new THREE.TorusGeometry(1.7 * scale, 0.18 * scale, 8, 24), m.accent);
    shockMount.position.set(0, -0.8 * scale, -1.0 * scale);
    grp.add(shockMount);

    // Coldshoe Foot
    const foot = new THREE.Mesh(new THREE.BoxGeometry(1.2 * scale, 1.4 * scale, 1.2 * scale), m.darkMetal);
    foot.position.set(0, -2.8 * scale, -1.0 * scale);
    grp.add(foot);

    return grp;
  }

  // 14. On-Camera Field Monitor (Atomos / SmallHD 7-inch Style)
  function create3DFieldMonitor(accentHex, scale = 1) {
    const grp = new THREE.Group();
    const m = createSharedMaterials(accentHex);

    // Rugged Frame with Corner Bumpers
    const frame = new THREE.Mesh(new THREE.BoxGeometry(8.2 * scale, 5.2 * scale, 1.2 * scale), m.cinemaBody);
    grp.add(frame);

    // Glowing Active Preview Screen
    const screen = new THREE.Mesh(new THREE.BoxGeometry(7.2 * scale, 4.4 * scale, 0.1 * scale), m.screenActive);
    screen.position.set(0, 0, 0.62 * scale);
    grp.add(screen);

    // Sun Hood Visor
    const topVisor = new THREE.Mesh(new THREE.BoxGeometry(8.0 * scale, 0.2 * scale, 2.4 * scale), m.darkMetal);
    topVisor.position.set(0, 2.6 * scale, 1.6 * scale);
    grp.add(topVisor);

    // Rear NP-F Battery
    const bat = new THREE.Mesh(new THREE.BoxGeometry(3.2 * scale, 4.2 * scale, 1.6 * scale), m.body);
    bat.position.set(1.4 * scale, 0, -1.3 * scale);
    grp.add(bat);

    return grp;
  }

  // 15. SD Memory Card
  function create3DSDCard(accentHex, scale = 1) {
    const grp = new THREE.Group();
    const m = createSharedMaterials(accentHex);

    const body = new THREE.Mesh(new THREE.BoxGeometry(4.4 * scale, 6.2 * scale, 0.4 * scale), m.body);
    grp.add(body);

    const notch = new THREE.Mesh(new THREE.BoxGeometry(1.2 * scale, 1.2 * scale, 0.5 * scale), m.metal);
    notch.rotation.z = Math.PI / 4;
    notch.position.set(2.2 * scale, 3.1 * scale, 0);
    grp.add(notch);

    for (let i = -3; i <= 3; i++) {
      const pin = new THREE.Mesh(new THREE.BoxGeometry(0.24 * scale, 1.2 * scale, 0.06 * scale), m.gold);
      pin.position.set(i * 0.48 * scale, 2.2 * scale, -0.22 * scale);
      grp.add(pin);
    }

    const label = new THREE.Mesh(new THREE.BoxGeometry(3.6 * scale, 3.4 * scale, 0.08 * scale), m.accent);
    label.position.set(0, -0.8 * scale, 0.22 * scale);
    grp.add(label);

    return grp;
  }

  // 16. Camera Shoulder / Messenger Bag
  function create3DCameraBag(accentHex, scale = 1) {
    const grp = new THREE.Group();
    const m = createSharedMaterials(accentHex);

    const body = new THREE.Mesh(new THREE.BoxGeometry(7.8 * scale, 5.8 * scale, 4.4 * scale), m.body);
    grp.add(body);

    const flap = new THREE.Mesh(new THREE.BoxGeometry(8.0 * scale, 4.4 * scale, 1.0 * scale), m.grip);
    flap.position.set(0, 0.6 * scale, 2.4 * scale);
    grp.add(flap);

    const buckle = new THREE.Mesh(new THREE.BoxGeometry(1.2 * scale, 1.8 * scale, 0.5 * scale), m.accent);
    buckle.position.set(0, -0.8 * scale, 2.95 * scale);
    grp.add(buckle);

    const handle = new THREE.Mesh(new THREE.TorusGeometry(1.8 * scale, 0.35 * scale, 8, 24, Math.PI), m.metal);
    handle.position.set(0, 3.0 * scale, 0);
    grp.add(handle);

    return grp;
  }

  // 17. Circular Studio Light Reflector
  function create3DReflector(accentHex, scale = 1) {
    const grp = new THREE.Group();
    const m = createSharedMaterials(accentHex);

    const hoop = new THREE.Mesh(new THREE.TorusGeometry(4.8 * scale, 0.2 * scale, 12, 36), m.body);
    grp.add(hoop);

    const disc = new THREE.Mesh(new THREE.CylinderGeometry(4.6 * scale, 4.6 * scale, 0.08 * scale, 36), m.silver);
    disc.rotation.x = Math.PI / 2;
    grp.add(disc);

    return grp;
  }

  // 18. Camera Battery Pack
  function create3DBattery(accentHex, scale = 1) {
    const grp = new THREE.Group();
    const m = createSharedMaterials(accentHex);

    const body = new THREE.Mesh(new THREE.BoxGeometry(4.2 * scale, 5.8 * scale, 2.4 * scale), m.body);
    grp.add(body);

    const notch = new THREE.Mesh(new THREE.BoxGeometry(2.8 * scale, 0.6 * scale, 0.4 * scale), m.metal);
    notch.position.set(0, 2.9 * scale, 0.8 * scale);
    grp.add(notch);

    for (let i = -1; i <= 1; i++) {
      const pin = new THREE.Mesh(new THREE.BoxGeometry(0.4 * scale, 0.15 * scale, 0.8 * scale), m.gold);
      pin.position.set(i * 0.8 * scale, 2.95 * scale, -0.4 * scale);
      grp.add(pin);
    }

    const bolt = new THREE.Mesh(new THREE.BoxGeometry(0.6 * scale, 1.8 * scale, 0.08 * scale), m.accent);
    bolt.rotation.z = -Math.PI / 6;
    bolt.position.set(0, 0, 1.25 * scale);
    grp.add(bolt);

    return grp;
  }

  // 19. Camera Neck / Shoulder Strap
  function create3DCameraStrap(accentHex, scale = 1) {
    const grp = new THREE.Group();
    const m = createSharedMaterials(accentHex);

    const band = new THREE.Mesh(new THREE.TorusGeometry(4.4 * scale, 0.32 * scale, 12, 36, Math.PI * 1.5), m.grip);
    grp.add(band);

    const pad = new THREE.Mesh(new THREE.TorusGeometry(4.45 * scale, 0.5 * scale, 8, 24, Math.PI * 0.7), m.accent);
    grp.add(pad);

    return grp;
  }

  // -------------------------------------------------------------
  // Instantiate 24 Camera Gears Distributed Throughout 3D Space
  // -------------------------------------------------------------
  const cameraGears = [
    // Hero Cameras & Production Systems
    { mesh: create3DCamera(0x38bdf8, 1.05), initPos: [34, 16, -10] },             // 1. Hero DSLR / Mirrorless Body (Cyan)
    { mesh: create3DCinemaCamera(0xf59e0b, 0.95), initPos: [-38, 22, -14] },       // 2. RED / ARRI Cinema Camera (Amber)
    { mesh: create3DDrone(0x38bdf8, 0.9), initPos: [12, 32, -22] },                // 3. 4K Aerial Drone Quadcopter
    { mesh: create3DRangefinder(0x818cf8, 0.95), initPos: [42, -16, -14] },        // 4. Vintage Rangefinder Camera (Indigo)
    { mesh: create3DActionCam(0x38bdf8, 0.85), initPos: [-16, -26, -12] },         // 5. Action Camera / GoPro
    { mesh: create3DCamera(0xf59e0b, 0.9), initPos: [48, -28, -24] },              // 6. Secondary DSLR Body (Amber)

    // Professional Lenses
    { mesh: create3DWhiteTelephotoLens(0xf59e0b, 0.88), initPos: [-36, -6, -16] }, // 7. 70-200mm White Telephoto Zoom
    { mesh: create3DPrimeLens(0x38bdf8, 0.92), initPos: [46, -2, -18] },            // 8. 85mm f/1.2 Fast Prime Lens
    { mesh: create3DWhiteTelephotoLens(0x38bdf8, 0.8), initPos: [-48, 32, -26] },  // 9. Secondary Telephoto Lens

    // Stabilizers & Heavy Support
    { mesh: create3DGimbal(0x38bdf8, 0.82), initPos: [-44, -22, -20] },            // 10. Handheld 3-Axis Gimbal
    { mesh: create3DTripod(0x818cf8, 0.72), initPos: [-52, 14, -26] },            // 11. Professional Tripod
    { mesh: create3DTripod(0xf59e0b, 0.7), initPos: [-12, -36, -24] },             // 12. Secondary Tripod

    // Studio Lighting & Modifiers
    { mesh: create3DSoftbox(0x38bdf8, 0.75), initPos: [54, 20, -28] },             // 13. Studio Softbox
    { mesh: create3DRingLight(0xf59e0b, 0.78), initPos: [24, 26, -24] },           // 14. Studio Ring Light
    { mesh: create3DSpeedlight(0xf59e0b, 0.85), initPos: [38, -26, -20] },         // 15. Speedlight Flash
    { mesh: create3DSpeedlight(0x38bdf8, 0.8), initPos: [-32, 2, -26] },           // 16. Secondary Speedlight
    { mesh: create3DReflector(0xf59e0b, 0.8), initPos: [52, 6, -30] },             // 17. Light Reflector

    // Audio & Monitoring
    { mesh: create3DShotgunMic(0x38bdf8, 0.85), initPos: [-20, 30, -18] },         // 18. Shotgun Boom Microphone
    { mesh: create3DFieldMonitor(0x818cf8, 0.85), initPos: [-26, 12, -15] },        // 19. 7-inch On-Camera Monitor

    // Essential Accessories & Power
    { mesh: create3DSDCard(0x38bdf8, 0.85), initPos: [28, 34, -18] },              // 20. SD Memory Card (Cyan)
    { mesh: create3DSDCard(0xf59e0b, 0.85), initPos: [-32, -32, -20] },            // 21. SD Memory Card (Gold)
    { mesh: create3DBattery(0xf59e0b, 0.85), initPos: [6, -34, -16] },              // 22. Camera Battery (Amber)
    { mesh: create3DCameraBag(0x38bdf8, 0.85), initPos: [-50, -14, -26] },         // 23. Camera Shoulder Bag
    { mesh: create3DCameraStrap(0x818cf8, 0.8), initPos: [-4, 34, -20] }           // 24. Camera Neck Strap
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
