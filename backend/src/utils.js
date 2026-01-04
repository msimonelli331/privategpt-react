// Utility functions for Kubernetes operations
const k8s = require("@kubernetes/client-node");

// Create Kubernetes client instance
const createK8sClient = () => {
  const kc = new k8s.KubeConfig();

  // Try to load from cluster first (for in-cluster deployment)
  try {
    kc.loadFromCluster();
    console.log("Loaded Kubernetes configuration from cluster");
  } catch (err) {
    console.log("Failed to load from cluster, trying from file:", err.message);
    // Fallback to loading from kubeconfig file
    try {
      kc.loadFromFile(process.env.KUBECONFIG || "~/.kube/config");
      console.log("Loaded Kubernetes configuration from file");
    } catch (fileErr) {
      console.error(
        "Failed to load Kubernetes configuration from file:",
        fileErr.message
      );
      throw new Error("Could not load Kubernetes configuration");
    }
  }

  return kc;
};

// Get Kubernetes API client
const getK8sApiClient = (apiType) => {
  const kc = createK8sClient();
  return kc.makeApiClient(apiType);
};

// Get custom resource API client for PrivateGPTInstance
const getCustomResourceApiClient = () => {
  const kc = createK8sClient();
  return kc.makeApiClient(k8s.CustomObjectsApi);
};

// Format namespace data
const formatNamespace = (namespace) => ({
  name: namespace.metadata.name,
  uid: namespace.metadata.uid,
  creationTimestamp: namespace.metadata.creationTimestamp,
  status: namespace.status.phase,
  labels: namespace.metadata.labels || {},
  annotations: namespace.metadata.annotations || {},
});

// Format pod data
const formatPod = (pod) => ({
  name: pod.metadata.name,
  namespace: pod.metadata.namespace,
  status: pod.status.phase,
  nodeName: pod.spec.nodeName,
  creationTimestamp: pod.metadata.creationTimestamp,
  labels: pod.metadata.labels || {},
  annotations: pod.metadata.annotations || {},
  containers: pod.spec.containers.map((container) => ({
    name: container.name,
    image: container.image,
    ports: container.ports || [],
  })),
});

// Format PrivateGPTInstance data
const formatPrivateGPTInstance = (instance) => ({
  name: instance.metadata.name,
  namespace: instance.metadata.namespace,
  uid: instance.metadata.uid,
  creationTimestamp: instance.metadata.creationTimestamp,
  labels: instance.metadata.labels || {},
  annotations: instance.metadata.annotations || {},
  spec: instance.spec || {},
  status: instance.status || {},
});

// List NamespacedCustomObjects (PrivateGPTInstance)
const listPrivateGPTInstances = async (namespace) => {
  const customApi = getCustomResourceApiClient();
  try {
    console.log(
      `Attempting to list PrivateGPTInstances in namespace: ${namespace}`
    );
    console.log(`Group parameter should be: 'privategpt.eirl'`);

    const response = await customApi.listNamespacedCustomObject(
      "privategpt.eirl", // group
      "v1alpha1", // version
      namespace, // namespace
      "privategptinstances" // plural
    );
    console.log(
      `Successfully retrieved ${response.body.items.length} instances`
    );
    return response.body.items.map(formatPrivateGPTInstance);
  } catch (err) {
    console.error(
      `Error listing PrivateGPTInstances in namespace ${namespace}:`,
      err
    );
    console.error("Error details:", {
      message: err.message,
      stack: err.stack,
      api: err.api,
      method: err.method,
      field: err.field,
    });
    throw err;
  }
};

// Create NamespacedCustomObject (PrivateGPTInstance)
const createPrivateGPTInstance = async (namespace, instanceData) => {
  const customApi = getCustomResourceApiClient();
  try {
    console.log(
      `Attempting to create PrivateGPTInstance in namespace: ${namespace}`
    );

    const customObject = {
      apiVersion: "privategpt.eirl/v1alpha1",
      kind: "PrivateGPTInstance",
      metadata: {
        name: instanceData.name,
        namespace: namespace,
        labels: instanceData.labels || {},
        annotations: instanceData.annotations || {},
      },
      spec: {
        ollamaURL: instanceData.ollamaURL,
        image: instanceData.image,
        domain: instanceData.domain,
      },
    };

    console.log(
      "Custom object to create:",
      JSON.stringify(customObject, null, 2)
    );

    const response = await customApi.createNamespacedCustomObject(
      "privategpt.eirl", // group
      "v1alpha1", // version
      namespace, // namespace
      "privategptinstances", // plural
      customObject
    );

    console.log("Successfully created instance");
    return formatPrivateGPTInstance(response.body);
  } catch (err) {
    console.error(
      `Error creating PrivateGPTInstance in namespace ${namespace}:`,
      err
    );
    console.error("Error details:", {
      message: err.message,
      stack: err.stack,
      api: err.api,
      method: err.method,
      field: err.field,
    });
    throw err;
  }
};

module.exports = {
  createK8sClient,
  getK8sApiClient,
  getCustomResourceApiClient,
  formatNamespace,
  formatPod,
  formatPrivateGPTInstance,
  listPrivateGPTInstances,
  createPrivateGPTInstance,
};
