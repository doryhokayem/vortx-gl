import type { GraphEngine } from "./renderer";
export declare class InteractionManager {
    private lastMouse;
    private isPanning;
    private engine;
    private canvas;
    private lastTouchDistance;
    private lastTouchMidpoint;
    private isTouching;
    private touchStartTime;
    private touchStartPos;
    private longPressTimer;
    private isLongPress;
    private isDraggingCombo;
    constructor(engine: GraphEngine, canvas: HTMLCanvasElement);
    private setupListeners;
    private handleMouseDown;
    private handleMouseMove;
    private handleMouseUp;
    private handleWheel;
    private handleTouchStart;
    private handleTouchMove;
    private handleTouchEnd;
    private clearLongPress;
    private triggerContextMenu;
}
