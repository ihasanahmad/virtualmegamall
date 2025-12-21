/* =========================================
   3D MALL EXPERIENCE - Cinematic (Premium Mode)
   ========================================= */

// --- CONFIGURATION ---
const CONFIG = {
    colors: {
        background: 0x050510,
        floor: 0x111111,
        ambient: 0x404040,
        gold: 0xD4AF37,
        selected: 0xffffff
    },
    brands: [
        { name: 'NIKE', color: 0xff4d4d, url: 'store.html?brand=Nike', pos: { x: -10, z: -10 }, rot: Math.PI / 4, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600' },
        { name: 'SAMSUNG', color: 0x4d79ff, url: 'store.html?brand=Samsung', pos: { x: 10, z: -10 }, rot: -Math.PI / 4, img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600' },
        { name: 'KHAADI', color: 0xD4AF37, url: 'store.html?brand=Khaadi', pos: { x: -10, z: 10 }, rot: Math.PI * 0.75, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600' },
        { name: 'ROLEX', color: 0x228b22, url: 'store.html?brand=Rolex', pos: { x: 10, z: 10 }, rot: -Math.PI * 0.75, img: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600' }
    ]
};

// --- GLOBALS ---
let scene, camera, renderer;
let raycaster, mouse;
let interactables = [];
let fontLoader, loadedFont, textureLoader;
let currentTarget = null; // Currently visited store
let isMoving = false; // Is camera tweening?

// --- INITIALIZATION ---
function init() {
    // 1. Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(CONFIG.colors.background);
    scene.fog = new THREE.FogExp2(CONFIG.colors.background, 0.02);

    // 2. Camera (Start High & Far for Overview)
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 30);
    camera.lookAt(0, 0, 0);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // 4. Lighting
    setupLighting();

    // 5. World
    createFloor();
    textureLoader = new THREE.TextureLoader();

    // Load Font & Build Stores
    fontLoader = new THREE.FontLoader();
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
        loadedFont = font;
        createBrandBooths();

        // Hide Loader
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = 0;
            setTimeout(() => loader.remove(), 500);
        }

        // Start Initial Camera Fly-in
        new TWEEN.Tween(camera.position)
            .to({ x: 0, y: 12, z: 25 }, 2000)
            .easing(TWEEN.Easing.Cubic.Out)
            .start();
    });

    // 6. Interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onMouseClick);

    // 7. Loop
    animate();
}

// --- WORLD GENERATION ---
function setupLighting() {
    const ambient = new THREE.AmbientLight(CONFIG.colors.ambient, 0.5);
    scene.add(ambient);

    // Dynamic Chandelier
    const mainLight = new THREE.PointLight(CONFIG.colors.gold, 1, 60);
    mainLight.position.set(0, 20, 0);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024; // Better shadow res
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);

    // Colored accents
    const p1 = new THREE.PointLight(0x00ffff, 0.3, 30);
    p1.position.set(-20, 10, -20);
    scene.add(p1);
    const p2 = new THREE.PointLight(0xff00ff, 0.3, 30);
    p2.position.set(20, 10, 20);
    scene.add(p2);
}

function createFloor() {
    // Reflective Glossy Floor
    const geo = new THREE.PlaneGeometry(100, 100);
    const mat = new THREE.MeshPhysicalMaterial({
        color: 0x0a0a0a,
        metalness: 0.1,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });
    const floor = new THREE.Mesh(geo, mat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Subtle Gold Grid
    const grid = new THREE.GridHelper(100, 40, 0x333333, 0x111111);
    grid.position.y = 0.01;
    scene.add(grid);
}

function createBrandBooths() {
    CONFIG.brands.forEach((brand) => {
        const group = new THREE.Group();
        group.position.set(brand.pos.x, 0, brand.pos.z);

        // Face Center (0,0,0) logic
        group.lookAt(0, 0, 0);

        // 1. Structure (Sleek Black Box)
        const dim = { w: 6, h: 4, d: 5 };
        const boxGeo = new THREE.BoxGeometry(dim.w, dim.h, dim.d);
        const boxMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.2 });
        const box = new THREE.Mesh(boxGeo, boxMat);
        box.position.y = dim.h / 2;
        box.castShadow = true;
        group.add(box);

        // 2. Window Display
        const winGeo = new THREE.PlaneGeometry(4, 3);
        const tex = textureLoader.load(brand.img);
        const winMat = new THREE.MeshBasicMaterial({ map: tex });
        const win = new THREE.Mesh(winGeo, winMat);
        win.position.set(0, 2, dim.d / 2 + 0.1);
        group.add(win);

        // 3. Floating 3D Text
        if (loadedFont) {
            const textGeo = new THREE.TextGeometry(brand.name, {
                font: loadedFont, size: 0.6, height: 0.1
            });
            textGeo.center();
            const textMat = new THREE.MeshStandardMaterial({
                color: brand.color,
                emissive: brand.color,
                emissiveIntensity: 0.5
            });
            const text = new THREE.Mesh(textGeo, textMat);
            text.position.set(0, 4.8, 0);
            text.userData = { isFloating: true, originalY: 4.8 };
            group.add(text);
        }

        // 4. Spotlight
        const spot = new THREE.SpotLight(brand.color, 2, 20, 0.4);
        spot.position.set(0, 8, 5); // In front and up
        spot.target = win;
        group.add(spot);
        scene.add(spot.target); // Needed for spotlight target

        group.userData = {
            name: brand.name,
            url: brand.url,
            // Calculate a camera position in front of this store
            // Vector from center (0,0,0) to store is roughly group.position
            // We want to be slightly "in" from the center relative to the store?
            // Actually, we want to be In front of the store face.
            // Since store looks at 0,0,0, 'front' is +Z in local space.
            // So we want world position of (0, 2, 8) relative to group.
            viewPos: group.localToWorld(new THREE.Vector3(0, 2, 8))
        };

        scene.add(group);
        interactables.push(group);
    });
}

// --- INTERACTION ---
function moveCameraTo(targetPos, lookAtTarget) {
    isMoving = true;

    // Tween Position
    new TWEEN.Tween(camera.position)
        .to({ x: targetPos.x, y: targetPos.y, z: targetPos.z }, 2000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .onComplete(() => { isMoving = false; })
        .start();

    // Tween Rotation (LookAt)
    // We can't tween lookAt directly easily, so we tween a dummy vector
    /*
    const currentLook = new THREE.Vector3(0,0,0); // Assuming currently looking at center
    camera.getWorldDirection(currentLook); 
    // This is complex. Simpler approach:
    // Just use Orbiting/Rotation tween or let camera.lookAt update every frame towards target?
    // Let's use a dummy object for LookAt target
    */

    // Simplified: We assume we always look at the store center (or 0,0,0 if resetting)
    // We will update the OrbitControls target if we were using controls, 
    // but since we aren't, we manually tween the lookAt focus point.

    // We'll just manually use camera.lookAt in loop if needed, 
    // OR just tween orientation (quaternion).

    // EASIEST: Tween the camera to position, and use a 'focusPoint' vector that we also tween.
    new TWEEN.Tween(focusPoint)
        .to({ x: lookAtTarget.x, y: lookAtTarget.y, z: lookAtTarget.z }, 2000)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();
}

let focusPoint = new THREE.Vector3(0, 0, 0); // Where camera looks

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactables, true); // Recursive

    const tooltip = document.getElementById('tooltip');

    if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        // Find parent group
        let obj = intersects[0].object;
        while (obj.parent && obj.parent.type !== 'Scene') { obj = obj.parent; }

        if (obj !== currentTarget) {
            // Slight hover effect could go here (scale up)
        }

        tooltip.style.opacity = 1;
        tooltip.innerHTML = currentTarget === obj ?
            `CLICK TO ENTER <b style="color:${CONFIG.colors.gold}">${obj.userData.name}</b>` :
            `FLY TO <b style="color:${CONFIG.colors.gold}">${obj.userData.name}</b>`;

        tooltip.style.left = (event.clientX + 20) + 'px';
        tooltip.style.top = (event.clientY + 20) + 'px';

    } else {
        document.body.style.cursor = 'default';
        tooltip.style.opacity = 0;
    }
}

function onMouseClick(event) {
    if (isMoving) return;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactables, true);

    if (intersects.length > 0) {
        let obj = intersects[0].object;
        while (obj.parent && obj.parent.type !== 'Scene') { obj = obj.parent; }

        if (currentTarget === obj) {
            // Already here? Enter!
            window.location.href = obj.userData.url;
        } else {
            // Fly to it
            currentTarget = obj;
            // Target pos is stored in userData.viewPos (World coords)
            moveCameraTo(obj.userData.viewPos, obj.position);
        }
    } else {
        // Clicked void? Maybe reset to center?
        currentTarget = null;
        moveCameraTo(new THREE.Vector3(0, 15, 30), new THREE.Vector3(0, 0, 0));
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// --- ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);
    TWEEN.update(); // Update tweens

    const time = Date.now() * 0.001;

    // 1. Idle Camera Motion (if not at a target and not moving)
    if (!currentTarget && !isMoving) {
        camera.position.x = Math.sin(time * 0.1) * 30;
        camera.position.z = Math.cos(time * 0.1) * 30;
        camera.lookAt(0, 0, 0); // Always look center
    }
    // 2. Focused Camera (if at target or moving)
    else {
        camera.lookAt(focusPoint);
    }

    // 3. Floating Text
    scene.children.forEach(child => {
        if (child.userData.name) { // It's a store group
            child.children.forEach(sub => {
                if (sub.userData.isFloating) {
                    sub.position.y = sub.userData.originalY + Math.sin(time * 2) * 0.1;
                }
            });
        }
    });

    renderer.render(scene, camera);
}

// Start
init();
