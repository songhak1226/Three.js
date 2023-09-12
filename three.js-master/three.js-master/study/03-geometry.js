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

    _setupControls() { // 마우스로 정육면체를 회전시킴
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
        camera.position.z = 2;
        this._camera = camera;
    }

    _setupLight() {
        const color = 0xffffff;
        const intensity = 5;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this._scene.add(light);
    }

    _setupModel() {
        // const geometry = new THREE.ConeGeometry(0.7, 1, 16, 5, true, 0, Math.PI);
        // const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 10, 8, true, 0, Math.PI);
        // const geometry = new THREE.SphereGeometry(0.7, 32, 12, 0, Math.PI, 0, Math.PI/2);
        // const geometry = new THREE.RingGeometry(0.2, 1, 6, 2, 0, Math.PI);
        // const geometry = new THREE.PlaneGeometry(1.5, 1.3, 2, 2); // 너비에 대한 길이, 높이에 대한 길이, 너비 방향에 대한 분할 수, 높이 방향에 대한 분할 수 
        // const geometry = new THREE.TorusGeometry(1, 0.5, 8, 32, Math.PI);
        const geometry = new THREE.TorusKnotGeometry(0.6,0.2,64, 32)
        const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x515151 });
        const cube = new THREE.Mesh(geometry, fillMaterial);

        const lineMeterial = new THREE.LineBasicMaterial({color: 0xffff00});
        const line = new THREE.LineSegments(
            new THREE.WireframeGeometry(geometry), lineMeterial
        );

        const group = new THREE.Group()
        group.add(cube);
        group.add(line);

        this._scene.add(group);
        this._cube = group;
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

    update(time) { // 정육면체가 자동으로 회전하는 코드
        time *= 0.001; // second unit
        // this._cube.rotation.x = time;
        // this._cube.rotation.y = time;
    }
}

window.onload = function () {
    new App();
}