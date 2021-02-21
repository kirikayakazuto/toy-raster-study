"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vector2_1 = require("../core/math/vector2");
const vector4_1 = require("../core/math/vector4");
const color_1 = require("../core/shading/color");
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
        this.texture = texture_1.default.createTextureFromFile("container2.png");
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
            }
        ];
        this.renderer.drawTriangle(vertexs);
    }
    vertexShading(vertex, input) {
        vertex.posModel.transform(input.viewProject, vertex.context.posProject);
        vertex.context.varyingVec2Dict[shader_1.ShaderVarying.UV] = vertex.uv;
        return vertex.context.posProject;
    }
    fragmentShading(input) {
        let tex = this.texture.sample(input.varyingVec2Dict[shader_1.ShaderVarying.UV]);
        return color_1.Color.multiplyColor(tex, input.color, tex);
    }
}
exports.default = DrawTriangle;
