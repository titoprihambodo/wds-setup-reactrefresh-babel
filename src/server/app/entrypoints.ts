import {Asset, Manifest} from './assetsManifest';

export interface RawEntrypoint {
  assets: Record<string, string[]>;
}
export type Entrypoint = Record<string, Asset[]>;

/**
 * --------------------
 * @class Entrypoints - stores entrypoints from the assets manifest
 * @param manifest - the assets manifest
 * --------------------
 */
export default class Entrypoints {
  private entrypoints = new Map<string, Entrypoint>();

  constructor(manifest: Manifest) {
    for (const entry in manifest.entrypoints) {
      if (!Object.prototype.hasOwnProperty.call(manifest.entrypoints, entry)) {
        continue;
      }
      const entrypoint: Entrypoint = {};
      // Iterate over the extension's in the entrypoint.
      for (const extension in manifest.entrypoints[entry].assets) {
        if (
          !Object.prototype.hasOwnProperty.call(
            manifest.entrypoints[entry].assets,
            extension
          )
        ) {
          continue;
        }
        // Create the extension in the entrypoint.
        entrypoint[extension] = [];
        // Grab the files in the extension.
        const assets = manifest.entrypoints[entry].assets[extension];
        // Iterate over the src field for each of the files.
        for (const src of assets) {
          let integrity = "";
          // Search for the entry with intgrity in the assets.
          for (const name in manifest) {
            if (
              name !== "entrypoints" &&
              !Object.prototype.hasOwnProperty.call(manifest, name)
            ) {
              continue;
            }
  
            // Grab the asset.
            const asset = manifest[name];
  
            // Check to see if the asset is a match.
            if (asset.src === src) {
              integrity = asset.integrity;
              break;
            }
          }
          entrypoint[extension].push({ src, integrity });
        }
        this.entrypoints.set(entry, entrypoint);
      }
    }
  }

  // method `get`
  public get(name: string): Readonly<Entrypoint> {
    const entrypoint = this.entrypoints.get(name);
    if (!entrypoint) {
      throw new Error(`Entrypoint ${name} does not exist in the manifest`);
    }

    return entrypoint;
  }
}