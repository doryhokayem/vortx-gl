import { mat3, vec2 } from "gl-matrix";
import type { NodeMetadata, EdgeMetadata, Combo, FlowConfig, PhantomEdge } from "./types";
export interface HUDAction {
    comboId: string;
    action: "expand" | "edit" | "delete";
}
export interface OverlayRenderParams {
    positions: Float32Array | null;
    nodeCount: number;
    edgeCount: number;
    edgeIndices: Uint32Array | null;
    metadata: Map<number, NodeMetadata>;
    edgeMetadata: Map<string, EdgeMetadata>;
    combos: Map<string, Combo>;
    theme: "dark" | "light";
    zoom: number;
    viewMatrix: mat3;
    selectedNodeIds: Set<number>;
    selectedEdgeId: string | null;
    selectedComboId: string | null;
    hoveredNodeId: number | null;
    lockedNodes: Set<number>;
    hiddenNodes: Set<number>;
    isBoxSelecting: boolean;
    selectionStart: vec2;
    selectionEnd: vec2;
    flow: FlowConfig;
    selectedNodes: Set<number>;
    phantomEdge: PhantomEdge | null;
    edgeIndexToUserIdMap?: Map<string, string>;
}
/**
 * @class OverlayManager
 * @description Manages the high-performance 2D Canvas overlay for the graph.
 * Handles labels, halos, selection marquees, flow animations, and viewport culling.
 * Uses scratch variables and optimized loops to minimize GC impact.
 */
export declare class OverlayManager {
    private canvas;
    private ctx;
    private hudRects;
    /**
     * Cached screen-space positions for the current frame.
     * Format: [x0, y0, x1, y1, ...]
     */
    private projectedCache;
    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D);
    private _posScratch;
    private _spScratch;
    private _s1Scratch;
    private _s2Scratch;
    /**
     * Projects world coordinates to screen space.
     */
    private project;
    /**
     * Helper to get theme-consistent colors for overlay elements.
     */
    private getThemeColor;
    /**
     * Main render call for the overlay. Clears the canvas and draws all
     * visible non-WebGL elements.
     * @param params State parameters from the main engine.
     */
    render(params: OverlayRenderParams): void;
    private drawMarquee;
    private drawCombos;
    private drawGroupHUD;
    pickHUDAction(mouseX: number, mouseY: number): HUDAction | null;
    private drawNodeHighlights;
    private drawEdgeHighlight;
    private drawPhantomEdge;
    private drawFlow;
    private drawHoverHighlight;
    private drawCustomEdges;
    private drawEdgeLabels;
    private drawNodeLabels;
    private drawNodeIcon;
    private drawLockIcon;
}
