import type * as THREE from 'three';

import { fragmentShaderFunction } from './fragment_shader_fn';

export const updateRotationsFn = fragmentShaderFunction<{
  spins: THREE.Texture;
  rotations: THREE.Texture;
  delta: number;
}>(
  {
    spins: null,
    rotations: null,
    delta: null,
  },
  `precision highp float;
precision highp sampler2D;

varying vec2 vUv;
uniform sampler2D spins;
uniform sampler2D rotations;
uniform float delta;

vec4 qmul(vec4 q1, vec4 q2) {
  return vec4(
    q2.xyz * q1.w + q1.xyz * q2.w + cross(q1.xyz, q2.xyz),
    q1.w * q2.w - dot(q1.xyz, q2.xyz)
  );
}

vec4 velocityToQuarternion(vec3 v, float t) {
  float norm = sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  float normX = v.x / norm;
  float normY = v.y / norm;
  float normZ = v.z / norm;

  float rotation = t * norm * 3.14159265;

  float sinRotation = sin(rotation / 2.);
  float cosRotation = cos(rotation / 2.);

  return vec4(normX * sinRotation, normY * sinRotation, normZ * sinRotation, cosRotation);
}

void main() {
  vec4 rot = texture2D( rotations, vUv );
  vec4 sp = texture2D( spins, vUv );
  gl_FragColor = qmul(velocityToQuarternion(sp.xyz, delta), rot);
}`
);
