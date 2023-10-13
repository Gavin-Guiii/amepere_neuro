import * as THREE from 'three';
import { STLLoader } from 'stl-loader';
import { OrbitControls } from 'orbit-control';

export default function loadSTLModel(stlFiles) {
    const container = document.getElementById('threejs-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 300;


    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);  // Adjust size to fit the grid item.
    renderer.setClearColor(0xeeeeee); // Set a light grey background color


    container.appendChild(renderer.domElement);


    const controls = new OrbitControls(camera, renderer.domElement);

    // Add an ambient light and a directional light
    scene.add(new THREE.AmbientLight(0x999999));
    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(10, 10, 10);
    scene.add(light);

    const loader = new STLLoader();

    stlFiles.forEach(fileName => {
        console.log(fileName);
        loader.load(
            `/static/STLs/${fileName}`,
            function (geometry) {
                console.log("STL Loaded");
                const material = new THREE.MeshNormalMaterial();
                const mesh = new THREE.Mesh(geometry, material);
                scene.add(mesh);
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
            },
            (error) => {
                console.error("An error occurred:", error);
            }
        );

    })

    window.onresize = function () {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    render();
}