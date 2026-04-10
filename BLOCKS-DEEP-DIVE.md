# Blocks Deep Dive: How Content Becomes Interactive Components

This guide explains in detail how Edge Delivery Services blocks work, from authored content to decorated, interactive components on the page.

## Table of Contents

1. [The Content-to-Block Pipeline](#the-content-to-block-pipeline)
2. [Content Structure: Tables as Data](#content-structure-tables-as-data)
3. [The HTML Delivered to Your Code](#the-html-delivered-to-your-code)
4. [Block Decoration: Step by Step](#block-decoration-step-by-step)
5. [Real-World Examples](#real-world-examples)
6. [Advanced Patterns](#advanced-patterns)

---

## The Content-to-Block Pipeline

### Overview

The journey from authored content to a rendered block follows this path:

```
Author creates content → EDS backend processes → HTML structure → Block JS decorates → Final rendered component
```

### Step-by-Step Process

1. **Author creates a table** in Google Docs, SharePoint, or AEM
2. **EDS backend converts** the table to semantic HTML
3. **HTML is delivered** to the browser with a specific structure
4. **`aem.js` identifies** blocks and calls decoration functions
5. **Block JavaScript transforms** the HTML into the final component
6. **CSS styles** the decorated component

---

## Content Structure: Tables as Data

### The Authoring Contract

Blocks are authored as **tables** in the content source. The table structure defines how data is organized:

- **Table name** (first row, merged cells) = Block name
- **Rows** = Data records or configuration
- **Columns** = Fields or properties

### Example: Hero Block Authoring

In Google Docs or AEM, an author creates:

```
┌─────────────────────────────────────┐
│ Hero                                │  ← Block name (merged cells)
├─────────────────────────────────────┤
│ [image.jpg]                         │  ← Row 1: Image
├─────────────────────────────────────┤
│ Welcome to Our Site                 │  ← Row 2: Heading
│ Discover amazing products           │         Description
│ [Shop Now →]                        │         CTA link
└─────────────────────────────────────┘
```

### Table Structure Variations

**Single Column (Stacked Content)**
```
┌──────────────┐
│ Block Name   │
├──────────────┤
│ Item 1       │
├──────────────┤
│ Item 2       │
├──────────────┤
│ Item 3       │
└──────────────┘
```

**Two Columns (Key-Value Pairs)**
```
┌──────────────┬──────────────┐
│ Block Name   │              │
├──────────────┼──────────────┤
│ Label        │ Value        │
├──────────────┼──────────────┤
│ Title        │ My Title     │
├──────────────┼──────────────┤
│ Description  │ My Desc      │
└──────────────┴──────────────┘
```

**Multi-Column (Repeating Items)**
```
┌────────┬────────┬────────┐
│ Cards  │        │        │
├────────┼────────┼────────┤
│ Card 1 │ Card 2 │ Card 3 │
│ [img]  │ [img]  │ [img]  │
│ Title  │ Title  │ Title  │
│ Text   │ Text   │ Text   │
└────────┴────────┴────────┘
```

---

## The HTML Delivered to Your Code

### How EDS Converts Tables to HTML

The EDS backend transforms the authored table into a structured `<div>` with a specific pattern:

```html
<div class="hero block" data-block-name="hero" data-block-status="initialized">
  <div><!-- Row 1 -->
    <div><!-- Cell 1 -->
      <picture>
        <img src="image.jpg" alt="Hero image">
      </picture>
    </div>
  </div>
  <div><!-- Row 2 -->
    <div><!-- Cell 1 -->
      <h1>Welcome to Our Site</h1>
      <p>Discover amazing products</p>
      <p><a href="/shop">Shop Now →</a></p>
    </div>
  </div>
</div>
```

### The HTML Structure Pattern

Every block follows this consistent structure:

```html
<div class="[blockname] block" data-block-name="[blockname]">
  <div>                    ← Row wrapper
    <div>Cell 1</div>      ← Cell wrapper
    <div>Cell 2</div>      ← Cell wrapper
  </div>
  <div>                    ← Row wrapper
    <div>Cell 1</div>
    <div>Cell 2</div>
  </div>
</div>
```

**Key Points:**
- Block container has class `[blockname]` and `block`
- Each table row becomes a `<div>`
- Each table cell becomes a nested `<div>`
- Content inside cells is already parsed (headings, paragraphs, images, links)

### Content Type Conversion

The backend automatically converts content types:

| Authored Content | HTML Output |
|-----------------|-------------|
| Image URL | `<picture><img src="..." alt="..."></picture>` |
| Heading text | `<h1>`, `<h2>`, etc. (based on formatting) |
| Paragraph text | `<p>Text content</p>` |
| Link | `<a href="...">Link text</a>` |
| Bold text | `<strong>Bold</strong>` |
| Italic text | `<em>Italic</em>` |
| List | `<ul><li>...</li></ul>` |

---

## Block Decoration: Step by Step

### The Decoration Function

Every block exports a default function that receives the block element:

```javascript
/**
 * Decorates the block
 * @param {Element} block - The block container element
 */
export default async function decorate(block) {
  // Your decoration logic here
}
```

### When Decoration Happens

1. **Page loads** → HTML is rendered
2. **`aem.js` runs** → Identifies all blocks on the page
3. **For each block** → Loads the corresponding JS file
4. **Calls `decorate()`** → Passes the block element
5. **Block transforms** → Manipulates the DOM
6. **Sets status** → `data-block-status="loaded"`

### The Decoration Process

Let's walk through a complete decoration example:

#### Step 1: Inspect the Initial HTML

```javascript
export default async function decorate(block) {
  // At this point, block contains:
  // <div class="hero block">
  //   <div><div><picture>...</picture></div></div>
  //   <div><div><h1>...</h1><p>...</p><a>...</a></div></div>
  // </div>
  
  console.log(block.children); // Array-like list of row divs
}
```

#### Step 2: Extract the Rows

```javascript
export default async function decorate(block) {
  // Convert children to array for easier manipulation
  const rows = [...block.children];
  
  console.log(rows.length); // 2 (image row + content row)
  console.log(rows[0]); // First row div
  console.log(rows[1]); // Second row div
}
```

#### Step 3: Extract Cells from Rows

```javascript
export default async function decorate(block) {
  const rows = [...block.children];
  
  // Get cells from first row
  const imageRow = rows[0];
  const imageCells = [...imageRow.children];
  
  console.log(imageCells.length); // 1 (single cell with image)
  console.log(imageCells[0]); // <div><picture>...</picture></div>
  
  // Get cells from second row
  const contentRow = rows[1];
  const contentCells = [...contentRow.children];
  
  console.log(contentCells.length); // 1 (single cell with text)
  console.log(contentCells[0]); // <div><h1>...<p>...<a>...</div>
}
```

#### Step 4: Extract Specific Elements

```javascript
export default async function decorate(block) {
  const rows = [...block.children];
  const [imageRow, contentRow] = rows; // Destructure for clarity
  
  // Extract image
  const picture = imageRow.querySelector('picture');
  const img = picture?.querySelector('img');
  
  console.log(img.src); // "https://..."
  console.log(img.alt); // "Hero image"
  
  // Extract content elements
  const heading = contentRow.querySelector('h1');
  const description = contentRow.querySelector('p');
  const cta = contentRow.querySelector('a');
  
  console.log(heading.textContent); // "Welcome to Our Site"
  console.log(description.textContent); // "Discover amazing products"
  console.log(cta.href); // "/shop"
}
```

#### Step 5: Transform the DOM

```javascript
export default async function decorate(block) {
  const rows = [...block.children];
  const [imageRow, contentRow] = rows;
  
  // Clear the block (remove all rows)
  block.innerHTML = '';
  
  // Create new structure
  const heroContainer = document.createElement('div');
  heroContainer.className = 'hero-container';
  
  // Add image section
  const imageSection = document.createElement('div');
  imageSection.className = 'hero-image';
  const picture = imageRow.querySelector('picture');
  imageSection.append(picture);
  
  // Add content section
  const contentSection = document.createElement('div');
  contentSection.className = 'hero-content';
  const heading = contentRow.querySelector('h1');
  const description = contentRow.querySelector('p');
  const cta = contentRow.querySelector('a');
  
  contentSection.append(heading, description);
  
  // Transform CTA into button
  const button = document.createElement('button');
  button.className = 'hero-cta';
  button.textContent = cta.textContent;
  button.addEventListener('click', () => {
    window.location.href = cta.href;
  });
  contentSection.append(button);
  
  // Assemble final structure
  heroContainer.append(imageSection, contentSection);
  block.append(heroContainer);
}
```

#### Step 6: Final HTML Output

After decoration, the block now looks like:

```html
<div class="hero block" data-block-status="loaded">
  <div class="hero-container">
    <div class="hero-image">
      <picture>
        <img src="image.jpg" alt="Hero image">
      </picture>
    </div>
    <div class="hero-content">
      <h1>Welcome to Our Site</h1>
      <p>Discover amazing products</p>
      <button class="hero-cta">Shop Now →</button>
    </div>
  </div>
</div>
```

---

## Real-World Examples

### Example 1: Cards Block (Multi-Column)

#### Authored Content

```
┌─────────┬─────────┬─────────┐
│ Cards   │         │         │
├─────────┼─────────┼─────────┤
│ [img1]  │ [img2]  │ [img3]  │
│ Title 1 │ Title 2 │ Title 3 │
│ Desc 1  │ Desc 2  │ Desc 3  │
└─────────┴─────────┴─────────┘
```

#### HTML Delivered

```html
<div class="cards block">
  <div><!-- Row 1 -->
    <div><picture><img src="img1.jpg"></picture><p>Title 1</p><p>Desc 1</p></div>
    <div><picture><img src="img2.jpg"></picture><p>Title 2</p><p>Desc 2</p></div>
    <div><picture><img src="img3.jpg"></picture><p>Title 3</p><p>Desc 3</p></div>
  </div>
</div>
```

#### Decoration Code

```javascript
export default async function decorate(block) {
  // Get all cells from the first (and only) row
  const cells = [...block.firstElementChild.children];
  
  // Clear block
  block.innerHTML = '';
  
  // Create a card container
  const cardsContainer = document.createElement('ul');
  cardsContainer.className = 'cards-container';
  
  // Process each cell as a card
  cells.forEach((cell) => {
    const card = document.createElement('li');
    card.className = 'card';
    
    // Extract elements
    const img = cell.querySelector('img');
    const [titleP, descP] = cell.querySelectorAll('p');
    
    // Create card structure
    if (img) {
      const cardImage = document.createElement('div');
      cardImage.className = 'card-image';
      cardImage.append(img);
      card.append(cardImage);
    }
    
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    
    if (titleP) {
      const title = document.createElement('h3');
      title.textContent = titleP.textContent;
      cardBody.append(title);
    }
    
    if (descP) {
      const desc = document.createElement('p');
      desc.textContent = descP.textContent;
      cardBody.append(desc);
    }
    
    card.append(cardBody);
    cardsContainer.append(card);
  });
  
  block.append(cardsContainer);
}
```

#### Final Output

```html
<div class="cards block">
  <ul class="cards-container">
    <li class="card">
      <div class="card-image"><img src="img1.jpg"></div>
      <div class="card-body">
        <h3>Title 1</h3>
        <p>Desc 1</p>
      </div>
    </li>
    <li class="card">
      <div class="card-image"><img src="img2.jpg"></div>
      <div class="card-body">
        <h3>Title 2</h3>
        <p>Desc 2</p>
      </div>
    </li>
    <li class="card">
      <div class="card-image"><img src="img3.jpg"></div>
      <div class="card-body">
        <h3>Title 3</h3>
        <p>Desc 3</p>
      </div>
    </li>
  </ul>
</div>
```

### Example 2: Section Metadata (Key-Value Configuration)

#### Authored Content

```
┌──────────────────┬────────────┐
│ Section Metadata │            │
├──────────────────┼────────────┤
│ Style            │ highlight  │
├──────────────────┼────────────┤
│ Background       │ dark       │
└──────────────────┴────────────┘
```

#### HTML Delivered

```html
<div class="section-metadata block">
  <div>
    <div>Style</div>
    <div>highlight</div>
  </div>
  <div>
    <div>Background</div>
    <div>dark</div>
  </div>
</div>
```

#### Decoration Code

```javascript
export default async function decorate(block) {
  const meta = {};
  
  // Extract key-value pairs
  [...block.children].forEach((row) => {
    const [keyCell, valueCell] = row.children;
    if (keyCell && valueCell) {
      const key = keyCell.textContent.trim().toLowerCase();
      const value = valueCell.textContent.trim().toLowerCase();
      meta[key] = value;
    }
  });
  
  console.log(meta); // { style: 'highlight', background: 'dark' }
  
  // Apply metadata to parent section
  const section = block.closest('.section');
  if (section) {
    Object.entries(meta).forEach(([key, value]) => {
      section.classList.add(`${key}-${value}`);
      section.dataset[key] = value;
    });
  }
  
  // Remove the metadata block from display
  block.remove();
}
```

#### Result

The section now has classes and data attributes:

```html
<div class="section style-highlight background-dark" data-style="highlight" data-background="dark">
  <!-- Section content -->
</div>
```

### Example 3: Sidebar CTA (Mixed Content)

#### Authored Content

```
┌──────────────┬─────────────────────────┐
│ Sidebar CTA  │                         │
├──────────────┼─────────────────────────┤
│ [bg-img.jpg] │ Special Offer!          │
│              │ Save 20% today          │
│              │ [Shop Now →]            │
└──────────────┴─────────────────────────┘
```

#### HTML Delivered

```html
<div class="sidebar-cta block">
  <div>
    <div><picture><img src="bg-img.jpg"></picture></div>
    <div>
      <p><strong>Special Offer!</strong></p>
      <p>Save 20% today</p>
      <p><a href="/shop">Shop Now →</a></p>
    </div>
  </div>
</div>
```

#### Decoration Code

```javascript
export default async function decorate(block) {
  const row = block.firstElementChild;
  const [imageCell, contentCell] = row.children;
  
  // Extract background image
  const img = imageCell.querySelector('img');
  if (img) {
    block.style.backgroundImage = `url('${img.src}')`;
    block.style.backgroundSize = 'cover';
    block.style.backgroundPosition = 'center';
    imageCell.remove(); // Remove the image cell
  }
  
  // Process content
  const heading = contentCell.querySelector('strong')?.parentElement;
  const description = contentCell.querySelectorAll('p')[1];
  const ctaLink = contentCell.querySelector('a');
  
  // Clear and rebuild
  block.innerHTML = '';
  
  const content = document.createElement('div');
  content.className = 'sidebar-cta-content';
  
  if (heading) {
    const h3 = document.createElement('h3');
    h3.textContent = heading.textContent;
    content.append(h3);
  }
  
  if (description) {
    content.append(description);
  }
  
  if (ctaLink) {
    ctaLink.className = 'button primary';
    content.append(ctaLink);
  }
  
  block.append(content);
}
```

---

## Advanced Patterns

### Pattern 1: Handling Optional Content

Authors may omit fields. Always check for existence:

```javascript
export default async function decorate(block) {
  const row = block.firstElementChild;
  const cells = [...row.children];
  
  // Safely extract image (might not exist)
  const img = cells[0]?.querySelector('img');
  if (img) {
    // Do something with image
  }
  
  // Safely extract heading (might not exist)
  const heading = cells[1]?.querySelector('h1, h2, h3');
  if (heading) {
    // Do something with heading
  }
}
```

### Pattern 2: Handling Variable Row Counts

```javascript
export default async function decorate(block) {
  const rows = [...block.children];
  
  // First row might be configuration
  const configRow = rows[0];
  const configCells = [...configRow.children];
  
  if (configCells.length === 2) {
    // This is a config row (key-value)
    const config = extractConfig(configRow);
    rows.shift(); // Remove config row
  }
  
  // Remaining rows are content
  rows.forEach((row) => {
    // Process content rows
  });
}
```

### Pattern 3: Extracting Configuration from First Row

```javascript
function extractConfig(row) {
  const config = {};
  [...row.children].forEach((cell) => {
    const [key, value] = cell.textContent.split(':').map(s => s.trim());
    if (key && value) {
      config[key.toLowerCase()] = value;
    }
  });
  return config;
}

export default async function decorate(block) {
  const rows = [...block.children];
  const config = extractConfig(rows[0]);
  
  console.log(config); // { theme: 'dark', layout: 'grid' }
  
  // Apply config
  if (config.theme) {
    block.classList.add(`theme-${config.theme}`);
  }
}
```

### Pattern 4: Async Data Loading

```javascript
export default async function decorate(block) {
  // Extract configuration
  const tagCell = block.querySelector('div > div');
  const tags = tagCell.textContent.split(',').map(t => t.trim());
  
  // Load external data
  const response = await fetch('/query-index.json');
  const data = await response.json();
  
  // Filter data based on tags
  const filtered = data.data.filter(item => 
    tags.some(tag => item.tags?.includes(tag))
  );
  
  // Clear block and render results
  block.innerHTML = '';
  filtered.forEach(item => {
    const card = createCard(item);
    block.append(card);
  });
}
```

### Pattern 5: Event Listeners and Interactivity

```javascript
export default async function decorate(block) {
  const rows = [...block.children];
  
  rows.forEach((row, index) => {
    const button = row.querySelector('a');
    if (button) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        console.log(`Card ${index} clicked`);
        // Custom behavior
      });
    }
  });
}
```

### Pattern 6: Lazy Loading with Intersection Observer

```javascript
export default async function decorate(block) {
  const loadContent = async () => {
    // Load heavy content
    const content = await fetch('/api/data').then(r => r.json());
    renderContent(block, content);
  };
  
  // Only load when block enters viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadContent();
        observer.disconnect();
      }
    });
  });
  
  observer.observe(block);
}
```

---

## Key Takeaways

### Understanding the Data Flow

1. **Authors create tables** → Structure defines the data contract
2. **EDS converts to HTML** → Consistent `<div>` structure with rows and cells
3. **Your code receives** → Pre-parsed HTML with semantic elements
4. **You transform** → Extract, restructure, enhance
5. **CSS styles** → Final visual presentation

### Best Practices

✅ **Always inspect the HTML first**
```javascript
console.log(block.innerHTML); // See what you're working with
```

✅ **Handle missing content gracefully**
```javascript
const img = cell?.querySelector('img');
if (img) { /* use it */ }
```

✅ **Use destructuring for clarity**
```javascript
const [imageRow, contentRow] = [...block.children];
```

✅ **Keep semantic HTML**
```javascript
// Good: Keep heading semantics
const h2 = document.createElement('h2');

// Bad: Lose semantics
const div = document.createElement('div');
div.className = 'heading';
```

✅ **Test with varied content**
- Empty fields
- Extra rows
- Missing images
- Long text

### Common Pitfalls

❌ **Assuming fixed structure**
```javascript
// Bad: Assumes exactly 2 rows
const imageRow = block.children[0];
const contentRow = block.children[1];

// Good: Check existence
const rows = [...block.children];
if (rows.length >= 2) {
  const [imageRow, contentRow] = rows;
}
```

❌ **Not checking for null**
```javascript
// Bad: Will throw if no image
const img = block.querySelector('img');
const src = img.src; // Error if img is null

// Good: Safe access
const img = block.querySelector('img');
const src = img?.src || '/default.jpg';
```

❌ **Hardcoding element types**
```javascript
// Bad: Assumes <h1>
const heading = block.querySelector('h1');

// Good: Accept any heading level
const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
```

---

## Debugging Tips

### Inspect the Initial HTML

```javascript
export default async function decorate(block) {
  console.log('Initial HTML:', block.innerHTML);
  console.log('Children:', [...block.children]);
  console.log('First row:', block.firstElementChild);
  
  // Your decoration logic...
}
```

### Log the Transformation Steps

```javascript
export default async function decorate(block) {
  console.log('Step 1: Extract rows');
  const rows = [...block.children];
  console.log('Rows:', rows);
  
  console.log('Step 2: Extract cells');
  const cells = [...rows[0].children];
  console.log('Cells:', cells);
  
  console.log('Step 3: Extract elements');
  const img = cells[0]?.querySelector('img');
  console.log('Image:', img);
}
```

### Use Browser DevTools

1. **Elements panel** → Inspect the block before/after decoration
2. **Console** → Log data at each step
3. **Network panel** → Check if external data loads
4. **Performance panel** → Identify slow operations

---

## Conclusion

Blocks are the fundamental building blocks of Edge Delivery Services. Understanding how content flows from authoring to decoration empowers you to:

- Design better authoring experiences
- Write more robust decoration code
- Debug issues faster
- Create reusable, maintainable components

The key is remembering: **blocks transform structured HTML into interactive components**. The HTML structure is predictable, but the content within can vary. Write defensive code that handles edge cases, and your blocks will work reliably across all content scenarios.
