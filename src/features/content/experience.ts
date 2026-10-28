/** Stable bullet IDs let CVs select shared facts without copying their text. */
export function experienceBullets(item: {
  highlights: string[];
  bullets?: { id: string; text: string }[];
}) {
  return item.bullets?.length
    ? item.bullets
    : item.highlights.map((text, index) => ({
        id: `bullet-${index + 1}`,
        text,
      }));
}
