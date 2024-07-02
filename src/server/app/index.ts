import express, {Express, Router} from 'express';
import path from 'path';
import nunjucks from 'nunjucks';
import http from 'http';
import {createRouter} from './router';

export interface AppOptions {
  app: Express;
}

/**
 * --------------------
 * @function createApp
 * @param options 
 * --------------------
 */
export async function createApp(options: AppOptions) {
  configureView(options);
  const {app} = options;
  
  // assets in production env
  const staticPath = path.resolve(__dirname, '..', '..', 'dist', 'assets');
  app.use('/assets', express.static(staticPath));

  app.use('/', await createRouter());
}

/**
 * -------------------------
 * @function listenAndServe
 * @param app 
 * @param port 
 * @returns 
 * -------------------------
 */
export const listenAndServe = (
  app: Express,
  port: number,
): Promise<http.Server> => {
  return new Promise(resolve => {
    // listen on the designated port
    const httpServer = app.listen(port, () => resolve(httpServer));
  })
}

/**
 * ------------------------
 * @function configureView - setting up template (nunjucks)
 * @param options 
 * ------------------------
 */
function configureView(options: AppOptions) {
  const {app} = options;

  const views = path.join(__dirname, '..', 'views');
  app.set('views', views);

  nunjucks.configure(views, {
    autoescape: true,
    express: app,
    // In development, we should enable file watch mode, and prevent file caching.
    watch: true,
    noCache: true,
    // Trim whitespace in templates.
    trimBlocks: true,
    lstripBlocks: true,
  });

  app.set('view engine', 'html');
}