import { memo } from 'react';

// Static noise texture as a data URI - much more performant than SVG filter
// This eliminates continuous GPU rendering from feTurbulence
const noiseTextureDataUri = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAElBMVEUAAAAAAAAAAAAAAAAAAAAAAADgKxmiAAAABnRSTlMDBAUGBwgKCxkZAAAAfElEQVQ4y2NgGAWjYBSMghEPGBkYGBkZ/xMBGf8TAxn/EwMZ/xMDGf8TAxn/EwMZ/xMDGf8TAxn/EwMZ/xMDGf8TAxn/EwMZ/xMDGf8TAxn/EwMZ/xMDGf8TAxn/EwMZ/xMDGf8TAxn/EwMZ/xMDGf8TAxn/EwMZ/xMBGQGYDwDbFjLdAAAAAElFTkSuQmCC`;

export const NoiseOverlay = memo(function NoiseOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.02]"
      aria-hidden="true"
      style={{
        backgroundImage: `url("${noiseTextureDataUri}")`,
        backgroundRepeat: 'repeat',
        // Using a small tile that repeats - more performant than SVG filter
        backgroundSize: '48px 48px',
      }}
    />
  );
});
