import { createRoot } from "react-dom/client";
import React, { Component } from "react";
import App from "./App";
import "./index.css";

// Error boundary to gracefully catch any render errors in the tree
class ErrorBoundary extends Component<{ children: React.ReactNode }, { error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[TAZGA] Render error caught:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, color: "red", fontFamily: "monospace", whiteSpace: "pre-wrap", background: "#fff", minHeight: "100vh" }}>
          <h1 style={{ fontSize: 20, marginBottom: 16 }}>Something went wrong</h1>
          <pre>{this.state.error.message}</pre>
          <pre style={{ marginTop: 16, fontSize: 12 }}>{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function mount() {
  const container = document.getElementById("root");
  if (!container) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", mount, { once: true });
      return;
    }
    requestAnimationFrame(mount);
    return;
  }
  try {
    createRoot(container).render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );
  } catch (err) {
    console.error("[TAZGA] render() threw:", err);
  }
}

mount();
