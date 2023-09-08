import * as THREE from '../build/three.module.js';
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js"
import { GLTFLoader } from "../examples/jsm/loaders/GLTFLoader.js"

class App {
    constructor() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);

        this._renderer = renderer;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        const scene = new THREE.Scene();
        this._scene = scene;

        this._setupCamera();
        this._setupLight();
        this._setupModel();
        this._setupControls();
        this._setupPicking();

        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));
    }

    _setupControls() {
        this._constrols = new OrbitControls(this._camera, this._divContainer);
    }

    _setupModel() {
        const gltfLoader = new GLTFLoader();

        const items = [
            {url: "data/mercedes_benz_sl-65_amg_-_low_poly/scene.gltf"},
            {url: "data/porsche_carrera_gt_-_low_poly/scene.gltf"}
        ];

        items.forEach((item, index) => {
            gltfLoader.load(item.url, (gltf) => {
                const obj3d = gltf.scene;

                const box = new THREE.Box3().setFromObject(obj3d);
                const sizeBox = box.max.z - box.min.z;
                const scale = 1 / sizeBox;
                const tx = (index / (items.length-1)) - 0.5;
                obj3d.scale.set(scale, scale, scale);
                obj3d.position.set(tx, -box.min.y*scale, 0);

                this._scene.add(obj3d);
                obj3d.name = "car";

                // this._scene.add(new THREE.BoxHelper(obj3d));
                // console.log(dumpObject(obj3d).join('\n'));

                obj3d.traverse(child => {
                    child.castShadow = true;
                    // child.receiveShadow = true;
                })
            });
        });

        const boxGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.1, 64);
        const boxMaterial = new THREE.MeshStandardMaterial({
            color: 0x454545, 
            metalness: 0.5,
            roughness: 0.5
        });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.receiveShadow = true;
        box.name = "box";

        box.position.y = -0.05;
        this._scene.add(box);
    }

    // 클릭시 
    _setupPicking() {
        const raycaster = new THREE.Raycaster();
        this._divContainer.addEventListener("dblClick", this._onDblClick.bind(this));
        this._raycaster = raycaster;
    }

    _onDblClick(event) {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        const xy = {
            x: (event.offsetX / width) * 2 - 1,
            y: -(event.offsetY / height) * 2 + 1
        };
        this._raycaster.setFromCamera(xy, this._camera);

        const cars = [];
        this._scene.traverse(obj3d => {
            if(obj3d.name === "car") {
                cars.push(obj3d);
            }
        });

        for(let i = 0; i<cars.length; i++){
            const car = cars[i];
            const targets = this._raycaster.intersectObject(car);
            if(targets.length > 0) {
                // 더블 클릭된 객체(차) 확대 코드
                this._zoomFit(car, 70);
                return;
            }
        }
        // 객체(차)를 클릭한게 아닐 시 무대를 확대하는 코드
        const box = this._scene.getObjectByName("box");
        this._zoomFit(box, 45);
    }

    // 확대하는 코드를 메서드 화
    _zoomFit(object3d, viewAngle) {
        const box = new THREE.Box3().setFromObject(object3d);
        const sizeBox = box.getSize(new THREE.Vector3()).length();
        const centerBox = box.getCenter(new THREE.Vector3());

        const direction = new THREE.Vector3(0, 1, 0);
        direction.applyAxisAngle(new THREE.Vector3(1, 0, 0),
            THREE.MathUtils.degToRad(viewAngle));

        const halfSizeModel = sizeBox * 0.5;
        const halfFov = THREE.MathUtils.degToRad(this._camera.fov * .5);
        const distance = halfSizeModel / MathUtils.tan(halfFov);
        const newPosition = new THREE.Vector3().copy(
            direction.multiplyScalar(distance).add(centerBox)
        );
        this._camera.position.copy(newPosition);
        this._controls.target.copy(centerBox);
    }

    _setupCamera() {
        const camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            100
        );

        camera.position.z = 1.5;
        camera.position.y = 1;
        this._camera = camera;
    }

    _setupLight() {
        const ambientLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4);
        this._scene.add(ambientLight);

        const color = 0xffffff;
        const intensity = 10;

        const light2 = new THREE.DirectionalLight(color, intensity);
        light2.castShadow = true;
        light2.position.set(1, 4, 0);
        light2.shadow.mapSize.width = light2.shadow.mapSize.height = 1024 * 10;
        light2.shadow.radius = 4;
        light2.shadow.bias = 0.0001;
        light2.position.set(-1, 2, 0);
        this._scene.add(light2);
        
    }

    update(time) {
        time *= 0.001; // second unit
        this._constrols.update();
    }

    render(time) {
        this._renderer.render(this._scene, this._camera);   
        this.update(time);

        requestAnimationFrame(this.render.bind(this));
    }

    resize() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
        
        this._renderer.setSize(width, height);
    }
}

window.onload = function () {
    new App();
}