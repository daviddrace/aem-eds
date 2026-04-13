# Block Variations Guide

Block variations allow you to create multiple visual or functional versions of the same block without duplicating code. This is one of the most powerful features in Edge Delivery Services.

## How It Works

When authors create a block in Google Docs, they can specify a variation by adding it in parentheses:

```
| Block Name (Variation) |
| Content goes here      |
```

EDS automatically:
1. Converts the variation name to kebab-case
2. Adds it as a CSS class to the block element
3. Your CSS and JavaScript can detect and handle it

## Example: Authoring

**Google Doc Table:**
```
| Person Card (Dark) |
| Name | John Doe   |
| Role | Developer  |
```

**Resulting HTML:**
```html
<div class="person-card dark">
  <div class="person-card-wrapper">
    <!-- content -->
  </div>
</div>
```

## Two Approaches to Variations

### 1. CSS-Only Variations (Recommended)

Use CSS-only variations when you only need to change:
- Colors, backgrounds, borders
- Spacing, padding, margins
- Font sizes, weights
- Shadows, borders, effects

**Advantages:**
- ✅ No JavaScript needed
- ✅ Faster (no DOM manipulation)
- ✅ Easier to maintain
- ✅ Better performance

**Example:**
```css
/* Default styling */
.person-card .person-card-wrapper {
  background-color: #fff;
  color: #333;
  padding: 1rem;
}

/* Dark variation: Person Card (Dark) */
.person-card.dark .person-card-wrapper {
  background-color: #333;
  color: #fff;
}

/* Compact variation: Person Card (Compact) */
.person-card.compact .person-card-wrapper {
  padding: 0.5rem;
  max-width: 300px;
}

.person-card.compact .person-name {
  font-size: 1rem;
}
```

### 2. JavaScript-Based Variations

Use JavaScript when you need to:
- Restructure the DOM
- Change field order
- Add/remove elements
- Apply different logic
- Load different data

**Example:**
```js
export default function decorate(block) {
  // Detect variation
  const isHorizontal = block.classList.contains('horizontal');
  
  // ... standard decoration logic ...
  
  // Handle variation-specific DOM changes
  if (isHorizontal) {
    const imageEl = block.querySelector('.person-image');
    const contentEls = [...block.children].filter(
      (el) => !el.classList.contains('person-image')
    );
    
    // Restructure: image on left, content on right
    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('person-card-content');
    contentEls.forEach((el) => contentWrapper.appendChild(el));
    
    block.innerHTML = '';
    block.appendChild(imageEl);
    block.appendChild(contentWrapper);
  }
}
```

## Best Practices

### 1. Document Your Variations

Add comments in CSS showing how to author each variation:

```css
/* Variation: Dark theme
 * Author as: Person Card (Dark)
 * Adds dark background and light text
 */
.person-card.dark .person-card-wrapper {
  background-color: #333;
  color: #fff;
}
```

### 2. Prefer CSS-Only When Possible

Only use JavaScript for variations that truly require DOM restructuring:

```
CSS-only:     ✅ Dark theme, Compact, Highlighted
JavaScript:   ⚠️  Horizontal layout, Grid view, Carousel
```

### 3. Keep Variations Cohesive

Variations should be **visual/layout alternatives**, not completely different blocks:

```
Good:  Person Card (Dark), Person Card (Compact), Person Card (Horizontal)
Bad:   Person Card (Product), Person Card (Article), Person Card (Video)
       ↑ These should be separate blocks
```

### 4. Test All Combinations

Variations can be combined! Test edge cases:

```
| Person Card (Dark, Compact) |
```

Results in:
```html
<div class="person-card dark compact">
```

Your CSS should handle this gracefully:

```css
/* Works independently */
.person-card.dark { /* ... */ }
.person-card.compact { /* ... */ }

/* Or handle combinations explicitly */
.person-card.dark.compact {
  /* Special styling for dark + compact */
}
```

### 5. Provide Sensible Defaults

Always style the base block first, then add variations:

```css
/* Base styling - works without any variation */
.person-card .person-card-wrapper {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
}

/* Variations enhance or override */
.person-card.dark .person-card-wrapper {
  background: #333;
}
```

## Common Variation Patterns

### Theme Variations
```css
.block.dark { /* dark theme */ }
.block.light { /* light theme */ }
.block.brand { /* brand colors */ }
```

### Size Variations
```css
.block.small { /* reduced size */ }
.block.large { /* increased size */ }
.block.compact { /* minimal spacing */ }
```

### Layout Variations
```css
.block.horizontal { /* side-by-side */ }
.block.vertical { /* stacked */ }
.block.grid { /* grid layout */ }
```

### Emphasis Variations
```css
.block.highlighted { /* accent styling */ }
.block.featured { /* prominent display */ }
.block.subtle { /* muted styling */ }
```

## Real-World Example: Person Card

### Authored Variations

```
| Person Card |           → Default
| Person Card (Dark) |    → Dark theme
| Person Card (Compact) | → Smaller size
| Person Card (Horizontal) | → Image + content side-by-side
| Person Card (Highlighted) | → Accent border
```

### CSS Implementation

```css
/* Default */
.person-card-wrapper {
  background: #fff;
  max-width: 400px;
  padding: 1rem;
}

/* Dark: CSS-only */
.person-card.dark .person-card-wrapper {
  background: #333;
  color: #fff;
}

/* Compact: CSS-only */
.person-card.compact .person-card-wrapper {
  max-width: 300px;
  padding: 0.5rem;
}

/* Horizontal: Requires JavaScript + CSS */
.person-card.horizontal .person-card-wrapper {
  display: flex;
  gap: 1.5rem;
  max-width: 600px;
}
```

### JavaScript Implementation

```js
export default function decorate(block) {
  const isHorizontal = block.classList.contains('horizontal');
  
  // ... standard decoration ...
  
  // Only horizontal needs DOM restructuring
  if (isHorizontal) {
    // Restructure DOM for side-by-side layout
  }
}
```

## Debugging Variations

### Check Applied Classes

In browser DevTools:
```js
// Inspect block element
console.log(block.classList);
// DOMTokenList ['person-card', 'dark', 'compact']
```

### Verify Authoring

In Google Docs, ensure parentheses are correct:
```
✅ | Person Card (Dark) |
❌ | Person Card - Dark |
❌ | Person Card Dark |
```

### Test CSS Specificity

If variations aren't working, check specificity:
```css
/* Too specific - hard to override */
.section .person-card-wrapper.person-card-wrapper {
  background: #fff;
}

/* Better - easy to override with variations */
.person-card .person-card-wrapper {
  background: #fff;
}

.person-card.dark .person-card-wrapper {
  background: #333; /* ✅ Works! */
}
```

## Multiple Variations

Authors can combine variations:
```
| Person Card (Dark, Compact, Highlighted) |
```

Handle in CSS:
```css
/* Individual variations */
.person-card.dark { /* ... */ }
.person-card.compact { /* ... */ }
.person-card.highlighted { /* ... */ }

/* Specific combinations (optional) */
.person-card.dark.highlighted {
  /* Dark + highlighted needs special handling */
  border-color: #6db3f2;
}
```

Handle in JavaScript:
```js
const isDark = block.classList.contains('dark');
const isCompact = block.classList.contains('compact');
const isHighlighted = block.classList.contains('highlighted');

if (isDark && isHighlighted) {
  // Special logic for this combination
}
```

## Performance Considerations

### CSS-Only Variations
- ✅ Zero JavaScript cost
- ✅ No layout recalculation
- ✅ Instant rendering

### JavaScript Variations
- ⚠️ Runs during block decoration
- ⚠️ May cause layout shifts if not careful
- ⚠️ Keep logic minimal and fast

**Tip:** If a variation requires heavy JavaScript, consider making it a separate block instead.

## When to Use Separate Blocks

Create a new block instead of a variation when:

1. **Different data model** - Fields are completely different
2. **Different functionality** - Behavior is fundamentally different
3. **Different authoring experience** - Authors need different tools
4. **Too many variations** - More than 5-6 variations becomes hard to maintain

**Example:**
```
❌ Person Card (Product)     → Make a Product Card block
❌ Person Card (Article)     → Make an Article Card block
✅ Person Card (Horizontal)  → Good variation
✅ Person Card (Dark)        → Good variation
```

## Related Documentation

- [Block Authoring Guide](https://www.aem.live/developer/block-collection)
- [CSS Best Practices](https://www.aem.live/developer/keeping-it-100#optimize-css)
- [Block Development Tutorial](https://www.aem.live/developer/tutorial)
