import * as THREE from 'three';

export function createGPUData({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  const options = {
    minFilter: THREE.NearestFilter, //important as we want to sample square pixels
    magFilter: THREE.NearestFilter, //
    format: THREE.RGBAFormat,
    type: THREE.FloatType, //important as we need precise coordinates (not ints)
    generateMipMaps: false,
  };
  const target = new THREE.WebGLRenderTarget(width, height, options);
  return target;
}
