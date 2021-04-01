## Repo Information

This repo was set up using [the JB2 plugin template](https://github.com/GMOD/jbrowse-plugin-template)

Here is some information on using this codebase

### Setup

Run `yarn` (or `rm yarn.lock && npm install` to use npm instead of yarn) to install the necessary dependencies.

After this, run `yarn setup` (or `npm run setup`).
This configures your project, and adds a build of JBrowse 2 that can be used to test your plugin during development.

### Build

```console
$ yarn build ## or `npm run build`
```

### Development

To develop against JBrowse Web:

- Start a development version of JBrowse Web (see
  [here](https://github.com/GMOD/jbrowse-components/blob/master/CONTRIBUTING.md))
- In this project, run `yarn start` (or `npm run start`)
- Assuming JBrowse Web is being served on port 3000, navigate in your web
  browser to
  http://localhost:3000/?config=http://localhost:9000/jbrowse_config.json
- When you make changes to your plugin, it will automatically be re-built.
  You can then refresh JBrowse Web to see the changes.

### Testing

To test your plugin, there are several commands available:

#### `yarn browse` or `npm run browse`

Launches your local JBrowse 2 build that is used for integration testing, with your
plugin already included in the configuration. Your plugin must also be running
(`yarn start` or `npm run start`).

#### `yarn test` or `npm test`

Runs any unit tests defined during plugin development.

#### `yarn test:cy` or `npm run test:cy`

Runs the [cypress](https://www.cypress.io/) integration tests for your plugin.
Both the plugin and `browse` must already be running.

#### `yarn e2e` or `npm run e2e`

Starts up the JBrowse 2 build as well as your plugin, and runs the [cypress](https://www.cypress.io/)
integration tests against them. Closes both resources after tests finish.

#### `yarn cypress` or `npm run cypress`

Launches the [cypress](https://www.cypress.io/) test runner, which can be very
useful for writing integration tests for your plugin. Both the plugin and `browse`
must already be running.
