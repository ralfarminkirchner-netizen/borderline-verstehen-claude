import { openAtlasImageViewer, humanImageText } from './atlas-image-viewer.mjs';

const enhanced = new WeakSet();

/** Progressively add a separate, keyboard-accessible viewer control to existing media. */
export function installAtlasImageViewer({ doc = document, Observer = MutationObserver, open = openAtlasImageViewer } = {}) {
  const stylesheet = new URL('./atlas-image-viewer.css', import.meta.url).href;
  if (![...doc.querySelectorAll('link[rel="stylesheet"]')].some(link => link.href === stylesheet)) {
    const link = doc.createElement('link');
    link.rel = 'stylesheet';
    link.href = stylesheet;
    doc.head.append(link);
  }

  function addButton(target, image, getSource, getTitle, getAttribution, getSourceURL) {
    if (enhanced.has(target) || !target.parentNode) return;
    const button = doc.createElement('button');
    button.type = 'button';
    button.className = 'aiv-open';
    button.textContent = 'Bild vergrößern';
    const title = humanImageText(getTitle());
    if (title) button.setAttribute('aria-label', `Bild vergrößern: ${title}`);
    button.addEventListener('click', () => {
      const src = getSource();
      if (!src) return;
      open({ src, alt: image.getAttribute('alt') ?? '', title: getTitle() || 'Bild ansehen', sourceLabel: getAttribution(), sourceURL: getSourceURL?.() || '', trigger: button });
    });
    target.insertAdjacentElement('afterend', button);
    enhanced.add(target);
  }

  function enhanceLink(link) {
    const image = link.querySelector('img');
    if (!image) return;
    const figure = link.closest('.af-medium');
    addButton(link, image,
      () => link.getAttribute('href') || image.currentSrc || image.getAttribute('src'),
      () => figure?.querySelector('.af-medium-heading h3')?.textContent.trim(),
      () => figure?.querySelector('.af-attribution')?.textContent.trim() || '',
      () => figure?.querySelector('figcaption > details:last-of-type a[href]')?.getAttribute('href') || '');
  }

  function enhanceNotebookImage(image) {
    if (image.closest('.af-image-enlarge')) return;
    const article = image.closest('.notebook-context-item');
    if (!article || article.querySelector('.nl-open-image')) return;
    const anchor = image.closest('a');
    const target = anchor && article.contains(anchor) ? anchor : image;
    addButton(target, image,
      () => image.currentSrc || image.getAttribute('src'),
      () => article.querySelector('header h2')?.textContent.trim(),
      () => article.querySelector('.notebook-context-provenance')?.textContent.trim() || article.querySelector('.notebook-context-kind')?.textContent.trim() || '',
      () => article.querySelector('.nl-original-source a[href], a[href*="notebooklm.google.com"], a[href*="notebook.google.com"]')?.getAttribute('href') || '');
  }

  function enhanceMediaImage(link) {
    const image = link.querySelector('img');
    const article = link.closest('.shared-media-item');
    if (!image || !article) return;
    addButton(link, image,
      () => link.getAttribute('href'),
      () => article.querySelector('h3')?.textContent.trim(),
      () => (article.querySelector('.shared-media-provenance')?.dataset.credit || article.querySelector('.shared-media-provenance')?.textContent)?.trim() || article.querySelector('.eyebrow')?.textContent.trim() || '',
      () => article.querySelector('.shared-media-original-source a[href]')?.getAttribute('href') || '');
  }

  function scan(root) {
    if (root.nodeType !== 1 && root.nodeType !== 9) return;
    if (root.matches?.('.af-image-enlarge')) enhanceLink(root);
    if (root.matches?.('.shared-media-image')) enhanceMediaImage(root);
    if (root.matches?.('.notebook-context-item img')) enhanceNotebookImage(root);
    if (root.matches?.('img')) {
      const link = root.closest('.af-image-enlarge');
      if (link) enhanceLink(link);
    }
    root.querySelectorAll('.af-image-enlarge').forEach(enhanceLink);
    root.querySelectorAll('.shared-media-image').forEach(enhanceMediaImage);
    root.querySelectorAll('.notebook-context-item img').forEach(enhanceNotebookImage);
  }

  scan(doc);
  const observer = new Observer(records => {
    for (const record of records) for (const node of record.addedNodes) scan(node);
  });
  observer.observe(doc.body, { childList: true, subtree: true });
  return () => observer.disconnect();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => installAtlasImageViewer(), { once: true });
  } else {
    installAtlasImageViewer();
  }
}
