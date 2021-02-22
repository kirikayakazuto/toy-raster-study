"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Material {
    constructor(diffuse) {
        this.diffuse = diffuse;
    }
    setSpecular(specular, shininess) {
        this.specular = specular;
        this.shininess = shininess;
    }
}
exports.default = Material;
