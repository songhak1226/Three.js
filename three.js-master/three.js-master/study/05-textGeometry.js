import * as THREE from '../build/three.module.js';
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js"
import { FontLoader } from "../examples/jsm/loaders/FontLoader.js"
import { TextGeometry } from "../examples/jsm/geometries/TextGeometry.js"

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
        camera.position.x = -10;
        camera.position.z = 10;
        this._camera = camera;
    }

    _setupLight() {
        const color = 0xffffff;
        const intensity = 15;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this._scene.add(light);
    }

    _setupModel() {
        const fontLoader = new FontLoader();
        async function loadFont(that) {
            const url = "../examples/fonts/helvetiker_regular.typeface.json";
            const font = await new Promise((resolve, reject) => {
                fontLoader.load(url, resolve, undefined, reject);
            });

            const geometry = new TextGeometry("GIS", {
                font: font,
                size: 5,
                height: 1.5,
                curveSegments: 4,
                bevelEnabled: true,
                bevelThickness: 0.7,
                bevelSize: .7,
                bevelSegments: 2
            })
            const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x515151 });
            const cube = new THREE.Mesh(geometry, fillMaterial);

            const lineMeterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
            const line = new THREE.LineSegments(
                new THREE.WireframeGeometry(geometry), lineMeterial
            );

            const group = new THREE.Group()
            group.add(cube);
            group.add(line);

            that._scene.add(group);
            that._cube = group;
        };
        loadFont(this);

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