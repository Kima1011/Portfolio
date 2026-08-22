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

  // 4. Procedural 3D Camera Gear Models (Matching All 10 Gears from Reference Image)
  function createSharedMaterials(accentHex) {
    return {
      body: new THREE.MeshStandardMaterial({ color: 0x141a26, roughness: 0.4, metalness: 0.7 }),
      grip: new THREE.MeshStandardMaterial({ color: 0x0c1017, roughness: 0.85, metalness: 0.2 }),
      metal: new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.2, metalness: 0.95 }),
      gold: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.25, metalness: 0.9 }),
      barrel: new THREE.MeshStandardMaterial({ color: 0x111622, roughness: 0.35, metalness: 0.8 }),
      glass: new THREE.MeshStandardMaterial({ color: accentHex, roughness: 0.05, metalness: 0.9, transparent: true, opacity: 0.85 }),
      accent: new THREE.MeshStandardMaterial({ color: accentHex, roughness: 0.25, metalness: 0.85, emissive: accentHex, emissiveIntensity: 0.4 }),
      screen: new THREE.MeshStandardMaterial({ color: 0x080c14, roughness: 0.1, metalness: 0.9 }),
      led: new THREE.MeshStandardMaterial({ color: 0xff3b30, emissive: 0xff3b30, emissiveIntensity: 0.9 }),
      diffuser: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4, metalness: 0.1, transparent: true, opacity: 0.9, emissive: 0xffffff, emissiveIntensity: 0.35 }),
      silver: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.15, metalness: 0.95 })
    };
  }

  // Gear 1: DSLR / Mirrorless Camera Body
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

    // Prism & Hotshoe
    const prism = new THREE.Mesh(new THREE.CylinderGeometry(1.8 * scale, 2.8 * scale, 1.8 * scale, 4), m.body);
    prism.rotation.y = Math.PI / 4;
    prism.position.set(0, 3.6 * scale, 0);
    grp.add(prism);

    const hotshoe = new THREE.Mesh(new THREE.BoxGeometry(1.6 * scale, 0.4 * scale, 1.8 * scale), m.metal);
    hotshoe.position.set(0, 4.6 * scale, 0);
    grp.add(hotshoe);

    // Lens & Mount
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

    // Dials, Shutter, LED & Screen
    const dial = new THREE.Mesh(new THREE.CylinderGeometry(1.0 * scale, 1.0 * scale, 0.8 * scale, 16), m.metal);
    dial.position.set(-3.0 * scale, 3.2 * scale, 0);
    grp.add(dial);

    const shutter = new THREE.Mesh(new THREE.CylinderGeometry(0.6 * scale, 0.6 * scale, 0.6 * scale, 16), m.metal);
    shutter.position.set(3.2 * scale, 3.1 * scale, 0.8 * scale);
    grp.add(shutter);

    const led = new THREE.Mesh(new THREE.SphereGeometry(0.3 * scale, 12, 12), m.led);
    led.position.set(1.5 * scale, 1.8 * scale, 1.8 * scale);
    grp.add(led);

    const screen = new THREE.Mesh(new THREE.BoxGeometry(6.2 * scale, 4.2 * scale, 0.15 * scale), m.screen);
    screen.position.set(0.2 * scale, 0, -1.75 * scale);
    grp.add(screen);

    return grp;
  }

  // Gear 2: Camera Telephoto / Zoom Lens
  function create3DTelephotoLens(accentHex, scale = 1) {
    const grp = new THREE.Group();
    const m = createSharedMaterials(accentHex);

    // Bayonet Mount
    const mount = new THREE.Mesh(new THREE.CylinderGeometry(2.2 * scale, 2.2 * scale, 0.8 * scale, 32), m.metal);
    mount.position.y = -3.6 * scale;
    grp.add(mount);

    // Main Barrel
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(2.3 * scale, 2.1 * scale, 6.8 * scale, 32), m.barrel);
    grp.add(barrel);

    // Zoom & Focus Ribbed Rings
    const ring1 = new THREE.Mesh(new THREE.CylinderGeometry(2.45 * scale, 2.45 * scale, 1.4 * scale, 32), m.grip);
    ring1.position.y = -1.2 * scale;
    grp.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.CylinderGeometry(2.48 * scale, 2.48 * scale, 1.6 * scale, 32), m.grip);
    ring2.position.y = 1.4 * scale;
    grp.add(ring2);

    // Accent Ring
    const acc = new THREE.Mesh(new THREE.TorusGeometry(2.35 * scale, 0.1 * scale, 8, 32), m.accent);
    acc.rotation.x = Math.PI / 2;
    acc.position.y = 2.8 * scale;
    grp.add(acc);

    // Front Hood & Glass
    const hood = new THREE.Mesh(new THREE.CylinderGeometry(2.55 * scale, 2.35 * scale, 0.9 * scale, 32), m.barrel);
    hood.position.y = 3.6 * scale;
    grp.add(hood);

    const glass = new THREE.Mesh(new THREE.SphereGeometry(2.1 * scale, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), m.glass);
    glass.position.y = 3.6 * scale;
    grp.add(glass);

    return grp;
  }

  // Gear 3: Camera Tripod
  function create3DTripod(accentHex, scale = 1) {
    const grp = new THREE.Group();
    const m = createSharedMaterials(accentHex);

    // Ball Head & Quick Release Plate
    const plate = new THREE.Mesh(new THREE.BoxGeometry(2.4 * scale, 0.4 * scale, 2.4 * scale), m.metal);
    plate.position.y = 5.2 * scale;
    grp.add(plate);

    const ball = new THREE.Mesh(new THREE.SphereGeometry(1.1 * scale, 16, 16), m.metal);
    ball.position.y = 4.2 * scale;
    grp.add(ball);

    // Pan Handle
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.2 * scale, 0.2 * scale, 3.4 * scale, 12), m.grip);
    handle.rotation.z = Math.PI / 2.5;
    handle.position.set(1.6 * scale, 4.4 * scale, 0);
    grp.add(handle);

    // Central Spider Hub
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

  // Gear 4: Speedlight Camera Flash
  function create3DSpeedlight(accentHex, scale = 1) {
    const grp = new THREE.Group();
    const m = createSharedMaterials(accentHex);

    // Hotshoe Mount Foot
    const foot = new THREE.Mesh(new THREE.BoxGeometry(1.4 * scale, 0.4 * scale, 1.4 * scale), m.metal);
    foot.position.y = -3.8 * scale;
    grp.add(foot);

    // Lower Main Body Column
    const body = new THREE.Mesh(new THREE.BoxGeometry(3.0 * scale, 3.8 * scale, 2.4 * scale), m.body);
    body.position.y = -1.8 * scale;
    grp.add(body);

    const screen = new THREE.Mesh(new THREE.BoxGeometry(2.0 * scale, 1.6 * scale, 0.1 * scale), m.accent);
    screen.position.set(0, -1.8 * scale, -1.25 * scale);
    grp.add(screen);

    // Swivel / Tilt Elbow
    const elbow = new THREE.Mesh(new THREE.CylinderGeometry(1.1 * scale, 1.1 * scale, 2.2 * scale, 16), m.metal);
    elbow.rotation.z = Math.PI / 2;
    elbow.position.y = 0.4 * scale;
    grp.add(elbow);

    // Flash Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(3.8 * scale, 2.2 * scale, 4.0 * scale), m.body);
    head.position.set(0, 1.6 * scale, 0.8 * scale);
    grp.add(head);

    // Frosted Fresnel Diffuser Lens
    const diffuser = new THREE.Mesh(new THREE.BoxGeometry(3.4 * scale, 1.8 * scale, 0.2 * scale), m.diffuser);
    diffuser.position.set(0, 1.6 * scale, 2.85 * scale);
    grp.add(diffuser);

    return grp;
  }

  // Gear 5: SD Memory Card
  function create3DSDCard(accentHex, scale = 1) {
    const grp = new THREE.Group();
    const m = createSharedMaterials(accentHex);

    // Main Card Body Plate
    const body = new THREE.Mesh(new THREE.BoxGeometry(4.4 * scale, 6.2 * scale, 0.4 * scale), m.body);
    grp.add(body);

    // Top Right Chamfer Notch
    const notch = new THREE.Mesh(new THREE.BoxGeometry(1.2 * scale, 1.2 * scale, 0.5 * scale), m.metal);
    notch.rotation.z = Math.PI / 4;
    notch.position.set(2.2 * scale, 3.1 * scale, 0);
    grp.add(notch);

    // Gold Pins
    for (let i = -3; i <= 3; i++) {
      const pin = new THREE.Mesh(new THREE.BoxGeometry(0.24 * scale, 1.2 * scale, 0.06 * scale), m.gold);
      pin.position.set(i * 0.48 * scale, 2.2 * scale, -0.22 * scale);
      grp.add(pin);
    }

    // Label Plate
    const label = new THREE.Mesh(new THREE.BoxGeometry(3.6 * scale, 3.4 * scale, 0.08 * scale), m.accent);
    label.position.set(0, -0.8 * scale, 0.22 * scale);
    grp.add(label);

    // Lock Switch
    const lock = new THREE.Mesh(new THREE.BoxGeometry(0.2 * scale, 0.8 * scale, 0.4 * scale), m.gold);
    lock.position.set(-2.25 * scale, 0.5 * scale, 0);
    grp.add(lock);

    return grp;
  }

  // Gear 6: Camera Shoulder / Messenger Bag
  function create3DCameraBag(accentHex, scale = 1) {
    const grp = new THREE.Group();
    const m = createSharedMaterials(accentHex);

    // Main Padded Compartment
    const body = new THREE.Mesh(new THREE.BoxGeometry(7.8 * scale, 5.8 * scale, 4.4 * scale), m.body);
    grp.add(body);

    // Front Weather Protective Flap
    const flap = new THREE.Mesh(new THREE.BoxGeometry(8.0 * scale, 4.4 * scale, 1.0 * scale), m.grip);
    flap.position.set(0, 0.6 * scale, 2.4 * scale);
    grp.add(flap);

    // Metal Lock Buckle
    const buckle = new THREE.Mesh(new THREE.BoxGeometry(1.2 * scale, 1.8 * scale, 0.5 * scale), m.accent);
    buckle.position.set(0, -0.8 * scale, 2.95 * scale);
    grp.add(buckle);

    // Arched Top Carry Handle
    const handle = new THREE.Mesh(new THREE.TorusGeometry(1.8 * scale, 0.35 * scale, 8, 24, Math.PI), m.metal);
    handle.position.set(0, 3.0 * scale, 0);
    grp.add(handle);

    // Side Accessory Pockets
    const pLeft = new THREE.Mesh(new THREE.BoxGeometry(0.8 * scale, 3.8 * scale, 3.2 * scale), m.grip);
    pLeft.position.set(-4.2 * scale, -0.2 * scale, 0);
    grp.add(pLeft);

    const pRight = new THREE.Mesh(new THREE.BoxGeometry(0.8 * scale, 3.8 * scale, 3.2 * scale), m.grip);
    pRight.position.set(4.2 * scale, -0.2 * scale, 0);
    grp.add(pRight);

    return grp;
  }

  // Gear 7: Circular Light Reflector
  function create3DReflector(accentHex, scale = 1) {
    const grp = new THREE.Group();
    const m = createSharedMaterials(accentHex);

    // Flexible Outer Spring Steel Ring
    const hoop = new THREE.Mesh(new THREE.TorusGeometry(4.8 * scale, 0.2 * scale, 12, 36), m.body);
    grp.add(hoop);

    // Highly Reflective Metallic Surface
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(4.6 * scale, 4.6 * scale, 0.08 * scale, 36), m.silver);
    disc.rotation.x = Math.PI / 2;
    grp.add(disc);

    // Angled Kickstand Leg
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.16 * scale, 0.16 * scale, 5.4 * scale, 12), m.accent);
    stand.rotation.x = -Math.PI / 5;
    stand.position.set(0, -2.0 * scale, -2.0 * scale);
    grp.add(stand);

    return grp;
  }

  // Gear 8: Studio Softbox Lighting
  function create3DSoftbox(accentHex, scale = 1) {
    const grp = new THREE.Group();
    const m = createSharedMaterials(accentHex);

    // Flared Pyramidal Reflector Hood
    const cone = new THREE.Mesh(new THREE.CylinderGeometry(5.4 * scale, 1.8 * scale, 4.8 * scale, 4), m.body);
    cone.rotation.y = Math.PI / 4;
    cone.rotation.x = Math.PI / 2;
    cone.position.set(0, 3.0 * scale, 1.8 * scale);
    grp.add(cone);

    // Glowing White Diffusion Screen Panel
    const diffuser = new THREE.Mesh(new THREE.BoxGeometry(7.2 * scale, 7.2 * scale, 0.15 * scale), m.diffuser);
    diffuser.position.set(0, 3.0 * scale, 4.25 * scale);
    grp.add(diffuser);

    // Rear Strobe Light Housing
    const strobe = new THREE.Mesh(new THREE.CylinderGeometry(1.2 * scale, 1.2 * scale, 2.0 * scale, 16), m.metal);
    strobe.rotation.x = Math.PI / 2;
    strobe.position.set(0, 3.0 * scale, -1.0 * scale);
    grp.add(strobe);

    // Telescopic Light Stand Mast
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.28 * scale, 0.28 * scale, 8.5 * scale, 12), m.metal);
    mast.position.set(0, -1.5 * scale, -1.0 * scale);
    grp.add(mast);

    return grp;
  }

  // Gear 9: Camera Battery Pack
  function create3DBattery(accentHex, scale = 1) {
    const grp = new THREE.Group();
    const m = createSharedMaterials(accentHex);

    // Battery Main Casing
    const body = new THREE.Mesh(new THREE.BoxGeometry(4.2 * scale, 5.8 * scale, 2.4 * scale), m.body);
    grp.add(body);

    // Terminal Guide Slots
    const notch = new THREE.Mesh(new THREE.BoxGeometry(2.8 * scale, 0.6 * scale, 0.4 * scale), m.metal);
    notch.position.set(0, 2.9 * scale, 0.8 * scale);
    grp.add(notch);

    // Gold Terminal Contacts
    for (let i = -1; i <= 1; i++) {
      const pin = new THREE.Mesh(new THREE.BoxGeometry(0.4 * scale, 0.15 * scale, 0.8 * scale), m.gold);
      pin.position.set(i * 0.8 * scale, 2.95 * scale, -0.4 * scale);
      grp.add(pin);
    }

    // Glowing Lightning Bolt Glyph
    const boltTop = new THREE.Mesh(new THREE.BoxGeometry(0.6 * scale, 1.8 * scale, 0.08 * scale), m.accent);
    boltTop.rotation.z = -Math.PI / 6;
    boltTop.position.set(-0.3 * scale, 0.6 * scale, 1.25 * scale);
    grp.add(boltTop);

    const boltBot = new THREE.Mesh(new THREE.BoxGeometry(0.6 * scale, 1.8 * scale, 0.08 * scale), m.accent);
    boltBot.rotation.z = -Math.PI / 6;
    boltBot.position.set(0.3 * scale, -0.6 * scale, 1.25 * scale);
    grp.add(boltBot);

    return grp;
  }

  // Gear 10: Camera Neck / Shoulder Strap
  function create3DCameraStrap(accentHex, scale = 1) {
    const grp = new THREE.Group();
    const m = createSharedMaterials(accentHex);

    // Curved Woven Strap Band
    const band = new THREE.Mesh(new THREE.TorusGeometry(4.4 * scale, 0.32 * scale, 12, 36, Math.PI * 1.5), m.grip);
    grp.add(band);

    // Leather Shoulder Cushion
    const pad = new THREE.Mesh(new THREE.TorusGeometry(4.45 * scale, 0.5 * scale, 8, 24, Math.PI * 0.7), m.accent);
    grp.add(pad);

    // Quick-Release Buckle Clips
    const clip1 = new THREE.Mesh(new THREE.BoxGeometry(0.8 * scale, 1.2 * scale, 0.6 * scale), m.metal);
    clip1.position.set(4.4 * scale, 0, 0);
    grp.add(clip1);

    const clip2 = new THREE.Mesh(new THREE.BoxGeometry(0.8 * scale, 1.2 * scale, 0.6 * scale), m.metal);
    clip2.position.set(0, -4.4 * scale, 0);
    grp.add(clip2);

    return grp;
  }

  // Instantiate all 10 camera gears from the photo at balanced 3D background coordinates
  const cameraGears = [
    { mesh: create3DCamera(0x38bdf8, 1.0), initPos: [34, 16, -12] },          // 1. DSLR Camera Body
    { mesh: create3DTelephotoLens(0xf59e0b, 0.9), initPos: [-36, -14, -18] },   // 2. Camera Lens
    { mesh: create3DTripod(0x38bdf8, 0.75), initPos: [-44, 18, -26] },         // 3. Tripod
    { mesh: create3DSpeedlight(0xf59e0b, 0.85), initPos: [42, -18, -22] },      // 4. Flash / Speedlight
    { mesh: create3DSDCard(0x818cf8, 0.85), initPos: [20, 28, -20] },          // 5. SD Memory Card
    { mesh: create3DCameraBag(0x38bdf8, 0.85), initPos: [-22, -26, -24] },     // 6. Camera Bag
    { mesh: create3DReflector(0xf59e0b, 0.8), initPos: [48, 4, -28] },         // 7. Light Reflector
    { mesh: create3DSoftbox(0x38bdf8, 0.75), initPos: [-48, 2, -28] },         // 8. Studio Softbox
    { mesh: create3DBattery(0xf59e0b, 0.85), initPos: [10, -28, -18] },         // 9. Camera Battery
    { mesh: create3DCameraStrap(0x818cf8, 0.8), initPos: [-14, 26, -16] }      // 10. Camera Strap
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

    // Rotate geometric wireframe meshes
    wireMesh.rotation.x = elapsedTime * 0.2;
    wireMesh.rotation.y = elapsedTime * 0.3;
    
    torusMesh.rotation.x = -elapsedTime * 0.15;
    torusMesh.rotation.z = elapsedTime * 0.25;

    // 3D Physics Tilt Effects and rotation for All 10 Camera Gears in background
    cameraGears.forEach((item, idx) => {
      const speed = 0.14 + (idx % 4) * 0.04;
      const dir = idx % 2 === 0 ? 1 : -1;
      item.mesh.rotation.x = Math.sin(elapsedTime * speed) * 0.25 + (targetY * 0.02 * dir);
      item.mesh.rotation.y = elapsedTime * (0.16 * dir) + (targetX * 0.02 * dir);
      item.mesh.rotation.z = Math.cos(elapsedTime * speed * 0.8) * 0.12;
      item.mesh.position.y = item.initPos[1] + Math.sin(elapsedTime * 1.2 + idx * 1.2) * 1.5;
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
