import { vec2 } from "gl-matrix";
import type { NodeMetadata, EdgeMetadata, Combo, InteractionState, NodeInput, EdgeInput, NodeData, EdgeData, Stylesheet, RadialMenuItem, FlowConfig } from "./types";
export type { NodeMetadata, EdgeMetadata, Combo };
/**
 * @class GraphEngine
 * @description The main orchestrator for the WebGL graph visualization.
 * It manages hardware-accelerated rendering of nodes/edges and coordinates with
 * the PickingEngine for interaction and OverlayManager for UI elements.
 *
 * Supports incremental graph mutation (add/remove/update), a typed event system,
 * element state (lock, hide, color), and is compatible with Cytoscape.js workflows.
 */
export declare class GraphEngine {
    private gl;
    private pickingEngine;
    private overlayManager;
    private emitter;
    private program;
    private edgeProgram;
    private viewMatrix;
    private vao;
    private edgeVao;
    private positionBuffer;
    private colorBuffer;
    private idBuffer;
    private edgeIndexBuffer;
    private pickingFramebuffer;
    private pickingTexture;
    private uMatrixLoc;
    private uPointSizeLoc;
    private uPickingModeLoc;
    private uEdgeMatrixLoc;
    private uEdgeColorLoc;
    private nodeCount;
    private edgeCount;
    private positions;
    private metadata;
    private edgeIndices;
    private edgeMetadata;
    private combos;
    private theme;
    private static readonly MAX_ZOOM;
    private static readonly MIN_ZOOM;
    /** CPU-side per-node RGBA colors kept in sync with GPU colorBuffer. */
    private colorData;
    /** CPU-side per-node float IDs (= internal buffer index). */
    private idData;
    /** Current allocated GPU buffer capacity (in nodes). */
    private capacity;
    private autoNodeId;
    private autoEdgeId;
    /** User-facing string/number ID → internal buffer index */
    private nodeIdMap;
    /** Internal buffer index → user-facing ID */
    private reverseIdMap;
    /** The authoritative edge list used for mutation and CPU-side operations. */
    private edgeList;
    /** User edge ID → index in edgeList */
    private edgeIdMap;
    /** Internal "u-v" pick key → user edge ID, for translating GPU pick results. */
    private edgeIndexToUserIdMap;
    private stylesheet;
    private lockedNodes;
    private hiddenNodes;
    private hiddenEdges;
    private state;
    private dragOffsets;
    private canvas;
    private overlayCanvas;
    /**
     * Sets a temporary "phantom" edge from a source node to a world position.
     * Used for visual feedback during relation creation.
     */
    setPhantomEdge(sourceNodeId: number, x: number, y: number): void;
    /** Removes the temporary phantom edge. */
    clearPhantomEdge(): void;
    /**
     * Initializes the engine with the provided canvases.
     * @param canvas The WebGL canvas for node/edge rendering.
     * @param overlayCanvas The 2D canvas for labels and HUD elements.
     */
    constructor(canvas: HTMLCanvasElement, overlayCanvas: HTMLCanvasElement);
    /**
     * Subscribe to a graph event.
     * @param event Event name — see the Events Reference in the docs.
     * @param handler Callback invoked with event-specific data.
     * @returns An unsubscribe function for cleanup.
     *
     * @example
     * const unsub = engine.on('node:click', ({ id }) => console.log('Clicked:', id));
     * // Cleanup later:
     * unsub();
     *
     * @events
     * | Event | Payload |
     * |---|---|
     * | `node:add` | `{ id, index, position }` |
     * | `node:remove` | `{ id }` |
     * | `node:click` | `{ id, index }` |
     * | `node:hover` | `{ id, index }` |
     * | `node:hoverout` | `{}` |
     * | `node:drag` | `{ id, index, x, y }` |
     * | `node:select` | `{ id, index }` |
     * | `nodes:select` | `{ ids[], indices[] }` |
     * | `edge:add` | `{ id, source, target }` |
     * | `edge:remove` | `{ id }` |
     * | `edge:select` | `{ id }` |
     * | `combo:select` | `{ id }` |
     * | `graph:click` | `{ x, y }` |
     * | `graph:pan` | `{ dx, dy, offset }` |
     * | `graph:zoom` | `{ zoom }` |
     * | `graph:clear` | `{}` |
     */
    on<T = unknown>(event: string, handler: (data: T) => void): () => void;
    /**
     * Remove a previously registered event listener.
     * @param event Event name.
     * @param handler The exact handler reference passed to `on()`.
     */
    off<T = unknown>(event: string, handler: (data: T) => void): void;
    /**
     * @internal Called by InteractionManager to fire events through the engine's emitter.
     */
    emitEvent<T = unknown>(event: string, data?: T): void;
    /**
     * Sets the global stylesheet for the graph.
     * Elements with matching 'classes' will inherit styles from this sheet.
     */
    setStylesheet(sheet: Stylesheet): void;
    /**
     * Merges styles from multiple class names based on the current stylesheet.
     */
    private resolveStyle;
    /**
     * Adds a single node to the live graph. GPU buffers are updated immediately.
     * @param input Node configuration object.
     * @returns The node's ID (user-provided or auto-generated).
     * @fires `node:add`
     *
     * @example
     * const id = engine.addNode({
     *   id: 'alice',
     *   label: 'Alice',
     *   position: { x: 0.5, y: -0.3 },
     *   color: '#6bcb77',
     * });
     */
    addNode(input: NodeInput): string | number;
    /**
     * Updates an existing node's visual properties or data.
     * @param input Node configuration containing the ID to update and new values.
     */
    updateNode(input: NodeInput): void;
    /**
     * Removes a node (and all its connected edges) from the graph.
     *
     * Uses a **swap-with-last** strategy so GPU buffer updates are O(1) —
     * the removed slot is overwritten by the last node, keeping the buffer compact.
     *
     * @param nodeId The user-facing node ID.
     * @fires `node:remove`
     *
     * @example
     * engine.removeNode('alice');
     */
    removeNode(nodeId: string | number): void;
    /**
     * Adds an edge between two existing nodes.
     * @param input Edge configuration.
     * @returns The edge's ID (user-provided or auto-generated).
     * @fires `edge:add`
     *
     * @example
     * engine.addEdge({ source: 'alice', target: 'bob', label: 'knows' });
     */
    addEdge(input: EdgeInput): string;
    /**
     * Updates metadata or properties of an existing edge.
     */
    updateEdge(input: EdgeInput): void;
    /**
     * Removes an edge by its user-facing ID.
     * @param edgeId The edge ID returned by `addEdge()` or set in `EdgeInput.id`.
     * @fires `edge:remove`
     *
     * @example
     * engine.removeEdge('my-edge-id');
     */
    removeEdge(edgeId: string): void;
    /**
     * Removes all nodes and edges from the graph and resets all state.
     * @fires `graph:clear`
     *
     * @example
     * engine.clear();
     */
    clear(): void;
    /**
     * Returns all nodes as plain data objects (not GPU references).
     * @example
     * const nodes = engine.getAllNodes();
     * nodes.forEach(n => console.log(n.id, n.position));
     */
    getAllNodes(): NodeData[];
    /**
     * Returns all edges as plain data objects.
     * @example
     * engine.getAllEdges().forEach(e => console.log(e.source, '→', e.target));
     */
    getAllEdges(): EdgeData[];
    /**
     * Returns all nodes that have the specified class applied.
     */
    getNodesByClass(className: string): NodeData[];
    /**
     * Returns all edges that have the specified class applied.
     */
    getEdgesByClass(className: string): EdgeData[];
    /**
     * Returns a single node by its user-facing ID.
     */
    getNode(nodeId: string | number): NodeData | null;
    /**
     * Returns the internal GPU buffer index for a node, or `null` if not found.
     */
    getInternalIndex(nodeId: string | number): number | null;
    /**
     * Returns the user-facing ID for an internal buffer index, or `null`.
     */
    getNodeId(index: number): string | number | null;
    /**
     * Returns the metadata (labels, icons, custom data) for a given node ID.
     */
    getNodeMetadata(nodeId: string | number): NodeMetadata | null;
    /**
     * Returns the metadata for a given edge ID.
     */
    getEdgeMetadata(edgeId: string): EdgeMetadata | null;
    /**
     * Locks a node so it cannot be dragged by the user.
     * Programmatic position changes via `setNodePosition()` still work.
     */
    lockNode(nodeId: string | number): void;
    /**
     * Unlocks a previously locked node.
     */
    unlockNode(nodeId: string | number): void;
    /**
     * @internal Used by InteractionManager to check lock state before dragging.
     */
    isNodeLocked(index: number): boolean;
    /**
     * Hides a node. Hidden nodes are invisible and cannot be picked or selected.
     * The node remains in the graph and can be shown again with `showNode()`.
     * @example
     * engine.hideNode('alice');
     */
    hideNode(nodeId: string | number): void;
    /**
     * Shows a previously hidden node.
     * @example
     * engine.showNode('alice');
     */
    showNode(nodeId: string | number): void;
    /**
     * @internal Returns true if the node at `index` is hidden.
     */
    isNodeHidden(index: number): boolean;
    /**
     * Sets the fill color of a node. Accepts 0–1 float components.
     */
    setNodeColor(nodeId: string | number, r: number, g: number, b: number, a?: number): void;
    /**
     * Updates the display label of a node.
     */
    setNodeLabel(nodeId: string | number, label: string): void;
    /**
     * Merges a plain object into a node's `data` field.
     */
    setNodeData(nodeId: string | number, data: any): void;
    /**
     * Hides an edge. It will not be rendered or pickable.
     * @example
     * engine.hideEdge('edge-1');
     */
    hideEdge(edgeId: string): void;
    /**
     * Shows a previously hidden edge.
     */
    showEdge(edgeId: string): void;
    reverseEdge(edgeId: string): void;
    /**
     * Updates the display label of an edge.
     */
    setEdgeLabel(edgeId: string, label: string): void;
    /**
     * Merges a plain object into an edge's `data` field.
     */
    setEdgeData(edgeId: string, data: any): void;
    /**
     * Deselects all nodes and edges.
     */
    deselectAll(): void;
    /**
     * Uploads graph data to the GPU in bulk and initializes all internal state.
     * After calling `setData`, the graph supports incremental mutation via
     * `addNode` / `removeNode` / `addEdge` / `removeEdge`.
     *
     * @param positions Interleaved node coordinates [x1, y1, x2, y2, ...]
     * @param colors Interleaved RGBA colors [r1,g1,b1,a1, r2,g2,b2,a2, ...]
     * @param ids Unique numeric identifiers (typically [0,1,2,...,n])
     * @param metadata Map of node metadata (labels, icons, etc.) keyed by index
     * @param edgeIndices Source-target index pairs for edges [u1,v1, u2,v2, ...]
     * @param nodeIdMap Optional map of UserID -> BufferIndex. If omitted, indices 0..N are used as IDs.
     * @param edgeMetadata Map of edge metadata keyed by "u-v" strings or Edge IDs
     */
    setData(positions: Float32Array, colors: Float32Array, ids: Float32Array, metadata: Map<number, NodeMetadata>, edgeIndices?: Uint32Array, edgeMetadata?: Map<string, EdgeMetadata>, nodeIdMap?: Map<string | number, number>): void;
    updatePositions(positions: Float32Array): void;
    setNodePosition(id: number, x: number, y: number): void;
    getNodePosition(id: number): vec2 | null;
    setFlowAnimation(enabled: boolean): void;
    setTheme(theme: "dark" | "light"): void;
    setFlowVelocity(velocity: number): void;
    /**
     * Sets the particle size for the energy flow animation.
     * @param size Base radius in pixels.
     */
    setFlowSize(size: number): void;
    /**
     * Sets a custom color for the energy flow particles.
     * @param color CSS color string (e.g. '#00ff00', 'rgba(0,0,0,0.5)')
     */
    setFlowColor(color: string | undefined): void;
    /**
     * Filters the energy flow to only show on specific edges.
     * @param prop metadata.data property name.
     * @param value Required value for the property to match.
     */
    setFlowFilter(prop: string | null, value?: unknown): void;
    /**
     * Creates a group (combo) containing the specified nodes.
     * @param id Unique group ID.
     * @param label Display label for the group border.
     * @param nodeIds Array of User IDs to include in the group.
     * @fires `combo:add`
     */
    createGroup(id: string, label: string, nodeIds: (string | number)[]): void;
    /**
     * Removes a group. The nodes inside the group are NOT deleted.
     */
    removeGroup(id: string): void;
    /**
     * Adds a node to an existing group.
     */
    addToGroup(groupId: string, nodeId: string | number): void;
    /**
     * Removes a node from a group.
     */
    removeFromGroup(groupId: string, nodeId: string | number): void;
    /**
     * Toggles the collapsed/expanded state of a group.
     * When collapsed, all members are hidden.
     */
    toggleComboCollapse(groupId: string): void;
    /**
     * Moves an entire group by a world-space delta.
     */
    moveGroup(groupId: string, dx: number, dy: number, skipSync?: boolean): void;
    /**
     * Returns all groups and their members.
     */
    getAllGroups(): {
        id: string;
        label: string;
        nodeIds: (string | number)[];
    }[];
    createCombo(id: string, label: string, nodeIds: (string | number)[]): void;
    removeCombo(id: string): void;
    updateCombo(id: string, label: string, nodeIds: (string | number)[]): void;
    getCombo(id: string): Combo;
    addNodeToCombo(comboId: string, nodeId: string | number): void;
    removeNodeFromCombo(comboId: string, nodeId: string | number): void;
    render(): void;
    private renderOverlay;
    getState(): InteractionState;
    updateInteractionState(update: Partial<InteractionState>): void;
    /**
     * Configures the Energy Flow animation settings.
     */
    setFlowConfig(config: Partial<FlowConfig>): void;
    /**
     * GPU color-buffer picking. Returns the internal index of the node under the cursor,
     * or `null` if nothing was hit or if the hit node is hidden.
     */
    pick(mouseX: number, mouseY: number): number | null;
    /**
     * CPU line-segment picking. Returns the user-facing edge ID under the cursor, or `null`.
     * Hidden edges are excluded.
     */
    getEdgeAt(mouseX: number, mouseY: number): string | null;
    pickCombo(mouseX: number, mouseY: number): string | null;
    pickHUD(mouseX: number, mouseY: number): import("./overlay").HUDAction;
    fitToView(): void;
    zoomIn(): void;
    zoomOut(): void;
    setCameraCenter(x: number, y: number): void;
    setCameraZoom(zoom: number): void;
    getSelectedNodeIds(): number[];
    /**
     * Returns the User IDs of all currently selected nodes.
     */
    getSelectedUserIds(): (string | number)[];
    selectNode(id: number | null): void;
    zoomAt(mouseX: number, mouseY: number, delta: number): void;
    /**
     * Run a built-in geometric layout on the nodes.
     * Supports Grid, Circle, and Random arrangements.
     *
     * @param type Layout algorithm to use.
     * @param options Configuration for the layout run.
     */
    runLayout(type: "grid" | "circle" | "random", options?: {
        selectedOnly?: boolean;
    }): void;
    private radialMenuConfigs;
    /**
     * Configures the available items in the circular context menu for a specific type.
     * @param type 'node', 'edge', or 'combo'
     * @param items List of menu items.
     */
    setRadialMenu(type: 'node' | 'edge' | 'combo', items: RadialMenuItem[]): void;
    /**
     * Returns the registered menu items for a type.
     */
    getRadialMenu(type: string): RadialMenuItem[];
    pan(dx: number, dy: number): void;
    syncDragOffsets(mouseX: number, mouseY: number): void;
    handleDragging(mouseX: number, mouseY: number): void;
    performBoxSelection(): void;
    unproject(screenX: number, screenY: number): vec2;
    private initShaders;
    private initBuffers;
    private initPicking;
    private handleResize;
    private updateMatrix;
    private createProgram;
    /**
     * Resolve a user-facing node ID (string or number) to the internal buffer index.
     */
    private resolveNodeIndex;
    /** Parse color input into a [r, g, b, a] tuple with 0–1 float components. */
    private parseColor;
    /**
     * Ensures the CPU+GPU node buffers have at least `minCount` capacity.
     * Uses a doubling strategy to amortize reallocation cost.
     */
    private ensureNodeCapacity;
    /**
     * Rebuilds the GPU edge index buffer from `edgeList`, excluding hidden edges.
     * Called after any edge mutation.
     */
    private rebuildEdgeBuffer;
    /** Rebuilds the `edgeIndexToUserIdMap` from scratch (called after node swaps). */
    private rebuildEdgeIndexToUserIdMap;
    /** Internal edge removal without buffer rebuild (for batched removeNode). */
    private _removeEdgeInternal;
    /** Pre-processes a node image into a circular, white-tinted off-screen canvas. */
    private loadNodeImage;
}
