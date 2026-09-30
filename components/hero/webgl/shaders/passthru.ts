import type * as THREE from 'three';

import { fragmentShaderFunction } from './fragment_shader_fn';

export const passThruFn = fragmentShaderFunction<{
  srcdata: THREE.Texture;
}>(
  {
    srcdata: null,
  },
  `precision highp float;
precision highp sampler2D;

varying vec2 vUv;
uniform sampler2D srcdata;

void main() {
  gl_FragColor = texture2D( srcdata, vUv );
}`
);
