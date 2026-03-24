/**
 * Newsletter Signup block — iframed SFMC Cloud Pages form.
 *
 * Authored as a single-row block in Google Docs:
 *   Col 1: Background image (optional)
 *   Col 2: SFMC Cloud Pages URL (the iframe src)
 *
 * The iframe is loaded lazily via IntersectionObserver.
 *
 * @param {Element} block
 */
export default function decorate(block) {
  // Universal Editor instrumentation
  block.setAttribute('data-aue-type', 'component');
  block.setAttribute('data-aue-label', 'Newsletter Signup');
  block.setAttribute('data-aue-prop', 'newsletter');
  block.setAttribute('data-aue-resource', `urn:aemconnection:${block.id}`); // hypothetical resource ID

  // Parse the block content
  const children = [...block.children];
  const firstRow = children[0];
  let picture = null;
  let url = null;

  if (firstRow && firstRow.children.length > 1) {
    // New format: Image | URL
    picture = firstRow.children[0].querySelector('picture');
    url = firstRow.children[1].textContent?.trim();
  } else {
    // Old format: URL only
    url = block.textContent?.trim();
  }

  block.textContent = '';

  if (!url) return;

  // Layout structure
  const container = document.createElement('div');
  container.classList.add('newsletter-signup-container');

  if (picture) {
    const bgImage = document.createElement('div');
    bgImage.classList.add('newsletter-bg-image');
    bgImage.append(picture);
    container.append(bgImage);
    block.classList.add('has-bg-image');
  }

  const content = document.createElement('div');
  content.classList.add('newsletter-content');

  const placeholder = document.createElement('div');
  placeholder.classList.add('newsletter-signup-placeholder');
  content.append(placeholder);

  container.append(content);
  block.append(container);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();

      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.title = 'Sign up for our newsletter';
      iframe.loading = 'lazy';
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('scrolling', 'no');
      iframe.classList.add('newsletter-signup-iframe');

      /* Resize iframe to fit content once loaded */
      iframe.addEventListener('load', () => {
        try {
          // Attempt to get height if same-origin (unlikely for SFMC)
          const { scrollHeight } = iframe.contentDocument?.body || {};
          if (scrollHeight) iframe.style.height = `${scrollHeight}px`;
        } catch {
          /* cross-origin — use a fixed height or postMessage from SFMC page */
        }
      });

      // Handle message from SFMC if setup for resizing
      window.addEventListener('message', (event) => {
        if (event.origin === new URL(url).origin && event.data?.height) {
          iframe.style.height = `${event.data.height}px`;
        }
      });

      placeholder.replaceWith(iframe);
    });
  }, { rootMargin: '200px' });

  observer.observe(placeholder);
}
