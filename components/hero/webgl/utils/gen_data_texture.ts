import * as THREE from 'three';

export function genDataTexture({
  width,
  height,
  gen,
}: {
  width: number;
  height: number;
  gen: (idx: number) => [number, number, number, number];
}) {
  const data = new Float32Array(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const [x, y, z, w] = gen(i);

    const idx = i * 4;
    data[idx] = x;
    data[idx + 1] = y;
    data[idx + 2] = z;
    data[idx + 3] = w;
  }

  const texture = new THREE.DataTexture(
    data,
    width,
    height,
    THREE.RGBAFormat,
    THREE.FloatType
  );
  texture.needsUpdate = true;

  return texture;
}
