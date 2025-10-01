const getReadableSize = (schemeSizeInBytes: number) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let index = 0;
  let readableSchemeSize = schemeSizeInBytes;

  while (readableSchemeSize >= 1024 && index < units.length - 1) {
    readableSchemeSize /= 1024;
    index++;
  }
  return `${readableSchemeSize.toFixed(2)} ${units[index]}`;
};

export default getReadableSize;
