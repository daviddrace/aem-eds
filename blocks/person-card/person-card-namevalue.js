import { optimizeImageByDisplaySize } from '../../scripts/image-utils.js';

/**
 * person-card block — card element with information about a person
 *
 * Expected block structure (Google Doc table):
 *   Row 1, Col 1: name
 *   Row 1, Col 2: {name}
 *   Row 2, Col 1: role
 *   Row 2, Col 2: {role}
 *   Row 3, Col 1: email
 *   Row 3, Col 2: {email}
 *   Row 4, Col 1: phone
 *   Row 4, Col 2: {phone}
 *   Row 5, Col 1: image
 *   Row 5, Col 2: {image}
 *
 * @param {Element} block
 */
export default function decorate(block) {
  // Check for block variations (added as CSS classes by EDS)
  // Examples: "Person Card (Dark)" -> block.classList.contains('dark')
  //           "Person Card (Horizontal)" -> block.classList.contains('horizontal')
  const isHorizontal = block.classList.contains('horizontal');

  // Define the order fields should appear in the final output
  // This ensures consistent display even if authors create rows in a different order
  const FIELD_ORDER = ['name', 'role', 'email', 'phone', 'image'];

  // STEP 1: Extract data from the authored table structure
  // The block comes in as rows with 2 cells each: [label, value]
  // We parse this into a simple object: { name: cellElement, email: cellElement, ... }
  const data = {};
  [...block.children].forEach((row) => {
    // Destructure the row's two cells (label and value)
    const [labelCell, valueCell] = row.children;
    if (labelCell && valueCell) {
      // Use the label text as the key (e.g., "Name" becomes "name")
      const key = labelCell.textContent?.trim().toLowerCase();
      if (key) {
        // Store the actual DOM element (valueCell) so we can reuse it
        // This preserves any existing formatting, images, etc. from the author
        data[key] = valueCell;
      }
    }
  });

  // STEP 2: Clear the block to rebuild it in our desired order
  block.innerHTML = '';

  // STEP 3: Rebuild the block in the order defined by FIELD_ORDER
  FIELD_ORDER.forEach((key) => {
    // Skip fields that weren't authored (e.g., if author didn't include "phone")
    if (!data[key]) return;

    // Get the value cell element we stored earlier
    const valueCell = data[key];
    // Add classes for styling: generic "person-card-value" + specific "person-name", etc.
    valueCell.classList.add('person-card-value', `person-${key}`);

    // STEP 4: Apply field-specific transformations
    // Email: Convert plain text to a clickable mailto: link
    if (key === 'email') {
      const emailText = valueCell.textContent?.trim();
      if (emailText) {
        const emailLink = document.createElement('a');
        emailLink.href = `mailto:${emailText}`;
        emailLink.textContent = emailText;
        valueCell.innerHTML = '';
        valueCell.appendChild(emailLink);
      }
    }

    // Phone: Convert plain text to a clickable tel: link
    if (key === 'phone') {
      const phoneText = valueCell.textContent?.trim();
      if (phoneText) {
        const phoneLink = document.createElement('a');
        // Remove spaces from phone number for the href (e.g., "555 1234" becomes "5551234")
        phoneLink.href = `tel:${phoneText.replace(/\s/g, '')}`;
        phoneLink.textContent = phoneText;
        valueCell.innerHTML = '';
        valueCell.appendChild(phoneLink);
      }
    }

    // Image: Optimize based on display size (card max-width is 400px)
    // The function automatically applies 2x multiplier for retina displays
    if (key === 'image') {
      const img = valueCell.querySelector('img');
      if (img) {
        optimizeImageByDisplaySize(img, [
          { displayWidth: 400 }, // Card displays at 400px (will request 800px for retina)
        ]);
      }
    }

    // STEP 5: Append the decorated cell to the block in the correct order
    block.appendChild(valueCell);
  });

  // STEP 6: Handle variations that require DOM restructuring
  // Horizontal variation: Split image and content into two columns
  if (isHorizontal) {
    const imageEl = block.querySelector('.person-image');
    const contentEls = [...block.children].filter((el) => !el.classList.contains('person-image'));

    if (imageEl && contentEls.length > 0) {
      // Create wrapper for content (name, role, email, phone)
      const contentWrapper = document.createElement('div');
      contentWrapper.classList.add('person-card-content');
      contentEls.forEach((el) => contentWrapper.appendChild(el));

      // Clear and rebuild with image + content side-by-side
      block.innerHTML = '';
      block.appendChild(imageEl);
      block.appendChild(contentWrapper);
    }
  }
}
