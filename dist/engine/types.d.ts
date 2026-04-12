import { vec2 } from "gl-matrix";
/**
 * Visual properties applicable to nodes or edges via classes.
 */
export interface GraphStyle {
    /** Fill color: CSS hex string ("#ff6b6b") or [r,g,b,a] components in 0–1 range. */
    color?: string | [number, number, number, number?];
    /** Node diameter or edge weight. */
    size?: number;
    /** Display label. */
    label?: string;
    /** Emoji or text icon. */
    icon?: string;
    /** URI of an image. */
    image?: string;
}
/**
 * A dictionary of class names to style properties.
 */
export type Stylesheet = Record<string, GraphStyle>;
/**
 * Input format for creating or updating a node via `engine.addNode()`.
 */
export interface NodeInput {
    /** Unique identifier. String or number. Auto-generated if omitted. */
    id?: string | number;
    /** Initial world position. */
    position?: {
        x: number;
        y: number;
    };
    /** Fill color: CSS hex string ("#ff6b6b") or [r,g,b,a] components in 0–1 range. */
    color?: string | [number, number, number, number?];
    /** Display label shown above or below the node. */
    label?: string;
    /** Emoji or text icon rendered inside the node. */
    icon?: string;
    /** URI of an image to render inside the node circle. */
    image?: string;
    /** Arbitrary application data attached to the node. */
    data?: Record<string, unknown>;
    /** Node diameter in pixels. */
    size?: number;
    /** Class names for shared styling. */
    classes?: string[];
}
/**
 * Input format for creating or updating an edge via `engine.addEdge()`.
 */
export interface EdgeInput {
    /** Unique identifier. Auto-generated if omitted. */
    id?: string;
    /** ID of the source node. */
    source: string | number;
    /** ID of the target node. */
    target: string | number;
    /** Display label for the edge. */
    label?: string;
    /** Arbitrary application data attached to the edge. */
    data?: Record<string, unknown>;
    /** Class names for shared styling. */
    classes?: string[];
}
/**
 * Plain data object returned by `engine.getAllNodes()`.
 */
export interface NodeData {
    /** The original ID provided by the user. */
    id: string | number;
    /** Internal buffer index — used for direct GPU operations. */
    _index: number;
    /** Current world positions. */
    position: {
        x: number;
        y: number;
    };
    label?: string;
    icon?: string;
    image?: string;
    /** Arbitrary application data. */
    data?: Record<string, unknown>;
    /** Visual radius of the node. */
    size?: number;
    /** Applied class names. */
    classes?: string[];
}
/**
 * Plain data object returned by `engine.getAllEdges()`.
 */
export interface EdgeData {
    /** Unique edge ID. */
    id: string;
    /** ID of the source node. */
    source: string | number;
    /** ID of the target node. */
    target: string | number;
    label?: string;
    /** Arbitrary application data. */
    data?: Record<string, unknown>;
    /** Applied class names. */
    classes?: string[];
}
/**
 * Engine-internal metadata for a node.
 */
export interface NodeMetadata {
    label?: string;
    icon?: string;
    image?: string;
    imageElement?: HTMLImageElement;
    processedImageElement?: HTMLCanvasElement | HTMLImageElement;
    link?: string;
    width?: number;
    height?: number;
    /** Arbitrary application data. */
    data?: Record<string, unknown>;
    classes?: string[];
}
/**
 * Engine-internal metadata for an edge.
 */
export interface EdgeMetadata {
    label?: string;
    width?: number;
    /** Arbitrary application data. */
    data?: Record<string, unknown>;
    classes?: string[];
}
/**
 * Configuration for the Energy Flow animation.
 */
export interface FlowConfig {
    enabled: boolean;
    /** Particle movement speed (0-0.01) */
    velocity: number;
    /** Particle radius in pixels */
    size: number;
    /** Optional custom color */
    color?: string;
    /** Opacity (0-1) */
    opacity?: number;
    /** Enable pulse effect */
    pulse?: boolean;
    /** Optional property filter (metadata.data field) */
    filterProp?: string | null;
    /** Value to match for the filterProp */
    filterValue?: unknown;
    /** If true, only run flow on edges connected to selected nodes. */
    selectedOnly?: boolean;
}
/**
 * Represents a group of nodes that can be managed together.
 */
export interface Combo {
    /** Unique group ID. */
    id: string;
    /** Display label. */
    label: string;
    /** Set of internal node indices belonging to this group. */
    nodeIds: Set<number>;
    /** Optional hull color. */
    color?: string;
    /** Whether the group is currently collapsed into a summary node. */
    collapsed?: boolean;
    /** Stored positions of nodes before they were collapsed. */
    originalPositions?: Map<number, {
        x: number;
        y: number;
    }>;
    /** The index of the node that remains visible to represent the group when collapsed. */
    representativeId?: number;
}
/**
 * An item in the radial (circular) context menu.
 */
export interface RadialMenuItem {
    /** Label shown in the menu segment. */
    label: string;
    /** Lucide icon name. */
    icon: string;
    /** Action ID emitted when clicked. */
    action: string;
    /** Optional arbitrary data. */
    data?: any;
}
/**
 * Temporary edge drawn during relation creation.
 */
export interface PhantomEdge {
    /** Internal index of the source node. */
    sourceNodeId: number;
    /** World-space target position (usually mouse position). */
    targetPos: vec2;
}
/**
 * Captures the current state of viewport interaction.
 */
export interface InteractionState {
    /** Viewport zoom level. */
    zoom: number;
    /** Screen-space offset (pan). */
    offset: vec2;
    /** Set of currently selected internal node indices. */
    selectedNodeIds: Set<number>;
    /** ID of the currently selected edge. */
    selectedEdgeId: string | null;
    /** ID of the currently selected combo. */
    selectedComboId: string | null;
    /** Index of the node currently under the mouse. */
    hoveredNodeId: number | null;
    /** Whether a box selection is currently active. */
    isBoxSelecting: boolean;
    /** Starting screen-space coordinate of the selection marquee. */
    selectionStart: vec2;
    /** Current screen-space coordinate of the selection marquee. */
    selectionEnd: vec2;
    /** Whether multiple nodes are being dragged. */
    isMultiDragging: boolean;
    /** Index of a single node currently being dragged. */
    draggedNodeId: number | null;
    /** Current energy flow configuration. */
    flow: FlowConfig;
    /** Temporary edge drawn during relation creation. */
    phantomEdge: PhantomEdge | null;
}
