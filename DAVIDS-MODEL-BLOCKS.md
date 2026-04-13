# David's Model for Block Authoring

This guide explains how to apply [David's Model](https://www.aem.live/docs/davidsmodel) principles when building blocks in Edge Delivery Services.

## Rule #14: Name/Value Pairs Only for Configuration

> "Use name/value pairs only for configuration... This should only be used in exceptional cases and largely for content that is not displayed as such... It is definitely not recommended to map default content concepts and have name/value pairs for things like Heading, Image or Text."

### What This Means

**Name/value pairs (two-column tables) should be for:**
- ✅ Configuration options (like section metadata)
- ✅ Settings that control behavior
- ✅ Data attributes that aren't displayed directly

**NOT for:**
- ❌ Content that appears on the page (headings, text, images)
- ❌ Semantic document elements
- ❌ Standard content patterns

## The Problem with Name/Value Content Blocks

### Anti-Pattern Example: Person Card with Name/Value Pairs

**Authoring:**
```
| Person Card |
| Name  | John Doe              |
| Role  | Senior Developer      |
| Email | john.doe@company.com  |
| Phone | +1 555-123-4567       |
| Image | [image]               |
```

**Why this violates David's Model:**
1. Name, Role, Email, Phone, Image are **content**, not configuration
2. Labels are redundant (we know what a name is)
3. Requires JavaScript to parse and reorder
4. More verbose for authors
5. Doesn't follow semantic document structure

## The Semantic Approach

### Recommended: Position-Based Content

**Authoring:**
```
| Person Card |
| John Doe              |
| Senior Developer      |
| john.doe@company.com  |
| +1 555-123-4567       |
| [image]               |
```

**Why this follows David's Model:**
1. ✅ Content is in semantic order (like a business card)
2. ✅ No redundant labels
3. ✅ Simpler authoring
4. ✅ Minimal JavaScript needed
5. ✅ Follows document structure principles

### Implementation

```js
export default function decorate(block) {
  const cells = [...block.children];
  
  // Detect field types by position and content
  cells.forEach((cell, index) => {
    const text = cell.textContent?.trim();
    const img = cell.querySelector('img');
    
    if (img) {
      cell.classList.add('person-image');
    } else if (index === 0) {
      cell.classList.add('person-name');
    } else if (index === 1) {
      cell.classList.add('person-role');
    } else if (isEmail(text)) {
      cell.classList.add('person-email');
      // Convert to mailto link
    } else if (isPhone(text)) {
      cell.classList.add('person-phone');
      // Convert to tel link
    }
  });
}
```

## When to Use Name/Value Pairs

### Appropriate Use Case: Configuration

```
| Gallery |
| [image1] [image2] [image3] |
| Columns | 3                  | ← Configuration
| Theme   | Dark               | ← Configuration
| Autoplay | true              | ← Configuration
```

**JavaScript:**
```js
export default function decorate(block) {
  // Extract configuration from last rows
  const config = {};
  const contentRows = [];
  
  [...block.children].forEach((row) => {
    if (row.children.length === 2) {
      const [key, value] = row.children;
      const keyText = key.textContent?.trim().toLowerCase();
      // Check if this looks like configuration
      if (['columns', 'theme', 'autoplay'].includes(keyText)) {
        config[keyText] = value.textContent?.trim();
        return; // Don't add to content
      }
    }
    contentRows.push(row);
  });
  
  // Use config to control behavior
  if (config.columns) {
    block.style.gridTemplateColumns = `repeat(${config.columns}, 1fr)`;
  }
  if (config.theme === 'dark') {
    block.classList.add('dark');
  }
}
```

## Decision Framework

### Use Semantic Structure When:
- ✅ Content has a natural order (like a business card)
- ✅ Fields are predictable and consistent
- ✅ Content is displayed directly
- ✅ Authors understand the pattern

**Examples:**
- Person cards (name, role, contact)
- Product cards (image, title, price, description)
- Testimonials (quote, author, photo)
- Step-by-step instructions (numbered list)

### Use Name/Value Pairs When:
- ✅ Controlling block behavior (not content)
- ✅ Fields are unpredictable or user-defined
- ✅ Configuration options (like metadata)
- ✅ Data attributes (not displayed directly)

**Examples:**
- Block configuration (columns, theme, layout)
- Feature flags (autoplay, loop, controls)
- Technical settings (API keys, IDs)
- Metadata (tags, categories)

### Use Hybrid Approach When:
- ✅ Mix of content and configuration
- ✅ Optional configuration with required content

**Example:**
```
| Product Card |
| [product image]           |
| Product Name              |
| $99.99                    |
| Product description...    |
| Badge | New               | ← Configuration
| CTA Text | Buy Now        | ← Configuration
```

## Real-World Examples

### ✅ Good: Semantic Quote Block

```
| Quote |
| The only way to do great work is to love what you do. |
| Steve Jobs                                              |
| [photo of Steve Jobs]                                   |
```

**JavaScript:**
```js
export default function decorate(block) {
  const [quoteCell, authorCell, imageCell] = block.children;
  
  quoteCell.classList.add('quote-text');
  authorCell.classList.add('quote-author');
  imageCell?.classList.add('quote-image');
  
  // Wrap quote in blockquote
  const blockquote = document.createElement('blockquote');
  blockquote.appendChild(quoteCell);
  block.insertBefore(blockquote, authorCell);
}
```

### ❌ Bad: Name/Value Quote Block

```
| Quote |
| Text   | The only way to do great work is to love what you do. |
| Author | Steve Jobs                                              |
| Image  | [photo of Steve Jobs]                                   |
```

This is an anti-pattern because Text, Author, and Image are content, not configuration.

### ✅ Good: Semantic with Configuration

```
| Hero |
| Welcome to Our Site       |
| Discover amazing things   |
| [hero image]              |
| Alignment | Center        | ← Configuration
| Overlay   | Dark          | ← Configuration
```

**JavaScript:**
```js
export default function decorate(block) {
  const config = {};
  const contentCells = [];
  
  [...block.children].forEach((row) => {
    if (row.children.length === 2) {
      const [key, value] = row.children;
      const keyText = key.textContent?.trim().toLowerCase();
      if (['alignment', 'overlay'].includes(keyText)) {
        config[keyText] = value.textContent?.trim().toLowerCase();
        return;
      }
    }
    contentCells.push(row);
  });
  
  // Apply configuration
  if (config.alignment) {
    block.classList.add(`align-${config.alignment}`);
  }
  if (config.overlay) {
    block.classList.add(`overlay-${config.overlay}`);
  }
  
  // Process content semantically
  const [headingCell, subtitleCell, imageCell] = contentCells;
  headingCell.classList.add('hero-heading');
  subtitleCell.classList.add('hero-subtitle');
  imageCell.classList.add('hero-image');
}
```

## Migration Strategy

If you have existing blocks using name/value pairs for content:

### 1. Assess Impact
- How many pages use this block?
- Can authors adapt to new structure?
- Is the content truly semantic?

### 2. Support Both Formats (Transition Period)

```js
export default function decorate(block) {
  // Detect format
  const firstRow = block.children[0];
  const isNameValue = firstRow.children.length === 2 
    && firstRow.children[0].textContent?.trim().length > 0;
  
  if (isNameValue) {
    // Legacy name/value format
    decorateNameValue(block);
  } else {
    // New semantic format
    decorateSemantic(block);
  }
}
```

### 3. Document New Authoring Pattern

Create clear authoring guides showing:
- Expected field order
- Required vs optional fields
- Examples with screenshots
- Migration instructions

### 4. Gradual Migration

- Update documentation first
- Support both formats for 3-6 months
- Migrate high-traffic pages first
- Eventually deprecate old format

## Performance Benefits

Semantic structure is faster:

**Name/Value Approach:**
```js
// Parse labels, build lookup object, reorder, apply transformations
const data = {};
rows.forEach((row) => {
  const key = row.children[0].textContent.toLowerCase();
  data[key] = row.children[1];
});
FIELD_ORDER.forEach((key) => {
  block.appendChild(data[key]);
});
```

**Semantic Approach:**
```js
// Direct processing, no parsing needed
cells.forEach((cell, index) => {
  if (index === 0) cell.classList.add('name');
  if (index === 1) cell.classList.add('role');
  // etc.
});
```

Less JavaScript = faster LCP = better Core Web Vitals.

## Summary

**David's Model Rule #14 in practice:**

1. **Content = Semantic structure** (position-based, no labels)
2. **Configuration = Name/value pairs** (settings, not displayed content)
3. **Hybrid = Semantic content + optional configuration**

**Ask yourself:**
- Is this content that appears on the page? → Use semantic structure
- Is this a setting that controls behavior? → Use name/value pairs
- Can authors understand the order? → Use semantic structure
- Are fields unpredictable? → Consider name/value pairs (but maybe it should be multiple blocks)

Following David's Model makes blocks:
- ✅ Easier to author
- ✅ Faster to render
- ✅ More maintainable
- ✅ Better aligned with web semantics
- ✅ More performant (less JavaScript)

## Related Resources

- [David's Model](https://www.aem.live/docs/davidsmodel)
- [Block Collection](https://www.aem.live/developer/block-collection)
- [Markup Reference](https://www.aem.live/developer/markup-reference)
