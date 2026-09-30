import type * as THREE from 'three';

import { passThruFn } from '../shaders/passthru';

export function writeTexture(
  renderer: THREE.WebGLRenderer,
  texture: THREE.Texture
) {
  const passThrough = passThruFn();

  return (output: THREE.WebGLRenderTarget) =>
    passThrough({
      inputs: { srcdata: texture },
      renderer,
      output,
    });
}
