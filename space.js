import * as THREE from 'three';

// Three.js Space Background
class SpaceBackground {
    constructor(containerId) {
        this.containerId = containerId;
        this.canvas = document.getElementById('space-background');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        
        this.stars = [];
        this.planets = [];
        this.particles = [];
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.clock = new THREE.Clock();
        
        this.init();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.5;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Setup camera
        this.camera.position.set(0, 0, 30);

        // Add lights
        const ambientLight = new THREE.AmbientLight(0x111111);
        this.scene.add(ambientLight);

        // Main directional light (sun)
        const sunLight = new THREE.DirectionalLight(0xffffff, 3);
        sunLight.position.set(50, 30, 50);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 500;
        this.scene.add(sunLight);

        // Add rim light for dramatic effect
        const rimLight = new THREE.DirectionalLight(0xff4d00, 2);
        rimLight.position.set(-50, 0, 0);
        this.scene.add(rimLight);

        // Create elements
        this.createStars();
        this.createMars();
        this.createAsteroidBelt();
        this.createInteractiveParticles();
        this.createNebula();
        this.createGalaxy();

        // Event listeners
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('click', (e) => this.onMouseClick(e));
        window.addEventListener('scroll', () => this.onScroll());

        // Start animation
        this.animate();
    }

    createGalaxy() {
        const parameters = {
            count: 100000,
            size: 0.01,
            radius: 50,
            branches: 3,
            spin: 1,
            randomness: 0.2,
            randomnessPower: 3,
            insideColor: 0xff6030,
            outsideColor: 0x1b3984
        };

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(parameters.count * 3);
        const colors = new Float32Array(parameters.count * 3);

        const colorInside = new THREE.Color(parameters.insideColor);
        const colorOutside = new THREE.Color(parameters.outsideColor);

        for(let i = 0; i < parameters.count; i++) {
            const i3 = i * 3;
            const radius = Math.random() * parameters.radius;
            const spinAngle = radius * parameters.spin;
            const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

            const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
            const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
            const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);

            positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
            positions[i3 + 1] = randomY;
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

            const mixedColor = colorInside.clone();
            mixedColor.lerp(colorOutside, radius / parameters.radius);

            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: parameters.size,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });

        const galaxy = new THREE.Points(geometry, material);
        galaxy.position.z = -100;
        this.scene.add(galaxy);
        this.particles.push(galaxy);
    }

    createMars() {
        const marsGeometry = new THREE.SphereGeometry(5, 128, 128);
        
        // Create procedural texture for Mars
        const textureSize = 2048;
        const canvas = document.createElement('canvas');
        canvas.width = textureSize;
        canvas.height = textureSize;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        // Create base color with more realistic gradient
        const gradient = ctx.createRadialGradient(
            textureSize/2, textureSize/2, 0,
            textureSize/2, textureSize/2, textureSize/2
        );
        gradient.addColorStop(0, '#FF6B4A');    // Brighter center
        gradient.addColorStop(0.4, '#E84C1E');  // Mars red
        gradient.addColorStop(0.7, '#C1440E');  // Darker red
        gradient.addColorStop(1, '#8B2703');    // Dark edge

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, textureSize, textureSize);

        // Add detailed noise patterns
        for (let i = 0; i < 5; i++) {
            const imageData = ctx.getImageData(0, 0, textureSize, textureSize);
            const data = imageData.data;
            
            for (let j = 0; j < data.length; j += 4) {
                const noise = (Math.random() - 0.5) * 20;
                const pattern = Math.sin(j/1000) * Math.cos(j/1000) * 20;
                
                data[j] = Math.min(255, Math.max(0, data[j] + noise + pattern));
                data[j+1] = Math.min(255, Math.max(0, data[j+1] + noise + pattern));
                data[j+2] = Math.min(255, Math.max(0, data[j+2] + noise + pattern));
            }
            
            ctx.putImageData(imageData, 0, 0);
        }

        // Create more detailed normal map
        const normalCanvas = document.createElement('canvas');
        normalCanvas.width = textureSize;
        normalCanvas.height = textureSize;
        const normalCtx = normalCanvas.getContext('2d');

        // Create complex surface details
        for (let x = 0; x < textureSize; x += 2) {
            for (let y = 0; y < textureSize; y += 2) {
                const noise1 = Math.sin(x/20) * Math.cos(y/20) * 0.2;
                const noise2 = Math.sin(x/50) * Math.cos(y/50) * 0.3;
                const noise3 = Math.random() * 0.1;
                const height = 0.5 + noise1 + noise2 + noise3;
                
                const r = Math.floor(height * 255);
                const g = Math.floor(height * 255);
                const b = 255;
                normalCtx.fillStyle = `rgb(${r},${g},${b})`;
                normalCtx.fillRect(x, y, 2, 2);
            }
        }

        // Create materials with improved settings
        const marsMaterial = new THREE.MeshStandardMaterial({
            map: new THREE.CanvasTexture(canvas),
            normalMap: new THREE.CanvasTexture(normalCanvas),
            normalScale: new THREE.Vector2(2, 2),
            roughness: 0.8,
            metalness: 0.2,
            roughnessMap: new THREE.CanvasTexture(canvas),
            emissive: 0x330000,
            emissiveIntensity: 0.1
        });

        const mars = new THREE.Mesh(marsGeometry, marsMaterial);
        mars.position.set(-10, 0, -20);
        mars.castShadow = true;
        mars.receiveShadow = true;
        
        this.scene.add(mars);
        this.planets.push(mars);

        // Enhanced atmosphere with more realistic glow
        const atmosphereGeometry = new THREE.SphereGeometry(5.2, 128, 128);
        const atmosphereVertexShader = `
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        const atmosphereFragmentShader = `
            uniform float time;
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
                float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                vec3 atmosphere = vec3(0.8, 0.3, 0.1) * pow(intensity, 1.5);
                float pulse = sin(vPosition.x * 2.0 + vPosition.y * 2.0 + vPosition.z * 2.0 + time) * 0.1 + 0.9;
                gl_FragColor = vec4(atmosphere * pulse, intensity * 0.5);
            }
        `;
        const atmosphereMaterial = new THREE.ShaderMaterial({
            vertexShader: atmosphereVertexShader,
            fragmentShader: atmosphereFragmentShader,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            transparent: true,
            uniforms: {
                time: { value: 0 }
            }
        });
        
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        mars.add(atmosphere);
    }

    createStars() {
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const starsVertices = [];
        for (let i = 0; i < 15000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = -Math.random() * 2000;
            starsVertices.push(x, y, z);
        }

        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
        const starField = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(starField);
        this.stars.push(starField);
    }

    createAsteroidBelt() {
        const asteroidCount = 1000;
        const asteroidGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const asteroidMaterial = new THREE.MeshStandardMaterial({
            color: 0x808080,
            roughness: 0.8,
            metalness: 0.2
        });

        for (let i = 0; i < asteroidCount; i++) {
            const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
            
            // Position in a ring around Mars
            const angle = (i / asteroidCount) * Math.PI * 2;
            const radius = 15 + Math.random() * 5; // Distance from center
            const verticalOffset = (Math.random() - 0.5) * 2; // Vertical variation
            
            asteroid.position.x = Math.cos(angle) * radius - 10;
            asteroid.position.y = verticalOffset;
            asteroid.position.z = Math.sin(angle) * radius - 20;
            
            // Random rotation
            asteroid.rotation.x = Math.random() * Math.PI;
            asteroid.rotation.y = Math.random() * Math.PI;
            asteroid.rotation.z = Math.random() * Math.PI;
            
            // Random scale variation
            const scale = 0.5 + Math.random();
            asteroid.scale.set(scale, scale, scale);
            
            this.scene.add(asteroid);
            this.planets.push(asteroid);
        }
    }

    createInteractiveParticles() {
        const particleCount = 2000;
        const geometry = new THREE.BufferGeometry();
        
        // Create a small circle texture for particles
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.5, 'rgba(128, 128, 128, 0.4)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
        
        const sprite = new THREE.CanvasTexture(canvas);
        
        const material = new THREE.PointsMaterial({
            size: 0.5,
            map: sprite,
            transparent: true,
            opacity: 0.6,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        const color1 = new THREE.Color(0x00ff9d);  // Alien Green
        const color2 = new THREE.Color(0xff4d00);  // Mars Orange
        const color3 = new THREE.Color(0x0066ff);  // Bright Blue

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Create a spiral pattern
            const radius = Math.random() * 30;
            const theta = Math.random() * Math.PI * 2;
            const y = (Math.random() - 0.5) * 20;
            
            positions[i3] = Math.cos(theta) * radius;
            positions[i3 + 1] = y;
            positions[i3 + 2] = Math.sin(theta) * radius;
            
            // Add some randomness to movement
            velocities[i3] = (Math.random() - 0.5) * 0.02;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
            
            // Random size for each particle
            sizes[i] = Math.random() * 0.5 + 0.1;
            
            // Interpolate between three colors based on position
            const mixRatio1 = Math.sin(theta) * 0.5 + 0.5;
            const mixRatio2 = Math.cos(theta) * 0.5 + 0.5;
            
            const tempColor = new THREE.Color();
            tempColor.copy(color1).lerp(color2, mixRatio1).lerp(color3, mixRatio2);
            
            colors[i3] = tempColor.r;
            colors[i3 + 1] = tempColor.g;
            colors[i3 + 2] = tempColor.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        this.particles.push({ 
            mesh: particles, 
            velocities,
            initialPositions: positions.slice(),
            time: 0 
        });
    }

    createNebula() {
        const nebulaParticles = 3000;
        const geometry = new THREE.BufferGeometry();
        
        // Create soft particle texture
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.6)');
        gradient.addColorStop(0.7, 'rgba(128, 128, 128, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
        
        const sprite = new THREE.CanvasTexture(canvas);
        
        const material = new THREE.PointsMaterial({
            size: 2,
            map: sprite,
            transparent: true,
            opacity: 0.6,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const positions = [];
        const colors = [];
        const sizes = [];
        
        const nebulaColors = [
            { r: 1.0, g: 0.3, b: 0.0 }, // Mars Orange
            { r: 0.0, g: 1.0, b: 0.6 }, // Alien Green
            { r: 1.0, g: 0.0, b: 0.3 }  // Neon Pink
        ];

        for (let i = 0; i < nebulaParticles; i++) {
            // Create cloud-like formations
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const r = 20 + Math.random() * 15 + Math.sin(theta * 4) * 5;

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            positions.push(x, y, z);
            
            // Interpolate between colors
            const mixRatio = Math.abs(Math.sin(theta) * Math.cos(phi));
            const colorIndex = Math.floor(mixRatio * nebulaColors.length);
            const nextColorIndex = (colorIndex + 1) % nebulaColors.length;
            const mixFactor = (mixRatio * nebulaColors.length) % 1;
            
            const color1 = nebulaColors[colorIndex];
            const color2 = nebulaColors[nextColorIndex];
            
            // Linear interpolation between colors
            colors.push(
                color1.r + (color2.r - color1.r) * mixFactor,
                color1.g + (color2.g - color1.g) * mixFactor,
                color1.b + (color2.b - color1.b) * mixFactor
            );
            
            sizes.push(Math.random() * 2 + 1);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

        const nebula = new THREE.Points(geometry, material);
        nebula.rotation.x = Math.random() * Math.PI;
        this.scene.add(nebula);
        this.particles.push({
            mesh: nebula,
            time: 0
        });
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Smooth camera movement
        const targetX = this.mouse.x * 5;
        const targetY = this.mouse.y * 5;
        this.camera.position.x += (targetX - this.camera.position.x) * 0.05;
        this.camera.position.y += (targetY - this.camera.position.y) * 0.05;
        
        // Dynamic camera look
        const lookAtTarget = new THREE.Vector3(
            -10 + this.mouse.x * 2,
            this.mouse.y * 2,
            -20
        );
        this.camera.lookAt(lookAtTarget);
    }

    onMouseClick(event) {
        // Convert mouse position to normalized device coordinates (-1 to +1)
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update the picking ray with the camera and mouse position
        this.raycaster.setFromCamera(mouse, this.camera);

        // Calculate intersection point with z-plane at -20
        const planeNormal = new THREE.Vector3(0, 0, 1);
        const planeConstant = -20;
        const plane = new THREE.Plane(planeNormal, planeConstant);
        const intersectionPoint = new THREE.Vector3();
        this.raycaster.ray.intersectPlane(plane, intersectionPoint);

        // Create explosion at intersection point
        this.createExplosion(intersectionPoint.x, intersectionPoint.y, intersectionPoint.z);
    }

    createExplosion(x, y, z) {
        const particleCount = 50;
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.PointsMaterial({
            size: 0.1,
            color: 0xff4d00,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = x;
            positions[i + 1] = y;
            positions[i + 2] = z;

            velocities[i] = (Math.random() - 0.5) * 0.15;
            velocities[i + 1] = (Math.random() - 0.5) * 0.15;
            velocities[i + 2] = (Math.random() - 0.5) * 0.15;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const explosion = new THREE.Points(geometry, material);
        this.scene.add(explosion);

        // Animate explosion
        let time = 0;
        const animate = () => {
            time += 0.15;
            const positions = explosion.geometry.attributes.position.array;

            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += velocities[i];
                positions[i + 1] += velocities[i + 1];
                positions[i + 2] += velocities[i + 2];
            }

            explosion.geometry.attributes.position.needsUpdate = true;
            material.opacity = Math.max(0, 0.8 - time / 1.5);

            if (time < 2) {
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(explosion);
            }
        };

        animate();
    }

    onScroll() {
        const scrolled = window.pageYOffset;
        this.camera.position.z = 30 + scrolled * 0.01;
        this.camera.rotation.x = scrolled * 0.001;
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const elapsedTime = this.clock.getElapsedTime();
        this.scene.traverse((child) => {
            if (child.material && child.material.uniforms && child.material.uniforms.time) {
                child.material.uniforms.time.value = elapsedTime;
            }
        });

        // Rotate Mars
        if (this.planets[0]) {
            this.planets[0].rotation.y = elapsedTime * 0.1;
        }

        // Update atmosphere glow
        if (this.planets[0] && this.planets[0].children[0]) {
            this.planets[0].children[0].material.uniforms.time.value = elapsedTime;
        }

        // Animate particles with natural movement
        this.particles.forEach((particle) => {
            if (particle.mesh && particle.velocities) {
                const positions = particle.mesh.geometry.attributes.position;
                const initialPositions = particle.initialPositions;
                particle.time += 0.005;

                for (let i = 0; i < positions.count; i++) {
                    const i3 = i * 3;
                    const noise1 = Math.sin(particle.time + i * 0.1) * 0.2;
                    const noise2 = Math.cos(particle.time + i * 0.15) * 0.2;
                    const noise3 = Math.sin(particle.time * 0.8 + i * 0.05) * 0.2;

                    positions.array[i3] = initialPositions[i3] + noise1;
                    positions.array[i3 + 1] = initialPositions[i3 + 1] + noise2;
                    positions.array[i3 + 2] = initialPositions[i3 + 2] + noise3;
                }
                
                positions.needsUpdate = true;
            } else if (particle.mesh) {
                // Rotate nebula slowly
                particle.mesh.rotation.y = elapsedTime * 0.05;
                particle.mesh.rotation.x = Math.sin(elapsedTime * 0.1) * 0.2;
            }
        });

        // Render
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Initialize space background
window.addEventListener('DOMContentLoaded', () => {
    new SpaceBackground('space-background');
});
