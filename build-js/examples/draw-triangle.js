"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const math_utils_1 = require("../core/math/math-utils");
const vector2_1 = require("../core/math/vector2");
const vector4_1 = require("../core/math/vector4");
const color_1 = require("../core/shading/color");
const Light_1 = require("../core/shading/Light");
const Material_1 = require("../core/shading/Material");
const shader_1 = require("../core/shading/shader");
const texture_1 = require("../core/shading/texture");
class DrawTriangle {
    constructor(renderer) {
        this.cameraPos = new vector4_1.Vector4(0, 0, 2.5, 1);
        this.fovy = Math.PI / 2;
        this.renderer = renderer;
        this.init();
    }
    init() {
        this.setCamera();
        this.renderer.setBackgroundColor(color_1.Color.GRAY);
        this.material = new Material_1.default(texture_1.default.createTextureFromFile("container2.png"));
        this.material.setSpecular(texture_1.default.createTextureFromFile("container2_specular.png"), 32);
        this.light = new Light_1.default(new vector4_1.Vector4(1.2, 1, 2), new vector4_1.Vector4(1, 1, 1, 1).normalize(), color_1.Color.WHITE.clone());
        this.light.setDiffuse(this.light.lightColor.clone().multiplyRGB(0.5));
        this.light.setAmbient(this.light.diffuse.clone().multiplyRGB(0.2));
        this.light.setSpecular(color_1.Color.WHITE.clone());
        let shader = new shader_1.default({
            vertexShading: this.vertexShading.bind(this),
            fragmentShading: this.fragmentShading.bind(this)
        });
        this.renderer.setShader(shader);
    }
    setCamera() {
        let at = new vector4_1.Vector4(0, 0, 0, 1);
        let up = new vector4_1.Vector4(0, 1, 0, 1);
        let aspect = this.renderer.width / this.renderer.height;
        let near = 1, far = 500;
        this.renderer.setCamera(this.cameraPos, at, up, this.fovy, aspect, near, far);
    }
    draw() {
        let vertexs = [
            {
                posModel: new vector4_1.Vector4(-1, -1, 1),
                color: color_1.Color.WHITE,
                uv: new vector2_1.Vector2(0, 0)
            },
            {
                posModel: new vector4_1.Vector4(1, -1, 1),
                color: color_1.Color.WHITE,
                uv: new vector2_1.Vector2(1, 0)
            },
            {
                posModel: new vector4_1.Vector4(1, 1, 1),
                color: color_1.Color.WHITE,
                uv: new vector2_1.Vector2(1, 1)
            },
            {
                posModel: new vector4_1.Vector4(-1, 1, 1),
                color: color_1.Color.WHITE,
                uv: new vector2_1.Vector2(0, 1)
            }
        ];
        this.renderer.drawTriangle([
            vertexs[0], vertexs[1], vertexs[2]
        ]);
        this.renderer.drawTriangle([
            vertexs[0], vertexs[2], vertexs[3]
        ]);
    }
    vertexShading(vertex, input) {
        vertex.posModel.transform(input.viewProject, vertex.context.posProject);
        vertex.context.varyingVec2Dict[shader_1.ShaderVarying.UV] = vertex.uv;
        vertex.context.varyingVec4Dict[shader_1.ShaderVarying.WORLD_POS] = vertex.posModel;
        return vertex.context.posProject;
    }
    fragmentShading(input) {
        let fragPos = input.varyingVec4Dict[shader_1.ShaderVarying.WORLD_POS];
        let diffTex = this.material.diffuse.sample(input.varyingVec2Dict[shader_1.ShaderVarying.UV]);
        let specTex = this.material.specular.sample(input.varyingVec2Dict[shader_1.ShaderVarying.UV]);
        let ambient = color_1.Color.multiplyColor(diffTex, this.light.ambient);
        let norm = new vector4_1.Vector4(0, 0, 1, 1).normalize();
        let lightDir = this.light.position.sub(fragPos).normalize();
        let diff = Math.max(this.dot(norm, lightDir), 0);
        let diffuse = color_1.Color.multiplyColor(diffTex, this.light.diffuse.clone().multiplyRGB(diff));
        let cameraDir = this.cameraPos.sub(fragPos).normalize();
        let reflecDir = this.reflecDir(lightDir.mul(-1), norm);
        let spec = Math.pow(Math.max(this.dot(cameraDir, reflecDir), 0), this.material.shininess);
        let specular = color_1.Color.multiplyColor(specTex, this.light.specular.clone().multiplyRGB(spec));
        return ambient.addRGB(diffuse).addRGB(specular);
    }
    reflecDir(input, n) {
        return input.sub(n.mul(2).mul(this.dot(input, n)));
    }
    dot(v1, v2) {
        v1 = v1.normalize();
        v2 = v2.normalize();
        return (v1.x * v2.x + v1.y * v2.y + v1.z * v2.z) / (Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z) * Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z));
    }
    onWheel(delta) {
        this.fovy = math_utils_1.default.clamp(this.fovy + (delta > 0 ? 0.05 : -0.05), Math.PI / 6, Math.PI * 2 / 3);
        this.setCamera();
    }
}
exports.default = DrawTriangle;
