import React from 'react';

export const LoadingSkeleton = ({ className = '' }) => {
  return <div className={`animate-pulse bg-primary-200 rounded ${className}`} />;
};
