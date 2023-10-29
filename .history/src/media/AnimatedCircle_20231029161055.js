import React from 'react';

const AnimatedCircle = () => (
  <svg width="100" height="100" viewBox="0 0 100 100">
    <circle
      cx="50"
      cy="50"
      r="40"
      stroke="#2196F3"
      strokeWidth="10"
      fill="transparent"
    >
      <animate
        attributeName="stroke-dashoffset"
        from="0"
        to="502.4"
        dur="1s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="stroke-dasharray"
        from="0, 150.8"
        to="113.1, 150.8"
        dur="1s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);

export default AnimatedCircle;
