import { Canvas, extend } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "./components/Experience";
import { Suspense } from 'react';

import { TransitionMaterial } from "./components/TransitionMaterial";
import { Loader, Stats } from '@react-three/drei';

extend({
  TransitionMaterial,
});

function App() {
  return (
    <>
      <Leva />
      <Stats />
      <Suspense>
        <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>

          <color attach="background" args={["#333"]} />
          <Experience />
        </Canvas>
      </Suspense>
      <Loader />
    </>
  );
}

export default App;
