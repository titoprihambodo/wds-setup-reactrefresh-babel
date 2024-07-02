import {Router} from 'express';
import {createManifestLoader} from './assetsManifest';

/**
 * ----------------------
 * @function createRouter - server app routing
 * @returns 
 * ----------------------
 */
export async function createRouter(){
  const router = Router();

  // assets from webpack-dev-server(Wds)
  const manifest = createManifestLoader();
  const entrypointLoader = manifest.createEntrypointLoader('main');
  const entrypoint = await entrypointLoader();
  const staticURI = `http://127.0.0.1:8080/`;

  router.get(
    "/",
    async (req, res, next) => {
      res.render('client', {entrypoint, staticURI});
    }
  );
  
  router.get('/test', 
    (req, res, next) => res.send('Hellow!')
  );

  return router;
}