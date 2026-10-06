// Format displayed titles while retaining the supplied catalog text.
export const formatRecordTitle = (title: string): string =>
  title.toLowerCase().replace(/(^|\s|\()(\p{L})/gu, (_match, prefix, letter) =>
    prefix + letter.toUpperCase(),
  );
