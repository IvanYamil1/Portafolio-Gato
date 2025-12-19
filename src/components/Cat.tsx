"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { useGallery } from "@/contexts/GalleryContext";

const WALK_SPEED = 2;
const RUN_SPEED = 5;
const ROTATION_SPEED = 3;
const WALK_ANIM_SPEED = 1.8;
const RUN_ANIM_SPEED = 2;

interface CatModelProps {
  isMoving: boolean;
  isRunning: boolean;
  turnDirection: number; // -1 izquierda, 0 recto, 1 derecha
}

function CatModel({ isMoving, isRunning, turnDirection }: CatModelProps) {
  const { scene, animations } = useGLTF("/models/cat.gltf");
  const modelRef = useRef<THREE.Group>(null);
  const { actions } = useAnimations(animations, modelRef);
  const currentTilt = useRef(0);
  const idleTime = useRef(0);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    const runAction = actions["run"];
    if (runAction && isMoving) {
      /* eslint-disable react-hooks/immutability */
      runAction.paused = false;
      runAction.timeScale = isRunning ? RUN_ANIM_SPEED : WALK_ANIM_SPEED;
      /* eslint-enable react-hooks/immutability */
      runAction.reset().fadeIn(0.2).play();
    }
  }, [isMoving, actions, isRunning]);

  // Actualizar velocidad de animación en tiempo real cuando cambia isRunning
  useEffect(() => {
    const runAction = actions["run"];
    if (runAction && isMoving) {
      const targetSpeed = isRunning ? RUN_ANIM_SPEED : WALK_ANIM_SPEED;
      /* eslint-disable-next-line react-hooks/immutability */
      runAction.timeScale = targetSpeed;
    }
  }, [isRunning, actions, isMoving]);

  // Inclinación suave al girar + interpolación de animación al detenerse + idle breathing
  useFrame((_, delta) => {
    if (!modelRef.current) return;

    // Inclinación al girar
    const targetTilt = turnDirection * 0.15;
    currentTilt.current += (targetTilt - currentTilt.current) * 0.1;

    // Animación idle (respiración) cuando está quieto
    let idleRotX = 0;
    let idleY = 0;
    if (!isMoving) {
      idleTime.current += delta;
      // Movimiento sutil de respiración
      idleRotX = Math.sin(idleTime.current * 2) * 0.02; // Cabeceo leve
      idleY = Math.sin(idleTime.current * 3) * 0.005; // Sube y baja muy sutil
    } else {
      idleTime.current = 0;
    }

    modelRef.current.rotation.set(
      idleRotX,
      Math.PI / 2,
      currentTilt.current
    );
    modelRef.current.position.y = idleY;

    // Cuando no se mueve, interpolar hacia el frame 75%
    const runAction = actions["run"];
    if (runAction && !isMoving) {
      const duration = runAction.getClip().duration;
      const targetTime = duration * 0.75;

      /* eslint-disable react-hooks/immutability */
      runAction.paused = false;
      runAction.timeScale = 0;

      // Interpolar suavemente hacia el target
      const diff = targetTime - runAction.time;
      if (Math.abs(diff) > 0.01) {
        runAction.time += diff * 0.1;
      } else {
        runAction.time = targetTime;
      }
      /* eslint-enable react-hooks/immutability */
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={0.015}
      position={[0, 0, 0]}
    />
  );
}

function CatPlaceholder() {
  return (
    <mesh castShadow>
      <boxGeometry args={[0.4, 0.3, 0.6]} />
      <meshStandardMaterial color="#ff8844" />
    </mesh>
  );
}

export function Cat() {
  const groupRef = useRef<THREE.Group>(null);
  const [, getKeys] = useKeyboardControls();
  const [isMoving, setIsMoving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [turnDirection, setTurnDirection] = useState(0);
  const { selectedPainting, touchControls, isMobile } = useGallery();
  const wasViewingPainting = useRef(false);
  const isTransitioningToPainting = useRef(false);
  const transitionProgress = useRef(0);
  const lastLookAt = useRef(new THREE.Vector3());
  const prevSelectedPainting = useRef<typeof selectedPainting>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const catPos = groupRef.current.position;
    const catRot = groupRef.current.rotation.y;

    // Calcular posición objetivo detrás del gato
    const behindOffset = new THREE.Vector3(0, 1.5, 3);
    behindOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), catRot);
    const catCamTarget = new THREE.Vector3(
      catPos.x + behindOffset.x,
      catPos.y + behindOffset.y,
      catPos.z + behindOffset.z
    );
    const catLookAt = new THREE.Vector3(catPos.x, catPos.y + 0.2, catPos.z);

    // Detectar cuando se selecciona un nuevo cuadro
    if (selectedPainting && !prevSelectedPainting.current) {
      isTransitioningToPainting.current = true;
      transitionProgress.current = 0;
      lastLookAt.current.copy(catLookAt);
    }
    prevSelectedPainting.current = selectedPainting;

    // Si hay un cuadro seleccionado, mover cámara hacia él
    if (selectedPainting) {
      wasViewingPainting.current = true;

      const paintingPos = new THREE.Vector3(...selectedPainting.position);
      const paintingRot = selectedPainting.rotation[1];

      // Calcular posición frente al cuadro - más lejos en móvil para ver todo el contenido
      const cameraDistance = isMobile ? 4.0 : 1.8;
      const offset = new THREE.Vector3(0, 0, cameraDistance);
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), paintingRot);

      // En móvil, subir un poco la cámara para ver mejor el pergamino completo
      const cameraYOffset = isMobile ? 0.15 : 0;
      const camTarget = new THREE.Vector3(
        paintingPos.x + offset.x,
        paintingPos.y + cameraYOffset,
        paintingPos.z + offset.z
      );

      // Transición suave hacia el cuadro (más lenta)
      if (isTransitioningToPainting.current) {
        transitionProgress.current += delta * 0.25;

        // Ease-out cúbico suave
        const t = Math.min(transitionProgress.current, 1);
        const eased = 1 - Math.pow(1 - t, 3);

        // Velocidad que va de lento a la velocidad final sin corte
        const lerpSpeed = 0.008 + (0.03 * eased);
        state.camera.position.lerp(camTarget, lerpSpeed);

        // Interpolar el punto de mira
        lastLookAt.current.lerp(paintingPos, lerpSpeed * 1.5);
        state.camera.lookAt(lastLookAt.current);

        // Terminar transición cuando esté muy cerca del objetivo
        const dist = state.camera.position.distanceTo(camTarget);
        if (dist < 0.05) {
          isTransitioningToPainting.current = false;
          lastLookAt.current.copy(paintingPos);
        }
      } else {
        // Ya terminó la transición, mantener posición estable
        state.camera.position.lerp(camTarget, 0.05);
        lastLookAt.current.copy(paintingPos);
        state.camera.lookAt(paintingPos.x, paintingPos.y, paintingPos.z);
      }
      return;
    }

    // Transición suave al volver del cuadro (más lenta)
    if (wasViewingPainting.current) {
      transitionProgress.current += delta * 0.2;

      // Ease-out cúbico para una transición muy suave
      const t = Math.min(transitionProgress.current, 1);
      const eased = 1 - Math.pow(1 - t, 3);

      // Interpolar posición de cámara (más lento)
      const lerpSpeed = 0.008 + (0.03 * eased);
      state.camera.position.lerp(catCamTarget, lerpSpeed);

      // Interpolar también el punto de mira (lookAt)
      lastLookAt.current.lerp(catLookAt, lerpSpeed * 1.5);
      state.camera.lookAt(lastLookAt.current);

      // Terminar cuando esté cerca del objetivo
      const dist = state.camera.position.distanceTo(catCamTarget);
      if (dist < 0.1 && transitionProgress.current > 1) {
        wasViewingPainting.current = false;
      }
      return;
    }

    // Combinar controles de teclado y táctiles
    const keyboardControls = getKeys();
    const forward = keyboardControls.forward || (isMobile && touchControls.forward);
    const backward = keyboardControls.backward || (isMobile && touchControls.backward);
    const left = keyboardControls.left || (isMobile && touchControls.left);
    const right = keyboardControls.right || (isMobile && touchControls.right);
    const run = keyboardControls.run || (isMobile && touchControls.run);

    const moving = forward || backward || left || right; // También animar al girar

    if (moving !== isMoving) {
      setIsMoving(moving);
    }

    if (run !== isRunning) {
      setIsRunning(run);
    }

    // Actualizar dirección del giro
    const newTurnDir = left ? 1 : right ? -1 : 0;
    if (newTurnDir !== turnDirection) {
      setTurnDirection(newTurnDir);
    }

    if (left) {
      groupRef.current.rotation.y += ROTATION_SPEED * delta;
    }
    if (right) {
      groupRef.current.rotation.y -= ROTATION_SPEED * delta;
    }

    // Velocidad según si corre o camina
    const currentSpeed = run ? RUN_SPEED : WALK_SPEED;

    if (forward || backward) {
      const direction = new THREE.Vector3(0, 0, forward ? -1 : 1);
      direction.applyQuaternion(groupRef.current.quaternion);
      direction.multiplyScalar(currentSpeed * delta);

      const newPosition = groupRef.current.position.clone().add(direction);

      if (newPosition.x > -1.8 && newPosition.x < 1.8) {
        groupRef.current.position.x = newPosition.x;
      }
      if (newPosition.z > -12 && newPosition.z < 12) {
        groupRef.current.position.z = newPosition.z;
      }
    }

    // Mantener el gato siempre en el suelo
    groupRef.current.position.y = 0;

    // Cámara normal siguiendo al gato
    state.camera.position.lerp(catCamTarget, 0.08);

    // Limitar la cámara para que no atraviese las paredes
    state.camera.position.x = Math.max(-2.5, Math.min(2.5, state.camera.position.x));
    state.camera.position.z = Math.max(-13, Math.min(13, state.camera.position.z));

    state.camera.lookAt(catLookAt);
  });

  return (
    <group ref={groupRef} position={[0, 0, 10]}>
      <Suspense fallback={<CatPlaceholder />}>
        <CatModel isMoving={isMoving} isRunning={isRunning} turnDirection={turnDirection} />
      </Suspense>
      <pointLight position={[0, 2, 0]} intensity={5} distance={6} color="#ffffff" />
    </group>
  );
}

useGLTF.preload("/models/cat.gltf");
