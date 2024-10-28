#!/bin/bash -eux

pushd dis-data-admin-ui
	corepack enable	
	yarn set version stable	
	yarn	
  make lint
popd
