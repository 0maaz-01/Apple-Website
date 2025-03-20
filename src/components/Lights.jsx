import { Environment, Lightformer } from "@react-three/drei";

const Lights = () => {
  return (
    // group different lights and lightformers. We can use group to organize lights, cameras, meshes, and other objects in the scene.
    <group name="lights">
        {/* @description Environment is used to create a background environment for the scene*/}
        <Environment resolution={256}>
            <group>
                {/* A Lightformer can be used to define how light is projected onto objects. It is used to create custom lights with various shapes and properties in a 3D scene. */}
                <Lightformer 
                  form="rect"                 // form specifies the shape of the light. 
                  intensity={10}              // intensity: Controls the brightness of the lightformer (how bright the light appears once shaped).
                  position={[-1, 0, -10]}
                  scale={10}                  //  Defines the size of the lightformer in 3D space. This can be used to adjust how large the light’s projection is on the objects.
                  color={"#495057"}            
                />
                <Lightformer
                  form="rect"
                  intensity={10}
                  position={[-10, 2, 1]}
                  scale={10}
                  rotation-y={Math.PI / 2}
                />
                <Lightformer
                  form="rect"
                  intensity={10}
                  position={[10, 0, 1]}
                  scale={10}
                  rotation-y={Math.PI / 2}
                />
            </group>
        </Environment>

        {/* In Three.js, a spotlight is a type of light source that creates a focused, cone-shaped beam of light. It's commonly used to simulate effects like spotlights in theaters or headlights on cars.*/}
        <spotLight
            position={[-2, 10, 5]}
            angle={0.15}
            penumbra={1}                     // the penumbra is the soft edge of a shadow cast by a point light
            decay={0}                        // the amount the light dims as it moves away from the source
            intensity={Math.PI * 0.2}        //  The brightness of the spotlight (default is 1).
            color={"#f8f9fa"}                //  You can use new THREE.Color(r, g, b) or a hex string like 0xffffff for white.
        />
        <spotLight
            position={[0, -25, 10]}
            angle={0.15}
            penumbra={1}
            decay={0}
            intensity={Math.PI * 0.2}
            color={"#f8f9fa"}
        />
        <spotLight
            position={[0, 15, 5]}
            angle={0.15}
            penumbra={1}
            decay={0.1}
            intensity={Math.PI * 3}
        />
      </group>
  );
};

export default Lights;
