# Page Metadata and Fragments Guide

## Page Metadata Overview

Page metadata is information about your page that's invisible to visitors but important for:
- **SEO** - Search engines (title, description, keywords)
- **Social Media** - Open Graph tags for Facebook, Twitter cards
- **AI Agents** - Google, ChatGPT, and other AI crawlers
- **EDS Configuration** - Template, theme, nav, footer references

### How to Author Page Metadata

Create a table at the **bottom** of your Google Doc:

```
| Metadata |
| Title       | My Page Title                    |
| Description | A brief description of the page  |
| Keywords    | keyword1, keyword2, keyword3     |
| Image       | [insert social share image]      |
```

**Important:** The table header must be exactly "Metadata" (not "Page Metadata").

## Common Metadata Properties

### SEO Metadata

```
| Metadata |
| Title       | Best Practices for Dental Care |
| Description | Learn expert tips for...       |
| Keywords    | dental, oral health, teeth     |
| Image       | [social share image]           |
```

**Results in:**
```html
<head>
  <title>Best Practices for Dental Care</title>
  <meta name="description" content="Learn expert tips for...">
  <meta name="keywords" content="dental, oral health, teeth">
  <meta property="og:image" content="...">
</head>
```

### Social Media Metadata

```
| Metadata |
| og:title       | Custom Facebook Title    |
| og:description | Custom Facebook desc     |
| og:image       | [Facebook share image]   |
| twitter:card   | summary_large_image      |
```

### Template and Theme

```
| Metadata |
| Template | article  |
| Theme    | dark     |
```

**Results in:**
```html
<body class="article dark">
```

The `template` and `theme` values are added as CSS classes to the `<body>` element.

## Fragment References in Metadata

### The `nav` and `footer` Properties

Your metadata table includes:

```
| Metadata |
| nav    | /nav    |
| footer | /footer |
```

**What this does:**
- Tells EDS where to load the header navigation content
- Tells EDS where to load the footer content
- These are **fragment references** - reusable content loaded from separate documents

### How Fragments Work

**Fragments** are standalone pieces of content that can be reused across multiple pages.

**Key concept:** Instead of copying the same header/footer into every page, you create ONE source of truth and reference it everywhere.

## Understanding the Nav Fragment

### 1. The Metadata Reference

In your page:
```
| Metadata |
| nav | /nav |
```

### 2. The Fragment Document

You have a separate Google Doc at `/nav` (or `nav.docx`) that contains:
```
[Colgate Logo Link]

- Home
- Products
  - Toothpaste
  - Toothbrushes
  - Mouthwash
- About
- Contact

[Search Icon Link]
```

### 3. How It's Loaded

Looking at `@/Users/draced/Library/CloudStorage/OneDrive-WPPCloud/Projects/GDIO/Edge Delivery Services/codebase/aem-eds/blocks/header/header.js:114-131`:

```js
export default async function decorate(block) {
  // Get nav path from metadata
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  
  // Fetch the fragment
  const resp = await fetch(`${navPath}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();
    // ... decorate the nav content
  }
}
```

**What happens:**
1. EDS reads `nav` metadata → finds `/nav`
2. Fetches `/nav.plain.html` (the rendered fragment)
3. Inserts and decorates the content into the header
4. Applies navigation styling and interactivity

### 4. The Result

Every page that has `| nav | /nav |` in its metadata gets the same navigation, loaded from that single source.

## Understanding the Footer Fragment

Same concept as nav:

### 1. The Metadata Reference

```
| Metadata |
| footer | /footer |
```

### 2. The Fragment Document

Separate Google Doc at `/footer` containing:
```
© 2024 Colgate-Palmolive Company

- Privacy Policy
- Terms of Use
- Contact Us

[Social Media Icons]
```

### 3. How It's Loaded

The footer block works similarly to header - fetches `/footer.plain.html` and decorates it.

## Fragment Lifecycle

### Important: Fragments Have Their Own Preview/Publish Cycle

**Fragment document** (`/nav`):
- Has its own preview URL: `https://...aem.page/nav`
- Has its own publish status
- Must be **previewed** and **published** separately

**Page using fragment:**
- References the fragment via metadata
- Gets the **published** version on live site
- Gets the **previewed** version on preview environment

### Workflow Example

1. **Edit nav fragment** in Google Docs
2. **Preview nav** → `https://...aem.page/nav`
3. **Test on page** → Page loads previewed nav
4. **Publish nav** → Makes it live
5. **Publish page** → Page now loads published nav

## When to Use Fragments

### ✅ Good Use Cases

**1. Headers and Footers**
```
| Metadata |
| nav    | /nav    |
| footer | /footer |
```
- Appears on every page
- Single source of truth
- Easy to update site-wide

**2. Promotional Banners**
```
| Fragment |
| /fragments/summer-sale-banner |
```
- Reused across multiple pages
- Can be updated independently
- Easy to remove when promotion ends

**3. Common Sections**
```
| Fragment |
| /fragments/newsletter-signup |
```
- Appears on many pages
- Consistent content and styling
- Update once, applies everywhere

### ❌ When to Avoid Fragments

**1. Primary Page Content**
- Main article text should be in the page itself
- Important for SEO and indexing
- Keeps authoring simple

**2. Page-Specific Content**
- Content that only appears on one page
- No reuse benefit
- Adds unnecessary complexity

**3. Content That Needs to Be Indexed**
- Fragments are loaded client-side (JavaScript)
- Search engine crawlers may not see fragment content
- Can hurt SEO if main content is in fragments

## Fragment SEO Considerations

### Preventing Fragment Indexing

Fragments themselves shouldn't be indexed as standalone pages. Add to fragment metadata:

```
| Metadata |
| Robots | noindex |
```

Or use bulk metadata (in a spreadsheet):

```
URL                 Robots
/fragments/*        noindex
/nav                noindex
/footer             noindex
```

**Why?** Fragments are meant to be embedded, not visited directly.

## Your Current Setup

Based on your metadata:

```
| Metadata |
| nav    | /nav    |
| footer | /footer |
```

**You have:**
1. A `/nav` Google Doc with navigation content
2. A `/footer` Google Doc with footer content
3. Every page references these via metadata
4. EDS automatically loads and decorates them

**To update site-wide navigation:**
1. Edit `/nav` Google Doc
2. Preview it
3. Publish it
4. All pages automatically get the update (no need to touch individual pages!)

## Advanced: Custom Fragment Paths

You can use different fragments for different sections:

```
| Metadata |
| nav    | /fragments/product-nav |
| footer | /fragments/product-footer |
```

Or conditional fragments based on template:

```
| Metadata |
| Template | product |
| nav      | /fragments/product-nav |
```

Then in your code, you could load different navs based on template.

## Fragment Block (Manual Embedding)

You can also manually embed fragments in page content:

```
| Fragment |
| https://main--site--org.aem.page/fragments/promo-banner |
```

Or if in `/fragments/` folder:

```
| Fragment |
| /fragments/promo-banner |
```

EDS automatically recognizes `/fragments/*` paths and treats them as fragments.

## Complete Example

### Page Document

```
[Page content here]

---

| Section Metadata |
| style | article-with-sidebar |

[More content]

| Person Card |
| John Doe    |
| Developer   |

---

| Metadata |
| Title       | About Our Team           |
| Description | Meet the people behind... |
| Template    | article                   |
| nav         | /nav                      |
| footer      | /footer                   |
```

### Nav Fragment (`/nav` document)

```
[Colgate Logo](/)

- Home
- Products
  - Toothpaste
  - Toothbrushes
- About
- Contact

[Search](#search)

---

| Metadata |
| Robots | noindex |
```

### Footer Fragment (`/footer` document)

```
© 2024 Colgate-Palmolive Company

- [Privacy Policy](/privacy)
- [Terms](/terms)
- [Contact](/contact)

---

| Metadata |
| Robots | noindex |
```

## Summary

**Page Metadata:**
- Table at bottom of page with "Metadata" header
- Controls SEO, social sharing, templates, themes
- Special properties: `nav`, `footer` reference fragments

**Fragments:**
- Reusable content in separate documents
- Loaded dynamically via fetch
- Have their own preview/publish lifecycle
- Perfect for headers, footers, common sections
- Should be marked `noindex` for SEO

**Your Setup:**
- `| nav | /nav |` → Loads navigation from `/nav` document
- `| footer | /footer |` → Loads footer from `/footer` document
- Update fragments once, all pages get the change
- Fragments must be previewed/published separately

## Related Documentation

- [Official Metadata Docs](https://www.aem.live/docs/metadata)
- [Official Fragments Docs](https://www.aem.live/docs/fragments)
- [Special Metadata Properties](https://www.aem.live/docs/special-metadata-properties)
- [Bulk Metadata](https://www.aem.live/docs/bulk-metadata)
- [Header Block](https://www.aem.live/developer/block-collection/header)
- [Footer Block](https://www.aem.live/developer/block-collection/footer)
- [Fragment Block](https://www.aem.live/developer/block-collection/fragment)
