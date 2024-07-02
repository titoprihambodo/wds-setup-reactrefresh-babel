import express, {Express} from 'express';
import {AppOptions, createApp, listenAndServe} from './app';

/**
 * @function setupServer - setup to run the server app
 */
export async function setupServer() {
  const app: Express = express();
  const PORT = 5000;

  // if we need more options to setup server app
  // const options: AppOptions = {
  //   app,
  // }

  await createApp({app});
  await listenAndServe(app, PORT);
  console.log(`Listening on port ${PORT}!`);
}