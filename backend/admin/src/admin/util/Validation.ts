export const validateFastaFile = (fastaString: string) => {
  // Allow valid nucleotides of DNA and RNA sequences
  const alphabet = /^[ACGTN]+$/i;
  const lines = fastaString.trim().split(/\r?\n/);
  let errors = [];
  let hasSequence = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('>')) {
      // Validate header line
      const header = line.slice(1).trim();
      const [id, ...desc] = header.split(/\s+/);
      if (!/^[A-Za-z0-9._-]+$/.test(id)) {
        errors.push(`Line ${i + 1}: Sequence id is invalid`);
      }
      if (desc.join(' ').match(/[^\x20-\x7E]/)) {
        errors.push(`Line ${i + 1}: Non-ASCII characters in sequence description`);
      }
      hasSequence = false;
    } else {
      // Validate non header line
      if (!alphabet.test(line)) {
        errors.push(`Line ${i + 1}: Invalid characters in sequence`);
      }
      hasSequence = true;
    }
  }
  if (!hasSequence) {
    errors.push('Last header has no sequence');
  }
  return errors;
};
