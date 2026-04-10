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
  console.log(block.children); // Array-like list of row divs
  // TODO: Implement person-card decoration logic
  // Expected structure:
  // Row 1, Col 1: name
  // Row 1, Col 2: {name}
  // Row 2, Col 1: role
  // Row 2, Col 2: {role}
  // Row 3, Col 1: email
  // Row 3, Col 2: {email}
  // Row 4, Col 1: phone
  // Row 4, Col 2: {phone}
  // Row 5, Col 1: image
  // Row 5, Col 2: {image}

  const row = block.querySelector(':scope > div');
  if (!row) return;

  const cells = [...row.children];
  cells[0]?.classList.add('promo-banner-content');
  cells[1]?.classList.add('promo-banner-image');

  const content = block.querySelector('.promo-banner-content');
  if (content) {
    content.querySelectorAll('a').forEach((a) => {
      a.classList.add('button', 'primary');
      a.closest('p')?.classList.add('button-wrapper');
    });
  }
}
