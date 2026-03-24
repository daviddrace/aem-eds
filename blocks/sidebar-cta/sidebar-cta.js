/**
 * Sidebar CTA block — promo box with image, heading, description, and button.
 * Authored as a single-row block in Google Docs.
 *
 * Expected block structure (from Google Doc table):
 *   Row 1: Image (optional) | Heading, description text, CTA link
 *
 * @param {Element} block
 */
export default function decorate(block) {
  // Universal Editor instrumentation
  block.setAttribute('data-aue-type', 'component');
  block.setAttribute('data-aue-label', 'Sidebar CTA');
  block.setAttribute('data-aue-model', 'sidebar-cta');

  const rows = [...block.children];

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1) {
      cells[0].classList.add('sidebar-cta-content');
      cells[0].setAttribute('data-aue-prop', 'content');
      cells[0].setAttribute('data-aue-type', 'richtext');
    } else if (cells.length >= 2) {
      const imgCell = cells[0];
      const img = imgCell.querySelector('img');
      if (img) {
        block.style.backgroundImage = `url('${img.src}')`;
        block.setAttribute('data-aue-prop', 'backgroundImage');
        block.setAttribute('data-aue-type', 'media');
        if (img.alt) {
          block.setAttribute('aria-label', img.alt);
        }
        imgCell.remove();
      } else {
        imgCell.classList.add('sidebar-cta-image');
        imgCell.setAttribute('data-aue-prop', 'image');
        imgCell.setAttribute('data-aue-type', 'media');
      }
      cells[cells.length - 1].classList.add('sidebar-cta-content');
      cells[cells.length - 1].setAttribute('data-aue-prop', 'content');
      cells[cells.length - 1].setAttribute('data-aue-type', 'richtext');
    }

    const content = row.querySelector('.sidebar-cta-content');
    if (content) {
      const links = content.querySelectorAll('a');
      links.forEach((a) => {
        a.classList.add('button', 'primary');
        a.closest('p')?.classList.add('button-wrapper');
      });
    }
  });
}
