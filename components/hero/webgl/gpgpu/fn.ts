import * as THREE from 'three';

export function functionDefinition<T extends Record<string, any>>({
  material: materialClass,
}: {
  material: { new (args: { precision: 'highp' }): THREE.ShaderMaterial };
}) {
  return () => {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -1,
      1,
      1,
      -1,
      1 / Math.pow(2, 53),
      1
    );

    //5 the simulation:
    //create a bi-unit quadrilateral and uses the simulation material to update the Float Texture
    const geom = new THREE.BufferGeometry();
    geom.setAttribute(
      'position',
      new THREE.BufferAttribute(
        new Float32Array([
          -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0,
        ]),
        3
      )
    );
    geom.setAttribute(
      'uv',
      new THREE.BufferAttribute(
        new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]),
        2
      )
    );
    const material = new materialClass({
      precision: 'highp',
    });
    scene.add(new THREE.Mesh(geom, material));

    function run({
      inputs,
      renderer,
      output,
    }: {
      inputs: T;
      renderer: THREE.WebGLRenderer;
      output: THREE.WebGLRenderTarget | null;
    }) {
      renderer.setRenderTarget(output);
      for (const key in inputs) {
        material.uniforms[key].value = inputs[key];
      }
      renderer.render(scene, camera);
    }

    return run;
  };
}
