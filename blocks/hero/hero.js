export default function decorate(block) {
  // Universal Editor instrumentation
  block.setAttribute('data-aue-type', 'component');
  block.setAttribute('data-aue-label', 'Hero');
  block.setAttribute('data-aue-model', 'hero');

  const img = block.querySelector('img');
  if (img) {
    img.setAttribute('data-aue-prop', 'image');
    img.setAttribute('data-aue-type', 'media');
    img.setAttribute('data-aue-label', 'Hero Image');
  }

  const h1 = block.querySelector('h1');
  if (h1) {
    h1.setAttribute('data-aue-prop', 'heading');
    h1.setAttribute('data-aue-type', 'text');
    h1.setAttribute('data-aue-label', 'Heading');
  }
}
