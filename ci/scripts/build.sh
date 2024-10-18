#!/bin/bash -eux

mkdir -p build/dis-data-admin-ui

pushd dis-data-admin-ui
  make build
  cp Dockerfile.concourse ../build
  cp -r dist ../build/dis-data-admin-ui
  cp server.js ../build/dis-data-admin-ui
  cp vite.config.js ../build/dis-data-admin-ui
  cp package.json ../build/dis-data-admin-ui
popd