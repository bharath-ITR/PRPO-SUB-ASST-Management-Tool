import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Torus } from '@react-three/drei';

// Spinning Sphere Component with animation
const SpinningSphere = (props) => {
  const ref = useRef();

  // Rotate the sphere
  useFrame(() => {
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={ref} {...props}>
      <Sphere args={[1, 32, 32]} scale={1.2}>
        <meshStandardMaterial color="hotpink" />
      </Sphere>
    </mesh>
  );
};

// Spinning Torus Component with animation
const SpinningTorus = (props) => {
  const ref = useRef();

  // Rotate the torus
  useFrame(() => {
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={ref} {...props}>
      <Torus args={[0.7, 0.3, 16, 100]} scale={1.2}>
        <meshStandardMaterial color="lightblue" />
      </Torus>
    </mesh>
  );
};
