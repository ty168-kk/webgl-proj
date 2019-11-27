import * as Three from "three";
import FPSMonitor from "./FPSMonitor";
import { AnimateObj } from "./AnimateObj";
class Stage extends AnimateObj {
    scene = new Three.Scene();
    taskQueue = [];
    repetitiveTaskQueue = [];
    camera = new Three.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    renderer = new Three.WebGLRenderer();

    // attrs
    attrs = {
        timestamp: -1,
        interval: -1
    };

    constructor() {
        super();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
    }

    start = () => {
        if (this.attrs.timestamp === -1) {
            this.init();
        }
        requestAnimationFrame(this.start);
        this.nextTick();
        this.executeTasks();
        this.renderer.render(this.scene, this.camera);
    };

    addTask = callback => {
        this.taskQueue.push(callback);
    };

    addRepetitiveTask = callback => {
        this.repetitiveTaskQueue.push(callback);
    };

    executeTasks = () => {
        while (this.taskQueue.length > 0) {
            this.taskQueue.shift()(this.attrs.interval);
        }
        this.repetitiveTaskQueue.forEach(task => {
            task(this.attrs.interval);
        });
    };

    nextTick = () => {
        const now = performance.now();
        this.attrs.interval =
            this.attrs.timestamp !== -1 ? now - this.attrs.timestamp : -1;
        this.attrs.timestamp = now;
    };

    init = () => {
        // cube
        this.items.cube = Cube.createObj();
        this.scene.add(this.items.cube.instance);

        // fps monitor
        this.items.FPSMonitor = FPSMonitor.createObj();
        document.body.appendChild(this.items.FPSMonitor.instance);

        this.camera.position.z = 5;
    };
}

class Cube extends AnimateObj {
    constructor() {
        super();
        this.items.geometry = new Three.BoxGeometry(1, 1, 1);
        this.items.material = new Three.MeshBasicMaterial({ color: 0x00ff00 });
        this.instance = new Three.Mesh(
            this.items.geometry,
            this.items.material
        );
    }

    static createObj() {
        return new Cube();
    }

    rotate = interval => {
        this.instance.rotation.x += 0.001 * interval;
        this.instance.rotation.y += 0.001 * interval;
    };
}

const stage = new Stage();
stage.start();

// update cube
stage.addRepetitiveTask(interval => {
    stage.items.cube.rotate(interval);
});

// update fps monitor
stage.addRepetitiveTask(interval => {
    stage.items.FPSMonitor.updateFPS(1000 / interval);
});
