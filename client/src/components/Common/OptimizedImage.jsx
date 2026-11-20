import React, { useState } from 'react';

/**
 * Next.js-Style Optimized Image Component
 * 
 * Features:
 * - Native lazy-loading (`loading="lazy"` / `priority` control)
 * - Asynchronous decoding (`decoding="async"`)
 * - Smooth skeleton / blur transition upon load
 * - Fallback handling for broken / missing images
 */
export default function OptimizedImage({
  src,
  alt = 'Image',
  className = '',
  priority = false,
  fallbackSrc = '/hero_banner_1.png',
  fallbackIcon = null,
  aspectRatio = null,
  style = {},
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
  };

  const handleLoad = () => {
    setLoaded(true);
  };

  if (!src || error) {
    if (fallbackIcon) {
      return (
        <div
          className={`flex items-center justify-center bg-neutral-100 text-neutral-400 ${className}`}
          style={style}
        >
          {fallbackIcon}
        </div>
      );
    }
    return (
      <img
        src={fallbackSrc}
        alt={alt}
        className={`${className} object-cover`}
        style={style}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        {...props}
      />
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${aspectRatio ? `aspect-[${aspectRatio}]` : ''}`}
      style={style}
    >
      {/* Subtle progressive blur / skeleton placeholder while loading */}
      {!loaded && (
        <div className="absolute inset-0 bg-neutral-200/60 animate-pulse z-0" />
      )}

      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
}
