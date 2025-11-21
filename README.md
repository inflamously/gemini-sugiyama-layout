# Sugiyama Graph Visualizer

A React-based interactive sandbox for visualizing Directed Acyclic Graphs (DAGs). 

This project implements a **custom Sugiyama-style layout algorithm** from scratch, moving away from "black box" graph libraries to demonstrate the core logic behind network visualization.

## 🌟 Features

*   **Custom Layout Engine**: A manual implementation of the layered graph drawing method (Layering → Ordering → Positioning).
*   **Educational Mode**: Toggle **"Show Layers"** to visualize the rank assignment step of the algorithm.
*   **Multiple Node Views**: Switch between different React components for rendering nodes (`Simple`, `Card`, `Technical`) while maintaining the same graph topology.
*   **Interactive Canvas**: Real-time updates as you modify data or layout configuration.
*   **JSON Editor**: Direct manipulation of the graph data structure.

## 🛠 Architecture

The project is built with **React**, **Tailwind CSS**, and **D3-Shape** (solely for drawing curved connectors).

### The Layout Algorithm (`services/layoutService.ts`)

Instead of using a library like `dagre` or `d3-dag`, this project manually calculates positions in 6 steps:

1.  **Initialization**: Wraps raw data into internal node objects.
2.  **Layer Assignment**: Uses the **Longest Path Algorithm** to assign a vertical "rank" to every node. It detects and handles cycles by ignoring back-edges.
3.  **Grouping**: Buckets nodes by their assigned layer.
4.  **Ordering**: Applies a **Barycenter Heuristic** (averaging parent positions) to sort nodes within each layer, minimizing edge crossings.
5.  **Coordinate Assignment**: Calculates exact X/Y pixels based on layer width and node spacing settings.
6.  **Edge Routing**: Generates points for `curveBumpY` to draw smooth, circuit-board style connections.

## 📂 Project Structure

*   **`components/`**:
    *   `GraphCanvas`: The main SVG/HTML hybrid container.
    *   `NodeViews`: Orchestrator for different node styles (`CardNode`, `TechnicalNode`, etc.).
    *   `Controls`: Sidebar for manipulating data and visuals.
    *   `DebugLayer`: Visualizes the calculated "ranks" (background stripes).
*   **`services/`**:
    *   `layoutService`: Pure TypeScript logic for the graph math.

## 🚀 Getting Started

1.  **Visuals Tab**: Adjust `Node Width`, `Height`, and `Spacing` to see how the algorithm adapts.
2.  **Data Tab**: Edit the JSON to add new nodes.
    *   Format: `{ "id": "A", "parentIds": ["B"] }`
3.  **View Style**: Switch to "Technical" to see a high-density view useful for system architecture diagrams.

## 📝 License

MIT Reference Project
