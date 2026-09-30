import type * as THREE from 'three';

import { fragmentShaderFunction } from './fragment_shader_fn';

export const updateVelocityFn = fragmentShaderFunction<{
  positions: THREE.Texture;
  velocity: THREE.Texture;
  delta: number;
}>(
  {
    positions: null,
    velocity: null,
    delta: null,
  },
  `precision highp float;
precision highp sampler2D;

varying vec2 vUv;
uniform sampler2D velocity;
uniform sampler2D positions;
uniform float delta;

float reflectIfNeeded(float p, float v) {
  if (p < -127. && v < 0.) {
    return -1. * v;
  } else if (p > 128. && v > 0.) {
   return -1. * v;
  }

  return v;
}

void main() {
  vec3 offset = texture2D( positions, vUv ).xyz;
  vec3 vel = texture2D( velocity, vUv ).xyz;

  gl_FragColor = vec4(
    reflectIfNeeded(offset.x, vel.x), 
    reflectIfNeeded(offset.y, vel.y),
    reflectIfNeeded(offset.z, vel.z),
    0.
  );
}
`
);
