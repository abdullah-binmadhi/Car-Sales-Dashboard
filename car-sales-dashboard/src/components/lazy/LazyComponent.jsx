import React, { Suspense } from 'react';

const LazyComponent = ({ component: Component, fallback = null, ...props }) => {
  return (
    <Suspense fallback={fallback}>
      <Component {...props} />
    </Suspense>
  );
};

export default LazyComponent;