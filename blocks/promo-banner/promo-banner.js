/**
 * Promo Banner block — full-width two-column banner with image and text.
 *
 * Expected block structure (Google Doc table):
 *   Row 1, Col 1: Image
 *   Row 1, Col 2: Heading, description, CTA link
 *
 * @param {Element} block
 */
export default function decorate(block) {
  // Universal Editor instrumentation
  block.setAttribute('data-aue-type', 'component');
  block.setAttribute('data-aue-label', 'Promo Banner');
  block.setAttribute('data-aue-model', 'promo-banner');

  const row = block.querySelector(':scope > div');
  if (!row) return;

  const cells = [...row.children];
  cells[0]?.classList.add('promo-banner-content');
  cells[0]?.setAttribute('data-aue-prop', 'content');
  cells[0]?.setAttribute('data-aue-type', 'richtext');

  cells[1]?.classList.add('promo-banner-image');
  cells[1]?.setAttribute('data-aue-prop', 'image');
  cells[1]?.setAttribute('data-aue-type', 'media');

  const content = block.querySelector('.promo-banner-content');
  if (content) {
    content.querySelectorAll('a').forEach((a) => {
      a.classList.add('button', 'primary');
      a.closest('p')?.classList.add('button-wrapper');
    });
  }
}
