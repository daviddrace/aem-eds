import { createOptimizedPicture } from './aem.js';

/**
 * Standard breakpoint configurations for common layout patterns.
 * All widths are 2x the display size for retina screens.
 */
export const IMAGE_BREAKPOINTS = {
  // Full-width hero images (up to 1200px container)
  hero: [
    { media: '(min-width: 900px)', width: '2400' }, // Desktop
    { media: '(min-width: 600px)', width: '1800' }, // Tablet
    { width: '1200' }, // Mobile
  ],

  // Content images in article body (max 750px)
  content: [
    { media: '(min-width: 600px)', width: '1500' }, // Desktop/Tablet
    { width: '1200' }, // Mobile
  ],

  // Card/thumbnail images (300-400px)
  card: [
    { media: '(min-width: 600px)', width: '800' }, // Desktop
    { width: '800' }, // Mobile (cards don't shrink much)
  ],

  // Small thumbnails/avatars (100-200px)
  thumbnail: [
    { media: '(min-width: 600px)', width: '400' }, // Desktop
    { width: '400' }, // Mobile
  ],

  // Sidebar images (max 300px)
  sidebar: [
    { media: '(min-width: 600px)', width: '600' }, // Desktop
    { width: '800' }, // Mobile (full width)
  ],
};

/**
 * Optimizes all images in a container using a specific breakpoint preset.
 * This is the recommended way to handle image optimization in blocks.
 *
 * @param {Element} container - The container element with images to optimize
 * @param {string} preset - Breakpoint preset name from IMAGE_BREAKPOINTS
 * @param {boolean} eager - Whether to load images eagerly (for LCP images)
 *
 * @example
 * // In a block's decorate function:
 * import { optimizeImages, IMAGE_BREAKPOINTS } from '../../scripts/image-utils.js';
 *
 * export default function decorate(block) {
 *   // ... other decoration logic ...
 *   optimizeImages(block, 'card'); // Use 'card' preset
 * }
 */
export function optimizeImages(container, preset = 'content', eager = false) {
  const breakpoints = IMAGE_BREAKPOINTS[preset];
  if (!breakpoints) {
    // eslint-disable-next-line no-console
    console.warn(`Unknown image preset: ${preset}. Using 'content' preset.`);
  }

  container.querySelectorAll('img').forEach((img) => {
    const picture = img.closest('picture');
    if (picture) {
      // Replace existing picture with optimized version
      const optimizedPicture = createOptimizedPicture(
        img.src,
        img.alt,
        eager,
        breakpoints || IMAGE_BREAKPOINTS.content,
      );
      picture.replaceWith(optimizedPicture);
    }
  });
}

/**
 * Optimizes a single image with custom breakpoints.
 * Use this when you need fine-grained control over image sizes.
 *
 * @param {Element} img - The image element to optimize
 * @param {Array} breakpoints - Custom breakpoint configuration
 * @param {boolean} eager - Whether to load eagerly
 * @returns {Element} The optimized picture element
 *
 * @example
 * const customBreakpoints = [
 *   { media: '(min-width: 900px)', width: '1200' },
 *   { width: '600' }
 * ];
 * optimizeImage(img, customBreakpoints);
 */
export function optimizeImage(img, breakpoints, eager = false) {
  if (!img) return null;

  const picture = img.closest('picture');
  const optimizedPicture = createOptimizedPicture(
    img.src,
    img.alt,
    eager,
    breakpoints,
  );

  if (picture) {
    picture.replaceWith(optimizedPicture);
  }

  return optimizedPicture;
}
