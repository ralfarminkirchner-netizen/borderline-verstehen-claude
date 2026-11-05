// Rückweg in den Atlas, nur wenn die Probe innerhalb der Gesamt-App unter /schloss/ läuft.
(() => {
  if (location.protocol === 'file:' || !/\/schloss\/?$/.test(location.pathname)) return;
  const a = document.createElement('a');
  a.href = '../#atlas';
  a.className = 'atlas-rueckweg';
  a.textContent = '← Borderline verstehen · zurück in den Atlas';
  document.addEventListener('DOMContentLoaded', () => document.body.prepend(a));
})();
