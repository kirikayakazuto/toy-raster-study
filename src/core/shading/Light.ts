import { Vector4 } from "../math/vector4";
import { Color } from "./color";

export default class Light {

    position: Vector4;      // 位置
    direction: Vector4;     // 方向
    lightColor: Color;      // 光颜色

    ambient: Color;       // 环境光
    diffuse: Color;       // 灯光
    specular: Color;      // 镜面光
    

    constructor(pos: Vector4, direction: Vector4, lightColor: Color) {
        this.position = pos;
        this.direction = direction;
        this.lightColor = lightColor;
    }

    public setAmbient(ambient: Color) {
        this.ambient = ambient;
    }

    public setDiffuse(diffuse: Color) {
        this.diffuse = diffuse;
    }

    public setSpecular(specular: Color) {
        this.specular = specular;
    }

}