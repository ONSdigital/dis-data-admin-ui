#!/bin/bash -eux

pushd dis-data-admin-ui
  npm ci
  make lint
popd
