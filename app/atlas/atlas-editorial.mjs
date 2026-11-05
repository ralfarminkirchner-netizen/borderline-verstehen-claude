// Editorial display notes supplement the source record; they never rewrite it.
function matchesCorrection(item, { match } = {}) {
  if (!match || (!match.entryId && !match.textIncludes)) return false;
  if (match.entryId && item.id !== match.entryId) return false;
  if (match.textIncludes && ![item.summary, item.body].some(
    text => typeof text === 'string' && text.includes(match.textIncludes)
  )) return false;
  return true;
}

export function applyEditorialCorrections(entries, corrections = []) {
  return entries.map(item => {
    const matching = corrections.filter(correction => matchesCorrection(item, correction));
    if (!matching.length) return item;
    const copy = structuredClone(item);
    copy.editorialCorrections = [
      ...(copy.editorialCorrections || []),
      ...structuredClone(matching)
    ];
    return copy;
  });
}

export function displaySummary(item) {
  return item.editorialCorrections?.[0]?.editorialText || item.summary;
}
