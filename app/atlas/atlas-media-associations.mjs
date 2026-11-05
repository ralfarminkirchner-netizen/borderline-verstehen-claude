/** Explicit editorial placement only; shared words and tags never create an association. */
export function explicitlyRelatedMedia(media = [], entry) {
  const id = typeof entry === 'string' ? entry : entry?.id;
  if (!id) return [];
  return media.filter(item =>
    [...(item.relatedEntryIds || []), ...(item.entryIds || [])].includes(id) ||
    (item.id && (item.editorialRelations || []).some(relation => relation.from === id &&
      [ 'media:' + item.id, 'landscape-medium-' + item.id ].includes(relation.to))
    )
  );
}
