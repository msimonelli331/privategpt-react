# PrivateGPT React Backend

This is a Node.js backend server that provides a REST API for interacting with Kubernetes clusters. It's designed to be used with the PrivateGPT React application.

## Installation

```bash
pushd backend
pnpm install
popd
```

## Usage

### Development

```bash
pushd backend
pnpm start
popd
```

### Production

```bash
pushd backend
pnpm start
popd
```

## Configuration

The server will automatically try to load Kubernetes configuration From the cluster (for in-cluster deployments)

## Environment Variables

- `PORT` - Port to run the server on (default: 3000)

## Dependencies

- `@kubernetes/client-node` - Kubernetes client library
- `express` - Web framework

## Resources

- https://github.com/kubernetes-client/javascript/blob/master/examples/in-cluster.js
- https://leejjon.medium.com/create-a-react-app-served-by-express-js-node-js-and-add-typescript-33705be3ceda
- https://github.com/Leejjon/frontend-service
- https://stackoverflow.com/questions/68796298/how-do-i-deploy-a-react-app-that-has-a-node-js-server
- https://www.freecodecamp.org/news/how-to-create-a-react-app-with-a-node-backend-the-complete-guide/
- https://stackoverflow.com/questions/79553495/throw-new-typeerrormissing-parameter-name-at-i-debug-url
- https://expressjs.com/en/guide/migrating-5.html#path-syntax
