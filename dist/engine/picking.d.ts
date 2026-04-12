import { mat3 } from "gl-matrix";
import type { Combo } from "./types";
export declare class PickingEngine {
    private gl;
    constructor(gl: WebGL2RenderingContext);
    pickNode(params: {
        mouseX: number;
        mouseY: number;
        canvas: HTMLCanvasElement;
        program: WebGLProgram;
        pickingFramebuffer: WebGLFramebuffer;
        vao: WebGLVertexArrayObject;
        viewMatrix: mat3;
        pointSize: number;
        nodeCount: number;
    }): number | null;
    pickEdge(params: {
        mouseX: number;
        mouseY: number;
        edgeIndices: Uint32Array | null;
        positions: Float32Array | null;
        nodeCount: number;
        viewMatrix: mat3;
        canvasW: number;
        canvasH: number;
    }): string | null;
    pickCombo(params: {
        mouseX: number;
        mouseY: number;
        combos: Map<string, Combo>;
        positions: Float32Array | null;
        nodeCount: number;
        viewMatrix: mat3;
        zoom: number;
        canvasW: number;
        canvasH: number;
    }): string | null;
    private distToSegment;
    private project;
}
