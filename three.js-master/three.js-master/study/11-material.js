import * as THREE from '../build/three.module.js';
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js"
import { VertexNormalsHelper } from "../examples/jsm/helpers/VertexNormalsHelper.js" // 법선 벡터를 시각화 하기 위해 import

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
        this._scene.add(camera); // 카메라를 씬의 자식으로 추가해서 광원이동 하기위함
    }

    _setupLight() {

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this._scene.add(ambientLight); // aoMap이 적용되기 위해 코드 추가

        const color = 0xffffff;
        const intensity = 3;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        //this._scene.add(light);
        this._camera.add(light) // 광원을 카메라의 자식으로 추가해서 카메라가 움직이면 광원도 따라 움직임
    }

    _setupModel() {
        const textureLoader = new THREE.TextureLoader();
        const map = textureLoader.load("images/glass/Glass_window_002_basecolor.jpg");
        const mapAO = textureLoader.load("images/glass/Glass_window_002_ambientOcclusion.jpg");
        const mapHeight = textureLoader.load("images/glass/Glass_window_002_height.png");
        const mapNormal = textureLoader.load("images/glass/Glass_window_002_normal.jpg");
        const mapRoughness = textureLoader.load("images/glass/Glass_window_002_roughness.jpg");
        const mapMetalic = textureLoader.load("images/glass/Glass_window_002_metallic.jpg");
        const mapAlpha = textureLoader.load("images/glass/Glass_window_002_opacity.jpg");
        const mapLight = textureLoader.load("images/glass/light.jpg")


        const material = new THREE.MeshStandardMaterial({
            map: map,

            normalMap: mapNormal, // 법선 벡터를 이미지화해서 저장한것 / 법선 벡터 : mesh의 표면에 대한 수직벡터  - 광원에 대한 영향을 계산하기 위함

            displacementMap: mapHeight,
            displacementScale: 0.2,
            displacementBias: -0.15,

            aoMap: mapAO,
            aoMapIntensity: 1,

            roughnessMap: mapRoughness,
            roughness: 0.5,

            metalnessMap: mapMetalic,
            metalness: 0.7,

            alphaMap: mapAlpha,
            transparent: true, // 투명도 활성화
            side: THREE.DoubleSide, // mesh의 뒷면도 렌더링 되도록

            lightMap: mapLight,
            lightMapIntensity: 20,
        })

        const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1, 256, 256, 256), material);
        box.position.set(-1, 0, 0);
        box.geometry.attributes.uv2 = box.geometry.attributes.uv; // aoMap을 위해 uv2 데이터 지정
        this._scene.add(box);

        

        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.7, 512, 512), material);
        sphere.position.set(1, 0, 0);
        this._scene.add(sphere);

        // 노말 벡터 표시
        // const boxHelper = new VertexNormalsHelper(box, 0.1, 0xffff00);
        // this._scene.add(boxHelper);

        // const sphereHelper = new VertexNormalsHelper(sphere, 0.1, 0xffff00);
        // this._scene.add(sphereHelper);


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