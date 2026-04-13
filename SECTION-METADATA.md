# Section Metadata Guide

Section metadata allows you to configure entire sections of a page, similar to how block variations configure individual blocks.

## How It Works

### Authoring in Google Docs

Create a two-column table with "Section Metadata" as the header:

```
| Section Metadata |
| style     | article-with-sidebar |
| background | dark                |
```

Place this table **at the beginning of a section** (right after a horizontal line `---`).

### What EDS Does

**IMPORTANT:** Only the `style` key becomes a CSS class. All other keys become data attributes.

1. **`style` values → CSS classes:**

   ```html
   <div class="section article-with-sidebar"></div>
   ```

2. **Other keys → data attributes:**

   ```html
   <div class="section" data-background="dark" data-spacing="compact"></div>
   ```

3. **Removes the metadata table** from visible content

**Example:**

```
| Section Metadata |
| style      | hero    |
| background | dark   |
| spacing    | large  |
```

**Results in:**

```html
<div class="section hero" data-background="dark" data-spacing="large"></div>
```

## Section Boundaries

Sections are defined by **horizontal lines** in Google Docs:

```
[Content] ← Section 1

---  ← Divider

| Section Metadata |
| style | hero |

[Content] ← Section 2 (gets the metadata)

---  ← Divider

[Content] ← Section 3
```

**Important:** The metadata table must be at the **start** of the section it configures.

## Section Metadata vs Block Variations

### Similarities

Both use the same mechanism:

- ✅ Convert to CSS classes
- ✅ Enable CSS-based styling
- ✅ Can be detected in JavaScript
- ✅ Support multiple values

### Differences

| Aspect            | Section Metadata               | Block Variations               |
| ----------------- | ------------------------------ | ------------------------------ |
| **Scope**         | Entire section                 | Single block                   |
| **Authoring**     | Name/value table               | Parentheses in block name      |
| **HTML Target**   | `<div class="section">`        | `<div class="block-name">`     |
| **Use Case**      | Layout, background, spacing    | Block appearance/behavior      |
| **David's Model** | ✅ Appropriate (configuration) | ✅ Appropriate (configuration) |

### Example Comparison

**Section Metadata:**

```
| Section Metadata |
| style | two-column |
```

→ Affects entire section layout

**Block Variation:**

```
| Person Card (Dark) |
```

→ Affects only that person card

## How to Use Multiple CSS Classes

### Comma-Separated Values in `style`

To apply multiple CSS classes, use **comma-separated values** in the `style` row:

```
| Section Metadata |
| style | article-with-sidebar, light-gray, large-spacing |
```

**Results in:**

```html
<div class="section article-with-sidebar light-gray large-spacing"></div>
```

**CSS:**

```css
.section.article-with-sidebar {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

.section.light-gray {
  background: #f5f5f5;
}

.section.large-spacing {
  padding: 4rem 0;
}
```

### What Doesn't Work

❌ **Multiple `style` rows** (only last one applies):

```
| Section Metadata |
| style | article-with-sidebar |
| style | light-gray           |  ← Only this one applies
```

❌ **Space-separated** (becomes single hyphenated class):

```
| style | article-with-sidebar light-gray |
```

→ `class="section article-with-sidebar-light-gray"` (single class!)

✅ **Comma-separated** (becomes multiple classes):

```
| style | article-with-sidebar, light-gray |
```

→ `class="section article-with-sidebar light-gray"` (two classes!)

## Common Section Metadata Patterns

### 1. Layout Styles

```
| Section Metadata |
| style | article-with-sidebar |
```

**CSS:**

```css
.section.article-with-sidebar {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}
```

### 2. Background Colors

```
| Section Metadata |
| background | dark |
```

**CSS:**

```css
.section.dark {
  background-color: #333;
  color: #fff;
}
```

### 3. Spacing Control

```
| Section Metadata |
| spacing | compact |
```

**CSS:**

```css
.section.compact {
  padding: 1rem 0;
}

.section.compact > div {
  margin-bottom: 0.5rem;
}
```

### 4. Full-Width Sections

```
| Section Metadata |
| style | full-width |
```

**CSS:**

```css
.section.full-width {
  max-width: 100%;
  padding: 0;
}
```

### 5. Multiple Metadata Values

```
| Section Metadata |
| style      | two-column     |
| background | light-gray     |
| spacing    | large          |
```

**Result:**

```html
<div
  class="section two-column light-gray large"
  data-style="two-column"
  data-background="light-gray"
  data-spacing="large"
></div>
```

## Real-World Example: Article with Sidebar

### Authoring

```
---

| Section Metadata |
| style | article-with-sidebar |

[Main article content here]

| Sidebar CTA |
| [CTA content] |

| Related Articles |
| [Related content] |

---
```

### CSS Implementation

```css
/* Default section: full width */
.section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Article with sidebar: two-column grid */
.section.article-with-sidebar {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  align-items: start;
}

/* First child (article content) goes to column 1 */
.section.article-with-sidebar > .default-content-wrapper {
  grid-column: 1;
}

/* Blocks (sidebar-cta, related-articles) go to column 2 */
.section.article-with-sidebar > div[class*="sidebar"],
.section.article-with-sidebar > div[class*="related"] {
  grid-column: 2;
}

/* Responsive: stack on mobile */
@media (max-width: 900px) {
  .section.article-with-sidebar {
    grid-template-columns: 1fr;
  }

  .section.article-with-sidebar > div {
    grid-column: 1 !important;
  }
}
```

## JavaScript Access

You can read section metadata in JavaScript:

```js
// Get section element
const section = block.closest(".section");

// Check for metadata class
if (section.classList.contains("dark")) {
  // Adjust block behavior for dark background
}

// Read data attribute
const style = section.dataset.style; // "article-with-sidebar"
```

## Page Metadata vs Section Metadata

### Page Metadata

Affects the **entire page** (goes in `<head>`):

```
| Metadata |
| Title       | My Page Title    |
| Description | Page description |
| Template    | article          |
```

### Section Metadata

Affects **one section** (becomes CSS classes):

```
| Section Metadata |
| style | hero |
```

**Key difference:** Page metadata is for SEO/meta tags, section metadata is for styling/layout.

## Best Practices

### 1. Use for Layout, Not Content

✅ **Good:**

```
| Section Metadata |
| style | two-column |
```

❌ **Bad:**

```
| Section Metadata |
| heading | Welcome to Our Site |  ← This is content, not configuration
```

### 2. Keep Metadata Names Consistent

Create a standard vocabulary:

- `style`: Layout patterns (two-column, hero, full-width)
- `background`: Color schemes (dark, light, brand)
- `spacing`: Padding/margin (compact, normal, large)

### 3. Document Your Metadata

Create a style guide for authors:

```
Available Section Styles:
- article-with-sidebar: Two-column layout for articles
- hero: Full-width hero section
- full-width: Edge-to-edge content
- centered: Centered, narrow content

Available Backgrounds:
- dark: Dark background with light text
- light-gray: Light gray background
- brand: Brand color background
```

### 4. Combine with Block Variations

```
| Section Metadata |
| background | dark |

| Person Card (Compact) |
| John Doe              |
| Developer             |
```

Section is dark, card is compact - they work together!

### 5. Mobile-First Responsive

```css
/* Mobile first: single column */
.section.article-with-sidebar {
  display: block;
}

/* Desktop: two columns */
@media (min-width: 900px) {
  .section.article-with-sidebar {
    display: grid;
    grid-template-columns: 1fr 300px;
  }
}
```

## Common Patterns

### Hero Section

```
| Section Metadata |
| style | hero |

# Welcome to Our Site

Discover amazing things.

[CTA Button]
```

**CSS:**

```css
.section.hero {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
```

### Alternating Backgrounds

```
[Content]

---

| Section Metadata |
| background | light |

[Content]

---

| Section Metadata |
| background | dark |

[Content]
```

**CSS:**

```css
.section.light {
  background: #f5f5f5;
}

.section.dark {
  background: #333;
  color: #fff;
}
```

### Grid Layout

```
| Section Metadata |
| style | three-column |

| Card 1 |
| Card 2 |
| Card 3 |
```

**CSS:**

```css
.section.three-column {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
```

## Debugging Section Metadata

### Check in Browser DevTools

1. Inspect the section element
2. Look for CSS classes: `<div class="section article-with-sidebar">`
3. Check data attributes: `data-style="article-with-sidebar"`

### Common Issues

**Metadata not applying:**

- ✅ Is the metadata table at the **start** of the section?
- ✅ Is there a horizontal line (`---`) before the section?
- ✅ Is the table header exactly "Section Metadata"?

**CSS not working:**

- ✅ Are you targeting `.section.your-class`?
- ✅ Is your CSS loaded (check Network tab)?
- ✅ Is there a specificity conflict?

## Performance Considerations

Section metadata is **CSS-only** (no JavaScript needed):

- ✅ Zero performance cost
- ✅ Works immediately (no decoration phase)
- ✅ No layout shift
- ✅ SEO-friendly (classes in HTML)

## Related Documentation

- [Sections and Blocks](https://www.aem.live/developer/markup-sections-blocks)
- [Metadata](https://www.aem.live/developer/markup-sections-blocks#metadata)
- [David's Model](https://www.aem.live/docs/davidsmodel)

## Summary

**Section Metadata:**

- ✅ Configures entire sections
- ✅ Uses name/value pairs (appropriate per David's Model)
- ✅ Becomes CSS classes and data attributes
- ✅ Enables layout and styling control
- ✅ Works with block variations
- ✅ Zero JavaScript overhead

**When to use:**

- Layout patterns (columns, grids)
- Background colors/themes
- Spacing adjustments
- Full-width sections
- Any section-wide styling
