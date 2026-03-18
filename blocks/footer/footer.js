import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  footer.classList.add('footer');

  // Transform ul > li structure into columns
  const ul = fragment.querySelector('ul');
  if (ul) {
    const section = document.createElement('div');
    section.classList.add('section');

    // Each top-level li becomes a column
    ul.querySelectorAll(':scope > li').forEach((li) => {
      const column = document.createElement('div');

      // If li has text content before nested ul, make it a heading
      const text = li.childNodes[0]?.textContent?.trim();
      if (text && text.length > 0) {
        const heading = document.createElement('strong');
        heading.textContent = text;
        column.append(heading);
      }

      // Nested ul becomes the column content
      const nestedUl = li.querySelector('ul');
      if (nestedUl) {
        column.append(nestedUl.cloneNode(true));
      }

      section.append(column);
    });

    footer.append(section);
  }

  // Copyright/legal section at bottom
  const copyrightSection = document.createElement('div');
  copyrightSection.classList.add('section');
  const copyrightDiv = document.createElement('div');
  copyrightDiv.textContent = '© 2025 Colgate-Palmolive Company. All rights reserved.';
  copyrightSection.append(copyrightDiv);
  footer.append(copyrightSection);

  block.append(footer);
}
