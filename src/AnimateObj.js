export class AnimateObj {
    instance = {};
    items = {};
    static createObj(config) {}

    addObj = (id, obj) => {
        this.items[id] = obj;
    };
}
