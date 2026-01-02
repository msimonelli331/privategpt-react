const express = require("express");
const k8s = require("@kubernetes/client-node");
const { getK8sApiClient, formatNamespace, formatPod } = require("./utils");
const path = require("path");

const PORT = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(express.json());

// Serve static files from the frontend build directory
app.use(express.static(path.resolve(__dirname, "../../frontend/dist")));

// Create Kubernetes client
const k8sApi = getK8sApiClient(k8s.CoreV1Api);

// API endpoint to list namespaces
app.get("/api/namespaces", async (req, res) => {
  try {
    const namespacesRes = await k8sApi.listNamespace();
    const namespaces = namespacesRes.body.items.map(formatNamespace);

    res.json({
      success: true,
      count: namespaces.length,
      namespaces: namespaces,
    });
  } catch (err) {
    console.error("Error listing namespaces:", err);
    res.status(500).json({
      success: false,
      error: "Failed to list namespaces",
      message: err.message,
    });
  }
});

// API endpoint to list pods in a specific namespace
app.get("/api/namespaces/:namespace/pods", async (req, res) => {
  try {
    const { namespace } = req.params;
    const podsRes = await k8sApi.listNamespacedPod(namespace);
    const pods = podsRes.body.items.map(formatPod);

    res.json({
      success: true,
      count: pods.length,
      namespace: namespace,
      pods: pods,
    });
  } catch (err) {
    console.error(`Error listing pods in namespace ${namespace}:`, err);
    res.status(500).json({
      success: false,
      error: `Failed to list pods in namespace ${namespace}`,
      message: err.message,
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Kubernetes API server is running",
    timestamp: new Date().toISOString(),
  });
});

// Serve frontend files for all other routes (this enables client-side routing)
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../frontend/dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

module.exports = app;
