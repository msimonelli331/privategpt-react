# # PrivateGPT React

Custom UI for PrivateGPT. Starting point forked from [here](https://github.com/frgarciames/privategpt-react). The frontend has been modified since the fork and a backend api was added to support interfacing with the kubernetes API. These modifications relate to these repos:

1. [PrivateGPT](https://github.com/msimonelli331/PrivateGPT) backend running in kubernetes.
2. [privategpt-operator](https://github.com/msimonelli331/privategpt-operator) for spinning up PrivateGPT backend instances on creation of a custom resource.

The purpose of these repos is to support running multiple PrivateGPT instances, each with their own unique files

## Usage

### Dev

1. Run the frontend in Terminal 1

   ```bash
   pushd frontend
   pnpm dev
   popd
   ```

2. Run the backend in Terminal 2

   ```bash
   pushd backend
   pnpm start
   popd
   ```

### Prod

1. Build the frontend

   ```bash
   pushd frontend
   pnpm build
   popd
   ```

2. Run the backend, that points to the frontend static files

   ```bash
   pushd backend
   pnpm start
   popd
   ```

### Installation

```bash
helm repo add privategpt-react https://msimonelli331.github.io/privategpt-react
helm install privategpt-react privategpt-react/privategpt-react --create-namespace -n devops \
-f privategpt-react-values.yaml
```
