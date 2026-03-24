export default function decorate(block) {
  // Universal Editor instrumentation
  block.setAttribute('data-aue-type', 'component');
  block.setAttribute('data-aue-label', 'Columns');
  block.setAttribute('data-aue-model', 'columns');

  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      col.setAttribute('data-aue-prop', 'col');
      col.setAttribute('data-aue-type', 'richtext');
      col.setAttribute('data-aue-label', 'Column');

      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
          col.setAttribute('data-aue-type', 'media');
        }
      }
    });
  });
}
