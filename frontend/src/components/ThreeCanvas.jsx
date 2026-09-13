import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeCanvas = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060814, 0.0018);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 32;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x38bdf8, 0.8);
    scene.add(ambientLight);

    const cyanPointLight = new THREE.PointLight(0x06b6d4, 3, 60);
    cyanPointLight.position.set(15, 12, 10);
    scene.add(cyanPointLight);

    const purplePointLight = new THREE.PointLight(0xa855f7, 3, 60);
    purplePointLight.position.set(-15, -12, 10);
    scene.add(purplePointLight);

    // 5. Central 3D Floating Geometry: Dual Layer Holographic Polyhedron
    // Outer wireframe
    const outerGeo = new THREE.IcosahedronGeometry(7.2, 1);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      wireframe: true,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.75
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    scene.add(outerMesh);

    // Inner translucent faceted crystal core
    const innerGeo = new THREE.IcosahedronGeometry(5.0, 0);
    const innerMat = new THREE.MeshPhysicalMaterial({
      color: 0x818cf8,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.85,
      transmission: 0.6,
      transparent: true,
      opacity: 0.75,
      wireframe: false
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    // Glowing orbiting rings
    const ringGeo = new THREE.TorusGeometry(10.5, 0.08, 16, 120);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.55 });
    const ringMesh1 = new THREE.Mesh(ringGeo, ringMat1);
    ringMesh1.rotation.x = Math.PI / 3;
    scene.add(ringMesh1);

    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.55 });
    const ringMesh2 = new THREE.Mesh(ringGeo, ringMat2);
    ringMesh2.rotation.y = Math.PI / 4;
    scene.add(ringMesh2);

    // 6. Particle Starfield Dust (1,200 dynamic cyber stars)
    const particleCount = 1200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorA = new THREE.Color(0x38bdf8); // Cyan
    const colorB = new THREE.Color(0xa855f7); // Purple
    const colorC = new THREE.Color(0x818cf8); // Indigo

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

      const mixed = Math.random() > 0.5 ? colorA.clone().lerp(colorB, Math.random()) : colorC;
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 7. Interactive 3D Cyber Wave Grid (Flowing beneath hero, audits, and terms)
    const waveCols = 55;
    const waveRows = 40;
    const waveCount = waveCols * waveRows;
    const waveGeo = new THREE.BufferGeometry();
    const wavePos = new Float32Array(waveCount * 3);
    const waveColors = new Float32Array(waveCount * 3);

    const waveColorCyan = new THREE.Color(0x38bdf8);
    const waveColorPurple = new THREE.Color(0xa855f7);

    for (let ix = 0; ix < waveCols; ix++) {
      for (let iz = 0; iz < waveRows; iz++) {
        const i = ix * waveRows + iz;
        const x = (ix - waveCols / 2) * 2.2;
        const z = (iz - waveRows / 2) * 2.0 - 5;
        const y = -14;

        wavePos[i * 3] = x;
        wavePos[i * 3 + 1] = y;
        wavePos[i * 3 + 2] = z;

        const ratio = (ix / waveCols + iz / waveRows) * 0.5;
        const col = waveColorCyan.clone().lerp(waveColorPurple, ratio);
        waveColors[i * 3] = col.r;
        waveColors[i * 3 + 1] = col.g;
        waveColors[i * 3 + 2] = col.b;
      }
    }

    waveGeo.setAttribute('position', new THREE.BufferAttribute(wavePos, 3));
    waveGeo.setAttribute('color', new THREE.BufferAttribute(waveColors, 3));

    const waveMat = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const waveMesh = new THREE.Points(waveGeo, waveMat);
    scene.add(waveMesh);

    // 8. Mouse interaction parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.0008;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.0008;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 8. Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // 9. Animation Loop
    let animId;
    const startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) * 0.001;

      // Smooth camera interpolation toward mouse
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      camera.position.x = targetX * 12;
      camera.position.y = -targetY * 12;
      camera.lookAt(scene.position);

      // Rotate polyhedrons
      outerMesh.rotation.x = elapsed * 0.12;
      outerMesh.rotation.y = elapsed * 0.18;
      outerMesh.position.y = Math.sin(elapsed * 0.8) * 0.8;

      innerMesh.rotation.x = -elapsed * 0.15;
      innerMesh.rotation.z = elapsed * 0.12;
      innerMesh.position.y = Math.sin(elapsed * 0.8) * 0.8;

      // Orbit rings
      ringMesh1.rotation.z = elapsed * 0.1;
      ringMesh2.rotation.z = -elapsed * 0.12;

      // Drift particles gently
      particles.rotation.y = elapsed * 0.03;
      particles.rotation.x = elapsed * 0.015;

      // Animate 3D Cyber Wave Grid with traveling waves + mouse cursor ripple
      const wavePositions = waveGeo.attributes.position.array;
      const mouseWorldX = targetX * 35;
      const mouseWorldZ = targetY * 30;

      for (let ix = 0; ix < waveCols; ix++) {
        for (let iz = 0; iz < waveRows; iz++) {
          const i = ix * waveRows + iz;
          const x = wavePositions[i * 3];
          const z = wavePositions[i * 3 + 2];

          // Dynamic wave equation with cursor ripple
          const distToMouse = Math.hypot(x - mouseWorldX, z - mouseWorldZ);
          const mouseRipple = Math.sin(Math.max(0, 16 - distToMouse) * 0.45) * 2.2;

          const waveHeight =
            Math.sin(x * 0.16 + elapsed * 2.0) * 2.0 +
            Math.cos(z * 0.2 + elapsed * 1.6) * 1.8 +
            mouseRipple;

          wavePositions[i * 3 + 1] = -14 + waveHeight;
        }
      }
      waveGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 10. Clean up
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      outerGeo.dispose();
      outerMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo.dispose();
      ringMat1.dispose();
      ringMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      waveGeo.dispose();
      waveMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
};
