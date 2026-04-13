# Person Card: Authoring Approaches

## Current Approach (Name/Value Pairs)

### How Authors Create It
```
| Person Card |
| Name  | John Doe              |
| Role  | Senior Developer      |
| Email | john.doe@company.com  |
| Phone | +1 555-123-4567       |
| Image | [insert image]        |
```

### Pros
- ✅ Explicit field labels
- ✅ Fields can be in any order
- ✅ Easy to understand what each field is
- ✅ Fields are optional (author can skip any)

### Cons
- ❌ Violates David's Model Rule #14 (name/value for content)
- ❌ More verbose to author
- ❌ Requires JavaScript to parse and reorder
- ❌ Labels are redundant (we know what a name is)

---

## Recommended Approach (Semantic Structure)

### How Authors Create It
```
| Person Card |
| John Doe                     |
| Senior Developer             |
| john.doe@company.com         |
| +1 555-123-4567              |
| [insert image]               |
```

### Pros
- ✅ Follows David's Model (semantic document structure)
- ✅ Simpler to author (less typing)
- ✅ Cleaner markup
- ✅ Order defines meaning (like a business card)
- ✅ Minimal JavaScript needed

### Cons
- ⚠️ Order matters (must be: name, role, email, phone, image)
- ⚠️ Less explicit (author needs to know the order)
- ⚠️ All fields must be present (or use empty cells)

---

## Alternative: Hybrid Approach (Single-Cell Semantic)

### How Authors Create It
```
| Person Card |
| ![John Doe](image.jpg) |
| John Doe               |
| Senior Developer       |
| john.doe@company.com   |
| +1 555-123-4567        |
```

### Pros
- ✅ Semantic structure
- ✅ Image can be first (visual hierarchy)
- ✅ Simple authoring
- ✅ Follows document semantics

### Cons
- ⚠️ Order still matters
- ⚠️ Need to detect field types (email vs phone vs text)

---

## Recommendation

**For person cards specifically, the semantic approach is better:**

1. **Person cards are predictable** - always have name, role, contact info
2. **Order makes sense** - matches how business cards work
3. **Simpler authoring** - less typing, clearer intent
4. **Better performance** - less JavaScript parsing

**When to use name/value pairs:**
- Configuration options (e.g., "Display Mode: Grid")
- Unpredictable field sets
- User-defined metadata
- Complex forms

**Example of appropriate name/value usage:**
```
| Person Card |
| John Doe                     |
| Senior Developer             |
| john.doe@company.com         |
| Columns | 3                   | ← Configuration
| Theme   | Dark                | ← Configuration
```

---

## Migration Path

If you want to switch to semantic structure:

1. **Define clear field order** in documentation
2. **Update JavaScript** to expect positional fields
3. **Provide authoring guide** for content creators
4. **Support both formats** during transition (detect which format is used)
5. **Migrate existing content** gradually
