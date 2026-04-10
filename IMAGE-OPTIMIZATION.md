# Image Optimization Guide

This project includes a reusable image optimization utility that automatically resizes images based on their display context, reducing page load times and improving performance.

## Quick Start

### Using Presets (Recommended)

The simplest way to optimize images is using predefined breakpoint presets:

```js
import { optimizeImages } from '../../scripts/image-utils.js';

export default function decorate(block) {
  // Optimize all images in the block using the 'card' preset
  optimizeImages(block, 'card');
  
  // ... rest of your decoration logic
}
```

### Available Presets

| Preset | Use Case | Desktop Width | Mobile Width |
|--------|----------|---------------|--------------|
| `hero` | Full-width hero images | 2400px | 1200px |
| `content` | Article body images | 1500px | 1200px |
| `card` | Card/thumbnail images (300-400px display) | 800px | 800px |
| `thumbnail` | Small avatars/icons (100-200px display) | 400px | 400px |
| `sidebar` | Sidebar images | 600px | 800px |

**Note:** All widths are 2x the typical display size to support retina displays.

## Advanced Usage

### Custom Breakpoints

For fine-grained control, use custom breakpoints:

```js
import { optimizeImage } from '../../scripts/image-utils.js';

export default function decorate(block) {
  const img = block.querySelector('img');
  
  optimizeImage(img, [
    { media: '(min-width: 900px)', width: '1200' }, // Desktop
    { media: '(min-width: 600px)', width: '900' },  // Tablet
    { width: '600' },                                // Mobile
  ]);
}
```

### Eager Loading (LCP Images)

For above-the-fold images that affect Largest Contentful Paint:

```js
// Optimize with eager loading (no lazy loading)
optimizeImages(block, 'hero', true); // Third parameter = eager
```

## How It Works

The optimization utility:

1. **Finds all images** in the specified container
2. **Replaces the `<picture>` element** with an optimized version
3. **Creates multiple `<source>` elements** for different screen sizes
4. **Adds query parameters** to image URLs:
   - `?width=800` - Requests specific width from EDS
   - `&format=webply` - Optimized WebP format
   - `&optimize=medium` - EDS optimization level

### Generated HTML

```html
<picture>
  <!-- WebP sources for modern browsers -->
  <source media="(min-width: 600px)" type="image/webp" 
          srcset="image.png?width=800&format=webply&optimize=medium">
  <source type="image/webp" 
          srcset="image.png?width=800&format=webply&optimize=medium">
  
  <!-- Fallback for older browsers -->
  <source media="(min-width: 600px)" 
          srcset="image.png?width=800&format=png&optimize=medium">
  
  <!-- Final fallback -->
  <img src="image.png?width=800&format=png&optimize=medium" 
       alt="Description" loading="lazy">
</picture>
```

## Best Practices

### 1. Choose the Right Preset

Match the preset to your layout:
- **Hero blocks**: Use `hero` preset
- **Article content**: Use `content` preset  
- **Cards/thumbnails**: Use `card` preset
- **Sidebar widgets**: Use `sidebar` preset

### 2. Optimize Early

Call `optimizeImages()` at the **start** of your `decorate()` function, before manipulating the DOM:

```js
export default function decorate(block) {
  optimizeImages(block, 'card'); // Do this first
  
  // Then do other DOM manipulation
  const rows = [...block.children];
  // ...
}
```

### 3. Use 2x Width for Retina

Always use 2x the display width to ensure crisp images on retina displays:
- Display at 400px? Request 800px
- Display at 600px? Request 1200px

### 4. Test on Preview Environment

Image optimization only works on `*.aem.live` and `*.aem.page` domains, not on localhost. Always test on the preview environment:

```
https://{branch}--{repo}--{owner}.aem.page/{page-path}
```

## Examples

### Example 1: Simple Card Block

```js
import { optimizeImages } from '../../scripts/image-utils.js';

export default function decorate(block) {
  optimizeImages(block, 'card');
  
  // Add card styling
  block.querySelectorAll('img').forEach((img) => {
    img.closest('div').classList.add('card-image');
  });
}
```

### Example 2: Hero Block with Eager Loading

```js
import { optimizeImages } from '../../scripts/image-utils.js';

export default function decorate(block) {
  // Hero images affect LCP, so load eagerly
  optimizeImages(block, 'hero', true);
  
  // Rest of hero decoration...
}
```

### Example 3: Custom Breakpoints for Specific Layout

```js
import { optimizeImage } from '../../scripts/image-utils.js';

export default function decorate(block) {
  const img = block.querySelector('img');
  
  // Custom breakpoints for a unique layout
  optimizeImage(img, [
    { media: '(min-width: 1200px)', width: '1600' }, // Large desktop
    { media: '(min-width: 900px)', width: '1200' },  // Desktop
    { media: '(min-width: 600px)', width: '900' },   // Tablet
    { width: '600' },                                 // Mobile
  ]);
}
```

## Performance Impact

Proper image optimization can reduce image file sizes by **60-80%**:

- **Before**: 1600x1600px PNG (2.5 MB)
- **After**: 800x800px WebP (150 KB)

This dramatically improves:
- **Page load time** (especially on mobile)
- **Largest Contentful Paint (LCP)** score
- **Bandwidth usage** for users

## Troubleshooting

### Images not optimizing on localhost?

Image optimization only works on deployed environments (`*.aem.live`, `*.aem.page`). Test on your preview URL.

### Wrong image size being loaded?

Check browser DevTools Network tab:
1. Look for the image request
2. Verify the URL includes `?width=800&format=webply`
3. Check which `<source>` element the browser selected (based on media queries)

### Need different sizes for different breakpoints?

Use custom breakpoints instead of presets:

```js
optimizeImage(img, [
  { media: '(min-width: 900px)', width: '1200' },
  { width: '600' }
]);
```

## Related Documentation

- [AEM Image Optimization](https://www.aem.live/developer/keeping-it-100#optimize-images)
- [Responsive Images Guide](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [WebP Format](https://developers.google.com/speed/webp)
