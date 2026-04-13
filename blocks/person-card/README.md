# Person Card Block

A card component for displaying person information (name, role, contact details, photo).

## Authoring

### Basic Structure

Create a single-column table in Google Docs:

```
| Person Card |
| John Doe              |
| Senior Developer      |
| john.doe@company.com  |
| +1 555-123-4567       |
| [insert image]        |
```

### Field Order

Fields are identified by **position and content type**, not labels:

1. **Name** (required) - First text field
2. **Role** (optional) - Second text field  
3. **Email** (optional) - Auto-detected by @ symbol, converted to mailto: link
4. **Phone** (optional) - Auto-detected by number pattern, converted to tel: link
5. **Image** (optional) - Can be anywhere in the list

### Examples

**Minimal (name only):**
```
| Person Card |
| Jane Smith |
```

**With role:**
```
| Person Card |
| Jane Smith        |
| Product Manager   |
```

**Full contact card:**
```
| Person Card |
| Jane Smith              |
| Product Manager         |
| jane.smith@company.com  |
| +1 555-987-6543         |
| [insert photo]          |
```

**Image first (visual hierarchy):**
```
| Person Card |
| [insert photo]          |
| Jane Smith              |
| Product Manager         |
| jane.smith@company.com  |
```

## Variations

Add variations in parentheses after the block name:

### Dark Theme
```
| Person Card (Dark) |
| John Doe           |
| Developer          |
```

**Effect:** Dark background (#333) with light text

### Compact
```
| Person Card (Compact) |
| John Doe              |
| Developer             |
```

**Effect:** Smaller size (300px max-width), reduced padding and font sizes

### Highlighted
```
| Person Card (Highlighted) |
| John Doe                  |
| Developer                 |
```

**Effect:** Blue accent border and light blue background

### Horizontal
```
| Person Card (Horizontal) |
| [photo]                  |
| John Doe                 |
| Developer                |
| john@company.com         |
```

**Effect:** Image and content displayed side-by-side (600px max-width)

### Combined Variations
```
| Person Card (Dark, Compact) |
| John Doe                    |
| Developer                   |
```

Multiple variations can be combined!

## Technical Details

### Semantic Approach

This block follows **David's Model Rule #14** by using semantic structure instead of name/value pairs:

- ✅ **Content is position-based** (like a business card)
- ✅ **No redundant labels** (we know what a name is)
- ✅ **Auto-detection** for email and phone
- ✅ **Simpler authoring** (less typing)
- ✅ **Better performance** (less JavaScript parsing)

### Auto-Detection

**Email detection:**
- Pattern: `text@domain.ext`
- Automatically converted to `<a href="mailto:...">` link

**Phone detection:**
- Pattern: Numbers, spaces, dashes, parentheses, plus sign
- Minimum 7 digits
- Automatically converted to `<a href="tel:...">` link

### Image Optimization

Images are automatically optimized for the card layout:
- **Display width:** 400px (card max-width)
- **Request width:** 800px (2x for retina displays)
- **Format:** WebP with fallbacks
- **Loading:** Lazy (unless above the fold)

### CSS Classes

The block automatically adds these classes:

- `.person-card` - Block container
- `.person-card-value` - All content cells
- `.person-name` - Name field
- `.person-role` - Role field
- `.person-email` - Email field (contains `<a>` tag)
- `.person-phone` - Phone field (contains `<a>` tag)
- `.person-image` - Image field

## Migration from Name/Value Format

If you have existing person cards using the old name/value format:

**Old format (deprecated):**
```
| Person Card |
| Name  | John Doe    |
| Role  | Developer   |
| Email | john@...    |
```

**New format:**
```
| Person Card |
| John Doe    |
| Developer   |
| john@...    |
```

The old implementation is preserved in `person-card-namevalue.js` for reference.

## Accessibility

- Email and phone links are keyboard accessible
- Image alt text is preserved from authored content
- Semantic HTML structure for screen readers
- Proper heading hierarchy (name uses default paragraph, style with CSS)

## Performance

- Minimal JavaScript (auto-detection only)
- Optimized images (WebP, proper sizing)
- CSS-only variations (no JS overhead)
- Lazy loading for below-the-fold cards

## Related Documentation

- [David's Model](https://www.aem.live/docs/davidsmodel) - Why semantic structure
- [DAVIDS-MODEL-BLOCKS.md](../../DAVIDS-MODEL-BLOCKS.md) - Detailed guidance
- [AUTHORING-COMPARISON.md](./AUTHORING-COMPARISON.md) - Old vs new approach
- [BLOCK-VARIATIONS.md](../../BLOCK-VARIATIONS.md) - How variations work
