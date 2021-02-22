"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Light {
    constructor(pos, direction, lightColor) {
        this.position = pos;
        this.direction = direction;
        this.lightColor = lightColor;
    }
    setAmbient(ambient) {
        this.ambient = ambient;
    }
    setDiffuse(diffuse) {
        this.diffuse = diffuse;
    }
    setSpecular(specular) {
        this.specular = specular;
    }
}
exports.default = Light;
