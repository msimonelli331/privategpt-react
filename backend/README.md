# Kubernetes API Server for PrivateGPT

This is a Node.js backend server that provides a REST API for interacting with Kubernetes clusters. It's designed to be used with the PrivateGPT React application to provide Kubernetes namespace and pod information.

## Features

- List all Kubernetes namespaces
- List pods within a specific namespace
- Health check endpoint
- Error handling and logging
- Support for both in-cluster and local kubeconfig deployment

## Installation

```bash
cd backend
pnpm install
```

## Usage

### Development

```bash
pnpm run dev
```

### Production

```bash
pnpm start
```

## API Endpoints

### GET /api/namespaces
List all namespaces in the Kubernetes cluster

**Response:**
```json
{
  "success": true,
  "count": 5,
  "namespaces": [
    {
      "name": "default",
      "uid": "12345-67890-abcde-fghij",
      "creationTimestamp": "2023-01-01T00:00:00Z",
      "status": "Active",
      "labels": {},
      "annotations": {}
    }
  ]
}
```

### GET /api/namespaces/:namespace/pods
List all pods in a specific namespace

**Response:**
```json
{
  "success": true,
  "count": 3,
  "namespace": "default",
  "pods": [
    {
      "name": "my-pod-12345",
      "namespace": "default",
      "status": "Running",
      "nodeName": "node-1",
      "creationTimestamp": "2023-01-01T00:00:00Z",
      "labels": {},
      "annotations": {},
      "containers": [
        {
          "name": "my-container",
          "image": "nginx:latest",
          "ports": []
        }
      ]
    }
  ]
}
```

### GET /health
Health check endpoint

**Response:**
```json
{
  "success": true,
  "message": "Kubernetes API server is running",
  "timestamp": "2023-01-01T00:00:00Z"
}
```

## Configuration

The server will automatically try to load Kubernetes configuration in this order:

1. From the cluster (for in-cluster deployments)
2. From the kubeconfig file specified by the `KUBECONFIG` environment variable
3. From `~/.kube/config` (default kubeconfig location)

## Environment Variables

- `PORT` - Port to run the server on (default: 3000)
- `KUBECONFIG` - Path to kubeconfig file (optional)

## Dependencies

- `@kubernetes/client-node` - Kubernetes client library
- `express` - Web framework
- `nodemon` - Development server with auto-restart

## License

MIT