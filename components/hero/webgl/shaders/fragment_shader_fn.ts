import { shaderMaterial } from '@react-three/drei';

import { functionDefinition } from '../gpgpu/fn';

type TWithNullableValues<T extends Record<string, any>> = {
  [K in keyof T]: T[K] | null;
};

export function fragmentShaderFunction<T extends Record<string, any>>(
  uniforms: TWithNullableValues<T>,
  fs: string
) {
  const PassThruShaderMaterial = shaderMaterial(
    uniforms,
    `varying vec2 vUv;
  
  void main() {
      vUv = vec2(uv.x, uv.y);
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }`,
    fs
  );

  return functionDefinition<T>({
    material: PassThruShaderMaterial,
  });
}
