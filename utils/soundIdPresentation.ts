import { formatRecordTitle } from "./recordTitle";

// Keep a record name together and place its parenthesized genre below it.
export const getSoundTitleLines = (title: string): string[] => {
  const displayTitle = formatRecordTitle(title.trim());
  const match = displayTitle.match(/^(.*?)\s+(\([^()]+\))$/);
  return match ? [match[1], match[2]] : [displayTitle];
};
