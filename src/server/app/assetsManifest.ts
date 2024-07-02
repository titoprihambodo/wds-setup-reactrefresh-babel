import {setLongTimeout} from 'long-settimeout';
import fetch from 'node-fetch';
import Entrypoints, {Entrypoint, RawEntrypoint} from './entrypoints';

export interface Asset {
  src: string;
  integrity: string;
}
export type Manifest = {
  entrypoints: Record<string, RawEntrypoint>;
} & Record<string, Asset>;

export type EntrypointLoader = () => Promise<Readonly<Entrypoint>> | null;

/**
 * ----------------------------------------------------------
 * @class AssetManifest - store asset manifest from wds or file
 * @param manifestFileName - string file name of assets manifest
 * @param loadFromWdsURL - string URL of wds assets manifest output
 * ----------------------------------------------------------
 */
export default class AssetManifest {
  private manifestFileName: string;
  private loadFromWdsURL: string;
  private manifest: Manifest | null = null;

  constructor(manifestFileName: string, loadFromWdsURL: string) {
    this.manifestFileName = manifestFileName;
    this.loadFromWdsURL = loadFromWdsURL;

    if (!loadFromWdsURL) {
      // put action to load from file here (production) and store it into this.manifest
    }
  }

  // load method
  public async load(): Promise<Manifest> {
    if (this.loadFromWdsURL) {
      const url = `${this.loadFromWdsURL}/${this.manifestFileName}`
      const fetchManifest = async () => {
        // get the webpack assets information
        const assets = await fetch(url);
        if (!assets.ok) {
          console.error(
            "could not load the generated manifest",
            { manifest: url },
          );
          return null;
        }
        const manifest:Manifest = await assets.json();
        const firstEntrypoint = Object.keys(manifest.entrypoints)[0];
        if (
          !firstEntrypoint ||
          !manifest.entrypoints[firstEntrypoint].assets.js
        ) {
          // No entrypoint found or no js entry for first entrypoint, probably not ready -> retry!
          return null;
        }

        return manifest;
      }

      const fetchManifestAndRetry = async (waitForMS = 1000): Promise<Manifest> => {
        const manifest = await fetchManifest();
        if (manifest) {
          return manifest;
        }
        console.warn(`Failed to load entrypoint, retrying in ${waitForMS}ms`);
        await waitFor(waitForMS);

        return await fetchManifestAndRetry(waitForMS * 1.5);
      }

      return await fetchManifestAndRetry();
    }

    // (in the future) if loaded from file
    if (this.manifest) {
      return this.manifest;
    }
    throw new Error('Failed to load');
  }

  // handle the entrypoint
  public createEntrypointLoader(name: string): EntrypointLoader {
    if (this.loadFromWdsURL) {
      return async () => {
        return new Entrypoints(await this.load()).get(name);
      }
    }
    throw new Error(`Failed to load entrypoint ${name}`);
  }
}

/**
 * --------------------------------
 * @function createManifestLoader - set manifest filename and host url for webpack-dev-server
 * @returns 
 * --------------------------------
 */
export function createManifestLoader() {
  const manifestFileName = 'assets-manifest.json';
  const fromWds = `http://127.0.0.1:8080`; 
  // use below to check if it's development env or production 
  // const fromWds = 
  //   process.env.WDS === 'true'
  //     ? `http://127.0.0.1:8080/${manifestFilename}`
  //     : null;

  return new AssetManifest(manifestFileName, fromWds);
}

function waitFor(ms = 0): Promise<void> {
  return new Promise((resolve) => setLongTimeout(resolve, ms));
}