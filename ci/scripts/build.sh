#!/bin/bash -eux

pushd dis-data-admin-ui
    npm ci
    export NEXT_TELEMETRY_DISABLED=1
    make build
    cp -r .next/standalone ../build
    cp -r .next/static ../build
    cp Dockerfile.concourse ../build
popd
