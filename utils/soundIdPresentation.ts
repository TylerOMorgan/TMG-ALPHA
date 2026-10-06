// Keep a record name together and place its parenthesized genre below it.
export const getSoundTitleLines = (title: string): string[] => {
  const match = title.trim().match(/^(.*?)\s+(\([^()]+\))$/);
  return match ? [match[1], match[2]] : [title.trim()];
};
