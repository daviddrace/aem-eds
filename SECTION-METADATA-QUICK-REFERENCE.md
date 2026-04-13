# Section Metadata Quick Reference

## The Essential Rules

1. **Only `style` becomes CSS classes** - Everything else becomes data attributes
2. **Use commas for multiple classes** - Space-separated creates hyphenated class names
3. **Put metadata at the top** - Right after the `---` section divider

## Basic Example

```
---

| Section Metadata |
| style | article-with-sidebar |

[Your content here]

---
```

**Result:**
```html
<div class="section article-with-sidebar">
  <!-- content -->
</div>
```

## Multiple CSS Classes

**Use comma-separated values:**

```
| Section Metadata |
| style | article-with-sidebar, light-gray, large-spacing |
```

**Result:**
```html
<div class="section article-with-sidebar light-gray large-spacing">
```

**CSS:**
```css
.section.article-with-sidebar { /* layout */ }
.section.light-gray { /* background */ }
.section.large-spacing { /* spacing */ }
```

## What Doesn't Work

❌ **Multiple `style` rows** (only last applies):
```
| Section Metadata |
| style | article-with-sidebar |
| style | light-gray           |  ← Only this one
```

❌ **Space-separated** (becomes single hyphenated class):
```
| style | article-with-sidebar light-gray |
```
→ `class="section article-with-sidebar-light-gray"`

❌ **Other keys as CSS classes** (they become data attributes):
```
| background | dark |
```
→ `data-background="dark"` (not a CSS class!)

## Using Data Attributes

Non-`style` keys become data attributes:

```
| Section Metadata |
| style      | hero  |
| background | dark  |
| theme      | brand |
```

**Result:**
```html
<div class="section hero"
     data-background="dark"
     data-theme="brand">
```

**CSS with attribute selectors:**
```css
.section.hero { /* from style */ }

.section[data-background="dark"] {
  background: #333;
  color: #fff;
}

.section[data-theme="brand"] {
  background: var(--brand-color);
}
```

## Recommended Approach

**Use `style` for everything you want as CSS classes:**

```
| Section Metadata |
| style | hero, dark, centered, large-spacing |
```

**Result:**
```html
<div class="section hero dark centered large-spacing">
```

**CSS:**
```css
.section.hero { min-height: 60vh; }
.section.dark { background: #333; color: #fff; }
.section.centered { text-align: center; }
.section.large-spacing { padding: 4rem 0; }
```

**Simple, clean, and works perfectly!**

## Common Patterns

### Article with Sidebar
```
| Section Metadata |
| style | article-with-sidebar |
```

### Hero Section
```
| Section Metadata |
| style | hero, dark, centered |
```

### Two-Column Layout
```
| Section Metadata |
| style | two-column, light-gray |
```

### Full-Width Section
```
| Section Metadata |
| style | full-width, no-padding |
```

## Summary

✅ **DO:**
- Use `style` key for CSS classes
- Comma-separate multiple values
- Put metadata at top of section
- Use semantic, descriptive names

❌ **DON'T:**
- Use multiple `style` rows
- Space-separate values (creates hyphenated class)
- Expect other keys to become CSS classes
- Put metadata at bottom of section

## Reference

- [Full Documentation](./SECTION-METADATA.md)
- [Metadata Keys Reference](./SECTION-METADATA-KEYS.md)
- [Official EDS Docs](https://www.aem.live/developer/block-collection/section-metadata)
