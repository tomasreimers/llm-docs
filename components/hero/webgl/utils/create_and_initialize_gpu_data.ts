import type * as THREE from 'three';

import { createGPUData } from '../gpgpu/data';
import { genDataTexture } from './gen_data_texture';
import { writeTexture } from './write_texture';

export function createAndInitializeGPUData({
  width,
  height,
  renderer,
  gen,
}: {
  width: number;
  height: number;
  renderer: THREE.WebGLRenderer;
  gen: (idx: number) => [number, number, number, number];
}) {
  const data = createGPUData({
    width,
    height,
  });

  const init = writeTexture(renderer, genDataTexture({ width, height, gen }));
  init(data);

  return data;
}
