# Native AEM Content Setup

This branch (`feature/native-aem-content`) is configured to use **AEM as a Cloud Service** as the content source for Edge Delivery Services, instead of Google Docs or SharePoint.

## Overview

With native AEM content, authors create and manage content directly in AEM using the Universal Editor. The content is then delivered through Edge Delivery Services for optimal performance.

## Configuration

### fstab.yaml

The `fstab.yaml` file maps your site's URL structure to AEM content paths:

```yaml
mountpoints:
  /: https://author-p<program-id>-e<environment-id>.adobeaemcloud.com/content/<site-name>/us/en
```

**To configure for your AEM instance:**

1. Replace `<program-id>` with your Cloud Manager program ID
2. Replace `<environment-id>` with your environment ID
3. Replace `<site-name>` with your site's content root path

**Example:**
```yaml
mountpoints:
  /: https://author-p12345-e67890.adobeaemcloud.com/content/colgate/us/en
```

**For local development:**
```yaml
mountpoints:
  /: http://localhost:4502/content/<site-name>/us/en
```

## Content Authoring

### Page Structure

AEM pages for Edge Delivery follow this structure:

```
/content/<site-name>/us/en/
  ├── article-page
  │   └── jcr:content
  │       ├── root (container)
  │       │   ├── hero (block)
  │       │   ├── text (component)
  │       │   └── cards (block)
  │       └── metadata
```

### Blocks

Blocks in AEM are authored as components within the page structure. Each block component:

- Has a `sling:resourceType` pointing to a Franklin/EDS component
- Contains structured content that matches the block's expected format
- Is decorated by the corresponding JavaScript in `/blocks/<blockname>/`

### Universal Editor

The Universal Editor allows in-context editing of content. Blocks include `data-aue-*` attributes for instrumentation:

- `data-aue-type="component"` - Marks the block as editable
- `data-aue-label="Block Name"` - Display name in the editor
- `data-aue-model="blockname"` - Links to the content model
- `data-aue-prop="propertyName"` - Marks editable properties

## Development Workflow

### Local Development

1. **Start AEM locally** (if using local AEM):
   ```bash
   java -jar aem-sdk-quickstart.jar
   ```

2. **Update fstab.yaml** to point to localhost:
   ```yaml
   mountpoints:
     /: http://localhost:4502/content/<site-name>/us/en
   ```

3. **Start the EDS dev server**:
   ```bash
   aem up
   ```

4. **Access your site**:
   - Dev server: `http://localhost:3000`
   - AEM author: `http://localhost:4502`

### Content Preview

Content must be **published or previewed** in AEM before it appears in the EDS dev server:

- **Preview**: Makes content available to the dev server without publishing to production
- **Publish**: Makes content live on the production site

### Testing

Test your pages at different URLs:

- **HTML**: `http://localhost:3000/article-page` - Fully decorated page
- **Plain HTML**: `http://localhost:3000/article-page.plain.html` - Raw content structure
- **JSON**: `http://localhost:3000/article-page.json` - Content as JSON

## Differences from Google Docs/SharePoint

| Aspect | Google Docs/SharePoint | Native AEM |
|--------|------------------------|------------|
| **Content Source** | Document-based (Docs/Excel) | AEM Pages & Components |
| **Authoring** | Document editor | Universal Editor |
| **Content Structure** | Tables in documents | JCR nodes & properties |
| **Preview** | Automatic | Requires AEM preview action |
| **Metadata** | Document properties | Page properties & metadata component |
| **Assets** | Linked from Drive/SharePoint | AEM DAM |

## Block Compatibility

All blocks in this repository work with both document-based and native AEM content. The blocks:

1. Receive the same HTML structure regardless of content source
2. Use DOM manipulation to transform content
3. Don't depend on the authoring method

## Deployment

### Environments

- **Local Dev**: `http://localhost:3000` (code from local, content from AEM)
- **Preview**: `https://<branch>--<repo>--<owner>.aem.page/` (content from AEM preview)
- **Production**: `https://<branch>--<repo>--<owner>.aem.live/` (content from AEM publish)

### Publishing Process

1. Author content in AEM using Universal Editor
2. Preview content to test with EDS
3. Push code changes to GitHub
4. Test on preview environment
5. Publish content in AEM
6. Merge code to main branch

## Troubleshooting

### Content not appearing

- Ensure content is **previewed** in AEM
- Check `fstab.yaml` points to correct AEM instance
- Verify AEM is accessible from your dev environment
- Check CORS configuration on AEM

### 404 errors

- Verify content path matches `fstab.yaml` mountpoint
- Ensure page exists in AEM at the expected path
- Check that content is published/previewed

### Authentication issues

- For Cloud Service: Ensure proper authentication is configured
- For local AEM: Check that anonymous read access is granted to content paths

## Resources

- [AEM Edge Delivery Documentation](https://www.aem.live/docs/)
- [Universal Editor Guide](https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/implementing/developing/universal-editor/introduction.html)
- [AEM as a Cloud Service](https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/overview/introduction.html)
