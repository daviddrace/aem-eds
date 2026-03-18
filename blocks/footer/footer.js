import { getMetadata } from '../../scripts/aem.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';

  let fragment = null;
  try {
    const resp = await fetch(`${footerPath}.plain.html`);
    if (resp.ok) {
      const html = await resp.text();
      const temp = document.createElement('div');
      temp.innerHTML = html;
      fragment = temp;
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(`Failed to load footer fragment from ${footerPath}:`, e);
  }

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  footer.classList.add('footer');

  if (!fragment) {
    // Fragment failed to load, create empty footer
    block.append(footer);
    return;
  }

  // Transform ul > li structure into columns
  const ul = fragment.querySelector('ul');
  if (ul) {
    const section = document.createElement('div');
    section.classList.add('section');

    // Each top-level li becomes a column
    ul.querySelectorAll(':scope > li').forEach((li) => {
      const column = document.createElement('div');

      // Extract heading text (text before nested ul)
      let headingText = '';
      Array.from(li.childNodes).some((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          headingText += node.textContent.trim();
        } else if (node.tagName === 'UL') {
          return true; // Stop at first ul
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'UL') {
          headingText += node.textContent.trim();
        }
        return false;
      });

      if (headingText) {
        const heading = document.createElement('strong');
        heading.textContent = headingText;
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
  block.setAttribute('data-block-status', 'loaded');
}
