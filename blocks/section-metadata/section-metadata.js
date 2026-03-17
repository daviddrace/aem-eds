/**
 * Section Metadata block — stores page metadata (style, layout, etc.)
 * This block is not rendered; it's parsed for configuration and then hidden.
 */

export default function decorate(block) {
  block.style.display = 'none';
}
