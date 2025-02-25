
import * as THREE from "three";

// // Setup scene, camera, and renderer
// const scene = new THREE.Scene();
// const camera = new THREE.OrthographicCamera(
//   0,
//   window.innerWidth,
//   window.innerHeight,
//   0,
//   -10,
//   10
// );
// const renderer = new THREE.WebGLRenderer({ alpha: true }); // alpha: true for transparent background
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setClearColor(0x000000, 0); // Transparent background
// document.body.appendChild(renderer.domElement);

// // Style the canvas to overlay the page
// renderer.domElement.style.position = "fixed";
// renderer.domElement.style.top = "0";
// renderer.domElement.style.left = "0";
// renderer.domElement.style.pointerEvents = "none"; // Prevents canvas from blocking mouse events

// // Create the circular cursor
// const radius = 20; // Size of the cursor
// const segments = 32; // Number of segments for smoothness
// const geometry = new THREE.CircleGeometry(radius, segments);
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color for attractiveness
// const cursor = new THREE.Mesh(geometry, material);
// scene.add(cursor);

// // Handle mouse movement
// window.addEventListener("mousemove", onMouseMove, false);
// function onMouseMove(event) {
//   const mouseX = event.clientX;
//   const mouseY = event.clientY;
//   cursor.position.x = mouseX;
//   cursor.position.y = window.innerHeight - mouseY; // Invert y-axis to match screen coordinates
//   cursor.position.z = 0; // Keep it at z=0
// }

// // Handle window resizing
// window.addEventListener("resize", onWindowResize, false);
// function onWindowResize() {
//   camera.left = 0;
//   camera.right = window.innerWidth;
//   camera.top = window.innerHeight;
//   camera.bottom = 0;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// }

// // Animation loop
// function animate() {
//   requestAnimationFrame(animate);
//   renderer.render(scene, camera);
// }
// animate();





// Setup scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(0, window.innerWidth, window.innerHeight, 0, -10, 10);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x00ffff, 0);
document.body.appendChild(renderer.domElement);
renderer.domElement.style.position = 'fixed';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.pointerEvents = 'none';

// Glowing core
const coreGeometry = new THREE.DodecahedronGeometry(12, 0);
const coreMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.5 });
const core = new THREE.Mesh(coreGeometry, coreMaterial);
scene.add(core);

// Movement variables
// let lastX = 0;
// let velocity = 0;

// Mouse movement
window.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    core.position.set(mouseX, window.innerHeight - mouseY, 0);

    // velocity = mouseX - lastX;
    // lastX = mouseX;
});

// Window resize
window.addEventListener('resize', () => {
    camera.right = window.innerWidth;
    camera.top = window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Core rotation for 3D effect
    core.rotation.x += 0.02;
    core.rotation.y += 0.02;

    renderer.render(scene, camera);
}
animate();
// import { useFluid } from "@funtech-inc/use-shader-fx";