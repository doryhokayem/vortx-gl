<script setup>
import { onMounted, ref } from 'vue';
import { GraphCanvas, createGraphData } from 'webgl-graph-library';
import 'webgl-graph-library/dist/webgl-graph-library.css';

// 1. Prepare your data (can be loaded from an API)
const graphData = ref({
  nodes: [
    { data: { id: '1', label: 'CEO', color: '#ff4757', width: 80, height: 80 }, position: { x: 2500, y: 2400 } },
    { data: { id: '2', label: 'CTO', color: '#2ed573', width: 60, height: 60 }, position: { x: 2300, y: 2600 } },
    { data: { id: '3', label: 'CFO', color: '#1e90ff', width: 60, height: 60 }, position: { x: 2700, y: 2600 } }
  ],
  edges: [
    { data: { id: 'e1-2', source: '1', target: '2', label: 'Reports to' } },
    { data: { id: 'e1-3', source: '1', target: '3', label: 'Reports to' } }
  ]
});

// 2. Event Handled
const onNodeSelect = (nodeId) => {
  console.log('User selected node:', nodeId);
};

const onEdgeSelect = (edgeId) => {
  console.log('User selected edge:', edgeId);
};
</script>

<template>
  <div class="app-container">
    <header>
      <h1>Org Chart Visualizer</h1>
      <p>Powered by WebGL Graph Engine</p>
    </header>

    <main class="viewport">
      <!-- 3. Use the Library Component -->
      <GraphCanvas 
        :data="graphData" 
        @node-selected="onNodeSelect"
        @edge-selected="onEdgeSelect"
      />
    </main>
  </div>
</template>

<style>
/* Ensure the container has dimensions */
.viewport {
  width: 100vw;
  height: calc(100vh - 80px);
  position: relative;
}

header {
  height: 80px;
  background: #1a1a2e;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #16213e;
}

body {
  margin: 0;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}
</style>
