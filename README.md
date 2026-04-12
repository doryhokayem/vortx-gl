# VortxGL 🎨

A world-class, high-performance graph visualization engine built with **Vue 3**, **WebGL2**, and **TypeScript**. Engineered for extreme scale and architectural flexibility, VortxGL effortlessly handles **100,000+ nodes and edges** while maintaining a locked 60 FPS.

---

## 🚀 Key Evolutionary Features

### 🎬 Energy Flow Visualization

Bring your data to life with real-time particle animations along graph edges.

- **Dynamic Velocity**: Adjust stream speed in real-time.
- **Precision Filtering**: Target specific data flows by property and value (e.g., animate only `type: "transaction"`).
- **GPU-Ready**: Performance-optimized rendering that scales with your dataset.

### 📁 Advanced Combo (Grouping) System

Full support for hierarchical data structures and interactive clustering.

- **Smart Hulls**: Automatically generated convex hulls for expanded groups.
- **Interactive Collapsing**: Swap complex clusters for intuitive summary nodes.
- **Cluster Translation**: Drag entire groups while preserving internal layouts.

### ⛓️ Interactive Relation Builder

Engineered for semantic graph creation with real-time visual feedback.

- **Phantom Edges**: Real-time dashed preview line that follows the cursor during connection.
- **On-the-Fly Configuration**: Set labels, colors, and thickness via an interactive toast before finalizing.
- **Adaptive Labels**: Screen-space edge labels that automatically render for high-zoom clarity.

### 🏎️ Tactical Optimization

Built with a performance-first mindset:

- **Screen-Space Projection Cache**: Eliminates redundant O(NodeCount) matrix operations for labels and effects.
- **Zero-Allocation Loops**: Uses specialized scratch buffers to minimize Garbage Collection impact.

---

## ⚡ Quick Start

### 1. Installation

```bash
npm install vortx-gl
```

### 2. Basic Usage (Vue 3)

```vue
<script setup lang="ts">
import { GraphCanvas } from "vortx-gl";
import "vortx-gl/dist/vortx-gl.css";

const graphData = {
  nodes: [
    {
      data: {
        id: "1",
        label: "Node 1",
        color: "#00ffcc",
        backgroundImage: "https://example.com/icon.png",
      },
    },
  ],
  edges: [
    {
      data: { source: "1", target: "2", type: "transfer" },
    },
  ],
};
</script>

<template>
  <div style="width: 100vw; height: 100vh;">
    <GraphCanvas :data="graphData" />
  </div>
</template>
```

---

## 🌐 Live Demo & Docs

🚀 **Experience the Speed**: [View the Live Demo](https://webgl-graph.vercel.app)

---

## 📊 Data Schema & Types

VortxGL uses a robust, TypeScript-first schema. All element metadata is stored in a dedicated `data` record for application use.

```json
{
  "nodes": [
    {
      "data": {
        "id": "node-1",
        "label": "Engineering",
        "color": "#ff4757",
        "backgroundImage": "data:image/png;base64,...",
        "metadata": { "status": "active" }
      }
    }
  ],
  "edges": [
    {
      "data": {
        "id": "edge-1",
        "source": "node-1",
        "target": "node-2",
        "label": "Data Link"
      }
    }
  ]
}
```

---

## 🎨 Visual Polish

VortxGL provides rich options for making your graph look premium and intuitive.

### 1. Icons & Images
Nodes can render text-based icons (emojis) or high-resolution images.

```typescript
engine.addNode({
  id: "node-1",
  icon: "📂",      // Renders text/emoji in center
  image: "url...",  // Renders rounded image inside
  size: 60
});
```

### 2. Color Formats
Colors accept standard CSS hex strings or precision arrays for hardware-level control.

```typescript
// CSS Hex
color: "#ff4757"

// RGBA Array (0-1 range)
color: [1.0, 0.28, 0.34, 1.0]

// Transparent
color: [0, 0, 0, 0] // Useful for "ghost" nodes
```

### 3. Theme Switching
The engine supports built-in Dark and Light mode, affecting the background clear color and label contrast automatically.

```typescript
engine.setTheme("light"); // Switches to light background
```

---

## 📁 Combo Management

Combos (Groups) allow you to cluster related nodes into logical units. They support two modes: **Expanded** (showing a bounding hull) and **Collapsed** (showing a summary representative node).

### 1. Creating a Group
Groups are created by specifying a unique ID and a list of node IDs to include.

```typescript
engine.createGroup("group-alpha", "Engineers", ["node-1", "node-2", "node-3"]);
```

### 2. Collapsing & Expanding
Collapsing a group hides all member nodes except for one **representative**, which snaps to the centroid of the group.

```typescript
// Programmatically toggle state
engine.toggleComboCollapse("group-alpha");

// Listen for collapse events
engine.on('combo:update', (data) => {
  console.log(`Group ${data.id} is now ${data.state ? 'collapsed' : 'expanded'}`);
});
```

### 3. Interaction Logic
- **Dragging**: When a group is collapsed, dragging its representative moves all hidden members in sync.
- **Hulls**: When expanded, a convex hull is automatically rendered around the members with customizable padding and color.
- **Picking**: You can select a group by clicking on its hull (expanded) or its representative node (collapsed).

---

## ⌨️ Pro Shortcuts

| Command          | Action                     |
| :--------------- | :------------------------- |
| **Left Click**   | Select Node / Edge / Combo |
| **Drag**         | Pan the world              |
| **Scroll**       | Zoom at mouse focal point  |
| **Shift + Drag** | Precise Box Selection      |
| **Radial Right Click** | Contextual Command Menu    |
| **F**            | Snap to Fit View           |

---

## 🔘 Context Menus

VortxGL is designed to work seamlessly with domestic UI frameworks (Vue, React). Instead of drawing menus on the WebGL canvas, it is recommended to use standard DOM components positioned over the canvas.

### 1. Triggering Menus
Listen for the `contextmenu` event on the canvas. Use `engine.pick()` or `engine.getEdgeAt()` to identify the element under the cursor.

```typescript
canvas.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Identify target
  const nodeId = engine.pick(x, y);
  const edgeId = engine.getEdgeAt(x, y);

  // Show your Vue/React menu at e.clientX/Y
  showMenu({ x: e.clientX, y: e.clientY, target: nodeId || edgeId });
});
```

### 2. Customizing Menu Items
You can configure the segments of the circular menu for nodes, edges, and combos through the engine instance.

```typescript
engine.setRadialMenu('node', [
  { label: 'Inspect', icon: 'search', action: 'inspect' },
  { label: 'Delete', icon: 'trash-2', action: 'delete' },
  { label: 'Highlight', icon: 'zap', action: 'highlight' }
]);
```

### 3. Group HUD (Heads-Up Display)
For combos (groups), the engine draws a built-in HUD with an expand/collapse button. You can detect clicks on these HUD elements using `pickHUD()`.

```typescript
engine.on('node:mousedown', (e) => {
  const hudAction = engine.pickHUD(e.x, e.y);
  if (hudAction) {
    if (hudAction.action === 'expand') {
      engine.toggleComboCollapse(hudAction.comboId);
    }
  }
});
```

### 4. Interactive Connection Workflow

VortxGL includes a built-in workflow for creating new relations between nodes with real-time feedback.

1. **Trigger**: Call `engine.startConnect(sourceNodeId)` to enter connection mode.
2. **Preview**: A "Phantom Edge" (dashed line) will follow the cursor from the source node to the mouse position.
3. **Configure**: Users can set properties like `label` and `color` during the preview phase.
4. **Complete**: Clicking a target node finalizes the connection and creates a permanent "Styled Edge".

---


## 🏗️ Graph Mutation

VortxGL provides a high-performance imperative API for modifying the graph in real-time. Changes are immediately synced to GPU buffers using minimal memory copies.

### 1. Adding Elements
```typescript
// Add a node
engine.addNode({
  id: "node-1",
  label: "New Node",
  position: { x: 100, y: 100 },
  color: "#ff00ff"
});

// Add an edge
engine.addEdge({ 
  source: "node-1", 
  target: "node-2", 
  label: "Connected" 
});
```

### 2. Updating Elements
Updates are partial; you only need to provide the fields you want to change.
```typescript
engine.updateNode({
  id: "node-1",
  color: "#00ff00", // Change color
  label: "Updated Name"
});

engine.updateEdge({
  id: "edge-1",
  label: "New Relationship"
});
```

### 3. Removing Elements
```typescript
// Removes node and all connected edges
engine.removeNode("node-1");

// Removes a single edge
engine.removeEdge("edge-1");

// Complete reset
engine.clear();
```

### 3. Visual Properties Reference

| Property | Type | Target | Description |
|---|---|---|---|
| `label` | string | Both | Primary text label (Edges show at >30% zoom) |
| `size` | number | Node | Diameter of the node circle |
| `width` | number | Both | Bounding width for node labels |
| `customSize` | number | Edge | Precision line thickness (supports <1 and >10) |
| `customColor`| string | Edge | Per-edge override color (HEX/RGBA) |
| `color` | string | Node | CSS Hex or RGBA value |
| `icon` | string | Node | Lucide icon name or Emoji |
| `image` | string | Node | URL for an image shown inside the node |
| `opacity`| number | Both | Global transparency (0-1) |

```typescript
// Style a large node
engine.updateNode({
  id: "node-1",
  label: "Large Server",
  size: 80,       // Diameter
  width: 120,     // Label boundary width
  color: "#ff3300"
});

// Create a premium styled connection
engine.addEdge({
  source: "node-1", 
  target: "node-2",
  label: "Critical Link",
  data: {
    customColor: "#ff00ff", // Override WebGL global color
    customSize: 4.5         // Precise thickness in pixels
  }
});
```

---

## 🔍 Querying Elements

Retrieve element data from the engine for inspection or state management.

### 1. Selection by ID
```typescript
const node = engine.getNode("node-1");
console.log(node.position, node.label);
```

### 2. Selection by Class
Retrieve groups of elements that share a specific class.

```typescript
// Get all critical servers
const criticalNodes = engine.getNodesByClass("critical");

// Get all standard cables
const standardEdges = engine.getEdgesByClass("standard-link");
```

### 3. Global Retrieval
```typescript
const allNodes = engine.getAllNodes();
const allEdges = engine.getAllEdges();
```

---

## 🎨 Styling with Classes

VortxGL supports a high-performance stylesheet system, allowing you to define visual presets and apply them via class names, similar to CSS or Cytoscape.

### 1. Defining a Stylesheet
A stylesheet is a dictionary where keys are class names and values are style objects. Use `engine.setStylesheet()` to apply it globally.

```typescript
const theme = {
  'critical': { color: '#ff4757', size: 60, icon: '⚠️' } ,
  'server': { color: '#2f3542', size: 45, icon: '🖥️' },
  'standard-link': { color: 'rgba(255,255,255,0.2)' }
};

engine.setStylesheet(theme);
```

### 2. Applying Classes
Apply classes when adding or updating elements. Multiple classes can be applied as an array; later classes override previous ones.

```typescript
engine.addNode({
  id: "node-1",
  classes: ["server", "critical"],
  label: "Database 01"
});

engine.addEdge({
  source: "node-1",
  target: "node-2",
  classes: ["standard-link"]
});
```

### 3. Priority Rules
Visual properties are applied in the following order of precedence:
1. **Explicit Properties**: Properties set directly on the node (e.g., `color: '#fff'`) always win.
2. **Class Styles**: Properties defined in the stylesheet for the applied classes.
3. **Engine Defaults**: Hardcoded fallback values.

---

## ⚡ Energy Flow Animation

VortxGL includes a custom, hardware-accelerated "Energy Flow" animation for highlighting data movements along edges.

### 1. Basic Configuration
```typescript
engine.setFlowConfig({
  enabled: true,
  velocity: 0.005,
  size: 2,
  color: "#00ffcc"
});
```

### 2. Selective Flow (Advanced)
You can restrict the animation to only run on edges connected to the currently selected nodes. This is extremely useful for tracing paths or focusing on specific network segments.

```typescript
engine.setFlowConfig({
  enabled: true,
  selectedOnly: true
});
```

### 3. All Options
| Property | Type | Description |
|---|---|---|
| `enabled` | boolean | Toggle the animation |
| `velocity` | number | Speed of particles (0.001 - 0.01 recommended) |
| `size` | number | Radius of particles in pixels |
| `opacity` | number | Transparency (0 - 1) |
| `pulse` | boolean | Adds a subtle breathing effect to particles |
| `selectedOnly`| boolean | Show only on edges of selected nodes |

---

## 🏗️ Events & Interactivity

VortxGL features a powerful, Cytoscape-inspired event system for deep integration with your application logic.

### 1. Subscribing to Events
Use the `on()` API to listen for interactions. Use the returned function to unsubscribe.

```typescript
// Subscribe
const unsub = engine.on('node:click', ({ id }) => {
  console.log('Clicked node:', id);
});

// Unsubscribe when component is destroyed
unsub();
```

### 2. Available Events
| Category | Event Keys | Description |
| :--- | :--- | :--- |
| **Nodes** | `node:click`, `node:hover`, `node:drag`, `node:select` | Individual element interactions |
| **Edges** | `edge:click`, `edge:hover`, `edge:select` | Edge-specific interactions |
| **Combos** | `combo:click`, `combo:hover`, `combo:select` | Group-specific interactions |
| **Viewport** | `graph:click`, `graph:pan`, `graph:zoom`, `viewport` | Global camera movement |
| **Selection**| `boxstart`, `boxselect`, `boxend` | Marquee/Box selection lifecycle |

---

## 📸 Viewport & Camera

Control the view programmatically to create cinematic transitions or automated "focus" actions.

### 1. Focus & Fit
```typescript
// Auto-scale and center to show the entire graph
engine.fitToView();

// Move camera to a specific world coordinate
engine.setCameraCenter(0, 0);
```

### 2. Zoom Controls
```typescript
engine.zoomIn();
engine.zoomOut();

// Precise focal zoom (screen coordinates)
engine.zoomAt(mouseX, mouseY, delta);
```

---

## 🧬 Layouts & Batch Updates

VortxGL provides built-in geometric layouts and supports seamless integration with external layout engines (like Cytoscape.js or d3-force).

### 1. Built-in Geometric Layouts
Trigger fast, animated layouts directly from the engine instance.

```typescript
// Arrange all nodes in a circle
engine.runLayout('circle');

// Arrange nodes in a grid
engine.runLayout('grid');

// Random scatter
engine.runLayout('random');
```

### 2. Layouts on Selection
You can restrict any built-in layout to only affect currently selected elements, keeping the rest of the graph anchored.

```typescript
engine.runLayout('circle', { selectedOnly: true });
```

### 3. External Layouts (e.g. Cytoscape)
For complex force-directed or hierarchical layouts, calculate positions externally and sync them:

#### Batch Sync (Most Efficient)
Use `setData` for an O(1) buffer swap when a layout finishes.

```typescript
engine.setData(newPositions, newColors, newIds, metadata, edgeIndices);
```

#### Incremental Sync (Real-time Animation)
For live layout animations, use `updateNode` in your layout's tick function.

```typescript
nodes.forEach(n => {
  engine.updateNode({ id: n.id, position: { x: n.x, y: n.y } });
});
```

---

## 📜 License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.
