import { AnimateObj } from "./AnimateObj";
import * as Three from "three";
export default class FPSMonitor extends AnimateObj {
    fps = -1;
    constructor() {
        super();
        this.instance = document.createElement("text");
        const style = this.instance.style;
        style.color = "white";
        style.fontSize = "30px";
        style.zIndex = "100";
        style.position = "fixed";
        style.top = "10px";
        style.left = "10px";
    }

    static createObj = () => {
        return new FPSMonitor();
    };

    updateFPS = fps => {
        if (Math.abs(fps - this.fps) > 10) {
            this.instance.innerText = "FPS: " + fps.toFixed(0);
            this.fps = fps;
        }
    };
}
