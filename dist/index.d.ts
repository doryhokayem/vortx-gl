import './style.css';
export { GraphEngine } from './engine/renderer';
export * from './engine/types';
export { default as GraphCanvas } from './components/GraphCanvas.vue';
export declare const createGraphData: (nodes: any[], edges: any[]) => {
    nodes: any[];
    edges: any[];
};
