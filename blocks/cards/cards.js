import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Universal Editor instrumentation
  block.setAttribute('data-aue-type', 'component');
  block.setAttribute('data-aue-label', 'Cards');
  block.setAttribute('data-aue-model', 'cards');

  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.setAttribute('data-aue-type', 'component');
    li.setAttribute('data-aue-label', 'Card');
    li.setAttribute('data-aue-model', 'card');

    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
        div.setAttribute('data-aue-prop', 'image');
        div.setAttribute('data-aue-type', 'media');
      } else {
        div.className = 'cards-card-body';
        div.setAttribute('data-aue-prop', 'content');
        div.setAttribute('data-aue-type', 'richtext');
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.replaceChildren(ul);
}
