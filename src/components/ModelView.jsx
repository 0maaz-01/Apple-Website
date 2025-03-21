import { Html, OrbitControls, PerspectiveCamera, View } from "@react-three/drei"

import * as THREE from 'three'
import Lights from './Lights';
import Loader from './Loader';
import IPhone from './IPhone';
import { Suspense } from "react";

const ModelView = ({ index, groupRef, gsapType, controlRef, setRotationState, size, item }) => {
  return (
      <View               // View is useful for grouping elements and organizing sections of your 3D scene in React Three Fiber.
          index={index}
          id={gsapType}
          className={`w-full h-full absolute ${index === 2 ? 'right-[-100%]' : ''}`}
        >
            {/* Ambient Light lights up all the object in the scene equally. */}
            <ambientLight intensity={0.3} />

            {/*PerspectiveCamera is used to simulate the perspective view of a 3D scene, much like how a human eye perceives depth. */}
            <PerspectiveCamera makeDefault position={[0, 0, 4]} />

            <Lights />

            <OrbitControls              // allows the user to interact with the 3D scene by rotating, zooming, and panning the camera using mouse or touch events. 
                
                makeDefault             // to bind this orbit control to the camera created by the canvas.
                ref={controlRef}        // to bind the element on which we will apply orbit controls on
                enableZoom={false}
                enablePan={false}       // to lock the camera to a specific position and prevent the user from moving it horizontally or vertically within the scene.
                rotateSpeed={0.4}
                target={new THREE.Vector3(0, 0 ,0)}     // This ensures no matter where the camera moves, it will always focus on this point.
                onEnd={() => setRotationState(controlRef.current.getAzimuthalAngle())}    // The onEnd function is called when the user stops interacting with the controls (i.e., when the mouse button is released, or touch ends).
              />                    {/*controlRef.current represent the element (canvas) on which the cursor is present on.*/}              
                                    {/*the code is using the getAzimuthalAngle() method to get the camera’s azimuthal angle (the horizontal angle of rotation around the target).*/}

            <group ref={groupRef} name={`${index === 1} ? 'small' : 'large`} position={[0, 0 ,0]}>
                <Suspense fallback={<Loader />}>    {/*Suspense is a higher-order component that allows you to delay the rendering of a part of your UI until some asynchronous operation (like loading data or code) has completed. */}
                    <IPhone 
                      scale={index === 1 ? [15, 15, 15] : [17, 17, 17]}
                      item={item}
                      size={size}
                    />
                </Suspense>
            </group>
      </View>
  )
}

export default ModelView