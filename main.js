import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Featured model viewer
function initFeaturedModel() {
    // Get container
    const container = document.getElementById('featured-model');
    if (!container) return;
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1b26);
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
        45, 
        container.clientWidth / container.clientHeight, 
        0.1, 
        1000
    );
    camera.position.set(0, 1.5, 4);
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 2, 3);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Load the model (using the first project's model)
    const modelPath = projects[0].modelPath;
    const loader = new GLTFLoader();
    
    // Add loading indication
    const loadingElem = document.createElement('div');
    loadingElem.style.position = 'absolute';
    loadingElem.style.top = '50%';
    loadingElem.style.left = '50%';
    loadingElem.style.transform = 'translate(-50%, -50%)';
    loadingElem.style.color = 'white';
    loadingElem.textContent = 'Loading model...';
    container.appendChild(loadingElem);
    
    loader.load(
        modelPath,
        (gltf) => {
            // Remove loading text
            container.removeChild(loadingElem);
            
            // Center model
            const box = new THREE.Box3().setFromObject(gltf.scene);
            const center = box.getCenter(new THREE.Vector3());
            
            gltf.scene.position.x = -center.x;
            gltf.scene.position.y = -center.y;
            gltf.scene.position.z = -center.z;
            
            scene.add(gltf.scene);
            
            // Add subtle rotation animation
            const rotationSpeed = 0.001;
            function animateModel() {
                gltf.scene.rotation.y += rotationSpeed;
            }
            
            // Update animation loop
            function animate() {
                requestAnimationFrame(animate);
                controls.update();
                animateModel();
                renderer.render(scene, camera);
            }
            
            animate();
        },
        (xhr) => {
            const percent = (xhr.loaded / xhr.total) * 100;
            loadingElem.textContent = `Loading: ${Math.round(percent)}%`;
        },
        (error) => {
            console.error('Error loading model:', error);
            loadingElem.textContent = 'Error loading model';
        }
    );
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// Create project cards
function createProjectCards() {
    const container = document.querySelector('.project-grid');
    if (!container) return;
    
    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.dataset.id = project.id;
        
        card.innerHTML = `
            <img class="project-thumbnail" src="${project.thumbnail}" alt="${project.title}">
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        
        // Add click event to open project detail
        card.addEventListener('click', () => {
            window.location.href = `project.html?id=${project.id}`;
        });
        
        container.appendChild(card);
    });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initFeaturedModel();
    createProjectCards();
});