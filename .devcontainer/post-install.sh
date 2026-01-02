#!/bin/bash
set -x

install_pnpm() {
    curl -fsSL https://get.pnpm.io/install.sh | sh -
    source /root/.bashrc

    pnpm -v
}

install_cline() {
    install_npm
    apt update -y
    apt install -y python3 make gcc g++
    npm install -g cline

    cline version
}

install_helm() {
    curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-4 | bash

    helm version
}

docker --version
node -v
npm -v
install_pnpm
install_helm
install_cline

pushd frontend
pnpm install
popd

pushd backend
pnpm install
popd
