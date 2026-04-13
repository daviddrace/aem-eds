import { optimizeImageByDisplaySize } from '../../scripts/image-utils.js';

/**
 * person-card block — card element with information about a person
 *
 * SEMANTIC APPROACH (follows David's Model Rule #14)
 *
 * Expected block structure (Google Doc table):
 *   Row 1: Person Card
 *   Row 2: Name (e.g., "John Doe")
 *   Row 3: Role (e.g., "Senior Developer")
 *   Row 4: Email (e.g., "john@company.com")
 *   Row 5: Phone (e.g., "+1 555-123-4567")
 *   Row 6: Image
 *
 * Fields are identified by position and content type, not labels.
 * This follows semantic document structure rather than name/value pairs.
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const isHorizontal = block.classList.contains('horizontal');

  // Get all rows (cells in single-column table)
  const cells = [...block.children];

  // Helper: detect if text is an email
  const isEmail = (text) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);

  // Helper: detect if text is a phone number
  const isPhone = (text) => /^[\d\s\-+()]+$/.test(text) && text.replace(/\D/g, '').length >= 7;

  // Process each cell and assign semantic meaning
  const processedCells = cells.map((cell, index) => {
    const text = cell.textContent?.trim();
    const img = cell.querySelector('img');

    // Determine cell type
    let type = 'text';
    let className = 'person-card-value';

    if (img) {
      type = 'image';
      className = 'person-card-value person-image';
    } else if (index === 0 && text) {
      // First text cell is the name
      type = 'name';
      className = 'person-card-value person-name';
    } else if (isEmail(text)) {
      type = 'email';
      className = 'person-card-value person-email';

      // Convert to mailto link
      const emailLink = document.createElement('a');
      emailLink.href = `mailto:${text}`;
      emailLink.textContent = text;
      cell.innerHTML = '';
      cell.appendChild(emailLink);
    } else if (isPhone(text)) {
      type = 'phone';
      className = 'person-card-value person-phone';

      // Convert to tel link
      const phoneLink = document.createElement('a');
      phoneLink.href = `tel:${text.replace(/\s/g, '')}`;
      phoneLink.textContent = text;
      cell.innerHTML = '';
      cell.appendChild(phoneLink);
    } else if (index === 1 && text) {
      // Second text cell (after name) is likely the role
      type = 'role';
      className = 'person-card-value person-role';
    }

    // Add semantic classes
    cell.className = className;

    // Optimize images
    if (type === 'image' && img) {
      optimizeImageByDisplaySize(img, [
        { displayWidth: 400 },
      ]);
    }

    return { cell, type };
  });

  // Handle horizontal variation (requires DOM restructuring)
  if (isHorizontal) {
    const imageCell = processedCells.find((pc) => pc.type === 'image')?.cell;
    const contentCells = processedCells
      .filter((pc) => pc.type !== 'image')
      .map((pc) => pc.cell);

    if (imageCell && contentCells.length > 0) {
      const contentWrapper = document.createElement('div');
      contentWrapper.classList.add('person-card-content');
      contentCells.forEach((cell) => contentWrapper.appendChild(cell));

      block.innerHTML = '';
      block.appendChild(imageCell);
      block.appendChild(contentWrapper);
    }
  }
}
