import { IExample } from "../app"
import MathUtils from "../core/math/math-utils";
import { Vector2 } from "../core/math/vector2";
import { Vector4 } from "../core/math/vector4";
import Raster from "../core/raster"
import { Color } from "../core/shading/color";
import Shader, { FragmentInput, ShaderVarying, VertexInput } from "../core/shading/shader";
import Texture from "../core/shading/texture"
import { Vertex } from "../core/shading/vertex";

/** 三角形 */
export default class DrawTriangle implements IExample {

    
    private renderer:Raster;
    private texture:Texture;                // 
    private textureSpecular: Texture;       //
    

    private cameraPos = new Vector4(0, 0, 2.5, 1);
    private fovy = Math.PI / 2;

    public constructor(renderer: Raster) {
        this.renderer = renderer;
        this.init();
    }

    private init() {
        this.setCamera();
        this.renderer.setBackgroundColor(Color.GRAY);

        this.texture = Texture.createTextureFromFile("container2.png");
        this.textureSpecular = Texture.createTextureFromFile("container2_specular.png");

        let shader = new Shader({
            vertexShading: this.vertexShading.bind(this),
            fragmentShading: this.fragmentShading.bind(this)
        });

        this.renderer.setShader(shader);
    }

    private setCamera() {
        let at = new Vector4(0, 0, 0, 1);
        let up = new Vector4(0, 1, 0, 1);
        let aspect = this.renderer.width / this.renderer.height;
        let near = 1, far = 500;
        this.renderer.setCamera(this.cameraPos, at, up, this.fovy, aspect, near, far);
    }
    
    public draw() {
        let vertexs: Array<Vertex> = [
            {
                posModel: new Vector4(-1, -1, 1),
                color: Color.WHITE,
                uv: new Vector2(0, 0)
            },
            {
                posModel: new Vector4(1, -1, 1),
                color: Color.WHITE,
                uv: new Vector2(1, 0)
            },
            {
                posModel: new Vector4(1, 1, 1),
                color: Color.WHITE,
                uv: new Vector2(1, 1)
            },
            {
                posModel: new Vector4(-1, 1, 1),
                color: Color.WHITE,
                uv: new Vector2(0, 1)
            }
        ];
        this.renderer.drawTriangle([
            vertexs[0], vertexs[1], vertexs[2]
        ]);
        this.renderer.drawTriangle([
            vertexs[0], vertexs[2], vertexs[3]
        ]);
    }

    private vertexShading(vertex: Vertex, input: VertexInput) {
        vertex.posModel.transform(input.viewProject, vertex.context.posProject);
        vertex.context.varyingVec2Dict[ShaderVarying.UV] = vertex.uv;
        return vertex.context.posProject;
    }
    private fragmentShading(input: FragmentInput) {
        let tex = this.texture.sample(input.varyingVec2Dict[ShaderVarying.UV]);
        return Color.multiplyColor(tex, input.color, tex);
    }

    public onWheel(delta: number) {
        this.fovy = MathUtils.clamp(this.fovy + (delta > 0 ? 0.05 : -0.05), Math.PI/6, Math.PI*2/3);
        this.setCamera();
    }

}
