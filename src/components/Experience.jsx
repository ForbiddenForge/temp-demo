import {
  CameraControls,
  Environment,
  PerspectiveCamera,
  useFBO,
  useGLTF,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect, useRef, useState } from "react";
import { MathUtils } from "three";
import { DEG2RAD } from "three/src/math/MathUtils";
import { useCounterMaterials } from '../hooks/useCounterMaterials';


const sceneCount = 3;

export const Experience = () => {
  const viewport = useThree((state) => state.viewport);
  const renderedScene = useRef();

  const [renderTarget1, renderTarget2] = [useFBO(), useFBO()];
  const renderMaterial = useRef();
  const [version, setVersion] = useState(0);
  const [prevMode, setPrevMode] = useState(0);

  const { scene: modernKitchenScene, materials } = useGLTF(
    "/models/modern_kitchen.glb"
  );

  const counter = modernKitchenScene.getObjectByName('Counters_Counter_0')
  useCounterMaterials(counter)

  const initialScale = counter.scale.clone();

const { length, thickness } = useControls("Counter Dimensions", {
  length: {
    value: initialScale.y,
    min: 0.5,
    max: 3,
    step: 0.1,
    onChange: (value) => {
      counter.scale.y = value;
    }
  },
  thickness: {
    value: initialScale.z,
    min: 0.5,
    max: 3,
    step: 0.1,
    onChange: (value) => {
      counter.scale.z = value;
    }
  }
});


  
  
  const itemsToChangeMaterial = useRef([]);
  const modeGroups = useRef([]);
  modernKitchenScene.getObjectByName('rugRound').visible = false;
  
  useEffect(() => {
    const items = ["Wall", "Floor", "Chair", "Cupboard"];
    items.forEach((item) => {
      const obj = modernKitchenScene.getObjectByName(item);
      if (obj) {
        itemsToChangeMaterial.current.push(obj);
      }
    });
    for (let i = 0; i < sceneCount; i++) {
      const group = modernKitchenScene.getObjectByName(`version${i}`);
      if (group) {
        modeGroups.current.push(group);
      }
    }
  }, [modernKitchenScene]);

  useEffect(() => {
    if (version === prevMode) return;
    renderMaterial.current.uProgression = 0;
  }, [version]);

  useFrame(({ gl, scene }, delta) => {
    gl.setRenderTarget(renderTarget1);
    
    
    gl.render(scene, renderCamera.current);

    gl.setRenderTarget(renderTarget2);
    
      renderedScene.current.visible = true;
      
     
      
      itemsToChangeMaterial.current.forEach((item) => {
        item.material = materials[item.name + version];
      });
      modeGroups.current.forEach((group, index) => {
        group.visible = index === version;
      });
    
    
    gl.render(scene, renderCamera.current);

    renderedScene.current.visible = false;

    renderMaterial.current.uProgression = MathUtils.lerp(
      renderMaterial.current.uProgression,
      progressionTarget,
      delta * 5.0
    );

    gl.setRenderTarget(null);
    
    if (renderMaterial.current) {
      renderMaterial.current.uTex = renderTarget1.texture;
      renderMaterial.current.uTex2 = renderTarget2.texture;
    }
  });

  const renderCamera = useRef();
  const controls = useRef();

  useEffect(() => {
    controls.current.camera = renderCamera.current;
    controls.current.setLookAt(
      8.0146122041349432,
      7.822796205893349,
      8.587088991637922,
      -1.0858141754116573,
      0.9366397611967157,
      -2.7546919697281576
    );
  }, []);

  useControls("SCENE", {
    version: {
      value: version,
      options: [...Array(sceneCount).keys()],
      onChange: (value) => {
        setVersion((version) => {
          setPrevMode(version);
          return value;
        });
      },
    },
  });



  const progressionTarget = 1;

  useEffect(() => {
    modernKitchenScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [modernKitchenScene]);

  return (
    <>
      <PerspectiveCamera near={0.2} ref={renderCamera} />
      <CameraControls
        enablePan={false}
        minPolarAngle={DEG2RAD * 45}
        maxPolarAngle={DEG2RAD * 90}
        minAzimuthAngle={DEG2RAD * -150}
        maxAzimuthAngle={DEG2RAD * 150}
        minDistance={1}
        maxDistance={20}
        ref={controls}
      />

      <mesh>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <transitionMaterial
          ref={renderMaterial}
          toneMapped={false}
        />
      </mesh>
      
      <group ref={renderedScene}>
        <primitive object={modernKitchenScene} rotation-y={Math.PI / 2} scale={2} />
      </group>
      
      <Environment preset="sunset" blur={0.4} background />
      <ambientLight intensity={0.3}/> 
    </>
  );
};

useGLTF.preload("/models/modern_kitchen.glb");