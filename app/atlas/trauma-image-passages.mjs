import { openAtlasImageViewer } from './atlas-image-viewer.mjs';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/** The existing artwork stays whole. Its connection to the atlas is editorial. */
export function mountTraumaImagePassages(host, {media = [], onExplore = () => {}} = {}) {
  const images = media.filter(item => item.originWork === 'TraumaAtlas' && /^assets\/media\/[^/]+\.(jpg|jpeg|png|webp)$/i.test(item.file));
  if (!images.length) return;
  if (!document.querySelector('link[data-trauma-image-passages]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = new URL('./trauma-image-passages.css', import.meta.url).href;
    link.dataset.traumaImagePassages = ''; document.head.append(link);
  }
  const section = document.createElement('section');
  section.className = 'trauma-image-passages';
  section.setAttribute('aria-label', 'Bildwege aus dem TraumaAtlas');
  section.innerHTML = `<header><p class="tip-eyebrow">Bildwege aus dem TraumaAtlas</p><h2>Manches lässt sich<br>zuerst <em>spüren.</em></h2><p>Drei Bilder aus dem bestehenden TraumaAtlas öffnen Wege zu Körper, Halt und Verbindung. Du kannst bei einem Bild verweilen oder seinem Thema im Atlas folgen.</p></header><div class="tip-image-flow">${images.map((item, index) => `<article class="tip-passage"><button class="tip-original" data-picture="${index}" aria-label="${esc(item.title)} · Originalbild ansehen"><img src="${esc(item.file)}" alt="${esc(item.alt || item.title)}" loading="lazy" decoding="async"><span aria-hidden="true">Bild öffnen ↗</span></button><div class="tip-caption"><p class="tip-number" aria-hidden="true">${String(index + 1).padStart(2, '0')} · Bildweg</p><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p><button class="tip-continue" data-explore="${index}">Im Atlas weitergehen <span aria-hidden="true">↗</span></button></div></article>`).join('')}</div><footer><p>Bild aus dem bestehenden TraumaAtlas · unveränderte Originalbilder.</p><p>Die thematischen Anschlüsse sind redaktionelle Einladungen.</p></footer>`;
  section.addEventListener('click', event => {
    const picture = event.target.closest('[data-picture]');
    if (picture) {
      const item = images[Number(picture.dataset.picture)];
      openAtlasImageViewer({src: item.file, title: item.title, alt: item.alt || item.title, sourceLabel: item.provenance || item.producer, trigger: picture});
    }
    const explore = event.target.closest('[data-explore]');
    if (explore) onExplore(images[Number(explore.dataset.explore)]);
  });
  host.append(section);
}
