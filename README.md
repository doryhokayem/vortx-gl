# VortxGL 🎨

A high-performance, modular graph visualization engine built with **Vue 3**, **WebGL2**, and **TypeScript**. Optimized for extreme scale, this engine can handle **50,000+ nodes and edges** effortlessly at 60 FPS.

---

## ⚡ Quick Start

### 1. Installation

```bash
npm install vortx-gl
```

### 2. Basic Usage (Vue 3)

```vue
<script setup>
import { GraphCanvas } from "vortx-gl";
import "vortx-gl/dist/vortx-gl.css";

const graphData = {
  nodes: [
    {
      data: {
        id: "1",
        label: "Node 1",
        color: "#ff4757",
        backgroundImage: "https://example.com/icon.png", // Optional icon
      },
    },
  ],
  edges: [],
};
</script>

<template>
  <div style="width: 100vw; height: 100vh;">
    <GraphCanvas :data="graphData" />
  </div>
</template>
```

---

## 🌐 Live Demo

🚀 **Watch it in action**: [View the Live Demo](https://webgl-graph.vercel.app)

---

## 🚀 Key Features

- **Massive Scale**: Leverages WebGL2 for smooth 60 FPS rendering of **50k+ elements**.
- **Icon Support**: Render high-quality UI icons or images directly within nodes using `backgroundImage`.
- **Advanced Interaction**: Precision GPU picking, box selection, and smooth camera controls.
- **Worker-Powered Layouts**: Force-directed, Concentric, Radial, and Grid layouts computed in background workers.
- **Hybrid Rendering**: Secondary overlay for crisp labels and custom UI.

---

## 📊 Data Schema

The engine uses a JSON format compatible with Cytoscape.js:

```json
{
  "nodes": [
    {
      "data": {
        "id": "1",
        "label": "A",
        "color": "#000",
        "width": 50,
        "height": 50,
        "backgroundImage": "data:image/png;base64,..."
      }
    }
  ],
  "edges": [
    {
      "data": {
        "id": "e1-2",
        "source": "1",
        "target": "2",
        "label": "Connection"
      }
    }
  ]
}
```

---

## ⌨️ Shortcuts

| Command          | Action                     |
| :--------------- | :------------------------- |
| **Left Click**   | Select Node / Edge / Combo |
| **Drag**         | Pan the view               |
| **Scroll**       | Zoom at mouse position     |
| **Shift + Drag** | Box Selection              |
| **Right Click**  | Context Menu (Radial)      |
| **F**            | Fit to View                |

---

## 📜 License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.
