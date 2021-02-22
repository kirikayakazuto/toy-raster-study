import { IExample } from "../app"
import MathUtils from "../core/math/math-utils";
import { Vector2 } from "../core/math/vector2";
import { Vector4 } from "../core/math/vector4";
import Raster from "../core/raster"
import { Color } from "../core/shading/color";
import Light from "../core/shading/Light";
import Material from "../core/shading/Material";
import Shader, { FragmentInput, ShaderVarying, VertexInput } from "../core/shading/shader";
import Texture from "../core/shading/texture"
import { Vertex } from "../core/shading/vertex";



/** 三角形 */
export default class DrawTriangle implements IExample {

    
    private renderer:Raster;
    private light: Light;
    private material: Material;
    
    private cameraPos = new Vector4(0, 0, 2.5, 1);
    private fovy = Math.PI / 2;

    public constructor(renderer: Raster) {
        this.renderer = renderer;
        this.init();
    }

    private init() {
        this.setCamera();
        this.renderer.setBackgroundColor(Color.GRAY);

        this.material = new Material(Texture.createTextureFromFile("container2.png"));
        this.material.setSpecular(Texture.createTextureFromFile("container2_specular.png"), 32);

        this.light = new Light(new Vector4(1.2, 1, 2), new Vector4(1, 1, 1, 1).normalize(), Color.WHITE.clone());
        this.light.setDiffuse(this.light.lightColor.clone().multiplyRGB(0.5));
        this.light.setAmbient(this.light.diffuse.clone().multiplyRGB(0.2));
        this.light.setSpecular(Color.WHITE.clone());

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
        vertex.context.varyingVec4Dict[ShaderVarying.WORLD_POS] = vertex.posModel;

        return vertex.context.posProject;
    }

    private fragmentShading(input: FragmentInput) {
        let fragPos = input.varyingVec4Dict[ShaderVarying.WORLD_POS];
        let diffTex = this.material.diffuse.sample(input.varyingVec2Dict[ShaderVarying.UV]);
        let specTex = this.material.specular.sample(input.varyingVec2Dict[ShaderVarying.UV]);

        // 计算环境光照       
        let ambient = Color.multiplyColor(diffTex, this.light.ambient);                                 

        // 计算平行光
        let norm = new Vector4(0, 0, 1, 1).normalize();
        let lightDir = this.light.position.sub(fragPos).normalize();
        let diff = Math.max(this.dot(norm, lightDir), 0);
        let diffuse = Color.multiplyColor(diffTex, this.light.diffuse.clone().multiplyRGB(diff));
        
        // 计算镜面光
        let cameraDir = this.cameraPos.sub(fragPos).normalize();          // 计算摄像机方向
        
        let reflecDir = this.reflecDir(lightDir.mul(-1), norm);
        let spec = Math.pow(Math.max(this.dot(cameraDir, reflecDir), 0), this.material.shininess);
        let specular = Color.multiplyColor(specTex, this.light.specular.clone().multiplyRGB(spec));

        return ambient.addRGB(diffuse).addRGB(specular);
        // return specular;
    }

    private reflecDir(input: Vector4, n: Vector4) {
        return input.sub(n.mul(2).mul(this.dot(input, n)));
    }

    private dot(v1: Vector4, v2: Vector4) {
        v1 = v1.normalize();
        v2 = v2.normalize();
        return (v1.x * v2.x + v1.y * v2.y +v1.z * v2.z) / (Math.sqrt(v1.x * v1.x+v1.y * v1.y+v1.z * v1.z) * Math.sqrt(v2.x * v2.x+v2.y * v2.y+v2.z * v2.z)); 
    }

    public onWheel(delta: number) {
        this.fovy = MathUtils.clamp(this.fovy + (delta > 0 ? 0.05 : -0.05), Math.PI/6, Math.PI*2/3);
        this.setCamera();
    }

}
