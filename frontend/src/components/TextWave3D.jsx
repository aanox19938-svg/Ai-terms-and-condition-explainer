import React from 'react';

/**
 * TextWave3D
 * Static text renderer (floating animation disabled per user preference)
 */
export const TextWave3D = ({
  text,
  children,
  as: Component = 'span',
  className = '',
}) => {
  return (
    <Component className={className}>
      {text || children}
    </Component>
  );
};
