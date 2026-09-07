export const naturalSort = (arr: string[]): string[] => {
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
  return arr.sort((a, b) => collator.compare(a, b));
};

export const naturalSortByProperty = <T>(arr: T[], property: keyof T): T[] => {
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
  return arr.sort((a, b) => {
    const aVal = String(a[property]);
    const bVal = String(b[property]);
    return collator.compare(aVal, bVal);
  });
};