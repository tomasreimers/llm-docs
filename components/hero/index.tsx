'use client';

import {
  type Node as ThreeNode,
  Canvas,
  extend,
  useFrame,
  useThree,
} from '@react-three/fiber';
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
} from '@react-three/postprocessing';
import { Carattere } from 'next/font/google';
import {
  type MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as THREE from 'three';

import s from './Hero.module.scss';
import { useScrollProgress } from './hooks/scroll_progress';
import { createGPUData } from './webgl/gpgpu/data';
import { initRandom } from './webgl/initializers/random';
import { initRandomRotation } from './webgl/initializers/random_rotation';
import { passThruFn } from './webgl/shaders/passthru';
import { updatePositionsFn } from './webgl/shaders/positions';
import { ParticleRenderMaterial } from './webgl/shaders/render';
import { updateRotationsFn } from './webgl/shaders/rotations';
import { updateVelocityFn } from './webgl/shaders/velocity';
import { createAndInitializeGPUData } from './webgl/utils/create_and_initialize_gpu_data';

const cursive = Carattere({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

extend({
  ParticleRenderMaterial,
});

declare module '@react-three/fiber' {
  interface ThreeElements {
    particleRenderMaterial: ThreeNode<
      THREE.Material & {
        positions: THREE.Texture;
        rotations: THREE.Texture;
        rayOrigin: THREE.Vector3;
        rayDirection: THREE.Vector3;
        debugDistanceToMouse: boolean;
      },
      typeof ParticleRenderMaterial
    >;
  }
}

export function Hero() {
  const [offset] = useState(() => new THREE.Vector2(1e-3, 5e-4));
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (ev: MouseEvent) => {
      pointer.current = {
        x: (ev.clientX / window.innerWidth) * 2 - 1,
        y: 1 - 2 * (ev.clientY / window.innerHeight),
      };
    };

    document.addEventListener('mousemove', handler);
    return () => document.removeEventListener('mousemove', handler);
  }, []);

  const element = useRef<HTMLDivElement>(null);
  const wrapperElement = useRef<HTMLDivElement>(null);

  const scrollProgress = useScrollProgress(element, wrapperElement);
  const scrollProgressCappedAtOne = Math.min(scrollProgress, 1);

  const [clientPosition, setClientPosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    windowWidth: 0,
    windowHeight: 0,
  });
  useEffect(() => {
    const handler = () => {
      if (element.current) {
        const rect = element.current.getBoundingClientRect();

        setClientPosition({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
        });
      }
    };

    handler();

    document.addEventListener('scroll', handler);
    window.addEventListener('resize', handler);
    return () => {
      document.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    };
  }, []);

  const popoverStyle = useMemo(() => {
    if (scrollProgressCappedAtOne === 1) {
      return {
        borderRadius: 16,
      };
    }

    if (clientPosition.windowHeight === 0 && clientPosition.windowWidth === 0) {
      return {
        position: 'fixed' as const,
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
      };
    }

    const withEasing = easeOutCubic(scrollProgressCappedAtOne);

    return {
      position: 'fixed' as const,
      left: clientPosition.x * withEasing,
      top: clientPosition.y * withEasing,
      width:
        clientPosition.windowWidth -
        (clientPosition.windowWidth - clientPosition.width) * withEasing,
      height:
        clientPosition.windowHeight -
        (clientPosition.windowHeight - clientPosition.height) * withEasing,
      borderRadius: 16 * withEasing,
    };
  }, [clientPosition, scrollProgressCappedAtOne]);

  return (
    <div
      className={s.heroWrapper}
      ref={wrapperElement}
      style={{
        position: 'relative',
        zIndex: scrollProgressCappedAtOne === 1 ? undefined : 1000,
      }}
    >
      <div className={s.hero} ref={element}>
        <div className={s.heroPopover} style={popoverStyle}>
          <div className={s.canvasHolder}>
            <Canvas camera={{ position: [0, 0, -1] }}>
              <Particles
                pointer={pointer}
                scrollProgress={scrollProgressCappedAtOne}
              />
              <EffectComposer>
                <ChromaticAberration
                  radialModulation={true}
                  modulationOffset={0.5}
                  offset={offset}
                />
                <Bloom
                  luminanceThreshold={0.5}
                  luminanceSmoothing={0.7}
                  radius={0.9}
                  mipmapBlur={true}
                />
              </EffectComposer>
            </Canvas>
          </div>
          <div className={s.section}>
            <div
              className={s.heroCover}
              style={{
                transform: `scale(${1 + (1 - easeOutCubic(scrollProgressCappedAtOne)) * Math.min(1, Math.min(clientPosition.windowWidth / clientPosition.width, clientPosition.windowHeight / clientPosition.height) - 1)})`,
                zIndex: scrollProgressCappedAtOne === 1 ? 1 : 1001,
              }}
            >
              <div className={s.heroTitle}>Frontend development</div>
              <div className={s.heroFor}>
                <div className={s.heroForFlair} />
                <div className={cursive.className}>For</div>
                <div className={s.heroForFlair} />
              </div>
              <div className={s.heroTitle}>Backend developers</div>
            </div>
            <Chevrons
              style={{
                opacity: scrollProgress !== 0 ? 0 : 1,
                transition: 'opacity 1s',
                zIndex: scrollProgressCappedAtOne === 1 ? 1 : 1001,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

function Particles({
  pointer,
  scrollProgress,
}: {
  pointer: MutableRefObject<{
    x: number;
    y: number;
  }>;
  scrollProgress: number;
}) {
  const gl = useThree((state) => state.gl);
  const [particles] = useState(() => initParticles(gl));
  const renderMaterialRef = useRef<
    THREE.Material & {
      positions: THREE.Texture;
      rotations: THREE.Texture;
      rayOrigin: THREE.Vector3;
      rayDirection: THREE.Vector3;
      debugDistanceToMouse: boolean;
    }
  >(null);

  // TODO: We should take into account the delta in time and move it by that much
  useFrame(({ gl, scene, camera }, delta) => {
    const easeIn = easeOutCubic(scrollProgress);
    const zoomOut = 100 * (1 - easeIn);

    // Update camera
    camera.position.set(0, 0, -zoomOut);
    camera.rotation.set(
      -1 * pointer.current.y * Math.PI * 0.1,
      Math.PI + -1 * pointer.current.x * Math.PI * 0.1,
      0
    );

    // Update particles
    particles.update({ gl, delta });

    // Render frame
    gl.setRenderTarget(null);
    gl.render(scene, camera);
  }, 1);

  const [geometry] = useState(() => {
    const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.01, 5);

    // Unfortunately the only way to do flat shading
    // https://discourse.threejs.org/t/flatshading-on-buffergeometry-or-imported-model/24241
    const nonIndexedGeometry = geometry.toNonIndexed();
    nonIndexedGeometry.computeVertexNormals();
    const attr = new THREE.InstancedBufferAttribute(particles.indicies, 2);
    nonIndexedGeometry.setAttribute('pindex', attr);

    return nonIndexedGeometry;
  });

  return (
    <instancedMesh
      args={[undefined, undefined, particles.total]}
      frustumCulled={false}
      geometry={geometry}
    >
      <particleRenderMaterial
        ref={renderMaterialRef}
        positions={particles.output.positions.texture}
        rotations={particles.output.rotations.texture}
      />
    </instancedMesh>
  );
}

function initParticles(renderer: THREE.WebGLRenderer) {
  const width = 128;
  const height = 128;

  const l = width * height;
  const indicies = new Float32Array(l * 2);
  for (let i = 0; i < l; i++) {
    const i3 = i * 2;
    indicies[i3] = (i % width) / width;
    indicies[i3 + 1] = i / width / height;
  }

  const newPositions = createAndInitializeGPUData({
    width,
    height,
    renderer,
    gen: initRandom(-127, 128),
  });
  const newVelocity = createAndInitializeGPUData({
    width,
    height,
    renderer,
    gen: initRandom(-1, 1),
  });
  const newRotations = createAndInitializeGPUData({
    width,
    height,
    renderer,
    gen: initRandomRotation(-0.5, 0.5),
  });
  const spins = createAndInitializeGPUData({
    width,
    height,
    renderer,
    gen: initRandom(-0.5, 0.5),
  });

  const oldVelocity = createGPUData({
    width,
    height,
  });
  const oldPositions = createGPUData({
    width,
    height,
  });
  const oldRotations = createGPUData({
    width,
    height,
  });

  const velocitySimulation = updateVelocityFn();
  const positionSimulation = updatePositionsFn();
  const rotationSimulation = updateRotationsFn();
  const loopback = passThruFn();

  return {
    // necessary
    total: height * width,
    indicies,
    update: ({ gl, delta }: { gl: THREE.WebGLRenderer; delta: number }) => {
      // Velocity
      loopback({
        inputs: { srcdata: newVelocity.texture },
        renderer: gl,
        output: oldVelocity,
      });
      loopback({
        inputs: { srcdata: newPositions.texture },
        renderer: gl,
        output: oldPositions,
      });
      loopback({
        inputs: { srcdata: newRotations.texture },
        renderer: gl,
        output: oldRotations,
      });

      velocitySimulation({
        inputs: {
          velocity: oldVelocity.texture,
          positions: oldPositions.texture,
          delta,
        },
        renderer: gl,
        output: newVelocity,
      });
      positionSimulation({
        inputs: {
          /**
           * Warning: Yes, it looks like this should be new velocities; for whatever reason,
           * when I change this to be new velocities, I do not see points converging on the
           * gravitational center.
           *
           * This doesn't make sense to me. We just computed the velocity to converge... Alas.
           */
          velocity: oldVelocity.texture,
          positions: oldPositions.texture,
          delta,
        },
        renderer: gl,
        output: newPositions,
      });
      rotationSimulation({
        inputs: {
          rotations: oldRotations.texture,
          spins: spins.texture,
          delta,
        },
        renderer: gl,
        output: newRotations,
      });
    },
    output: {
      positions: newPositions,
      rotations: newRotations,
    },
  };
}

const Chevrons = ({ style }: { style: React.CSSProperties }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="40"
      viewBox="0 0 120 120"
      style={style}
    >
      <path
        d="M10 20 L60 45 L110 20"
        fill="none"
        stroke="white"
        strokeWidth="10"
        className={s.chevron}
      />

      <path
        d="M10 45 L60 70 L110 45"
        fill="none"
        stroke="white"
        strokeWidth="10"
        className={s.chevron}
        style={{ animationDelay: '0.2s' }}
      />

      <path
        d="M10 70 L60 95 L110 70"
        fill="none"
        stroke="white"
        strokeWidth="10"
        className={s.chevron}
        style={{ animationDelay: '0.4s' }}
      />
    </svg>
  );
};
