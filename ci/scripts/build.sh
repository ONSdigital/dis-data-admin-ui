#!/bin/bash -eux

pushd dis-data-admin-ui
  make build
  cp build/dis-data-admin-ui Dockerfile.concourse ../build
popd
