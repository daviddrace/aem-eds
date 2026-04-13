# Section Metadata Keys Reference

Section metadata keys are mostly **project-defined conventions**, but some have special meaning or common patterns in EDS.

## Special/Reserved Keys

### 1. `style`

**Most common key** - typically used for layout patterns.

**Single value:**

```
| Section Metadata |
| style | article-with-sidebar |
```

**Multiple values (comma-separated):**

```
| Section Metadata |
| style | article-with-sidebar, light-gray, large-spacing |
```

**Results in:**

```html
<div class="section article-with-sidebar light-gray large-spacing"></div>
```

**Why it's special:**

- Only `style` values become CSS classes
- Other keys become data attributes
- Supports comma-separated values for multiple classes
- Matches the pattern used in the EDS boilerplate
- Commonly used across EDS projects

**Common values:**

- `hero` - Full-width hero sections
- `full-width` - Edge-to-edge content
- `two-column` / `three-column` - Grid layouts
- `article-with-sidebar` - Article + sidebar layout
- `centered` - Centered, narrow content
- `dark` / `light` - Background themes
- `compact` / `large` - Spacing variations

### 2. `data-block-name` and `data-block-status`

**Reserved by EDS** - Used internally for block decoration.

❌ **Don't use these** - They're set by EDS automatically:

```html
<div class="section" data-block-name="hero" data-block-status="loaded"></div>
```

## Common Project-Defined Keys

These are **conventions**, not requirements. Define what makes sense for your project.

### Layout Keys

#### `style`

Primary layout pattern:

```
| style | two-column |
```

```css
.section.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
```

#### `align`

Content alignment:

```
| align | center |
```

```css
.section.center {
  text-align: center;
}
```

### Visual Keys

#### `background`

Background color/theme:

```
| background | dark |
```

```css
.section.dark {
  background-color: #333;
  color: #fff;
}
```

#### `theme`

Overall color scheme:

```
| theme | brand |
```

```css
.section.brand {
  background: var(--brand-color);
  color: white;
}
```

### Spacing Keys

#### `spacing`

Padding/margin control:

```
| spacing | compact |
```

```css
.section.compact {
  padding: 1rem 0;
}

.section.large {
  padding: 4rem 0;
}
```

#### `padding`

Specific padding:

```
| padding | none |
```

```css
.section.none {
  padding: 0;
}
```

### Behavior Keys

#### `sticky`

Sticky positioning:

```
| sticky | true |
```

```css
.section.true {
  position: sticky;
  top: 0;
  z-index: 100;
}
```

#### `overflow`

Overflow behavior:

```
| overflow | hidden |
```

```css
.section.hidden {
  overflow: hidden;
}
```

## Multiple Keys Example

You can combine the `style` key (for CSS classes) with other keys (for data attributes):

```
| Section Metadata |
| style      | hero, center, large |
| background | brand               |
```

**Results in:**

```html
<div class="section hero center large" data-background="brand"></div>
```

**Note:** Only `style` values become CSS classes. Other keys become data attributes.

**CSS:**

```css
/* Each key adds styling */
.section.hero {
  min-height: 60vh;
  display: flex;
  align-items: center;
}

.section.brand {
  background: var(--brand-color);
  color: white;
}

.section.center {
  text-align: center;
}

.section.large {
  padding: 4rem 2rem;
}

/* Or combine them */
.section.hero.brand {
  /* Special styling for hero + brand */
}
```

## Naming Conventions

### Use Descriptive, Semantic Names

✅ **Good:**

```
| style | article-with-sidebar |
| background | dark |
| spacing | compact |
```

❌ **Bad:**

```
| style | layout-1 |  ← Not descriptive
| background | #333 |  ← Use semantic names, not values
| spacing | 20px |     ← Use semantic names, not values
```

### Use Kebab-Case for Multi-Word Values

```
| style | article-with-sidebar |  ✅
| style | articleWithSidebar |   ❌ (camelCase)
| style | article_with_sidebar | ❌ (snake_case)
```

EDS converts to CSS classes, which use kebab-case.

### Keep Keys Consistent Across Project

Create a **metadata vocabulary** for your project:

```
Layout Keys:
- style: hero, two-column, three-column, full-width, centered

Background Keys:
- background: dark, light, brand, gray

Spacing Keys:
- spacing: none, compact, normal, large, xlarge

Alignment Keys:
- align: left, center, right
```

## Accessing in JavaScript

You can read section metadata in JavaScript:

```js
// Get section element
const section = document.querySelector(".section");

// Read from CSS classes
if (section.classList.contains("dark")) {
  console.log("Dark section");
}

// Read from data attributes
const style = section.dataset.style; // "article-with-sidebar"
const background = section.dataset.background; // "dark"
const spacing = section.dataset.spacing; // "compact"

console.log(`Style: ${style}, Background: ${background}, Spacing: ${spacing}`);
```

## Real-World Examples

### Example 1: Hero Section

```
| Section Metadata |
| style      | hero   |
| background | brand  |
| align      | center |
```

```css
.section.hero {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section.brand {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.section.center {
  text-align: center;
}
```

### Example 2: Article Section

```
| Section Metadata |
| style   | article-with-sidebar |
| spacing | large                |
```

```css
.section.article-with-sidebar {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

.section.large {
  padding: 4rem 2rem;
}
```

### Example 3: Full-Width Gallery

```
| Section Metadata |
| style   | full-width |
| padding | none       |
```

```css
.section.full-width {
  max-width: 100%;
}

.section.none {
  padding: 0;
}
```

## Best Practices

### 1. Document Your Keys

Create a style guide:

```markdown
# Section Metadata Reference

## Available Keys

### style

Controls section layout:

- `hero`: Full-height hero section
- `two-column`: Two-column grid
- `article-with-sidebar`: Article + 300px sidebar

### background

Controls background color:

- `dark`: Dark background (#333)
- `light`: Light gray background (#f5f5f5)
- `brand`: Brand color background

### spacing

Controls padding:

- `compact`: 1rem padding
- `normal`: 2rem padding (default)
- `large`: 4rem padding
```

### 2. Use CSS Custom Properties

Make values configurable:

```css
:root {
  --section-padding-compact: 1rem;
  --section-padding-normal: 2rem;
  --section-padding-large: 4rem;
}

.section.compact {
  padding: var(--section-padding-compact) 0;
}

.section.large {
  padding: var(--section-padding-large) 0;
}
```

### 3. Provide Defaults

```css
/* Default section styling */
.section {
  padding: var(--section-padding-normal) 0;
  max-width: 1200px;
  margin: 0 auto;
}

/* Metadata overrides */
.section.compact {
  padding: var(--section-padding-compact) 0;
}

.section.full-width {
  max-width: 100%;
}
```

### 4. Mobile-First Responsive

```css
/* Mobile: single column */
.section.two-column {
  display: block;
}

/* Desktop: two columns */
@media (min-width: 900px) {
  .section.two-column {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
}
```

## Summary

**Section Metadata Keys:**

- ❌ **No strict reserved keys** (except internal `data-block-*`)
- ✅ **Project-defined conventions** (you decide what makes sense)
- ✅ **Common patterns**: `style`, `background`, `spacing`, `align`
- ✅ **Each row** becomes both a CSS class and data attribute
- ✅ **Multiple keys** can be combined
- ✅ **Accessible** via CSS classes or JavaScript data attributes

**Recommended approach:**

1. Define a consistent vocabulary for your project
2. Document it for content authors
3. Use semantic, descriptive names
4. Keep it simple (3-5 common keys is plenty)
