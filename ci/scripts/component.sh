#!/bin/bash -eux

pushd dis-data-admin-ui
    make test-component PLAYWRIGHT_WORKERS=2
popd
