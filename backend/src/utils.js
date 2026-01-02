// Utility functions for Kubernetes operations
const k8s = require('@kubernetes/client-node');

// Create Kubernetes client instance
const createK8sClient = () => {
    const kc = new k8s.KubeConfig();
    
    // Try to load from cluster first (for in-cluster deployment)
    try {
        kc.loadFromCluster();
        console.log('Loaded Kubernetes configuration from cluster');
    } catch (err) {
        console.log('Failed to load from cluster, trying from file:', err.message);
        // Fallback to loading from kubeconfig file
        try {
            kc.loadFromFile(process.env.KUBECONFIG || '~/.kube/config');
            console.log('Loaded Kubernetes configuration from file');
        } catch (fileErr) {
            console.error('Failed to load Kubernetes configuration from file:', fileErr.message);
            throw new Error('Could not load Kubernetes configuration');
        }
    }
    
    return kc;
};

// Get Kubernetes API client
const getK8sApiClient = (apiType) => {
    const kc = createK8sClient();
    return kc.makeApiClient(apiType);
};

// Format namespace data
const formatNamespace = (namespace) => ({
    name: namespace.metadata.name,
    uid: namespace.metadata.uid,
    creationTimestamp: namespace.metadata.creationTimestamp,
    status: namespace.status.phase,
    labels: namespace.metadata.labels || {},
    annotations: namespace.metadata.annotations || {}
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
    containers: pod.spec.containers.map(container => ({
        name: container.name,
        image: container.image,
        ports: container.ports || []
    }))
});

module.exports = {
    createK8sClient,
    getK8sApiClient,
    formatNamespace,
    formatPod
};