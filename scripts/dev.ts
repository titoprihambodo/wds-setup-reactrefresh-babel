import webpack, {Configuration} from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import chalk from 'chalk';
import path from 'path';
import webpackConfig from './webpack.config';
import {setupServer} from '../src/server';

// webpack-dev-server port
const WDS_PORT = 8080;

/**
 * ------------------
 * Webpack(API) Setup
 * ------------------
 */
const config = webpackConfig as Configuration;

// setup the compiler
let compiler;
try {
  compiler = webpack(config);
} catch (error) {
  console.log(chalk.red("Failed to compile."));
  console.log();
  console.log(error.message || error);
  console.log();
  process.exit(1);
}
compiler.hooks.invalid.tap("invalid", () => {
  console.log("Compiling...");
});
compiler.hooks.done.tap("done", async (stats) => {
  console.log("Done");
});

// create DevServerConfig
const devServerConfig = {
  ...webpackConfig.devServer,
  static: {
    directory: path.join(__dirname, '..', 'dist', 'assets'),
    publicPath: '/assets',
  },
  port: WDS_PORT,
  allowedHosts: 'all',
  headers: {
    "Access-Control-Allow-Origin": "*",
    // "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    // "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
  },
}

// launch the webpackdevserver and listen to port
const devServer = new webpackDevServer(devServerConfig, compiler);
const runDevServer =  async () => {
  console.log(chalk.cyan("Starting the wds...\n"));
  console.log(chalk.yellow(`WDS_PORT: ${WDS_PORT}`));
  await devServer.start();
}

/**
 * ------------
 * Server Setup
 * ------------
 */
async function start() {
  await runDevServer();
  await setupServer();
}

async function bootstrap() {
  try {
    console.log('starting bootstrap');
    await start();
  } catch (error) {
    console.error('can not bootstrap server.', error);
    throw error;
  }
}

/**
 * -------------------------------------------------------
 * run server by calling bootstrap() and handling error (by shutting down the server)
 * -------------------------------------------------------
 */
bootstrap().catch(() => {
  process.exit(1);
})