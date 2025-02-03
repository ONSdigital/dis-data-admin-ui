# dis-data-admin-ui
The dataset publishing UI used for datasets on the ONS website.

### Getting started

To run dis-data-admin-ui locally:

1. [nvm](https://github.com/nvm-sh/nvm) installed:

   ```shell
   brew install nvm
   ```

   :warning: Make sure to follow the instructions provided at the end of the install to configure up your shell profile.

1. The node version specified in [`.nvmrc`](./.nvmrc) installed through nvm:

   ```shell
   nvm install
   ```

1. Start the app:

   ```shell
   make debug
   ```

### Dependencies

* No further dependencies other than those defined in `go.mod`

### Configuration

| Environment variable         | Default                   | Description
| ---------------------------- | ------------------------- | -----------
| BIND_ADDR                    | :29400                    | The host and port to bind to
| API_ROUTER_URL               | http://localhost:23200/v1 | URL of API Router
| GRACEFUL_SHUTDOWN_TIMEOUT    | 5s                        | The graceful shutdown timeout in seconds (`time.Duration` format)
| HEALTHCHECK_INTERVAL         | 30s                       | Time between self-healthchecks (`time.Duration` format)
| HEALTHCHECK_CRITICAL_TIMEOUT | 90s                       | Time to wait until an unhealthy dependent propagates its state to make this app unhealthy (`time.Duration` format)

### Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for details.

### License

Copyright © 2024, Office for National Statistics (https://www.ons.gov.uk)

Released under MIT license, see [LICENSE](LICENSE.md) for details.
