'use client';

import { Html } from '@react-three/drei';
import Lottie from 'lottie-react';

const Loader = () => {
  return (
    <Html center>
      <div style={{ width: 300, height: 300 }}>
        <Lottie
          path="/animations/loader.json"
          loop
          autoplay
        />
      </div>
    </Html>
  );
};

export default Loader;
