# DocuMind-RAG — Document Intelligence Assistant

DocuMind-RAG is a modern, responsive, dark-mode SaaS interface designed for intelligent document exploration, semantic search, and AI-assisted knowledge retrieval.

This demonstration operates completely in your web browser with **zero dependencies**, **no Node.js/npm required**, and **no server setup needed**.

---

## 🚀 Getting Started

You can launch and explore the interface immediately:

### Quick Launch:
1. Open Windows File Explorer and navigate to your project's frontend directory:
   ```
   cd DocuMind-RAG/frontend
   ```
2. **Double-click `index.html`** (or right-click → **Open with** → **Google Chrome**, **Microsoft Edge**, or **Firefox**).
3. The interface will load immediately with the dark-mode layout, document library, and interactive chat interface.

---

## ✨ Core Features & Capabilities

### 1. Navigation & Workspace Layout
* **Sidebar Views**: Seamless switching between **RAG Chat**, **Document Library**, and **Settings & Models**.
* **Breadcrumb Navigation**: Displays current view and active conversation context dynamically.
* **Quick Model Selector**: Quick-access pill in the top header for instant model and engine configuration.

### 2. Multi-Thread Conversation Management
* **Interactive Conversations**: Explore sample document rule inquiries with full context and verified citations:
  * **Monopoly Starting Bankroll**: Demonstrates structured financial data extraction and breakdown.
  * **Longest Continuous Path**: Demonstrates rule validation and bonus scoring logic.
  * **Bankruptcy & Mortgages**: Demonstrates complex policy and asset distribution queries.
* **New Chat**: Click **New Chat** (or press **`Ctrl + K`**) to clear the workspace, display the welcome hero banner, and start a fresh inquiry.

### 3. Grounded Question Answering
* **Interactive Suggestions**: Click any suggested question card on the welcome screen to launch a query.
* **Message Composer**:
  * Auto-resizing input with keyboard shortcuts (`Enter` to send, `Shift + Enter` for new lines).
  * Attachment affordance for adding documents.
  * Realistic typing indicator and response generation simulation.
* **Source-Grounded Answers**:
  * Clean formatting with highlighted callouts, metric badges, and copy-to-clipboard buttons.
  * Interactive feedback buttons (thumbs up / thumbs down) for answer quality evaluation.

### 4. Verified Citations & Sources Drawer
* **Source Citation Badges**: Assistant answers cite exact documents and page numbers (e.g., `monopoly.pdf:3:1`, `ticket_to_ride.pdf:6:0`).
* **Source Highlighting**: Clicking any citation badge automatically opens the right-hand **Sources Panel** (if closed), scrolls to the exact excerpt, and highlights the card.
* **Drawer Controls**: Toggleable via the top navbar button, the close button in the header, or the `Escape` key.

### 5. Document Library & Chunk Inspection
* **Live Search**: Instant real-time filtering across document names, paths, and descriptions.
* **Category Filtering**: Quickly filter documents by status (`All`, `Rulebooks`, `Indexed`, `Pending`).
* **Chunk Inspector**:
  * Open the **Inspect Chunks** modal on any document card to examine chunk IDs, character lengths, similarity scores, and verbatim text.
  * Includes individual chunk copying and keyboard `Escape` dismiss.
* **Direct Query**: Click **Query Doc** to immediately launch a targeted question about that specific file.

### 6. Appearance & Configuration
* **Theme Modes**: Switch between **Midnight Dark** and **Slate Obsidian** themes.
* **Accent Colors**: Customize the UI highlight color (**Indigo Glow**, **Amethyst Purple**, **Cyan Tech**, **Emerald Green**).
* **Local Storage Persistence**: Visual themes, accent colors, temperature, top-K chunks, and model choices persist across browser reloads.
* **Configurable Parameters**: Test different temperature values, top-K chunk retrieval depths, and inference model configurations.

### 7. Accessibility & Mobile Responsiveness
* **Focus States**: High-contrast accessible focus outlines (`:focus-visible`) across all interactive controls.
* **ARIA Support**: Semantic accessibility attributes (`role="dialog"`, `aria-modal="true"`, `role="region"`, `aria-expanded`).
* **Responsive Layout**: Adapts gracefully across desktop, tablet, and mobile screens with off-canvas sidebar drawers and backdrop overlays.

---

## 📜 License

This project is licensed under the MIT License. Developed and maintained as part of the **DocuMind-RAG — Document Intelligence Assistant** project.
