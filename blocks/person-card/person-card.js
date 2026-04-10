import { optimizeImage } from '../../scripts/image-utils.js';

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

    // Image: Replace with optimized picture using custom breakpoints
    // Person card max-width is 400px, so we use 800px (2x for retina) for all sizes
    if (key === 'image') {
      const img = valueCell.querySelector('img');
      if (img) {
        optimizeImage(img, [
          { media: '(min-width: 600px)', width: '800' }, // Desktop: 2x 400px
          { width: '800' }, // Mobile: same size (card doesn't shrink much)
        ]);
      }
    }

    // STEP 5: Append the decorated cell to the block in the correct order
    block.appendChild(valueCell);
  });
}
