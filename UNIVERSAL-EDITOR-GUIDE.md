# Universal Editor Integration Guide

This guide explains how to add Universal Editor support to blocks for in-context editing in AEM.

## Overview

The Universal Editor enables content authors to edit page content directly in the rendered page. To make blocks editable, you need to add `data-aue-*` attributes that tell the editor:

- What can be edited
- What type of content it is
- How it maps to the AEM content model

## Basic Instrumentation

### Block-Level Attributes

Add these attributes to the main block element:

```javascript
export default function decorate(block) {
  // Mark the block as an editable component
  block.setAttribute('data-aue-type', 'component');
  block.setAttribute('data-aue-label', 'Block Display Name');
  block.setAttribute('data-aue-model', 'blockname');
  
  // Your block decoration logic...
}
```

### Property-Level Attributes

Mark individual editable properties within the block:

```javascript
// For rich text content
contentDiv.setAttribute('data-aue-prop', 'text');
contentDiv.setAttribute('data-aue-type', 'richtext');

// For plain text
headingElement.setAttribute('data-aue-prop', 'heading');
headingElement.setAttribute('data-aue-type', 'text');

// For images
imageElement.setAttribute('data-aue-prop', 'image');
imageElement.setAttribute('data-aue-type', 'media');

// For links
linkElement.setAttribute('data-aue-prop', 'link');
linkElement.setAttribute('data-aue-type', 'reference');
```

## Attribute Reference

### `data-aue-type`

Defines what type of content or component this is:

- **`component`** - A block or component container
- **`container`** - A container that holds other components
- **`richtext`** - Rich text content (with formatting)
- **`text`** - Plain text content
- **`media`** - Images, videos, or other media
- **`reference`** - Links or references to other content
- **`multifield`** - Repeating content items

### `data-aue-label`

Human-readable name shown in the Universal Editor UI:

```javascript
block.setAttribute('data-aue-label', 'Hero Banner');
```

### `data-aue-model`

Links to the AEM component model (usually matches the block name):

```javascript
block.setAttribute('data-aue-model', 'hero');
```

### `data-aue-prop`

The property name in the AEM content model:

```javascript
element.setAttribute('data-aue-prop', 'title');
```

### `data-aue-filter`

Filter which components can be added to a container:

```javascript
container.setAttribute('data-aue-filter', 'section');
```

## Example: Hero Block

```javascript
/**
 * Hero block with Universal Editor support
 * @param {Element} block
 */
export default function decorate(block) {
  // Instrument the block
  block.setAttribute('data-aue-type', 'component');
  block.setAttribute('data-aue-label', 'Hero');
  block.setAttribute('data-aue-model', 'hero');

  const [imageRow, contentRow] = [...block.children];

  // Instrument the image
  if (imageRow) {
    const img = imageRow.querySelector('img');
    if (img) {
      img.setAttribute('data-aue-prop', 'image');
      img.setAttribute('data-aue-type', 'media');
    }
  }

  // Instrument the content
  if (contentRow) {
    const heading = contentRow.querySelector('h1, h2, h3');
    if (heading) {
      heading.setAttribute('data-aue-prop', 'heading');
      heading.setAttribute('data-aue-type', 'text');
    }

    const description = contentRow.querySelector('p');
    if (description) {
      description.setAttribute('data-aue-prop', 'description');
      description.setAttribute('data-aue-type', 'richtext');
    }

    const cta = contentRow.querySelector('a');
    if (cta) {
      cta.setAttribute('data-aue-prop', 'cta');
      cta.setAttribute('data-aue-type', 'reference');
    }
  }
}
```

## Example: Cards Block with Repeating Items

```javascript
export default function decorate(block) {
  block.setAttribute('data-aue-type', 'component');
  block.setAttribute('data-aue-label', 'Cards');
  block.setAttribute('data-aue-model', 'cards');

  const cards = [...block.children];
  
  cards.forEach((card, index) => {
    // Mark each card as a multifield item
    card.setAttribute('data-aue-type', 'component');
    card.setAttribute('data-aue-label', `Card ${index + 1}`);
    
    const img = card.querySelector('img');
    if (img) {
      img.setAttribute('data-aue-prop', 'image');
      img.setAttribute('data-aue-type', 'media');
    }

    const title = card.querySelector('h3');
    if (title) {
      title.setAttribute('data-aue-prop', 'title');
      title.setAttribute('data-aue-type', 'text');
    }

    const description = card.querySelector('p');
    if (description) {
      description.setAttribute('data-aue-prop', 'description');
      description.setAttribute('data-aue-type', 'richtext');
    }
  });
}
```

## Container Instrumentation

For sections or containers that hold multiple blocks:

```javascript
// In scripts.js or a section decorator
section.setAttribute('data-aue-type', 'container');
section.setAttribute('data-aue-label', 'Section');
section.setAttribute('data-aue-filter', 'section'); // Only allow section-level components
```

## Testing Universal Editor Integration

### 1. Local Testing

Start your dev server with the Universal Editor enabled:

```bash
aem up
```

Access the page through the Universal Editor:
```
http://localhost:3000/<page-path>?editor=universal
```

### 2. Verify Instrumentation

Open browser DevTools and check that:
- Block elements have `data-aue-type="component"`
- Editable properties have appropriate `data-aue-prop` and `data-aue-type` attributes
- Labels are descriptive and user-friendly

### 3. Test Editing

In the Universal Editor:
- Click on blocks to select them
- Verify that editable properties are highlighted
- Test editing text, images, and links
- Check that changes are reflected in real-time

## AEM Component Models

For each block, you need a corresponding AEM component model. The model defines:

- Component properties and their types
- Default values
- Validation rules
- Authoring dialogs

Example component model structure in AEM:

```
/apps/<site>/components/hero/
  ├── .content.xml          # Component definition
  ├── _cq_dialog.xml        # Authoring dialog
  └── hero.html             # HTL template (optional)
```

## Best Practices

### 1. Consistent Naming

Use consistent property names between:
- `data-aue-prop` attributes
- AEM component properties
- Block variable names

### 2. Semantic Labels

Use clear, author-friendly labels:
- ✅ "Hero Heading"
- ❌ "h1Text"

### 3. Appropriate Types

Choose the right `data-aue-type`:
- Use `richtext` for formatted content
- Use `text` for plain strings
- Use `media` for images/videos
- Use `reference` for links

### 4. Graceful Degradation

Blocks should work without Universal Editor:
```javascript
// Don't break if attributes aren't present
if (window.universalEditor) {
  block.setAttribute('data-aue-type', 'component');
}
```

### 5. Test Both Modes

Test your blocks in:
- Standard rendering (without Universal Editor)
- Universal Editor mode
- Different content scenarios (empty, partial, full)

## Troubleshooting

### Block not editable in Universal Editor

- Check that `data-aue-type="component"` is set on the block
- Verify `data-aue-model` matches the AEM component name
- Ensure the AEM component exists and is properly configured

### Properties not editable

- Check that `data-aue-prop` is set on the element
- Verify `data-aue-type` is appropriate for the content
- Ensure the property exists in the AEM component model

### Changes not saving

- Check browser console for errors
- Verify AEM connection in Universal Editor
- Ensure user has edit permissions in AEM

## Resources

- [Universal Editor Documentation](https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/implementing/developing/universal-editor/introduction.html)
- [AEM Component Development](https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/implementing/developing/components/overview.html)
- [Edge Delivery Services Documentation](https://www.aem.live/docs/)
