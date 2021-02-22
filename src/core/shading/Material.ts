import Texture from "./texture";

export default class Material {
    diffuse: Texture;       // 
    specular: Texture;

    shininess: number;

    constructor(diffuse: Texture) {
        this.diffuse = diffuse;
    }

    setSpecular(specular: Texture, shininess: number) {
        this.specular = specular;
        this.shininess = shininess;
    }
}