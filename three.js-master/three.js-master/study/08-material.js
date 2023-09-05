import * as THREE from '../build/three.module.js';
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js"

class App {
    constructor() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);
        this._renderer = renderer;

        const scene = new THREE.Scene();
        this._scene = scene;

        this._setupCamera();
        this._setupLight();
        this._setupModel();
        this._setupControls();

        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));

    }

    _setupControls() {
        new OrbitControls(this._camera, this._divContainer);
    }

    _setupCamera() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            100
        );
        camera.position.z = 3;
        this._camera = camera;
    }

    _setupLight() {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this._scene.add(light);
    }

    _setupModel() {
        // MeshBasicMaterial 예제
        // const material = new THREE.MeshBasicMaterial({
        //     visible: true,
        //     transparent: true,
        //     opacity: 0.5,
        //     depthTest: true,
        //     deptWrite: true,
        //     side: THREE.DoubleSide,
        //     color: 0xffff00,
        //     wireframe: false
        // });

        // MeshLambertMaterial 예제
        // const material = new THREE.MeshLambertMaterial({
        //     transparent: true,
        //     opacity: 0.6,
        //     side: THREE.DoubleSide,
        //     color: 0xff00ff,
        //     emissive: 0x555500,
        //     wireframe: false
        // })

        const material = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            emissive: 0x000000,
            specular: 0xffff00,
            shininess: 10,
            flatShading: true,
            wireframe: false
        })

        const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
        box.position.set(-1, 0, 0);
        this._scene.add(box);

        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), material);
        sphere.position.set(1, 0, 0);
        this._scene.add(sphere);
    }

    resize() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }

    render(time) {
        this._renderer.render(this._scene, this._camera);
        this.update(time);
        requestAnimationFrame(this.render.bind(this));
    }

    update(time) {
        time *= 0.001; // second unit
    }
}

window.onload = function () {
    new App();
}